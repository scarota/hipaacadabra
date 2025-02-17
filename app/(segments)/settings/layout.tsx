import SettingsSideNav from '@/app/ui/navigation/settings-sidenav';
import { protectRoute } from '@/app/lib/auth';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await protectRoute(['owner']);

  return (
    <div className="-m-8 flex min-h-screen">
      <div className="w-64 border-r bg-white">
        <SettingsSideNav />
      </div>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
