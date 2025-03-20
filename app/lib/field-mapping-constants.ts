// Define the field mapping types
export type FieldType =
  | 'string'
  | 'number'
  | 'date'
  | 'boolean'
  | 'object'
  | 'array';

export interface FieldDefinition {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  description: string;
}

export interface DataMapping {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  fields: FieldDefinition[];
}

// Patient data mapping
export const PATIENT_MAPPING: DataMapping = {
  id: 'patient',
  name: 'Patient Mapping',
  description: 'Map EHR patients to portal users',
  endpoint: '/patients/{email}',
  fields: [
    {
      name: 'ehrPatientId',
      label: 'EHR Patient ID',
      type: 'string',
      required: true,
      description: 'Unique identifier for the patient in the EHR system',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'string',
      required: true,
      description: 'Email address for portal access and notifications',
    },
    {
      name: 'firstName',
      label: 'First Name',
      type: 'string',
      required: true,
      description: "Patient's first name",
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'string',
      required: true,
      description: "Patient's last name",
    },
    {
      name: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'date',
      required: true,
      description: "Patient's date of birth (YYYY-MM-DD)",
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'string',
      required: false,
      description: 'Contact phone number',
    },
  ],
};

// Appointment data mapping
export const APPOINTMENT_MAPPING: DataMapping = {
  id: 'appointment',
  name: 'Appointment Mapping',
  description: 'Map EHR appointments to portal appointments',
  endpoint: '/appointments/{id}',
  fields: [
    {
      name: 'ehrAppointmentId',
      label: 'EHR Appointment ID',
      type: 'string',
      required: true,
      description: 'Unique identifier for the appointment in the EHR system',
    },
    {
      name: 'patientId',
      label: 'Patient ID',
      type: 'string',
      required: true,
      description: 'Reference to the patient this appointment is for',
    },
    {
      name: 'providerId',
      label: 'Provider ID',
      type: 'string',
      required: true,
      description: 'Reference to the healthcare provider',
    },
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      required: true,
      description: 'Date of the appointment (YYYY-MM-DD)',
    },
    {
      name: 'startTime',
      label: 'Start Time',
      type: 'string',
      required: true,
      description: 'Start time of the appointment (HH:MM)',
    },
    {
      name: 'endTime',
      label: 'End Time',
      type: 'string',
      required: true,
      description: 'End time of the appointment (HH:MM)',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'string',
      required: true,
      description:
        'Status of the appointment (scheduled, completed, cancelled, etc.)',
    },
    {
      name: 'type',
      label: 'Type',
      type: 'string',
      required: true,
      description: 'Type of appointment (follow-up, new patient, etc.)',
    },
    {
      name: 'location',
      label: 'Location',
      type: 'string',
      required: false,
      description: 'Physical location of the appointment',
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'string',
      required: false,
      description: 'Additional notes about the appointment',
    },
  ],
};

// Invoice data mapping
export const INVOICE_MAPPING: DataMapping = {
  id: 'invoice',
  name: 'Invoice Mapping',
  description: 'Map EHR invoices to portal invoices',
  endpoint: '/invoices/{id}',
  fields: [
    {
      name: 'ehrInvoiceId',
      label: 'EHR Invoice ID',
      type: 'string',
      required: true,
      description: 'Unique identifier for the invoice in the EHR system',
    },
    {
      name: 'patientId',
      label: 'Patient ID',
      type: 'string',
      required: true,
      description: 'Reference to the patient this invoice is for',
    },
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      required: true,
      description: 'Date the invoice was issued (YYYY-MM-DD)',
    },
    {
      name: 'dueDate',
      label: 'Due Date',
      type: 'date',
      required: true,
      description: 'Date the invoice is due (YYYY-MM-DD)',
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'number',
      required: true,
      description: 'Total amount due',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'string',
      required: true,
      description: 'Status of the invoice (pending, paid, overdue, etc.)',
    },
    {
      name: 'items',
      label: 'Line Items',
      type: 'array',
      required: false,
      description: 'Detailed line items for the invoice',
    },
  ],
};

// Map of all available data mappings
export const DATA_MAPPINGS: Record<string, DataMapping> = {
  [PATIENT_MAPPING.id]: PATIENT_MAPPING,
  [APPOINTMENT_MAPPING.id]: APPOINTMENT_MAPPING,
  [INVOICE_MAPPING.id]: INVOICE_MAPPING,
};
