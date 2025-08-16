import React from 'react';
import { CreditCard } from 'lucide-react';
import type { PaymentMethod } from '@/api/statsApi';
import { formatPercentage } from '@/utils/statsUtils';

interface PaymentMethodsChartProps {
    paymentMethods: PaymentMethod[];
}

export const PaymentMethodsChart: React.FC<PaymentMethodsChartProps> = ({ paymentMethods }) => (
    <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
        <h3 className='text-lg font-semibold text-[#C75D2C] font-butler mb-4 flex items-center'>
            <CreditCard className='w-5 h-5 mr-2' />
            Payment Methods Distribution
        </h3>

        <div className='space-y-4'>
            {paymentMethods.length === 0 ? (
                <div className='text-center py-8'>
                    <p className='text-[#C75D2C]/60'>No payment data available</p>
                </div>
            ) : (
                paymentMethods.map(method => (
                    <div
                        key={method.method}
                        className='flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-[#F8B259]/30'
                    >
                        <span className='text-[#C75D2C] font-medium'>{method.method.replace('_', ' ')}</span>
                        <div className='flex items-center space-x-4'>
                            <div className='bg-gray-200/60 rounded-full h-2 w-32 overflow-hidden'>
                                <div
                                    className='bg-gradient-to-r from-[#D96F32] to-[#C75D2C] h-2 rounded-full transition-all duration-500'
                                    style={{ width: `${method.percentage}%` }}
                                ></div>
                            </div>
                            <span className='text-sm font-bold text-[#C75D2C] w-12 text-right'>
                                {formatPercentage(method.percentage)}
                            </span>
                            <span className='text-sm text-[#C75D2C]/60 w-16 text-right'>({method.count})</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
);
