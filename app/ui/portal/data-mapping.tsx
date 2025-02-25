'use client';

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { Button } from '@/app/ui/button';
import { updateFieldMapping } from '@/app/lib/portal-actions';
import type { FieldMappingState } from '@/app/lib/portal-actions';
import {
  PATIENT_MAPPING,
  DATA_MAPPINGS,
} from '@/app/lib/field-mapping-constants';
import type { FieldDefinition } from '@/app/lib/field-mapping-constants';

interface DataMappingProps {
  initialMapping?: {
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

export default function DataMapping({ initialMapping }: DataMappingProps) {
  const initialState: FieldMappingState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(updateFieldMapping, initialState);

  // Ensure we have a valid mapping type
  const [mappingType, setMappingType] = useState<string>(
    initialMapping?.mapping_type || PATIENT_MAPPING.id,
  );

  // Store endpoints for each mapping type
  const [endpoints, setEndpoints] = useState<Record<string, string>>(() => {
    // Initialize with default endpoints from constants
    const initialEndpoints: Record<string, string> = {};

    // Set defaults for all mapping types
    Object.entries(DATA_MAPPINGS).forEach(([type, mapping]) => {
      initialEndpoints[type] = mapping.endpoint;
    });

    // If we have an initial mapping, override its endpoint
    if (initialMapping?.mapping_type && initialMapping?.endpoint) {
      initialEndpoints[initialMapping.mapping_type] = initialMapping.endpoint;
    }

    return initialEndpoints;
  });

  // Current endpoint is based on the selected mapping type
  const endpoint =
    endpoints[mappingType] || DATA_MAPPINGS[mappingType]?.endpoint || '';

  // Ensure we have valid field mappings
  const initialFieldMappings = initialMapping?.mappings || {};
  const [fieldMappings, setFieldMappings] =
    useState<Record<string, string>>(initialFieldMappings);

  const currentMapping = DATA_MAPPINGS[mappingType] || PATIENT_MAPPING;

  // Update field mappings when mapping type changes
  useEffect(() => {
    if (mappingType !== initialMapping?.mapping_type) {
      // If switching to a different mapping type than what was initially loaded,
      // reset field mappings to empty to avoid showing incorrect mappings
      setFieldMappings({});
    } else if (initialMapping?.mappings) {
      // If switching back to the initial mapping type, restore the original mappings
      setFieldMappings(initialMapping.mappings);
    }
  }, [mappingType, initialMapping]);

  const handleMappingTypeChange = (newType: string) => {
    setMappingType(newType);
  };

  const handleEndpointChange = (value: string) => {
    setEndpoints((prev) => ({
      ...prev,
      [mappingType]: value,
    }));
  };

  const handleFieldMappingChange = (fieldName: string, value: string) => {
    setFieldMappings((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="text-lg font-medium text-gray-900">
        Data Mapping Configuration
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Configure how your EHR data maps to portal data
      </p>

      <form action={dispatch} className="mt-6 space-y-6">
        {/* Mapping Type Selection */}
        <div>
          <label
            htmlFor="mappingType"
            className="block text-sm font-medium text-gray-700"
          >
            Mapping Type
          </label>
          <div className="mt-1">
            <select
              id="mappingType"
              name="mappingType"
              value={mappingType}
              onChange={(e) => handleMappingTypeChange(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {Object.values(DATA_MAPPINGS).map((mapping) => (
                <option key={mapping.id} value={mapping.id}>
                  {mapping.name}
                </option>
              ))}
            </select>
          </div>
          {state.errors?.mappingType && (
            <div className="mt-2 text-sm text-red-600">
              {state.errors.mappingType.join(', ')}
            </div>
          )}
        </div>

        {/* Endpoint Configuration */}
        <div>
          <label
            htmlFor="endpoint"
            className="block text-sm font-medium text-gray-700"
          >
            {currentMapping.name} API Endpoint
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="endpoint"
              name="endpoint"
              value={endpoint}
              onChange={(e) => handleEndpointChange(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder={currentMapping.endpoint}
            />
          </div>
          {state.errors?.endpoint && (
            <div className="mt-2 text-sm text-red-600">
              {state.errors.endpoint.join(', ')}
            </div>
          )}
        </div>

        {/* Field Mappings */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Field Mappings</h3>
          <div className="rounded-md border border-gray-200 p-4">
            <div className="space-y-4">
              {currentMapping.fields.map((field) => {
                const fieldValue = fieldMappings[field.name] || '';

                return (
                  <div key={field.name}>
                    <label
                      htmlFor={field.name}
                      className="flex items-center text-sm font-medium text-gray-700"
                    >
                      {field.label}
                      {field.required && (
                        <span className="ml-1 text-red-500">*</span>
                      )}
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id={field.name}
                        name={field.name}
                        value={fieldValue}
                        onChange={(e) =>
                          handleFieldMappingChange(field.name, e.target.value)
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder={`EHR field for ${field.label.toLowerCase()}`}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {field.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          {state.errors?.mappings && (
            <div className="mt-2 text-sm text-red-600">
              {state.errors.mappings.join(', ')}
            </div>
          )}
        </div>

        {state.message && !state.errors && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-700">{state.message}</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit">Save Mapping</Button>
        </div>
      </form>
    </div>
  );
}
