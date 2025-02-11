'use client';

import { useActionState } from 'react';
import { Button } from '@/app/ui/button';
import { updateOrganization } from '@/app/lib/kinde-actions';
import type { State } from '@/app/lib/kinde-actions';

interface GeneralFormProps {
  organizationName: string;
  logo?: string;
}

export default function GeneralForm({
  organizationName,
  logo = '',
}: GeneralFormProps) {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useActionState(updateOrganization, initialState);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          General Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Update your organization settings
        </p>
      </div>

      <div className="max-w-2xl rounded-lg bg-white p-6 shadow">
        <form action={dispatch} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label
                htmlFor="organizationName"
                className="block text-sm font-medium text-gray-700"
              >
                Organization Name
              </label>
              <input
                type="text"
                id="organizationName"
                name="organizationName"
                defaultValue={organizationName}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your organization name"
                aria-describedby="organizationName-error"
              />
              {state.errors?.organizationName && (
                <div
                  id="organizationName-error"
                  className="mt-1 text-sm text-red-600"
                >
                  {state.errors.organizationName.join(', ')}
                </div>
              )}
            </div>

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
                JPG, GIF or PNG. 1MB max.
              </p>
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
            <Button type="submit">Update settings</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
