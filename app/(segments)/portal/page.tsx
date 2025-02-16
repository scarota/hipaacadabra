import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal',
};

export default function PortalPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Patient Portal</h1>
        <p className="mt-1 text-sm text-gray-500">
          Live preview of your patient portal
        </p>
      </div>

      <div className="flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <div className="flex h-10 items-center justify-between border-b bg-gray-50 px-4">
          <span className="text-sm font-medium text-gray-600">Patient Portal</span>
          <div className="flex space-x-2">
            <div className="h-3 w-3 rounded-full bg-red-400"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
            <div className="h-3 w-3 rounded-full bg-green-400"></div>
          </div>
        </div>
        <iframe
          src="/patient"
          className="h-[calc(100%-2.5rem)] w-full"
          title="Patient Portal Preview"
        />
      </div>
    </div>
  );
}
