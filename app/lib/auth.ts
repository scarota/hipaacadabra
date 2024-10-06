import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function getOrganization(): Promise<string | undefined> {
  try {
    // Retrieve session from Kinde
    const session = getKindeServerSession();

    // Validate session and getOrganization method
    if (!session || typeof session.getOrganization !== 'function') {
      console.error('Invalid session or getOrganization function not found.');
      return undefined;
    }

    // Fetch organization information
    const org = await session.getOrganization();

    // Validate the returned organization object
    if (!org || !org.orgCode) {
      console.warn('Organization not found or orgCode is missing.');
      return undefined;
    }

    return org.orgCode;
  } catch (error) {
    // Log the error and return undefined
    console.error('Error fetching organization:', error);
    return undefined;
  }
}

export async function getUserEmail(): Promise<string | undefined> {
  try {
    const session = getKindeServerSession();
    if (!session || typeof session.getUser !== 'function') {
      console.error('Invalid session or getUser function not found.');
      return undefined;
    }
    const user = await session.getUser();
    if (!user || typeof user.email !== 'string') {
      console.warn('User not found or email is missing.');
      return undefined;
    }
    return user.email;
  } catch (error) {
    console.error('Error fetching user email:', error);
    return undefined;
  }
}
