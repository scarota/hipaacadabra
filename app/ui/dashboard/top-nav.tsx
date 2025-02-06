import Link from 'next/link';
import AcmeLogo from '@/app/ui/acme-logo';
import {
  PowerIcon,
  ChevronDownIcon,
  UserIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { getUserInfo } from '@/app/lib/kinde-data';
import NavLinks from '@/app/ui/dashboard/nav-links';

export default async function TopNav() {
  const userInfo = await getUserInfo();

  return (
    <div className="w-full border-b bg-white">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center">
          <div className="mr-8">
            <AcmeLogo />
          </div>
          <div className="flex items-center space-x-4">
            <NavLinks />
          </div>
        </div>
        <div className="group relative">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
            <span className="font-medium">{userInfo?.email}</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:rotate-180" />
          </button>
          {/* Submenu */}
          <div className="absolute right-0 mt-2 w-48 origin-top-right scale-0 transform rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 group-hover:scale-100">
            <Link
              href="/dashboard/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <UserIcon className="mr-3 h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <CogIcon className="mr-3 h-4 w-4" />
              Settings
            </Link>
            <div className="my-1 border-t border-gray-100"></div>
            <LogoutLink className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <PowerIcon className="mr-3 h-4 w-4" />
              Sign out
            </LogoutLink>
          </div>
        </div>
      </div>
    </div>
  );
}
