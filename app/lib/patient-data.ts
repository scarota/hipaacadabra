// Types
export interface Appointment {
  id: string;
  patientId: string;
  date: string;
  time: string;
  provider: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  location: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ApiConfig {
  baseUrl: string;
  apiKey: string;
}

// Helper function to get API configuration
async function getApiConfig(): Promise<ApiConfig> {
  // This would come from your portal configuration
  return {
    baseUrl: process.env.PROVIDER_API_BASE_URL || 'https://api.provider.com',
    apiKey: process.env.PROVIDER_API_KEY || '',
  };
}

// Helper function to make API requests
async function makeApiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const config = await getApiConfig();
  const url = `${config.baseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

// Mock data function - will be replaced with actual API calls later
export async function fetchPatientAppointments(
  patientId: string,
  options?: {
    status?: string;
    fromDate?: Date;
    toDate?: Date;
    limit?: number;
  },
): Promise<Appointment[]> {
  try {
    // This endpoint would match what's configured in your data mapping
    const endpoint = `/api/patients/${patientId}/appointments`;
    const queryParams = new URLSearchParams();
    
    if (options?.status) {
      queryParams.append('status', options.status);
    }
    if (options?.fromDate) {
      queryParams.append('fromDate', options.fromDate.toISOString());
    }
    if (options?.toDate) {
      queryParams.append('toDate', options.toDate.toISOString());
    }
    if (options?.limit) {
      queryParams.append('limit', options.limit.toString());
    }

    const queryString = queryParams.toString();
    const fullEndpoint = `${endpoint}${queryString ? `?${queryString}` : ''}`;

    // For now, return mock data
    // TODO: Replace with actual API call using makeApiRequest
    // return makeApiRequest<Appointment[]>(fullEndpoint);
    
    return [
      {
        id: '1',
        patientId,
        date: '2024-02-20',
        time: '10:00 AM',
        provider: 'Dr. Sarah Smith',
        type: 'Annual Check-up',
        status: 'scheduled',
        location: 'Main Clinic - Room 102',
        notes: 'Annual physical examination',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        patientId,
        date: '2024-03-05',
        time: '2:30 PM',
        provider: 'Dr. Michael Johnson',
        type: 'Follow-up',
        status: 'scheduled',
        location: 'North Branch - Room 205',
        notes: 'Follow-up for previous visit',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
      },
      {
        id: '3',
        patientId,
        date: '2024-01-10',
        time: '11:15 AM',
        provider: 'Dr. Sarah Smith',
        type: 'Consultation',
        status: 'completed',
        location: 'Main Clinic - Room 102',
        notes: 'Initial consultation',
        createdAt: new Date('2023-12-20'),
        updatedAt: new Date('2024-01-10'),
      },
    ];
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    throw new Error('Failed to fetch appointments');
  }
}

export async function fetchUpcomingAppointments(
  patientId: string,
  limit: number = 2,
): Promise<Appointment[]> {
  try {
    // This would use the endpoint defined in your data mapping
    const endpoint = `/api/patients/${patientId}/appointments/upcoming`;
    // TODO: Replace with actual API call
    // return makeApiRequest<Appointment[]>(endpoint, { 
    //   query: { limit }
    // });
    
    const allAppointments = await fetchPatientAppointments(patientId);
    return allAppointments
      .filter((apt) => apt.status === 'scheduled')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch upcoming appointments:', error);
    throw new Error('Failed to fetch upcoming appointments');
  }
}

export async function fetchAppointmentById(
  appointmentId: string,
  patientId: string,
): Promise<Appointment | null> {
  try {
    // This would use the endpoint defined in your data mapping
    const endpoint = `/api/patients/${patientId}/appointments/${appointmentId}`;
    // TODO: Replace with actual API call
    // return makeApiRequest<Appointment>(endpoint);
    
    const appointments = await fetchPatientAppointments(patientId);
    return appointments.find((apt) => apt.id === appointmentId) || null;
  } catch (error) {
    console.error('Failed to fetch appointment:', error);
    throw new Error('Failed to fetch appointment');
  }
} 