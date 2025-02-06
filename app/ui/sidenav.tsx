import NavLinks from '@/app/ui/nav-links';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-1 px-3 py-4">
        <NavLinks />
      </div>
    </div>
  );
}
