'use client';

import { useActionState } from 'react';
import { Button } from '@/app/ui/button';
import { updateOrganization } from '@/app/lib/kinde-actions';
import type { State } from '@/app/lib/kinde-actions';
import { useRef, useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(logo);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (500KB = 512000 bytes)
      if (file.size > 512000) {
        alert('File is too large. Maximum size is 500KB.');
        return;
      }

      // Check file type
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        alert('Invalid file type. Please upload a JPG, PNG, or GIF.');
        return;
      }

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
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
              <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Logo preview"
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : logo ? (
                  <Image
                    src={logo}
                    alt="Organization logo"
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 p-2">
                    <PhotoIcon className="h-8 w-8 text-gray-400" />
                    <span className="mt-1 text-[10px] text-gray-500">
                      No logo
                    </span>
                  </div>
                )}
              </div>
              <input
                type="file"
                id="logo"
                name="logo"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/gif"
                className="hidden"
              />
              <button
                type="button"
                onClick={handleUploadClick}
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Upload new logo
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              JPG, GIF or PNG. 500KB max.
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
  );
}
