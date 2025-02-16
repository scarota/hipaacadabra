import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Patient Login',
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
} 