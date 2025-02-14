import { Metadata } from 'next';
import BrandingForm from '@/app/ui/portal/branding-form';
import { getUserOrganization } from '@/app/lib/kinde-data';

export const metadata: Metadata = {
  title: 'Portal Branding',
};

export default async function BrandingPage() {
  const organization = await getUserOrganization();

  if (!organization) {
    return null;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Portal Branding
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Customize the look and feel of your customer portal
        </p>
      </div>

      <BrandingForm organization={organization} />
    </div>
  );
}
