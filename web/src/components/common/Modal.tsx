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
            className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4'
            style={{ zIndex: 99999 }}
            onClick={handleBackdropClick}
        >
            <div
                className={`bg-white/95 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl ${maxWidth} w-full ${maxHeight} flex flex-col`}
            >
                <div className='flex items-center justify-center p-6 pb-4 border-b border-[#F8B259]/30'>
                    <h2 className='text-xl font-bold text-[#C75D2C] font-butler'>{title}</h2>
                </div>

                <div className='flex-1 overflow-y-auto p-6 pt-4'>{children}</div>

                {actions && (
                    <div className='p-6 pt-4 border-t border-[#F8B259]/30'>
                        <div className='flex justify-end gap-3'>{actions}</div>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};
