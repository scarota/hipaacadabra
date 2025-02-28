'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { getUserOrganization } from '@/app/lib/kinde-data';
import { encrypt, decrypt } from '@/app/lib/encryption';
import { DATA_MAPPINGS } from '@/app/lib/field-mapping-constants';

export type State = {
  message: string | null;
  errors?: {
    apiKey?: string[];
    baseUrl?: string[];
    authType?: string[];
  };
};

const ApiConfigSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
  baseUrl: z.string().url('Invalid URL format'),
  authType: z.enum(['bearer', 'x-auth-key']),
});

export async function updatePortalApiConfig(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = ApiConfigSchema.safeParse({
    apiKey: formData.get('apiKey'),
    baseUrl: formData.get('baseUrl'),
    authType: formData.get('authType'),
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

    // Create the data object with the validated fields
    const data = {
      api_key: encryptedApiKey,
      base_url: validatedFields.data.baseUrl,
      auth_type: validatedFields.data.authType,
    };

    await prisma.portal_api_configs.upsert({
      where: {
        org_code: org.orgCode,
      },
      update: data,
      create: {
        org_code: org.orgCode,
        ...data,
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

export type ApiTestResult = {
  success: boolean;
  data?: any;
  error?: string;
  status?: number;
  duration?: number;
};

export async function testApiEndpoint(
  mappingType: string,
  endpoint: string,
  testId?: string,
): Promise<ApiTestResult> {
  try {
    const prisma = new PrismaClient();
    const org = await getUserOrganization();

    if (!org?.orgCode) {
      return {
        success: false,
        error: 'Organization not found',
      };
    }

    // Get the API configuration
    const apiConfig = await prisma.portal_api_configs.findUnique({
      where: {
        org_code: org.orgCode,
      },
    });

    if (!apiConfig) {
      return {
        success: false,
        error:
          'API configuration not found. Please configure your API settings first.',
      };
    }

    // Decrypt the API key
    const apiKey = await decrypt(apiConfig.api_key);

    // Get the authentication type from the API config
    const authType = apiConfig.auth_type;

    // Format the endpoint with the test ID if provided
    const formattedEndpoint = testId
      ? endpoint.replace('{id}', testId)
      : endpoint;

    // Construct the full URL
    const url = `${apiConfig.base_url}${formattedEndpoint}`;

    // Record start time for performance measurement
    const startTime = Date.now();

    // Set up headers based on authentication type
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authentication header based on selected type
    if (authType === 'bearer') {
      headers['Authorization'] = `Bearer ${apiKey}`;
    } else if (authType === 'x-auth-key') {
      headers['X-Auth-Key'] = apiKey;
    }

    // Make the API request
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    // Calculate request duration
    const duration = Date.now() - startTime;

    // Handle the response
    if (!response.ok) {
      return {
        success: false,
        error: `API request failed with status: ${response.status}`,
        status: response.status,
        duration,
      };
    }

    const data = await response.json();

    return {
      success: true,
      data,
      status: response.status,
      duration,
    };
  } catch (error) {
    console.error('API Test Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
