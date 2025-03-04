'use client';

import { useState } from 'react';
import { Button } from '@/app/ui/button';
import { testApiEndpoint } from '@/app/lib/portal-actions';
import type { ApiTestResult } from '@/app/lib/portal-actions';
import type { FieldDefinition } from '@/app/lib/field-mapping-constants';

interface ApiTestOutputProps {
  endpoint: string;
  mappingType: string;
  fieldMappings: Record<string, string>;
  currentMapping: {
    id: string;
    name: string;
    endpoint: string;
    fields: FieldDefinition[];
  };
}

export default function ApiTestOutput({
  endpoint,
  mappingType,
  fieldMappings,
  currentMapping,
}: ApiTestOutputProps) {
  const [testId, setTestId] = useState<string>('');
  const [testResult, setTestResult] = useState<ApiTestResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTestApiCall = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const result = await testApiEndpoint(mappingType, endpoint, testId);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format JSON for display
  const formatJson = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h3 className="text-md font-medium text-gray-900">API Test</h3>
      <p className="mt-1 text-sm text-gray-500">
        Test your API endpoint with a sample ID
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="testId"
            className="block text-sm font-medium text-gray-700"
          >
            Test ID (replaces {'{id}'} in endpoint)
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="testId"
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter an ID to test"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleTestApiCall}
            disabled={isLoading}
          >
            {isLoading ? 'Testing...' : 'Test API Call'}
          </Button>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700">Test Results</h4>
            <div className="mt-2">
              {testResult.success ? (
                <div className="rounded-md bg-green-50 p-2">
                  <p className="text-sm text-green-700">
                    Success! Status: {testResult.status}, Time:{' '}
                    {testResult.duration}ms
                  </p>
                </div>
              ) : (
                <div className="rounded-md bg-red-50 p-2">
                  <p className="text-sm text-red-700">
                    Error: {testResult.error}
                  </p>
                </div>
              )}
            </div>

            {/* Request Details */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">
                Request Details
              </h4>
              <div className="mt-2 rounded-md bg-gray-50 p-2">
                <p className="text-xs text-gray-700">
                  <span className="font-medium">Method:</span> GET
                </p>
                <p className="text-xs text-gray-700">
                  <span className="font-medium">Authentication:</span> Using API
                  configuration (check API Configuration section)
                </p>
                <p className="break-all text-xs text-gray-700">
                  <span className="font-medium">Endpoint:</span>{' '}
                  {endpoint.replace('{id}', testId || '{id}')}
                </p>
              </div>
            </div>

            {/* Response Data */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">
                Response Data
              </h4>
              <div className="mt-2 max-h-96 overflow-auto rounded-md bg-gray-50 p-4">
                <pre className="text-xs text-gray-800">
                  {testResult.success && testResult.data
                    ? formatJson(testResult.data)
                    : 'No data available'}
                </pre>
              </div>
            </div>

            {/* Field Mapping Preview */}
            {testResult.success && testResult.data && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Field Mapping Preview
                </h4>
                <div className="mt-2 rounded-md bg-gray-50 p-4">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr>
                        <th className="py-2 text-left font-medium text-gray-700">
                          Portal Field
                        </th>
                        <th className="py-2 text-left font-medium text-gray-700">
                          EHR Field
                        </th>
                        <th className="py-2 text-left font-medium text-gray-700">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentMapping.fields.map((field) => {
                        const ehrField = fieldMappings[field.name] || '';

                        // Handle nested paths like "patient.id" by splitting on dots
                        let value = 'No mapping';

                        if (ehrField && testResult.data) {
                          if (ehrField.includes('.')) {
                            // Handle nested paths
                            const parts = ehrField.split('.');
                            let current = testResult.data;

                            // Navigate through the object path
                            for (const part of parts) {
                              if (
                                current &&
                                typeof current === 'object' &&
                                part in current
                              ) {
                                current = current[part];
                              } else {
                                current = undefined;
                                break;
                              }
                            }

                            value =
                              current !== undefined ? current : 'Not found';
                          } else {
                            // Direct property access
                            value =
                              testResult.data[ehrField] !== undefined
                                ? testResult.data[ehrField]
                                : 'Not found';
                          }
                        }

                        return (
                          <tr
                            key={field.name}
                            className="border-t border-gray-200"
                          >
                            <td className="py-2 text-gray-700">
                              {field.label}
                            </td>
                            <td className="py-2 text-gray-700">
                              {ehrField || 'Not mapped'}
                            </td>
                            <td className="py-2 text-gray-700">
                              {typeof value === 'object'
                                ? JSON.stringify(value)
                                : String(value)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
