import TopNav from '@/app/ui/navigation/topnav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <TopNav />
      <div className="flex flex-1">
        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">{children}</div>
      </div>
    </div>
  );
}
