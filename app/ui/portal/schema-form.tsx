'use client';

import ApiKeyConfig from '@/app/ui/portal/api-key-config';
import DataMapping from '@/app/ui/portal/data-mapping';
import type { ApiConfig, FieldMapping } from '@/app/lib/portal-types';

interface SchemaFormProps {
  initialApiConfig?: ApiConfig | null;
  initialFieldMapping?: FieldMapping | null;
}

export default function SchemaForm({
  initialApiConfig,
  initialFieldMapping,
}: SchemaFormProps) {
  return (
    <div className="space-y-6">
      {/* API Key Configuration */}
      <ApiKeyConfig initialConfig={initialApiConfig} />

      {/* Data Mapping */}
      <DataMapping initialMapping={initialFieldMapping} />
    </div>
  );
}
