import { Metadata } from 'next';
import { getOrganizationUsers, getUserInfo } from '@/app/lib/kinde-data';
import UsersTable from '@/app/ui/settings/users-table';

export const metadata: Metadata = {
  title: 'Users',
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params?.query || '';
  const users = await getOrganizationUsers();
  const currentUser = await getUserInfo();

  const filteredUsers = users.filter((user) => {
    const searchTerm = query.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.roles.some((role) => role.toLowerCase().includes(searchTerm))
    );
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage users in your organization
        </p>
      </div>

      <UsersTable users={filteredUsers} currentUserEmail={currentUser?.email} />
    </div>
  );
}
