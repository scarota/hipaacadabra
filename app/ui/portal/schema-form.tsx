'use client';

import ApiKeyConfig from '@/app/ui/portal/api-key-config';
import DataMapping from '@/app/ui/portal/data-mapping';
import type { FieldDefinition } from '@/app/lib/field-mapping-constants';

interface SchemaFormProps {
  initialApiConfig?: {
    id: string;
    org_code: string;
    api_key: string;
    base_url: string;
    created_at: Date;
    updated_at: Date;
  } | null;
  initialFieldMapping?: {
    id: string;
    org_code: string;
    mapping_type: string;
    endpoint: string;
    mappings: Record<string, string>;
    created_at: Date;
    updated_at: Date;
    fieldDefinitions?: FieldDefinition[];
  } | null;
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
