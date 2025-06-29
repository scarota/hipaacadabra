'use client';

import { HomeIcon, WindowIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function TopNavLinks() {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/dashboard', icon: HomeIcon },
    { name: 'Portal', href: '/portal', icon: WindowIcon },
  ];

  return (
    <>
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
                'text-gray-700 hover:bg-gray-100': pathname !== link.href,
              },
            )}
          >
            <LinkIcon className="h-5 w-5" />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </>
  );
}
