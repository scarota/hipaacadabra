'use server';

import { revalidatePath } from 'next/cache';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Users, init } from '@kinde/management-api-js';

export async function updateProfile(formData: FormData) {
  const { getUser, refreshTokens } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    throw new Error('Unable to update profile. User not found.');
  }

  try {
    init();
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    const payload = {
      id: user.id,
      requestBody: {
        given_name: firstName,
        family_name: lastName,
      },
    };

    await Users.updateUser(payload);

    await refreshTokens();

    revalidatePath('/profile');
  } catch (error) {
    console.error('Failed to update profile:', error);
    throw new Error('Failed to update profile');
  }
}
