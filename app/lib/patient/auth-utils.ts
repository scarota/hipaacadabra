export function generateAuthToken(patientId: string, email: string): string {
  // Create a header
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  // Create a payload with claims
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: patientId,
    email: email,
    iat: now,
    exp: now + 86400, // Expires in 24 hours
    iss: 'hipaacadabra-patient-portal',
  };

  // In a real implementation, you would sign this with a secret key
  // For now, we'll just encode it to base64
  const encodedHeader = Buffer.from(JSON.stringify(header))
    .toString('base64')
    .replace(/=/g, '');
  const encodedPayload = Buffer.from(JSON.stringify(payload))
    .toString('base64')
    .replace(/=/g, '');

  // In a real implementation, you would create a signature
  // For now, we'll create a mock signature based on the payload
  const mockSignature = Buffer.from(`${patientId}-${now}-signature`)
    .toString('base64')
    .replace(/=/g, '');

  // Combine to form a JWT-like token
  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
}

export function isPatientAuthenticated(): boolean {
  // Check for token in cookies
  const hasTokenCookie = document.cookie
    .split('; ')
    .some((row) => row.startsWith('patient_token='));

  return hasTokenCookie;
}

export function getPatientToken(): string | null {
  const cookies = document.cookie.split('; ');
  const tokenCookie = cookies.find((row) => row.startsWith('patient_token='));

  if (tokenCookie) {
    return tokenCookie.split('=')[1];
  }

  return null;
}

export function getPatientId(): string | null {
  return localStorage.getItem('patientId');
}

export function logoutPatient(): void {
  // Clear the token cookie
  document.cookie =
    'patient_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

  // Clear localStorage
  localStorage.removeItem('patientId');
}

export function redirectToLoginIfNotAuthenticated(): void {
  if (typeof window !== 'undefined' && !isPatientAuthenticated()) {
    window.location.href = '/patient/login';
  }
}
