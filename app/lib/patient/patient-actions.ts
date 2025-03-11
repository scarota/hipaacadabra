'use server';

import { z } from 'zod';
import { getFieldMappingByType } from '@/app/lib/portal-data';
import { PATIENT_MAPPING } from '@/app/lib/field-mapping-constants';
import { getPortalApiConfig } from '@/app/lib/portal-data';
import { revalidatePath } from 'next/cache';
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
    firstName?: string;
    lastName?: string;
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
      return {
        success: false,
        message:
          patientResponse.message || 'No patient account found with this email',
        errors: patientResponse.errors,
      };
    }

    // Just console log the email and return a mock success response
    console.log('Verification code requested for email:', validatedEmail);
    console.log('Mock verification code: 123456');

    return {
      success: true,
      message: 'Verification code sent to your email',
      patient: patientResponse.patient,
    };
  } catch (error) {
    console.error('Error sending verification code:', error);
    return {
      success: false,
      message: 'An error occurred while sending the verification code.',
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
      message: 'Invalid verification data',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { email: validatedEmail, code: validatedCode } = validatedFields.data;

    // Just console log the verification attempt
    console.log('Verifying code for email:', validatedEmail);
    console.log('Entered code:', validatedCode);

    // For testing purposes, accept code 123456
    if (validatedCode === '123456') {
      return {
        success: true,
        message: 'Verification successful',
        token: 'mock-auth-token-123456',
      };
    } else {
      return {
        success: false,
        message: 'Invalid verification code. Please try again.',
      };
    }
  } catch (error) {
    console.error('Error verifying code:', error);
    return {
      success: false,
      message: 'An error occurred while verifying the code.',
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
    firstName?: string;
    lastName?: string;
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
        message: 'System configuration error. Please contact support.',
      };
    }

    // Get the configured endpoint
    const endpoint = patientMapping.endpoint;

    if (!endpoint) {
      console.error('Endpoint not configured in patient mapping');
      return {
        success: false,
        message: 'System configuration error. Please contact support.',
      };
    }

    // Replace {id} in the endpoint with the email
    const actualEndpoint = endpoint.replace('{id}', encodeURIComponent(email));
    const url = `${apiConfig.base_url}${actualEndpoint}`;

    console.log(`Making API request to: ${url}`);

    // Create headers with proper authentication
    const headers = createAuthHeaders(apiConfig.api_key, apiConfig.auth_type);

    // Make the API request
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);

      // Handle specific error cases
      if (response.status === 404) {
        return {
          success: false,
          message: 'No patient found with this email address.',
        };
      }

      return {
        success: false,
        message: `API request failed with status: ${response.status}`,
      };
    }

    // Parse the response
    const data = await response.json();
    console.log('API response:', data);

    // Get the mappings
    const mappings = patientMapping.mappings as Record<string, string>;
    console.log('Field mappings:', mappings);

    // Find which portal field is mapped to the email field
    // We need to find the key in mappings where the value is the field name in the API response
    // that contains the email
    let emailField = null;

    // First, try to find a field explicitly named 'email' in the mappings
    for (const [portalField, apiField] of Object.entries(mappings)) {
      if (portalField.toLowerCase() === 'email') {
        emailField = apiField;
        break;
      }
    }

    // // If we didn't find an explicit email field, look for common email field names
    // if (!emailField) {
    //   const commonEmailFields = ['email', 'emailaddress', 'mail', 'usermail', 'useremail'];
    //   for (const [portalField, apiField] of Object.entries(mappings)) {
    //     if (commonEmailFields.includes(apiField.toLowerCase())) {
    //       emailField = apiField;
    //       break;
    //     }
    //   }
    // }

    console.log('Identified email field in API response:', emailField);

    if (!emailField || !data[emailField]) {
      console.error('Email field not found in API response or mapping');
      console.log('Available fields in response:', Object.keys(data));
      return {
        success: false,
        message:
          'Email field not found in API response. Please check your field mappings.',
      };
    }

    // Verify that the email in the response matches the email we provided
    const responseEmail = data[emailField].toString().toLowerCase();
    const requestEmail = email.toLowerCase();

    if (responseEmail !== requestEmail) {
      console.error(
        `Email mismatch: requested ${requestEmail} but got ${responseEmail}`,
      );
      return {
        success: false,
        message: 'Email mismatch in API response.',
      };
    }

    // Map the response to our patient object using the field mappings
    const patient = {
      id: data[mappings.id || 'id'] || '',
      email: responseEmail,
      firstName: data[mappings.firstName || 'firstName'] || '',
      lastName: data[mappings.lastName || 'lastName'] || '',
    };

    // Validate that we have an ID
    if (!patient.id) {
      console.error('Patient ID not found in API response');
      return {
        success: false,
        message: 'Invalid patient data received from API.',
      };
    }

    return {
      success: true,
      patient,
    };
  } catch (error) {
    console.error('Error getting patient by email:', error);
    return {
      success: false,
      message: 'An error occurred while looking up patient information.',
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
