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

  return <GeneralForm organizationName={organization.orgName} />;
}
