import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Users, init } from '@kinde/management-api-js';

export async function getOrganization(): Promise<
  { orgCode: string; orgName: string } | undefined
> {
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

    return {
      orgCode: org.orgCode,
      orgName: org.orgName || org.orgCode,
    };
  } catch (error) {
    // Log the error and return undefined
    console.error('Error fetching organization:', error);
    return undefined;
  }
}

export async function getUserInfo(): Promise<
  | { firstName?: string; lastName?: string; email: string; id: string }
  | undefined
> {
  try {
    const session = getKindeServerSession();
    if (!session || typeof session.getUser !== 'function') {
      console.error('Invalid session or getUser function not found.');
      return undefined;
    }

    const user = await session.getUser();
    if (!user || !user.email || !user.id) {
      console.warn('User not found or required fields missing.');
      return undefined;
    }

    return {
      firstName: user.given_name || '',
      lastName: user.family_name || '',
      email: user.email,
      id: user.id,
    };
  } catch (error) {
    console.error('Error fetching user info:', error);
    return undefined;
  }
}

export async function testing() {
  init();
  const { users } = await Users.getUsers();
  console.log(users);

  return {
    users,
  };
}

// testing();
