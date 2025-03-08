import { Metadata } from 'next';
import PatientLoginForm from '@/app/ui/patient/login-form';

export const metadata: Metadata = {
  title: 'Patient Login',
  description: 'Sign in to access your patient portal',
};

export default function PatientLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-600">Patient Portal</h1>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your health information securely
          </p>
        </div>

        <div className="mt-8 sm:rounded-lg sm:px-10">
          <PatientLoginForm />
        </div>
      </div>
    </div>
  );
}
