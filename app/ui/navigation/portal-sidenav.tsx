'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { SwatchIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const links = [
  { name: 'Branding', href: '/portal/branding', icon: SwatchIcon },
  { name: 'Custom Domain', href: '/portal/domain', icon: GlobeAltIcon },
];

export default function PortalSideNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-1 px-3 py-4">
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
      </div>
    </div>
  );
}
