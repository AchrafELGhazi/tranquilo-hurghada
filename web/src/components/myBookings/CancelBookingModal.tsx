import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Booking } from '@/utils/types';

interface CancelBookingModalProps {
    booking: Booking | null;
    isOpen: boolean;
    cancelling: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

export const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
    booking,
    isOpen,
    cancelling,
    onClose,
    onConfirm,
}) => {
    const [cancellationReason, setCancellationReason] = useState('');

    if (!isOpen || !booking) return null;

    const handleClose = () => {
        setCancellationReason('');
        onClose();
    };

    const handleConfirm = () => {
        onConfirm(cancellationReason);
        setCancellationReason('');
    };

    return (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
            <div className='bg-white/95 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6 max-w-md w-full'>
                <div className='flex items-center justify-between mb-6'>
                    <h3 className='text-xl font-bold text-[#C75D2C] font-butler'>Cancel Booking</h3>
                    <button onClick={handleClose} className='p-2 hover:bg-[#F8B259]/20 rounded-xl transition-colors'>
                        <X className='w-5 h-5 text-[#C75D2C]' />
                    </button>
                </div>

                <div className='space-y-4'>
                    <p className='text-[#C75D2C]'>
                        Are you sure you want to cancel your booking for{' '}
                        <strong>{booking.villa?.title || 'this villa'}</strong>?
                    </p>

                    <div>
                        <label className='block text-sm font-medium text-[#C75D2C] mb-2'>
                            Reason for cancellation (optional)
                        </label>
                        <textarea
                            value={cancellationReason}
                            onChange={e => setCancellationReason(e.target.value)}
                            rows={3}
                            className='w-full px-3 py-2 border-2 border-[#F8B259]/50 rounded-xl bg-white/40 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] resize-none'
                            placeholder="Please let us know why you're cancelling..."
                        />
                    </div>

                    <div className='flex space-x-3 pt-4'>
                        <button
                            onClick={handleClose}
                            className='flex-1 py-2 px-4 border-2 border-[#F8B259]/50 text-[#C75D2C] rounded-xl hover:bg-white/50 transition-colors'
                        >
                            Keep Booking
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={cancelling}
                            className='flex-1 py-2 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2'
                        >
                            {cancelling ? (
                                <>
                                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                                    <span>Cancelling...</span>
                                </>
                            ) : (
                                <>
                                    <X className='w-4 h-4' />
                                    <span>Cancel Booking</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
