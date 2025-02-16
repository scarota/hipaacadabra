import { Metadata } from 'next';
import { CalendarIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export const metadata: Metadata = {
    title: 'Invoices',
};

// Mock data
const invoices = [
    {
        id: '1',
        date: '2024-02-01',
        dueDate: '2024-02-15',
        amount: 150.0,
        status: 'paid',
        description: 'Office Visit',
        items: [
            { description: 'General Consultation', amount: 100.0 },
            { description: 'Blood Pressure Check', amount: 50.0 },
        ],
    },
    {
        id: '2',
        date: '2024-01-15',
        dueDate: '2024-01-29',
        amount: 75.0,
        status: 'pending',
        description: 'Lab Work',
        items: [{ description: 'Blood Test Panel', amount: 75.0 }],
    },
    {
        id: '3',
        date: '2024-01-05',
        dueDate: '2024-01-19',
        amount: 200.0,
        status: 'paid',
        description: 'Specialist Consultation',
        items: [
            { description: 'Specialist Fee', amount: 150.0 },
            { description: 'X-Ray', amount: 50.0 },
        ],
    },
];

export default function InvoicesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
                <p className="mt-1 text-sm text-gray-500">
                    View and manage your invoices
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-white p-6 shadow">
                    <h3 className="text-sm font-medium text-gray-500">Total Due</h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">$75.00</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow">
                    <h3 className="text-sm font-medium text-gray-500">
                        Paid Last 30 Days
                    </h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">$350.00</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow">
                    <h3 className="text-sm font-medium text-gray-500">
                        Pending Invoices
                    </h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">1</p>
                </div>
            </div>

            {/* Invoices List */}
            <div className="rounded-lg bg-white shadow">
                <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-lg font-medium text-gray-900">Recent Invoices</h2>
                    <div className="mt-4 divide-y divide-gray-200">
                        {invoices.map((invoice) => (
                            <div key={invoice.id} className="py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {invoice.description}
                                                </h3>
                                                <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <CalendarIcon className="h-4 w-4" />
                                                        <span>Issued {invoice.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <CreditCardIcon className="h-4 w-4" />
                                                        <span>Due {invoice.dueDate}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-medium text-gray-900">
                                                    ${invoice.amount.toFixed(2)}
                                                </p>
                                                <p
                                                    className={clsx('mt-1 text-sm', {
                                                        'text-green-600': invoice.status === 'paid',
                                                        'text-yellow-600': invoice.status === 'pending',
                                                    })}
                                                >
                                                    {invoice.status.charAt(0).toUpperCase() +
                                                        invoice.status.slice(1)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <tbody className="divide-y divide-gray-200">
                                                    {invoice.items.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="py-2 text-sm text-gray-500">
                                                                {item.description}
                                                            </td>
                                                            <td className="py-2 text-right text-sm text-gray-900">
                                                                ${item.amount.toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    {invoice.status === 'pending' && (
                                        <div className="ml-6">
                                            <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">
                                                Pay Now
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 