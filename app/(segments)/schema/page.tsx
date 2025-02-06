import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Schema',
};

export default function SchemaPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-3xl font-bold">
        This is a placeholder for the Schema configuration page.
      </p>
    </div>
  );
}
