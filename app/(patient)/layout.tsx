'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isPatientAuthenticated } from '@/app/lib/patient/auth-utils';
import PatientTopNav from '@/app/ui/patient/patient-topnav';

export default function PatientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    const authenticated = isPatientAuthenticated();
    setIsAuthenticated(authenticated);

    // If not authenticated and not on the login page, redirect to login
    if (
      !authenticated &&
      !window.location.pathname.includes('/patient/login')
    ) {
      router.push('/patient/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If on a protected page and not authenticated, don't render children
  // This is a fallback in case the middleware redirect fails
  if (
    !isAuthenticated &&
    !window.location.pathname.includes('/patient/login')
  ) {
    return null;
  }

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
