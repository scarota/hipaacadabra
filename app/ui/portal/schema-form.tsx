'use client';

import ApiKeyConfig from '@/app/ui/portal/api-key-config';
import DataMapping from '@/app/ui/portal/data-mapping';

interface SchemaFormProps {
  initialApiConfig?: {
    id: string;
    org_code: string;
    api_key: string;
    base_url: string;
    created_at: Date;
    updated_at: Date;
  } | null;
}

export default function SchemaForm({ initialApiConfig }: SchemaFormProps) {
  return (
    <div className="space-y-6">
      {/* API Key Configuration */}
      <ApiKeyConfig initialConfig={initialApiConfig} />

      {/* Data Mapping */}
      <DataMapping />
    </div>
  );
}
