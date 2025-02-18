'use client';

import { useState } from 'react';
import { Button } from '@/app/ui/button';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function ApiKeyConfig() {
  const [showApiKey, setShowApiKey] = useState(false);

  return (
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
  );
}
