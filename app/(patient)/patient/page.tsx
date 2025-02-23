import { Metadata } from 'next';
import {
  CalendarIcon,
  DocumentTextIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

export const metadata: Metadata = {
  title: 'Patient Dashboard',
};

export default function PatientDashboardPage() {
  // Mock user data
  const userInfo = {
    firstName: 'John',
    lastName: 'Doe',
  };

  // Mock data for demonstration
  const upcomingAppointments = [
    {
      id: '1',
      date: '2024-02-20',
      time: '10:00 AM',
      provider: 'Dr. Smith',
      type: 'Check-up',
    },
    {
      id: '2',
      date: '2024-03-05',
      time: '2:30 PM',
      provider: 'Dr. Johnson',
      type: 'Follow-up',
    },
  ];

  const recentInvoices = [
    {
      id: '1',
      date: '2024-02-01',
      amount: '$150.00',
      status: 'Paid',
      description: 'Office Visit',
    },
    {
      id: '2',
      date: '2024-01-15',
      amount: '$75.00',
      status: 'Pending',
      description: 'Lab Work',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {userInfo.firstName}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here&apos;s an overview of your health information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Upcoming Appointments */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Upcoming Appointments
            </h2>
            <CalendarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="mt-4 divide-y divide-gray-200">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="py-3">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {appointment.type}
                    </p>
                    <p className="text-sm text-gray-500">
                      {appointment.provider}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{appointment.date}</p>
                    <p>{appointment.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Invoices
            </h2>
            <DocumentTextIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="mt-4 divide-y divide-gray-200">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="py-3">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {invoice.description}
                    </p>
                    <p className="text-sm text-gray-500">{invoice.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {invoice.amount}
                    </p>
                    <p
                      className={clsx('text-sm', {
                        'text-green-600': invoice.status === 'Paid',
                        'text-yellow-600': invoice.status === 'Pending',
                      })}
                    >
                      {invoice.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Office Hours */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Office Hours</h2>
            <ClockIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Monday - Friday</span>
              <span className="text-gray-900">8:00 AM - 5:00 PM</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Saturday</span>
              <span className="text-gray-900">9:00 AM - 1:00 PM</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Sunday</span>
              <span className="text-gray-900">Closed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
