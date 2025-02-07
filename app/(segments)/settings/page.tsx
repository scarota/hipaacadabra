import SideNav from '@/app/ui/sidenav';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function SettingsPage() {
  return (
    <div className="-m-8 flex h-full">
      <div className="w-64 border-r bg-white">
        <SideNav />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <p className="text-3xl font-bold">
          This is a placeholder for the Settings page.
        </p>
      </div>
    </div>
  );
}
