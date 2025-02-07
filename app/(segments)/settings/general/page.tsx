import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'General Settings',
};

export default function GeneralSettingsPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1">
        <div className="py-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            General Settings
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your general application settings
          </p>
        </div>
        <div className="mt-6">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Application Information
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Configure your application settings here.</p>
              </div>
              <div className="mt-5">
                {/* Add your settings form or content here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
