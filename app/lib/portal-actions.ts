'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { getUserOrganization } from '@/app/lib/kinde-data';
import { encrypt } from '@/app/lib/encryption';
import { DATA_MAPPINGS } from '@/app/lib/field-mapping-constants';

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

export type FieldMappingState = {
  message: string | null;
  errors?: {
    endpoint?: string[];
    mappings?: string[];
    mappingType?: string[];
  };
};

const FieldMappingSchema = z
  .object({
    mappingType: z.string().min(1, 'Mapping type is required'),
    endpoint: z.string().min(1, 'Endpoint is required'),
    mappings: z.record(z.string()),
  })
  .refine(
    (data) => {
      // Get the mapping definition based on the mapping type
      const mappingDef = DATA_MAPPINGS[data.mappingType];

      if (!mappingDef) {
        return false;
      }

      // Check that all required fields have a mapping
      return mappingDef.fields
        .filter((field) => field.required)
        .every(
          (field) =>
            data.mappings[field.name] &&
            data.mappings[field.name].trim() !== '',
        );
    },
    {
      message: 'All required fields must have a mapping',
      path: ['mappings'],
    },
  );

export async function updateFieldMapping(
  prevState: FieldMappingState,
  formData: FormData,
): Promise<FieldMappingState> {
  // Extract mapping type, endpoint and mappings from form data
  const mappingType = formData.get('mappingType')?.toString() || '';
  const endpoint = formData.get('endpoint')?.toString() || '';
  const mappings: Record<string, string> = {};

  // Get all field mappings except endpoint and mappingType
  Array.from(formData.entries()).forEach(([key, value]) => {
    if (key !== 'endpoint' && key !== 'mappingType' && value) {
      mappings[key] = value.toString();
    }
  });

  const validatedFields = FieldMappingSchema.safeParse({
    mappingType,
    endpoint,
    mappings,
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
        endpoint: ['Unable to save configuration: Organization not found'],
      },
    };
  }

  try {
    await prisma.field_mappings.upsert({
      where: {
        org_code_mapping_type: {
          org_code: org.orgCode,
          mapping_type: validatedFields.data.mappingType,
        },
      },
      update: {
        endpoint: validatedFields.data.endpoint,
        mappings: validatedFields.data.mappings,
      },
      create: {
        org_code: org.orgCode,
        mapping_type: validatedFields.data.mappingType,
        endpoint: validatedFields.data.endpoint,
        mappings: validatedFields.data.mappings,
      },
    });

    revalidatePath('/portal/schema');

    return {
      message: `${validatedFields.data.mappingType} field mappings updated successfully`,
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Failed to update field mappings',
      errors: {
        mappings: ['Failed to save field mappings'],
      },
    };
  } finally {
    await prisma.$disconnect();
  }
}
