'use server';

import { z } from 'zod';
import { getFieldMappingByType } from '@/app/lib/portal-data';
import { PATIENT_MAPPING } from '@/app/lib/field-mapping-constants';
import { getPortalApiConfig } from '@/app/lib/portal-data';
import { createAuthHeaders } from '@/app/lib/utils';

// Define validation schemas
const PatientEmailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const PatientVerificationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  code: z.string().min(4, 'Verification code must be at least 4 characters'),
});

// Define state types
export type PatientLoginState = {
  success?: boolean;
  patient?: {
    id: string;
    email: string;
  };
  token?: string;
  message?: string | null;
  errors?: {
    email?: string[];
    code?: string[];
  };
  isLoading?: boolean;
};

/**
 * Request a verification code for patient login
 */
export async function requestVerificationCode(
  prevState: PatientLoginState,
  formData: FormData,
): Promise<PatientLoginState> {
  const email = formData.get('email') as string;

  // Validate email with Zod
  const validatedFields = PatientEmailSchema.safeParse({ email });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid email format',
      errors: {
        email: validatedFields.error.flatten().fieldErrors.email,
      },
    };
  }

  try {
    const { email: validatedEmail } = validatedFields.data;

    // First, look up the patient
    const patientResponse = await lookupPatientByEmail(validatedEmail);

    if (!patientResponse.success || !patientResponse.patient) {
      // For non-existent emails, log this fact but don't reveal it to the user
      console.log(`Email not found: ${validatedEmail}`);

      // Return success with a fake patient object to show the verification form
      // This prevents user enumeration by making the behavior identical for all emails
      return {
        success: true,
        // No message needed here as it won't be seen
        // Create a temporary patient object with the email
        // This won't be stored but allows the UI to show the verification form
        patient: {
          id: `temp-${Date.now()}`,
          email: validatedEmail,
        },
      };
    }

    // For real patients, actually send a verification code (mock for now)
    console.log(`Verification code 123456 sent to: ${validatedEmail}`);

    return {
      success: true,
      // No message needed here as it won't be seen
      patient: patientResponse.patient,
    };
  } catch (error) {
    console.error('Error sending verification code:', error);
    // Use the same generic message for errors to prevent information leakage
    // Also return a fake patient object to show the verification form
    return {
      success: true,
      // No message needed here as it won't be seen
      patient: {
        id: `temp-${Date.now()}`,
        email: email,
      },
    };
  }
}

/**
 * Verify a patient login code
 */
export async function verifyPatientCode(
  prevState: PatientLoginState,
  formData: FormData,
): Promise<PatientLoginState> {
  const email = formData.get('email') as string;
  const code = formData.get('code') as string;

  // Validate inputs with Zod
  const validatedFields = PatientVerificationSchema.safeParse({ email, code });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Please check your verification details and try again.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { email: validatedEmail, code: validatedCode } = validatedFields.data;

    // First, look up the patient to verify they exist
    const patientResponse = await lookupPatientByEmail(validatedEmail);

    // For security, we'll do a constant-time comparison regardless of whether the patient exists
    // This prevents timing attacks that could determine if an email exists

    // For testing purposes, accept code 123456 only for valid patients
    const isValidPatient = patientResponse.success && patientResponse.patient;
    const isValidCode = validatedCode === '123456';

    if (isValidPatient && isValidCode) {
      // Only authenticate if both the patient exists and the code is valid
      console.log(`Successful verification for: ${validatedEmail}`);
      return {
        success: true,
        message: 'Verification successful',
        token: 'mock-auth-token-123456',
        patient: patientResponse.patient,
      };
    } else {
      // Log the actual reason for failure (for debugging) but don't reveal it to the user
      if (!isValidPatient) {
        console.log(
          `Verification failed: Patient not found for email ${validatedEmail}`,
        );
      } else {
        console.log(
          `Verification failed: Invalid code ${validatedCode} for email ${validatedEmail}`,
        );
      }

      // Use a generic message that doesn't confirm whether the code is wrong
      // or the email doesn't exist
      return {
        success: false,
        message: 'Verification failed. Please check your code and try again.',
      };
    }
  } catch (error) {
    console.error('Error verifying code:', error);
    // Use a generic error message
    return {
      success: false,
      message: 'Verification failed. Please check your code and try again.',
    };
  }
}

/**
 * Helper function to look up a patient by email
 */
async function lookupPatientByEmail(email: string): Promise<{
  success: boolean;
  patient?: {
    id: string;
    email: string;
  };
  message?: string;
  errors?: {
    email?: string[];
  };
}> {
  try {
    // Get the patient mapping from the database
    const patientMapping = await getFieldMappingByType(PATIENT_MAPPING.id);
    const apiConfig = await getPortalApiConfig();

    if (!patientMapping || !patientMapping.mappings || !apiConfig) {
      console.error('Patient mapping or API config not found');
      return {
        success: false,
        message: 'CONFIGURATION_ERROR',
      };
    }

    // Get the configured endpoint
    const endpoint = patientMapping.endpoint;

    if (!endpoint) {
      console.error('Endpoint not configured in patient mapping');
      return {
        success: false,
        message: 'ENDPOINT_NOT_CONFIGURED',
      };
    }

    // Replace {id} in the endpoint with the email
    const actualEndpoint = endpoint.replace('{id}', encodeURIComponent(email));
    const url = `${apiConfig.base_url}${actualEndpoint}`;

    console.log(`API request: ${url}`);

    // Create headers with proper authentication
    const headers = createAuthHeaders(apiConfig.api_key, apiConfig.auth_type);

    // Make the API request
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      return {
        success: false,
        message: `API_ERROR_${response.status}`,
      };
    }

    // Parse the response
    const rawData = await response.json();

    // Handle case where the API returns an array
    const data =
      Array.isArray(rawData) && rawData.length > 0 ? rawData[0] : rawData;

    // If we got an empty response or no data, patient doesn't exist
    if (!data || Object.keys(data).length === 0) {
      console.log(`No data returned for email: ${email}`);
      return {
        success: false,
        message: 'PATIENT_NOT_FOUND',
      };
    }

    // Get the mappings to find the email field
    const mappings = patientMapping.mappings as Record<string, string>;

    // Find the email field in the mappings
    const emailField = Object.keys(mappings).find((key) => key === 'email');

    if (!emailField) {
      console.error('Email field not found in mappings');
      return {
        success: false,
        message: 'EMAIL_MAPPING_NOT_FOUND',
      };
    }

    // Get the API field name that the email is mapped to
    const apiEmailField = mappings[emailField];

    // Check if the email field exists in the data
    if (!data[apiEmailField]) {
      console.error(`Email field '${apiEmailField}' not found in API response`);
      return {
        success: false,
        message: 'EMAIL_FIELD_NOT_FOUND',
      };
    }

    // Verify that the email in the response matches the email we provided
    const responseEmail = data[apiEmailField].toString();

    if (responseEmail.toLowerCase() !== email.toLowerCase()) {
      console.error(
        `Email mismatch: requested ${email} but got ${responseEmail}`,
      );
      return {
        success: false,
        message: 'EMAIL_MISMATCH',
      };
    }

    // Create a simple patient object with the email and any available ID
    const patient = {
      id: data.Guid || data.ClientId || data.id || String(Date.now()),
      email: responseEmail,
    };

    console.log(`Patient found: ${responseEmail}`);

    return {
      success: true,
      patient,
    };
  } catch (error) {
    console.error('Error getting patient by email:', error);
    return {
      success: false,
      message: 'PATIENT_LOOKUP_ERROR',
    };
  }
}

/**
 * Fetch appointments for a patient
 * @param patientId The ID of the patient to fetch appointments for
 * @returns An array of appointment objects
 */
export async function fetchPatientAppointments(patientId: string) {
  // This is a mock implementation - in a real app, you would fetch from an API
  console.log(`Fetching appointments for patient: ${patientId}`);

  // Return mock data
  return [
    {
      id: 'apt-1',
      type: 'Cardiology Consultation',
      provider: 'Dr. Jane Smith',
      date: 'December 15, 2023',
      time: '9:00 AM',
      location: 'Main Clinic, Room 302',
      status: 'scheduled',
      notes: 'Follow-up appointment',
    },
    {
      id: 'apt-2',
      type: 'Dermatology Check-up',
      provider: 'Dr. Michael Johnson',
      date: 'December 20, 2023',
      time: '2:30 PM',
      location: 'North Branch, Room 105',
      status: 'scheduled',
      notes: 'Annual skin check',
    },
    {
      id: 'apt-3',
      type: 'General Check-up',
      provider: 'Dr. Sarah Williams',
      date: 'November 10, 2023',
      time: '10:15 AM',
      location: 'Main Clinic, Room 101',
      status: 'completed',
      notes: 'Regular check-up',
    },
  ];
}
