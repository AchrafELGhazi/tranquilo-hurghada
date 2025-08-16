import React from 'react';
import { Crown, MapPin, Tag } from 'lucide-react';
import { formatCurrency } from '@/utils/statsUtils';

interface TopItem {
    id: string;
    title?: string;
    fullName?: string;
    name?: string;
    city?: string;
    category?: string;
    totalRevenue?: number;
    totalSpent?: number;
    revenue?: number;
    totalBookings?: number;
    bookings?: number;
}

interface TopItemsListProps {
    title: string;
    items: TopItem[];
    type: 'villa' | 'guest' | 'service';
    icon?: React.ReactNode;
}

export const TopItemsList: React.FC<TopItemsListProps> = ({ title, items, type, icon }) => (
    <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
        <h3 className='text-lg font-semibold text-[#C75D2C] font-butler mb-4 flex items-center'>
            {icon || <Crown className='w-5 h-5 mr-2' />}
            {title}
        </h3>

        <div className='space-y-3'>
            {items.length === 0 ? (
                <div className='text-center py-8'>
                    <p className='text-[#C75D2C]/60'>No data available</p>
                </div>
            ) : (
                items.map((item, index) => (
                    <div
                        key={item.id}
                        className='flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-[#F8B259]/30 hover:bg-white/80 transition-all duration-300'
                    >
                        <div className='flex items-center space-x-3'>
                            <div className='bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold'>
                                {index + 1}
                            </div>
                            <div>
                                <p className='font-medium text-[#C75D2C]'>{item.title || item.fullName || item.name}</p>
                                {item.city && (
                                    <p className='text-sm text-[#C75D2C]/60 flex items-center'>
                                        <MapPin className='w-3 h-3 mr-1' />
                                        {item.city}
                                    </p>
                                )}
                               
                            </div>
                        </div>
                        <div className='text-right'>
                            {type != 'service' && (
                                <p className='font-bold text-[#C75D2C]'>
                                    {formatCurrency(item.totalRevenue || item.totalSpent || item.revenue || 0)}
                                </p>
                            )}
                            <p className='text-sm text-[#C75D2C]/60'>
                                {item.totalBookings || item.bookings || 0} bookings
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
);
