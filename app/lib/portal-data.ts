import { PrismaClient } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';
import { getUserOrganization } from '@/app/lib/kinde-data';
import { decrypt } from '@/app/lib/encryption';
import { DATA_MAPPINGS } from '@/app/lib/field-mapping-constants';

export async function getPortalApiConfig() {
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
      ...config,
      api_key: await decrypt(config.api_key),
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch portal API configuration.');
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Retrieves a specific field mapping by type for the current organization
 * @param mappingType The type of mapping to retrieve (e.g., 'patient', 'appointment', 'invoice')
 * @returns The field mapping or null if not found
 */
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
