'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { Button } from '@/app/ui/button';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { updatePortalApiConfig } from '@/app/lib/portal-actions';
import type { State } from '@/app/lib/portal-actions';

interface ApiKeyConfigProps {
  organization: {
    orgCode: string;
    orgName: string;
  };
  initialConfig?: {
    id: string;
    org_code: string;
    api_key: string;
    base_url: string;
    created_at: Date;
    updated_at: Date;
  } | null;
}

export default function ApiKeyConfig({
  organization,
  initialConfig,
}: ApiKeyConfigProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useActionState(updatePortalApiConfig, initialState);

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="text-lg font-medium text-gray-900">API Configuration</h2>
      <p className="mt-1 text-sm text-gray-500">
        Configure your API endpoint and authentication
      </p>

      <form action={dispatch} className="mt-6 grid grid-cols-1 gap-6">
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
                defaultValue={initialConfig?.api_key}
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
          {state.errors?.apiKey && (
            <p className="mt-2 text-sm text-red-600" id="apiKey-error">
              {state.errors.apiKey.join(', ')}
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
            defaultValue={initialConfig?.base_url}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="https://api.yourprovider.com/v1"
            aria-describedby="baseUrl-error"
          />
          {state.errors?.baseUrl && (
            <p className="mt-2 text-sm text-red-600" id="baseUrl-error">
              {state.errors.baseUrl.join(', ')}
            </p>
          )}
        </div>

        {state.message && !state.errors && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-700">{state.message}</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit">Save configuration</Button>
        </div>
      </form>
    </div>
  );
}
