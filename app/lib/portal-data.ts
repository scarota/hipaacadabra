'use server';

import { PrismaClient } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';
import { getUserOrganization } from '@/app/lib/kinde-data';
import { decrypt } from '@/app/lib/encryption';
import { DATA_MAPPINGS } from '@/app/lib/field-mapping-constants';
import { z } from 'zod';
import { createAuthHeaders } from '@/app/lib/utils';
import type { ApiConfig, ApiTestResult } from '@/app/lib/portal-types';

export async function getPortalApiConfig(): Promise<ApiConfig | null> {
  noStore();
  const prisma = new PrismaClient();
  const org = await getUserOrganization();

  if (!org?.orgCode) {
    return null;
  }

  try {
    const config = await prisma.portal_api_configs.findUnique({
      where: {
        org_code: org.orgCode,
      },
    });

    if (!config) {
      return null;
    }

    // Decrypt the API key before returning
    return {
      id: config.id,
      org_code: config.org_code,
      api_key: await decrypt(config.api_key),
      base_url: config.base_url,
      auth_type: config.auth_type, // The field exists in the database
      created_at: config.created_at,
      updated_at: config.updated_at,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch portal API configuration.');
  } finally {
    await prisma.$disconnect();
  }
}

export async function getFieldMappingByType(mappingType: string) {
  noStore();
  const prisma = new PrismaClient();
  const org = await getUserOrganization();

  if (!org?.orgCode) {
    return null;
  }

  try {
    const mapping = await prisma.field_mappings.findUnique({
      where: {
        org_code_mapping_type: {
          org_code: org.orgCode,
          mapping_type: mappingType,
        },
      },
    });

    if (!mapping) {
      return null;
    }

    // Ensure mappings is a proper JavaScript object
    const parsedMappings =
      typeof mapping.mappings === 'string'
        ? JSON.parse(mapping.mappings as string)
        : mapping.mappings;

    return {
      ...mapping,
      // Ensure mappings is a proper JavaScript object
      mappings: parsedMappings,
      // Include the field definitions from the constants
      fieldDefinitions: DATA_MAPPINGS[mappingType]?.fields || [],
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch field mapping.');
  } finally {
    await prisma.$disconnect();
  }
}

export async function testApiEndpoint(
  endpoint: string,
  testEmail?: string,
): Promise<ApiTestResult> {
  try {
    // Check if email is provided
    if (!testEmail || testEmail.trim() === '') {
      return {
        success: false,
        error: 'Email is required. Please provide a valid email address.',
      };
    }

    // Validate email format
    const emailSchema = z.string().email('Invalid email format');
    const emailValidation = emailSchema.safeParse(testEmail);

    if (!emailValidation.success) {
      return {
        success: false,
        error: 'Invalid email format. Please provide a valid email address.',
      };
    }

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

    // Format the endpoint with the test email if provided
    const formattedEndpoint = testEmail
      ? endpoint.replace('{email}', testEmail)
      : endpoint;

    // Construct the full URL
    const url = `${apiConfig.base_url}${formattedEndpoint}`;

    // Record start time for performance measurement
    const startTime = Date.now();

    // Create headers with proper authentication
    const headers = createAuthHeaders(apiKey, authType);

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

    // Count and log the number of records for debugging
    const recordCount = Array.isArray(data) ? data.length : 1;
    console.log(`API test returned ${recordCount} record(s):`, data);

    return {
      success: true,
      data,
      status: response.status,
      duration,
      recordCount,
    };
  } catch (error) {
    console.error('Error testing API endpoint:', error);
    return {
      success: false,
      error: `Error testing API endpoint: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
