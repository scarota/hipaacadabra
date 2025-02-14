'use client';

import { useActionState } from 'react';
import { Button } from '@/app/ui/button';
import { updateDomain } from '@/app/lib/portal-actions';
import type { State } from '@/app/lib/portal-actions';

interface DomainFormProps {
  organization: {
    orgCode: string;
    orgName: string;
  };
}

export default function DomainForm({ organization }: DomainFormProps) {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useActionState(updateDomain, initialState);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <form action={dispatch} className="space-y-6">
          <div>
            <label
              htmlFor="domain"
              className="block text-sm font-medium text-gray-700"
            >
              Domain Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="domain"
                name="domain"
                placeholder="portal.yourdomain.com"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Enter the domain you want to use for your customer portal
            </p>
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
            <Button type="submit">Save domain</Button>
          </div>
        </form>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="text-lg font-medium text-gray-900">DNS Configuration</h3>
        <p className="mt-1 text-sm text-gray-500">
          Add these DNS records to your domain provider to verify ownership
        </p>

        <div className="mt-6 space-y-4">
          <div className="rounded-md bg-gray-50 p-4">
            <h4 className="text-sm font-medium text-gray-900">CNAME Record</h4>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="mt-1 font-mono text-sm">portal</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Value</p>
                <p className="mt-1 font-mono text-sm">proxy.hipaacadabra.com</p>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-gray-50 p-4">
            <h4 className="text-sm font-medium text-gray-900">TXT Record</h4>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="mt-1 font-mono text-sm">_hipaacadabra.portal</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Value</p>
                <p className="mt-1 font-mono text-sm">
                  verify={organization.orgCode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
