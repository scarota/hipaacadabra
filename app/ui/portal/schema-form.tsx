'use client';

import { useState } from 'react';
import { Button } from '@/app/ui/button';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface SchemaFormProps {
  organization: {
    orgCode: string;
    orgName: string;
  };
}

const DATA_SECTIONS = [
  {
    id: 'appointments',
    name: 'Appointments',
    description: 'Patient appointments and scheduling data',
    fields: ['date', 'time', 'provider', 'location', 'status'],
  },
  {
    id: 'invoices',
    name: 'Invoices',
    description: 'Billing and payment information',
    fields: ['amount', 'date', 'status', 'items', 'patient'],
  },
  {
    id: 'officeHours',
    name: 'Office Hours',
    description: 'Provider availability and office hours',
    fields: ['day', 'start', 'end', 'location', 'provider'],
  },
];

export default function SchemaForm({ organization }: SchemaFormProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* API Key Configuration */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-medium text-gray-900">API Configuration</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure your API endpoint and authentication
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6">
          <div>
            <label
              htmlFor="apiKey"
              className="block text-sm font-medium text-gray-700"
            >
              API Key
            </label>
            <div className="mt-1 flex items-center gap-x-3">
              <div className="relative flex-1">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  id="apiKey"
                  name="apiKey"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter your API key"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showApiKey ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <Button type="button">Verify</Button>
            </div>
          </div>

          <div>
            <label
              htmlFor="baseUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Base URL
            </label>
            <input
              type="text"
              id="baseUrl"
              name="baseUrl"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="https://api.yourprovider.com/v1"
            />
          </div>
        </div>
      </div>

      {/* Data Mapping */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-medium text-gray-900">Data Mapping</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure how your API data maps to our schema
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Data Sections */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Data Sections</h3>
            {DATA_SECTIONS.map((section) => (
              <div
                key={section.id}
                className={`cursor-pointer rounded-md border p-4 transition-colors ${
                  selectedSection === section.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedSection(section.id)}
              >
                <h4 className="text-sm font-medium text-gray-900">
                  {section.name}
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  {section.description}
                </p>
              </div>
            ))}
          </div>

          {/* Field Mapping */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Field Mapping</h3>
            {selectedSection ? (
              <div className="rounded-md border border-gray-200 p-4">
                <div className="space-y-6">
                  {/* Endpoint Configuration */}
                  <div>
                    <label
                      htmlFor={`${selectedSection}-endpoint`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      API Endpoint
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id={`${selectedSection}-endpoint`}
                        name={`${selectedSection}-endpoint`}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="/api/v1/appointments"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      The endpoint path for{' '}
                      {DATA_SECTIONS.find(
                        (s) => s.id === selectedSection,
                      )?.name.toLowerCase()}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="mb-4 text-sm font-medium text-gray-700">
                      Response Field Mapping
                    </h4>
                    <div className="space-y-4">
                      {DATA_SECTIONS.find(
                        (s) => s.id === selectedSection,
                      )?.fields.map((field) => (
                        <div key={field}>
                          <label
                            htmlFor={`${selectedSection}-${field}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          <div className="mt-1 flex gap-x-3">
                            <input
                              type="text"
                              id={`${selectedSection}-${field}`}
                              name={`${selectedSection}-${field}`}
                              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder={`response.data.${field}`}
                            />
                            <select className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                              <option value="string">String</option>
                              <option value="number">Number</option>
                              <option value="date">Date</option>
                              <option value="boolean">Boolean</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-md border border-gray-200 p-4">
                <p className="text-sm text-gray-500">
                  Select a data section to configure field mapping
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button type="submit">Save configuration</Button>
      </div>
    </div>
  );
}
