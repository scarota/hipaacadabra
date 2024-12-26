import Link from 'next/link';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { getUserEmail } from '@/app/lib/auth';

export default function TopNav() {
  return (
    <div className="w-full border-b bg-white">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center">
          <div className="mr-8">
            <AcmeLogo />
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-sm text-gray-700 hover:text-gray-900"
            >
              Home
            </Link>
            <Link
              href="/snapshots"
              className="text-sm text-gray-700 hover:text-gray-900"
            >
              Snapshots
            </Link>
            <Link
              href="/reports"
              className="text-sm text-gray-700 hover:text-gray-900"
            >
              Reports
            </Link>
            <Link
              href="/teams"
              className="text-sm text-gray-700 hover:text-gray-900"
            >
              Teams
            </Link>
            <LogoutLink className="text-sm text-gray-700 hover:text-gray-900">
              Sign Out
            </LogoutLink>
          </div>
        </div>
        <div className="group relative">
          <button className="flex items-center gap-2 text-sm text-gray-700">
            <span className="font-medium">{getUserEmail()}</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          </button>
          {/* <div className="absolute right-0 top-full mt-1 hidden w-48 rounded-md border bg-white shadow-lg group-hover:block">
            <LogoutLink className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <PowerIcon className="h-5 w-5" />
              <span>Sign Out</span>
            </LogoutLink>
          </div> */}
        </div>
      </div>
    </div>
  );
}
