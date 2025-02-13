import { Metadata } from 'next';
import { getOrganizationUsers } from '@/app/lib/kinde-data';
import UsersTable from '@/app/ui/settings/users-table';

export const metadata: Metadata = {
  title: 'Users',
};

export default async function UsersPage() {
  const users = await getOrganizationUsers();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage users in your organization
        </p>
      </div>

      <UsersTable users={users} />
    </div>
  );
}
