import { Metadata } from 'next';
import GeneralForm from '@/app/ui/settings/general-form';
import { getUserOrganization } from '@/app/lib/kinde-data';

export const metadata: Metadata = {
  title: 'General Settings',
};

export default async function GeneralSettingsPage() {
  const organization = await getUserOrganization();

  if (!organization) {
    return null;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          General Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Update your organization settings
        </p>
      </div>

      <GeneralForm organizationName={organization.orgName} />
    </div>
  );
}
