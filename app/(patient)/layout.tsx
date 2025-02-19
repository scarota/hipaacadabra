import PatientTopNav from '@/app/ui/patient/patient-topnav';

export default function PatientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <PatientTopNav />
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <footer className="border-t bg-white py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Powered by Healthcare Provider
          </p>
        </div>
      </footer>
    </div>
  );
}
