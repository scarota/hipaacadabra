'use server';

import { revalidatePath } from 'next/cache';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Users, Organizations, init } from '@kinde/management-api-js';
import { z } from 'zod';

const ProfileFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long'),
});

const OrganizationFormSchema = z.object({
  organizationName: z
    .string()
    .min(1, 'Organization name is required')
    .max(100, 'Organization name is too long'),
});

export type State = {
  errors?: {
    firstName?: string[];
    lastName?: string[];
    organizationName?: string[];
  };
  message?: string | null;
};

export async function updateProfile(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const { getUser, refreshTokens } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return {
      message: 'Unable to update profile. User not found.',
    };
  }

  const validatedFields = ProfileFormSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data. Please check the fields below.',
    };
  }

  try {
    init();
    const { firstName, lastName } = validatedFields.data;

    const payload = {
      id: user.id,
      requestBody: {
        given_name: firstName,
        family_name: lastName,
      },
    };

    await Users.updateUser(payload);
    await refreshTokens();
    revalidatePath('/profile');

    return {
      message: 'Profile updated successfully!',
    };
  } catch (error) {
    console.error('Failed to update profile:', error);
    return {
      message: 'Failed to update profile. Please try again.',
    };
  }
}

export async function updateOrganization(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const { getOrganization } = getKindeServerSession();
  const org = await getOrganization();

  if (!org?.orgCode) {
    return {
      message: 'Unable to update organization. Organization not found.',
    };
  }

  // Get access token using client credentials
  const tokenResponse = await fetch(
    `${process.env.KINDE_DOMAIN}/oauth2/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.KINDE_MANAGEMENT_CLIENT_ID!,
        client_secret: process.env.KINDE_MANAGEMENT_CLIENT_SECRET!,
        audience: `${process.env.KINDE_DOMAIN}/api`,
      }),
    },
  );

  if (!tokenResponse.ok) {
    return {
      message: 'Authentication failed. Unable to update organization.',
    };
  }

  const { access_token } = await tokenResponse.json();

  // Get and validate the file from form data
  const file = formData.get('logo') as File;

  if (file && file.size > 0) {
    // Validate file size (500KB)
    if (file.size > 512000) {
      return {
        message: 'Logo file is too large. Maximum size is 500KB.',
      };
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      return {
        message: 'Invalid file type. Please upload a JPG, PNG, or GIF.',
      };
    }
  }

  const validatedFields = OrganizationFormSchema.safeParse({
    organizationName: formData.get('organizationName'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data. Please check the fields below.',
    };
  }

  try {
    init();
    const { organizationName } = validatedFields.data;

    // Update organization name
    await Organizations.updateOrganization({
      orgCode: org.orgCode,
      requestBody: {
        name: organizationName,
      },
    });

    // If we have a logo, update it using the dedicated endpoint
    if (file && file.size > 0) {
      // Create a new FormData instance for the logo upload
      const logoFormData = new FormData();
      logoFormData.append('file', file);

      const response = await fetch(
        `${process.env.KINDE_ISSUER_URL}/api/v1/organizations/${org.orgCode}/logos/light`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          body: logoFormData,
        },
      );

      if (!response.ok) {
        throw new Error('Failed to upload logo');
      }
    }

    revalidatePath('/settings/general');

    return {
      message: 'Organization updated successfully!',
    };
  } catch (error) {
    console.error('Failed to update organization:', error);
    return {
      message: 'Failed to update organization. Please try again.',
    };
  }
}
