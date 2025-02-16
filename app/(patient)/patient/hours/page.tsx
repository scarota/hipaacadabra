import { Metadata } from 'next';
import {
    ClockIcon,
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
    title: 'Office Hours & Locations',
};

// Mock data
const locations = [
    {
        id: '1',
        name: 'Main Clinic',
        address: '123 Healthcare Ave, Medical District',
        phone: '(555) 123-4567',
        email: 'main@clinic.com',
        hours: [
            { days: 'Monday - Friday', hours: '8:00 AM - 5:00 PM' },
            { days: 'Saturday', hours: '9:00 AM - 1:00 PM' },
            { days: 'Sunday', hours: 'Closed' },
        ],
        providers: [
            { name: 'Dr. Smith', specialty: 'Primary Care' },
            { name: 'Dr. Johnson', specialty: 'Pediatrics' },
        ],
    },
    {
        id: '2',
        name: 'North Branch',
        address: '456 Medical Park, North Side',
        phone: '(555) 987-6543',
        email: 'north@clinic.com',
        hours: [
            { days: 'Monday - Thursday', hours: '9:00 AM - 6:00 PM' },
            { days: 'Friday', hours: '9:00 AM - 4:00 PM' },
            { days: 'Saturday - Sunday', hours: 'Closed' },
        ],
        providers: [
            { name: 'Dr. Wilson', specialty: 'Family Medicine' },
            { name: 'Dr. Brown', specialty: 'Internal Medicine' },
        ],
    },
];

export default function OfficeHoursPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                    Office Hours & Locations
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Find information about our locations and availability
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {locations.map((location) => (
                    <div key={location.id} className="rounded-lg bg-white p-6 shadow">
                        <h2 className="text-xl font-medium text-gray-900">
                            {location.name}
                        </h2>

                        {/* Contact Information */}
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPinIcon className="h-4 w-4" />
                                <span>{location.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <PhoneIcon className="h-4 w-4" />
                                <span>{location.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <EnvelopeIcon className="h-4 w-4" />
                                <span>{location.email}</span>
                            </div>
                        </div>

                        {/* Hours */}
                        <div className="mt-6">
                            <h3 className="flex items-center gap-2 font-medium text-gray-900">
                                <ClockIcon className="h-5 w-5" />
                                Hours of Operation
                            </h3>
                            <div className="mt-2 space-y-2">
                                {location.hours.map((schedule, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between text-sm text-gray-500"
                                    >
                                        <span>{schedule.days}</span>
                                        <span className="font-medium text-gray-900">
                                            {schedule.hours}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Providers */}
                        <div className="mt-6">
                            <h3 className="font-medium text-gray-900">Available Providers</h3>
                            <div className="mt-2 space-y-2">
                                {location.providers.map((provider, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between text-sm text-gray-500"
                                    >
                                        <span>{provider.name}</span>
                                        <span className="text-gray-900">{provider.specialty}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 