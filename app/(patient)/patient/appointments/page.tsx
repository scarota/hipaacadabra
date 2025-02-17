import { Metadata } from 'next';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Appointments',
};

// Mock data
const appointments = [
  {
    id: '1',
    date: '2024-02-20',
    time: '10:00 AM',
    provider: 'Dr. Smith',
    type: 'Check-up',
    location: 'Main Clinic - Room 102',
    status: 'upcoming',
  },
  {
    id: '2',
    date: '2024-03-05',
    time: '2:30 PM',
    provider: 'Dr. Johnson',
    type: 'Follow-up',
    location: 'North Branch - Room 205',
    status: 'upcoming',
  },
  {
    id: '3',
    date: '2024-01-15',
    time: '11:30 AM',
    provider: 'Dr. Smith',
    type: 'Initial Consultation',
    location: 'Main Clinic - Room 102',
    status: 'completed',
  },
];

export default function AppointmentsPage() {
  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'upcoming',
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
                </div>
                <button className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100">
                  Cancel
                </button>
              </div>
            </div>
          ))}
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
