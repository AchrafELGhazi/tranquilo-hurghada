import React from 'react';
import { formatPercentage, getTrendIcon, getTrendColor } from '@/utils/statsUtils';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: number;
    icon?: React.ReactNode;
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, trend, icon, color = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-50/60 border-blue-200/60 text-blue-800',
        green: 'bg-green-50/60 border-green-200/60 text-green-800',
        yellow: 'bg-yellow-50/60 border-yellow-200/60 text-yellow-800',
        red: 'bg-red-50/60 border-red-200/60 text-red-800',
        purple: 'bg-purple-50/60 border-purple-200/60 text-purple-800',
        indigo: 'bg-indigo-50/60 border-indigo-200/60 text-indigo-800',
    };

    return (
        <div
            className={`backdrop-blur-md border-2 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 ${colorClasses[color]}`}
        >
            <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                    {icon && <div className='text-2xl'>{icon}</div>}
                    <div>
                        <h3 className='text-sm font-medium text-[#C75D2C]/70'>{title}</h3>
                        <p className='text-2xl font-bold text-[#C75D2C]'>{value}</p>
                        {subtitle && <p className='text-sm text-[#C75D2C]/60'>{subtitle}</p>}
                    </div>
                </div>
                {trend !== undefined && (
                    <div className={`text-right ${getTrendColor(trend)}`}>
                        <div className='flex items-center space-x-1'>
                            <span>{getTrendIcon(trend)}</span>
                            <span className='text-sm font-medium'>{formatPercentage(Math.abs(trend))}</span>
                        </div>
                        <p className='text-xs text-[#C75D2C]/50'>vs last month</p>
                    </div>
                )}
            </div>
        </div>
    );
};
