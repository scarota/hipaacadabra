'use client';

import { useActionState } from 'react';
import { Button } from '@/app/ui/button';
import { updateBranding } from '@/app/lib/portal-actions';
import type { State } from '@/app/lib/portal-actions';

interface BrandingFormProps {
  organization: {
    orgCode: string;
    orgName: string;
  };
}

export default function BrandingForm({}: BrandingFormProps) {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useActionState(updateBranding, initialState);

  return (
    <div className="max-w-2xl rounded-lg bg-white p-6 shadow">
      <form action={dispatch} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Primary Color */}
          <div>
            <label
              htmlFor="primaryColor"
              className="block text-sm font-medium text-gray-700"
            >
              Primary Color
            </label>
            <div className="mt-1 flex items-center gap-x-3">
              <input
                type="color"
                id="primaryColor"
                name="primaryColor"
                defaultValue="#0066FF"
                className="h-10 w-10 rounded-md border border-gray-300"
              />
              <p className="text-sm text-gray-500">
                Used for buttons, links, and accents
              </p>
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label
              htmlFor="logo"
              className="block text-sm font-medium text-gray-700"
            >
              Logo
            </label>
            <div className="mt-2 flex items-center gap-x-3">
              <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                {/* Logo preview will go here */}
              </div>
              <button
                type="button"
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Change
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              SVG, PNG or JPG. 1MB max.
            </p>
          </div>

          {/* Font Selection */}
          <div>
            <label
              htmlFor="font"
              className="block text-sm font-medium text-gray-700"
            >
              Font Family
            </label>
            <select
              id="font"
              name="font"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="inter">Inter</option>
              <option value="roboto">Roboto</option>
              <option value="opensans">Open Sans</option>
              <option value="lato">Lato</option>
            </select>
          </div>
        </div>

        {state.message && (
          <div
            className={`rounded-md p-4 ${
              state.errors
                ? 'bg-red-50 text-red-700'
                : 'bg-green-50 text-green-700'
            }`}
          >
            <p className="text-sm">{state.message}</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit">Save branding</Button>
        </div>
      </form>
    </div>
  );
}
