'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { getUserOrganization } from '@/app/lib/kinde-data';
import { encrypt } from '@/app/lib/encryption';

export type State = {
  message: string | null;
  errors?: {
    apiKey?: string[];
    baseUrl?: string[];
  };
};

const ApiConfigSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
  baseUrl: z.string().url('Invalid URL format'),
});

export async function updatePortalApiConfig(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = ApiConfigSchema.safeParse({
    apiKey: formData.get('apiKey'),
    baseUrl: formData.get('baseUrl'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const prisma = new PrismaClient();
  const org = await getUserOrganization();

  if (!org?.orgCode) {
    return {
      message: 'Organization not found',
      errors: {
        apiKey: ['Unable to save configuration: Organization not found'],
      },
    };
  }

  try {
    // Encrypt the API key before storing
    const encryptedApiKey = await encrypt(validatedFields.data.apiKey);

    await prisma.portal_api_configs.upsert({
      where: {
        org_code: org.orgCode,
      },
      update: {
        api_key: encryptedApiKey,
        base_url: validatedFields.data.baseUrl,
      },
      create: {
        org_code: org.orgCode,
        api_key: encryptedApiKey,
        base_url: validatedFields.data.baseUrl,
      },
    });

    revalidatePath('/portal/schema');

    return {
      message: 'API configuration updated successfully',
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Failed to update API configuration',
      errors: {
        apiKey: ['Failed to save API configuration'],
      },
    };
  } finally {
    await prisma.$disconnect();
  }
}
