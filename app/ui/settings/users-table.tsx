import { formatDateToLocal } from '@/app/lib/utils';
import type { KindeUser } from '@/app/lib/definitions';
import Search from '@/app/ui/search';

interface UsersTableProps {
  users: KindeUser[];
  currentUserEmail?: string | null;
}

export default function UsersTable({ users, currentUserEmail }: UsersTableProps) {
  return (
    <div className="mt-6 flow-root">
      <div className="mb-4">
        <Search placeholder="Filter users by name, email, or role" />
      </div>
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-white p-2 md:pt-0">
          <div className="md:hidden">
            {users?.map((user) => (
              <div
                key={user.email}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                        {user.email === currentUserEmail && (
                          <span className="ml-2 text-sm text-gray-500">(You)</span>
                        )}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {user.roles.map((role) => (
                        <span
                          key={role}
                          className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xs text-gray-500">Joined On</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDateToLocal(user.joinedOn)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Roles
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Joined On
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {users?.map((user) => (
                <tr
                  key={user.email}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>
                        {user.firstName} {user.lastName}
                        {user.email === currentUserEmail && (
                          <span className="ml-2 text-sm text-gray-500">(You)</span>
                        )}
                      </p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{user.email}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <span
                          key={role}
                          className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(user.joinedOn)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
