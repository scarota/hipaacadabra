import EditProfileForm from '@/app/ui/profile/edit-form';
import { Metadata } from 'next';
import { getUserInfo } from '@/app/lib/auth';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function ProfilePage() {
  const userInfo = await getUserInfo();

  return (
    <EditProfileForm
      firstName={userInfo?.firstName}
      lastName={userInfo?.lastName}
    />
  );
}
