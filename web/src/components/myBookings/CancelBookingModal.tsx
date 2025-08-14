import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
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

    const handleClose = () => {
        setCancellationReason('');
        onClose();
    };

    const handleConfirm = () => {
        onConfirm(cancellationReason);
        setCancellationReason('');
    };

    const actions = (
        <>
            <button
                onClick={handleClose}
                className='px-4 py-2 border-2 border-[#F8B259]/50 text-[#C75D2C] rounded-xl hover:bg-white/50 transition-colors cursor-pointer'
            >
                Keep Booking
            </button>
            <button
                onClick={handleConfirm}
                disabled={cancelling}
                className='px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed'
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
        </>
    );

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title='Cancel Booking' actions={actions} maxWidth='max-w-md'>
            <div className='space-y-4'>
                <p className='text-[#C75D2C]'>
                    Are you sure you want to cancel your booking for{' '}
                    <strong>{booking?.villa?.title || 'this villa'}</strong>?
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
            </div>
        </Modal>
    );
};
