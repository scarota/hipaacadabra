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

    const payload = {
      orgCode: org.orgCode,
      requestBody: {
        name: organizationName,
      },
    };

    await Organizations.updateOrganization(payload);

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
