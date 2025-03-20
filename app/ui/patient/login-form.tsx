'use client';

import { useState, useEffect, useTransition } from 'react';
import { useActionState } from 'react';
import { Button } from '@/app/ui/button';
import {
  requestVerificationCode,
  verifyPatientCode,
} from '@/app/lib/patient/patient-actions';
import type { PatientLoginState } from '@/app/lib/patient/patient-actions';
import { useRouter } from 'next/navigation';

export default function PatientLoginForm() {
  const initialState: PatientLoginState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(
    requestVerificationCode,
    initialState,
  );
  const [verifyState, verifyDispatch] = useActionState(
    verifyPatientCode,
    initialState,
  );

  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [patientId, setPatientId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [redirecting, setRedirecting] = useState(false);

  const router = useRouter();

  // Track if we're in the loading state
  const isLoading =
    state.isLoading || verifyState.isLoading || isPending || redirecting;

  // Determine which state to use based on the current step
  const currentState = step === 'email' ? state : verifyState;

  // Handle successful verification with useEffect
  useEffect(() => {
    if (
      verifyState.success &&
      verifyState.token &&
      !verifyState.isLoading &&
      !redirecting
    ) {
      // Store patient ID in localStorage for convenience
      if (patientId) {
        localStorage.setItem('patientId', patientId);
      }

      // Set the token in a cookie (will be handled by the server)
      // The cookie will be automatically sent with subsequent requests
      document.cookie = `patient_token=${verifyState.token}; path=/; max-age=86400; SameSite=Strict`;

      // Set redirecting state to show loading and prevent multiple redirects
      setRedirecting(true);

      // Delay redirect to show success message
      setTimeout(() => {
        // Redirect to patient main page
        router.push('/patient');
      }, 1500); // 1.5 second delay
    }
  }, [
    verifyState.success,
    verifyState.token,
    verifyState.isLoading,
    patientId,
    router,
    redirecting,
  ]);

  // Handle successful code request with useEffect
  useEffect(() => {
    if (
      state.success &&
      state.patient &&
      step === 'email' &&
      !state.isLoading
    ) {
      // Store patient ID for later use
      setPatientId(state.patient.id);

      // Move to verification step
      setStep('verify');
    }
  }, [state.success, state.patient, state.isLoading, step]);

  // Handle form submission for verification code
  const handleVerifySubmit = (formData: FormData) => {
    formData.append('email', email);
    verifyDispatch(formData);
  };

  // Handle form submission for email
  const handleEmailSubmit = (formData: FormData) => {
    dispatch(formData);
  };

  // Handle resending verification code
  const handleResendCode = () => {
    console.log('Resending code for email:', email);
    const formData = new FormData();
    formData.append('email', email);

    // Use startTransition to properly handle the server action
    startTransition(() => {
      dispatch(formData);
    });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      {currentState.message && (
        <div
          className={`mb-4 rounded-md p-4 ${
            currentState.errors
              ? 'bg-red-50 text-red-700'
              : 'bg-green-50 text-green-700'
          }`}
        >
          <p className="text-sm">{currentState.message}</p>
        </div>
      )}

      {step === 'email' ? (
        <form action={handleEmailSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="you@example.com"
                aria-describedby="email-error"
              />
              {state.errors?.email && (
                <div id="email-error" className="mt-1 text-sm text-red-600">
                  {state.errors.email.join(', ')}
                </div>
              )}
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </Button>
          </div>
        </form>
      ) : (
        <form action={handleVerifySubmit} className="space-y-6">
          <div className="mb-4 rounded-md bg-blue-50 p-4 text-blue-700">
            <p className="text-sm">
              If the email is registered, a verification code has been sent.
              Please check your inbox and enter the code below.
            </p>
          </div>

          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
            >
              Verification Code
            </label>
            <div className="mt-1">
              <input
                id="code"
                name="code"
                type="text"
                required
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Enter code"
                aria-describedby="code-error"
              />
              {verifyState.errors?.code && (
                <div id="code-error" className="mt-1 text-sm text-red-600">
                  {verifyState.errors.code.join(', ')}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleResendCode}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Resend code
            </button>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? redirecting
                  ? 'Signing in...'
                  : 'Verifying...'
                : 'Verify & Sign In'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
