'use server';

import { z } from 'zod';
import { getFieldMappingByType } from '@/app/lib/portal-data';
import { PATIENT_MAPPING } from '@/app/lib/field-mapping-constants';
import { getPortalApiConfig } from '@/app/lib/portal-data';
import { revalidatePath } from 'next/cache';

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

    // Accept any code for testing purposes
    return {
      success: true,
      message: 'Verification successful',
      token: 'mock-auth-token-123456',
    };
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

    // Log the request details
    console.log('Patient mapping endpoint:', endpoint);
    console.log('Looking up patient with email:', email);

    // In a real implementation, we would:
    // 1. Replace {id} in the endpoint with the email
    // 2. Make an API request to the configured base URL + endpoint
    // 3. Parse the response using the field mappings

    // For testing, just log what we would do
    const actualEndpoint = endpoint.replace('{id}', email);
    console.log(
      `Would make request to: ${apiConfig.base_url}${actualEndpoint}`,
    );

    // Return mock data for testing
    return {
      success: true,
      patient: {
        id: 'patient-123',
        email: email,
        firstName: 'Test',
        lastName: 'Patient',
      },
    };
  } catch (error) {
    console.error('Error getting patient by email:', error);
    return {
      success: false,
      message: 'An error occurred while looking up patient information.',
    };
  }
}
