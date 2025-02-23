import { PrismaClient } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';
import { getUserOrganization } from '@/app/lib/kinde-data';
import { decrypt } from '@/app/lib/encryption';

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
