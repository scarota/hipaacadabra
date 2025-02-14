import EditProfileForm from '@/app/ui/profile/edit-form';
import { Metadata } from 'next';
import { getUserInfo } from '@/app/lib/kinde-data';
import Avatar from '@/app/ui/avatar';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function ProfilePage() {
  const userInfo = await getUserInfo();

  if (!userInfo) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex justify-center">
          <Avatar firstName={userInfo.firstName} lastName={userInfo.lastName} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Profile Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Update your personal information
        </p>
      </div>

      <EditProfileForm
        firstName={userInfo.firstName}
        lastName={userInfo.lastName}
        email={userInfo.email}
      />
    </div>
  );
}
