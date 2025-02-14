import { Metadata } from 'next';
import DomainForm from '@/app/ui/portal/domain-form';
import { getUserOrganization } from '@/app/lib/kinde-data';

export const metadata: Metadata = {
  title: 'Custom Domain',
};

export default async function DomainPage() {
  const organization = await getUserOrganization();

  if (!organization) {
    return null;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Custom Domain</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure a custom domain for your customer portal
        </p>
      </div>

      <DomainForm organization={organization} />
    </div>
  );
}
