import { Metadata } from 'next';
import GeneralForm from '@/app/ui/settings/general-form';
import { getOrganization } from '@/app/lib/kinde-data';

export const metadata: Metadata = {
  title: 'General Settings',
};

export default async function GeneralSettingsPage() {
  const organization = await getOrganization();

  if (!organization) {
    return null;
  }

  return <GeneralForm organizationName={organization.orgName} />;
}
