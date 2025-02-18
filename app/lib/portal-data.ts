import { PrismaClient } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';
import { getUserOrganization } from '@/app/lib/kinde-data';
import { encrypt, decrypt } from '@/app/lib/encryption';

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

export async function verifyPortalApiConfig() {
  const prisma = new PrismaClient();
  const org = await getUserOrganization();

  if (!org?.orgCode) {
    throw new Error('Organization not found');
  }

  try {
    const config = await prisma.portal_api_configs.findUnique({
      where: {
        org_code: org.orgCode,
      },
    });

    if (!config) {
      throw new Error('API configuration not found');
    }

    // Decrypt the API key for verification
    const apiKey = await decrypt(config.api_key);

    // TODO: Implement actual API verification logic here
    // This would typically involve:
    // 1. Making a test API call
    // 2. Validating the response
    // 3. Checking permissions/scopes

    // Update verification status
    await prisma.portal_api_configs.update({
      where: {
        org_code: org.orgCode,
      },
      data: {
        is_verified: true,
        last_verified: new Date(),
      },
    });

    return true;
  } catch (error) {
    console.error('Verification Error:', error);
    throw new Error('Failed to verify API configuration.');
  } finally {
    await prisma.$disconnect();
  }
}
