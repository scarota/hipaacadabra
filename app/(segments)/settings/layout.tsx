import SideNav from '@/app/ui/navigation/sidenav';
import { protectAdminRoute } from '@/app/lib/auth';

export default async function Layout({ children }: { children: React.ReactNode }) {
  await protectAdminRoute();

  return (
    <div className="-m-8 flex min-h-screen">
      <div className="w-64 border-r bg-white">
        <SideNav />
      </div>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
