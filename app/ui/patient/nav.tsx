'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarIcon,
  DocumentTextIcon,
  HomeIcon,
  ClockIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const links = [
  { name: 'Dashboard', href: '/patient', icon: HomeIcon },
  { name: 'Appointments', href: '/patient/appointments', icon: CalendarIcon },
  { name: 'Invoices', href: '/patient/invoices', icon: DocumentTextIcon },
  { name: 'Office Hours', href: '/patient/hours', icon: ClockIcon },
  { name: 'Profile', href: '/patient/profile', icon: UserIcon },
];

export default function PatientNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-lg font-semibold text-blue-600">
                Patient Portal
              </span>
            </div>
            <div className="ml-10 flex items-baseline space-x-4">
              {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={clsx(
                      'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
                      {
                        'bg-blue-50 text-blue-600': pathname === link.href,
                        'text-gray-700 hover:bg-gray-100':
                          pathname !== link.href,
                      },
                    )}
                  >
                    <LinkIcon className="h-5 w-5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div>
            <form action="/patient/logout" method="POST">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}
