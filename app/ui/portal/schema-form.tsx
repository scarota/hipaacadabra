'use client';

import ApiKeyConfig from '@/app/ui/portal/api-key-config';
import DataMapping from '@/app/ui/portal/data-mapping';

interface SchemaFormProps {
  organization: {
    orgCode: string;
    orgName: string;
  };
  initialApiConfig?: {
    id: string;
    org_code: string;
    api_key: string;
    base_url: string;
    is_verified: boolean;
    last_verified: Date | null;
    created_at: Date;
    updated_at: Date;
  } | null;
}

export default function SchemaForm({
  organization,
  initialApiConfig,
}: SchemaFormProps) {
  return (
    <div className="space-y-6">
      {/* API Key Configuration */}
      <ApiKeyConfig
        organization={organization}
        initialConfig={initialApiConfig}
      />

      {/* Data Mapping */}
      <DataMapping organization={organization} />
    </div>
  );
}
