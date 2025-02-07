import SideNav from '@/app/ui/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="-m-8 flex min-h-screen">
      <div className="w-64 border-r bg-white">
        <SideNav />
      </div>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
