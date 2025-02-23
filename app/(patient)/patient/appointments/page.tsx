import { Metadata } from 'next';
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { fetchPatientAppointments } from '@/app/lib/patient-data';

export const metadata: Metadata = {
  title: 'Appointments',
};

export default async function AppointmentsPage() {
  // TODO: Get actual patient ID from auth session
  const patientId = 'mock-patient-id';
  const appointments = await fetchPatientAppointments(patientId);

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'scheduled',
  );
  const pastAppointments = appointments.filter(
    (apt) => apt.status === 'completed',
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your appointments
        </p>
      </div>

      {/* Upcoming Appointments */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-medium text-gray-900">
          Upcoming Appointments
        </h2>
        <div className="mt-4 divide-y divide-gray-200">
          {upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="py-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-lg font-medium text-gray-900">
                    {appointment.type}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      {appointment.date} at {appointment.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <UserIcon className="h-4 w-4" />
                    <span>{appointment.provider}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{appointment.location}</span>
                  </div>
                  {appointment.notes && (
                    <p className="text-sm text-gray-500">{appointment.notes}</p>
                  )}
                </div>
                <button className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100">
                  Cancel
                </button>
              </div>
            </div>
          ))}
          {upcomingAppointments.length === 0 && (
            <p className="py-4 text-sm text-gray-500">
              No upcoming appointments scheduled.
            </p>
          )}
        </div>
      </div>

      {/* Past Appointments */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-medium text-gray-900">Past Appointments</h2>
        <div className="mt-4 divide-y divide-gray-200">
          {pastAppointments.map((appointment) => (
            <div key={appointment.id} className="py-4">
              <div className="space-y-1">
                <p className="text-lg font-medium text-gray-900">
                  {appointment.type}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {appointment.date} at {appointment.time}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <UserIcon className="h-4 w-4" />
                  <span>{appointment.provider}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{appointment.location}</span>
                </div>
                {appointment.notes && (
                  <p className="text-sm text-gray-500">{appointment.notes}</p>
                )}
              </div>
            </div>
          ))}
          {pastAppointments.length === 0 && (
            <p className="py-4 text-sm text-gray-500">No past appointments.</p>
          )}
        </div>
      </div>
    </div>
  );
}
