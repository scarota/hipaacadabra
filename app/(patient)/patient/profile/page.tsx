import { Metadata } from 'next';
import { Button } from '@/app/ui/button';

export const metadata: Metadata = {
    title: 'Profile',
};

// Mock data
const profile = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    dateOfBirth: '1980-05-15',
    address: {
        street: '789 Patient Lane',
        city: 'Medical City',
        state: 'MC',
        zipCode: '12345',
    },
    insurance: {
        provider: 'HealthCare Plus',
        policyNumber: 'HP123456789',
        groupNumber: 'GRP987654',
        primaryHolder: 'John Doe',
    },
    emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '(555) 987-6543',
    },
    preferences: {
        notifications: {
            appointments: true,
            reminders: true,
            results: true,
            billing: true,
        },
        communicationMethod: 'email',
    },
};

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your personal information and preferences
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Personal Information */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="text-lg font-medium text-gray-900">
                        Personal Information
                    </h2>
                    <div className="mt-4 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="firstName"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    defaultValue={profile.firstName}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="lastName"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    defaultValue={profile.lastName}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                defaultValue={profile.email}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Phone
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                defaultValue={profile.phone}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="dateOfBirth"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                id="dateOfBirth"
                                defaultValue={profile.dateOfBirth}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Insurance Information */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="text-lg font-medium text-gray-900">
                        Insurance Information
                    </h2>
                    <div className="mt-4 space-y-4">
                        <div>
                            <label
                                htmlFor="insuranceProvider"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Insurance Provider
                            </label>
                            <input
                                type="text"
                                id="insuranceProvider"
                                defaultValue={profile.insurance.provider}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="policyNumber"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Policy Number
                            </label>
                            <input
                                type="text"
                                id="policyNumber"
                                defaultValue={profile.insurance.policyNumber}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="groupNumber"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Group Number
                            </label>
                            <input
                                type="text"
                                id="groupNumber"
                                defaultValue={profile.insurance.groupNumber}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="text-lg font-medium text-gray-900">
                        Emergency Contact
                    </h2>
                    <div className="mt-4 space-y-4">
                        <div>
                            <label
                                htmlFor="emergencyName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                id="emergencyName"
                                defaultValue={profile.emergencyContact.name}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="relationship"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Relationship
                            </label>
                            <input
                                type="text"
                                id="relationship"
                                defaultValue={profile.emergencyContact.relationship}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="emergencyPhone"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Phone
                            </label>
                            <input
                                type="tel"
                                id="emergencyPhone"
                                defaultValue={profile.emergencyContact.phone}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Notification Preferences */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="text-lg font-medium text-gray-900">
                        Notification Preferences
                    </h2>
                    <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                            {Object.entries(profile.preferences.notifications).map(
                                ([key, value]) => (
                                    <div key={key} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={key}
                                            defaultChecked={value}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label
                                            htmlFor={key}
                                            className="ml-2 block text-sm text-gray-700"
                                        >
                                            {key.charAt(0).toUpperCase() + key.slice(1)} notifications
                                        </label>
                                    </div>
                                ),
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="communicationMethod"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Preferred Communication Method
                            </label>
                            <select
                                id="communicationMethod"
                                defaultValue={profile.preferences.communicationMethod}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="email">Email</option>
                                <option value="phone">Phone</option>
                                <option value="sms">SMS</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
            </div>
        </div>
    );
} 