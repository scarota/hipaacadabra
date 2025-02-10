'use client';

import { useActionState } from 'react';
import Avatar from '@/app/ui/avatar';
import { Button } from '@/app/ui/button';
import { updateProfile } from '@/app/lib/kinde-actions';
import type { State } from '@/app/lib/kinde-actions';

interface EditProfileFormProps {
  firstName?: string;
  lastName?: string;
  email: string;
}

export default function EditProfileForm({
  firstName = '',
  lastName = '',
  email,
}: EditProfileFormProps) {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useActionState(updateProfile, initialState);

  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex justify-center">
          <Avatar firstName={firstName} lastName={lastName} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Profile Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Update your personal information
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <form action={dispatch} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                defaultValue={firstName}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your first name"
                aria-describedby="firstName-error"
              />
              {state.errors?.firstName && (
                <div id="firstName-error" className="mt-1 text-sm text-red-600">
                  {state.errors.firstName.join(', ')}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                defaultValue={lastName}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your last name"
                aria-describedby="lastName-error"
              />
              {state.errors?.lastName && (
                <div id="lastName-error" className="mt-1 text-sm text-red-600">
                  {state.errors.lastName.join(', ')}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={email}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm"
                placeholder="Enter your email"
                readOnly
              />
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
