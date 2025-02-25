import { Metadata } from 'next';
import SchemaForm from '@/app/ui/portal/schema-form';
import {
  getPortalApiConfig,
  getFieldMappingByType,
} from '@/app/lib/portal-data';
import { PATIENT_MAPPING } from '@/app/lib/field-mapping-constants';

export const metadata: Metadata = {
  title: 'Schema Configuration',
};

export default async function SchemaPage() {
  const apiConfig = await getPortalApiConfig();
  // Fetch the patient mapping data by default
  const patientMapping = await getFieldMappingByType(PATIENT_MAPPING.id);

  if (!apiConfig) {
    return null;
  }

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

      <SchemaForm
        initialApiConfig={apiConfig}
        initialFieldMapping={patientMapping}
      />
    </div>
  );
}
