import React, { type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    actions?: ReactNode;
    maxWidth?: string;
    maxHeight?: string;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    actions,
    maxWidth = 'max-w-2xl',
    maxHeight = 'max-h-[80vh]',
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return createPortal(
        <div
            className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4'
            style={{ zIndex: 99999 }}
            onClick={handleBackdropClick}
        >
            <div
                className={`bg-white/95 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl ${maxWidth} w-full ${maxHeight} sm:max-h-[80vh] max-h-[95vh] flex flex-col`}
            >
                {/* Header - More compact on mobile */}
                <div className='flex items-center justify-center p-4 sm:p-6 pb-3 sm:pb-4 border-b border-[#F8B259]/30'>
                    <h2 className='text-lg sm:text-xl font-bold text-[#C75D2C] font-butler text-center'>{title}</h2>
                </div>

                {/* Content - Reduced padding on mobile */}
                <div className='flex-1 overflow-y-auto p-4 sm:p-6 pt-3 sm:pt-4'>{children}</div>

                {/* Actions - More compact on mobile */}
                {actions && (
                    <div className='p-4 sm:p-6 pt-3 sm:pt-4 border-t border-[#F8B259]/30'>
                        <div className='flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3'>{actions}</div>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};
