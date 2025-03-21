import type { FieldDefinition } from '@/app/lib/field-mapping-constants';

/**
 * Represents a portal API configuration
 */
export interface ApiConfig {
  id: string;
  org_code: string;
  api_key: string;
  base_url: string;
  auth_type: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Represents a field mapping configuration
 */
export interface FieldMapping {
  id: string;
  org_code: string;
  mapping_type: string;
  endpoint: string;
  mappings: Record<string, string>;
  created_at: Date;
  updated_at: Date;
  fieldDefinitions?: FieldDefinition[];
}

/**
 * State for API configuration form
 */
export interface ApiConfigState {
  message: string | null;
  errors?: {
    apiKey?: string[];
    baseUrl?: string[];
    authType?: string[];
  };
}

/**
 * State for field mapping form
 */
export interface FieldMappingState {
  message: string | null;
  errors?: {
    endpoint?: string[];
    mappings?: string[];
    mappingType?: string[];
  };
}

/**
 * Result of an API test call
 */
export interface ApiTestResult {
  success: boolean;
  data?: any;
  error?: string;
  status?: number;
  duration?: number;
  recordCount?: number;
}
