import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { AuthProvider } from './AuthProvider';
import TopNav from '@/app/ui/dashboard/top-nav';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          <div className="flex h-screen flex-col">
            <TopNav />
            {children}
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
