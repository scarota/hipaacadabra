import PortalSideNav from '@/app/ui/navigation/portal-sidenav';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="-m-8 flex min-h-screen">
      <div className="w-64 border-r bg-white">
        <PortalSideNav />
      </div>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
