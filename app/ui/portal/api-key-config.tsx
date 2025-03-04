'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/ui/button';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { updatePortalApiConfig } from '@/app/lib/portal-actions';
import type { State } from '@/app/lib/portal-actions';

interface ApiKeyConfigProps {
  initialConfig?: {
    id: string;
    org_code: string;
    api_key: string;
    base_url: string;
    auth_type: string;
    created_at: Date;
    updated_at: Date;
  } | null;
}

export default function ApiKeyConfig({ initialConfig }: ApiKeyConfigProps) {
  // Form state
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState(initialConfig?.api_key || '');
  const [baseUrl, setBaseUrl] = useState(initialConfig?.base_url || '');
  const [authType, setAuthType] = useState(initialConfig?.auth_type || '');

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<State>({
    message: null,
    errors: {},
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('apiKey', apiKey);
      formData.append('baseUrl', baseUrl);
      formData.append('authType', authType);

      // Call the server action
      const result = await updatePortalApiConfig(formState, formData);

      // Update form state with the result
      setFormState(result);
    } catch (error) {
      setFormState({
        message: 'An unexpected error occurred',
        errors: { apiKey: ['Failed to save configuration'] },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update state when initialConfig changes
  useEffect(() => {
    if (initialConfig) {
      if (initialConfig.api_key) setApiKey(initialConfig.api_key);
      if (initialConfig.base_url) setBaseUrl(initialConfig.base_url);
      if (initialConfig.auth_type) setAuthType(initialConfig.auth_type);
    }
  }, [initialConfig]);

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="text-lg font-medium text-gray-900">API Configuration</h2>
      <p className="mt-1 text-sm text-gray-500">
        Configure your API endpoint and authentication
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-6">
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
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your API key"
                aria-describedby="apiKey-error"
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
          </div>
          {formState.errors?.apiKey && (
            <p className="mt-2 text-sm text-red-600" id="apiKey-error">
              {formState.errors.apiKey.join(', ')}
            </p>
          )}
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
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="https://api.yourprovider.com/v1"
            aria-describedby="baseUrl-error"
          />
          {formState.errors?.baseUrl && (
            <p className="mt-2 text-sm text-red-600" id="baseUrl-error">
              {formState.errors.baseUrl.join(', ')}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="authType"
            className="block text-sm font-medium text-gray-700"
          >
            Authentication Type
          </label>
          <select
            id="authType"
            name="authType"
            value={authType}
            onChange={(e) => setAuthType(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-describedby="authType-error"
          >
            <option value="bearer">Bearer Token</option>
            <option value="x-auth-key">X-Auth-Key Header</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Select how your API key should be sent in the request
          </p>
          {formState.errors?.authType && (
            <p className="mt-2 text-sm text-red-600" id="authType-error">
              {formState.errors.authType.join(', ')}
            </p>
          )}
        </div>

        {formState.message && !formState.errors && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-700">{formState.message}</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save configuration'}
          </Button>
        </div>
      </form>
    </div>
  );
}
