import { RocketLaunchIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import clsx from 'clsx';

export default function AcmeLogo({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        `${lusitana.className} flex flex-row items-center leading-none`,
        className,
      )}
    >
      <RocketLaunchIcon className="h-8 w-8 text-blue-600" />
      <p className="text-xl font-semibold">Acme</p>
    </div>
  );
}
