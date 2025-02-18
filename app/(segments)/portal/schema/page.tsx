import { Metadata } from 'next';
import SchemaForm from '@/app/ui/portal/schema-form';
import { getUserOrganization } from '@/app/lib/kinde-data';
import { getPortalApiConfig } from '@/app/lib/portal-data';

export const metadata: Metadata = {
  title: 'Schema Configuration',
};

export default async function SchemaPage() {
  const organization = await getUserOrganization();

  if (!organization) {
    return null;
  }

  const apiConfig = await getPortalApiConfig();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Schema Configuration
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your API integration and data mapping
        </p>
      </div>

      <SchemaForm organization={organization} initialApiConfig={apiConfig} />
    </div>
  );
}
