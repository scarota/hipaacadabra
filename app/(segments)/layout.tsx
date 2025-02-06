import SideNav from '@/app/ui/sidenav';
import TopNav from '../ui/top-nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <TopNav />
      <div className="flex flex-1">
        <div className="w-64 border-r bg-white">
          <SideNav />
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">{children}</div>
      </div>
    </div>
  );
}
