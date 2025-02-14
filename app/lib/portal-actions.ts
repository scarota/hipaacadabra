'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export type State = {
  errors?: {
    primaryColor?: string[];
    font?: string[];
    domain?: string[];
  };
  message?: string | null;
};

const BrandingFormSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  font: z.enum(['inter', 'roboto', 'opensans', 'lato']),
});

const DomainFormSchema = z.object({
  domain: z
    .string()
    .min(1, 'Domain is required')
    .regex(
      /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/,
      'Invalid domain format',
    ),
});

export async function updateBranding(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = BrandingFormSchema.safeParse({
    primaryColor: formData.get('primaryColor'),
    font: formData.get('font'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data. Please check the fields below.',
    };
  }

  try {
    // TODO: Implement branding update logic
    // This would typically involve:
    // 1. Saving to database
    // 2. Updating CDN assets
    // 3. Regenerating CSS

    revalidatePath('/portal/branding');

    return {
      message: 'Branding updated successfully!',
    };
  } catch (error) {
    return {
      message: 'Failed to update branding. Please try again.',
    };
  }
}

export async function updateDomain(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = DomainFormSchema.safeParse({
    domain: formData.get('domain'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data. Please check the fields below.',
    };
  }

  try {
    // TODO: Implement domain update logic
    // This would typically involve:
    // 1. Validating domain ownership
    // 2. Setting up SSL certificate
    // 3. Updating DNS records
    // 4. Saving to database

    revalidatePath('/portal/domain');

    return {
      message:
        'Domain configuration initiated. Please add the DNS records to verify ownership.',
    };
  } catch (error) {
    return {
      message: 'Failed to update domain. Please try again.',
    };
  }
}
