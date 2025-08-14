import React from 'react';
import { Calendar, User, Home } from 'lucide-react';
import type { RecentBooking } from '@/api/statsApi';
import { formatCurrency, getStatusColor, formatDate } from '@/utils/statsUtils';

interface RecentBookingsTableProps {
    bookings: RecentBooking[];
}

export const RecentBookingsTable: React.FC<RecentBookingsTableProps> = ({ bookings }) => (
    <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
        <h3 className='text-lg font-semibold text-[#C75D2C] font-butler mb-4 flex items-center'>
            <Calendar className='w-5 h-5 mr-2' />
            Recent Bookings
        </h3>

        <div className='overflow-x-auto'>
            <table className='min-w-full'>
                <thead>
                    <tr className='border-b border-[#F8B259]/30'>
                        <th className='px-4 py-3 text-left text-xs font-medium text-[#C75D2C]/70 uppercase tracking-wider'>
                            <User className='w-4 h-4 inline mr-1' />
                            Guest
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-[#C75D2C]/70 uppercase tracking-wider'>
                            <Home className='w-4 h-4 inline mr-1' />
                            Villa
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-[#C75D2C]/70 uppercase tracking-wider'>
                            Check-in
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-[#C75D2C]/70 uppercase tracking-wider'>
                            Status
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-[#C75D2C]/70 uppercase tracking-wider'>
                            Amount
                        </th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-[#F8B259]/20'>
                    {bookings.map(booking => (
                        <tr key={booking.id} className='hover:bg-white/20 transition-colors duration-200'>
                            <td className='px-4 py-4 text-sm text-[#C75D2C] font-medium'>{booking.guestName}</td>
                            <td className='px-4 py-4 text-sm text-[#C75D2C]/80'>{booking.villaTitle}</td>
                            <td className='px-4 py-4 text-sm text-[#C75D2C]/70'>
                                {new Date(booking.checkIn).toLocaleDateString()}
                            </td>
                            <td className='px-4 py-4'>
                                <span
                                    className='inline-flex px-3 py-1 text-xs font-semibold rounded-full border'
                                    style={{
                                        backgroundColor: `${getStatusColor(booking.status)}20`,
                                        color: getStatusColor(booking.status),
                                        borderColor: `${getStatusColor(booking.status)}40`,
                                    }}
                                >
                                    {booking.status}
                                </span>
                            </td>
                            <td className='px-4 py-4 text-sm font-bold text-[#C75D2C]'>
                                {formatCurrency(booking.totalPrice)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
