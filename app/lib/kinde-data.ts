import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Organizations, init } from '@kinde/management-api-js';
import type { KindeUser } from './definitions';

export async function getUserOrganization(): Promise<
  { orgCode: string; orgName: string; orgLogo?: string } | undefined
> {
  try {
    // Retrieve session from Kinde
    const session = getKindeServerSession();

    // Validate session and getOrganization method
    if (!session || typeof session.getOrganization !== 'function') {
      console.error('Invalid session or getOrganization function not found.');
      return undefined;
    }

    // Get the org code from the session first
    const sessionOrg = await session.getOrganization();
    if (!sessionOrg?.orgCode) {
      console.warn('Organization not found or orgCode is missing.');
      return undefined;
    }

    // Initialize the management API
    init();

    // Fetch organization details from the management API
    const org = await Organizations.getOrganization({
      code: sessionOrg.orgCode,
    });

    if (!org || !org.code) {
      console.warn('Organization not found in management API.');
      return undefined;
    }

    return {
      orgCode: org.code,
      orgName: org.name ?? org.code,
      orgLogo: org.logo || undefined,
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

export async function getOrganizationUsers(): Promise<KindeUser[]> {
  try {
    // Retrieve session from Kinde
    const session = getKindeServerSession();

    // Validate session and getOrganization method
    if (!session || typeof session.getOrganization !== 'function') {
      console.error('Invalid session or getOrganization function not found.');
      return [];
    }

    // Get the org code from the session first
    const sessionOrg = await session.getOrganization();
    if (!sessionOrg?.orgCode) {
      console.warn('Organization not found or orgCode is missing.');
      return [];
    }

    // Initialize the management API
    init();

    // Fetch organization users from the management API
    const response = await Organizations.getOrganizationUsers({
      orgCode: sessionOrg.orgCode,
    });

    if (!response.organization_users) {
      console.warn('No users found in organization.');
      return [];
    }

    // Map organization users to our KindeUser type
    return response.organization_users.map((user) => ({
      email: user.email!,
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      joinedOn: user.joined_on || new Date().toISOString(),
      roles: user.roles || [],
    }));
  } catch (error) {
    // Log the error and return empty array
    console.error('Error fetching organization users:', error);
    return [];
  }
}
