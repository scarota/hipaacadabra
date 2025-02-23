'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { Button } from '@/app/ui/button';
import { updateFieldMapping } from '@/app/lib/portal-actions';
import type { FieldMappingState } from '@/app/lib/portal-actions';
import { USER_MAPPING } from '@/app/lib/field-mapping-constants';

interface DataMappingProps {
  initialMapping?: {
    endpoint: string;
    mappings: Record<string, string>;
  } | null;
}

export default function DataMapping({ initialMapping }: DataMappingProps) {
  const initialState: FieldMappingState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(updateFieldMapping, initialState);
  const [endpoint, setEndpoint] = useState<string>(
    initialMapping?.endpoint || USER_MAPPING.endpoint,
  );
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>(
    initialMapping?.mappings || {},
  );

  const handleFieldMappingChange = (fieldName: string, value: string) => {
    setFieldMappings((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="text-lg font-medium text-gray-900">
        Patient Data Mapping
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Configure how your EHR patient data maps to portal users
      </p>

      <form action={dispatch} className="mt-6 space-y-6">
        {/* Endpoint Configuration */}
        <div>
          <label
            htmlFor="endpoint"
            className="block text-sm font-medium text-gray-700"
          >
            Patient API Endpoint
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="endpoint"
              name="endpoint"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder={USER_MAPPING.endpoint}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            The endpoint path for retrieving patient data. Use {'{id}'} to
            indicate the patient identifier.
          </p>
          <div className="mt-2 rounded-md bg-blue-50 p-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Mapping Example
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p className="mb-2">For a JSON response like:</p>
                  <pre className="mb-2 overflow-x-auto rounded bg-blue-100 p-2 font-mono text-xs">
                    {`{
  "data": {
    "patient_id": "12345",
    "personal_info": {
      "given_name": "John",
      "family_name": "Doe",
      "birth_date": "1990-01-01"
    },
    "contact": {
      "email_address": "john@example.com",
      "phone_number": "555-0123"
    }
  }
}`}
                  </pre>
                  <p className="mb-2">Map the fields like:</p>
                  <ul className="list-inside list-disc space-y-1">
                    <li>
                      EHR Patient ID:{' '}
                      <span className="font-mono text-xs">data.patient_id</span>
                    </li>
                    <li>
                      First Name:{' '}
                      <span className="font-mono text-xs">
                        data.personal_info.given_name
                      </span>
                    </li>
                    <li>
                      Email:{' '}
                      <span className="font-mono text-xs">
                        data.contact.email_address
                      </span>
                    </li>
                  </ul>
                  <p className="mt-2">
                    Make sure the email field maps to the address used for
                    portal login.
                  </p>
                </div>
              </div>
            </div>
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
              {USER_MAPPING.fields.map((field) => (
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
                      value={fieldMappings[field.name] || ''}
                      onChange={(e) =>
                        handleFieldMappingChange(field.name, e.target.value)
                      }
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={`${field.name}`}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {field.description}
                    </p>
                  </div>
                </div>
              ))}
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
          <Button type="submit">Save mapping</Button>
        </div>
      </form>
    </div>
  );
}
