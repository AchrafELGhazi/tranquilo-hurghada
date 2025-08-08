import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface THModalProps {
      isOpen: boolean;
      onClose: () => void;
      title?: string;
      children: React.ReactNode;
      footer?: React.ReactNode;
      size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
      className?: string;
      overlayClassName?: string;
      closeOnOverlayClick?: boolean;
      closeOnEscape?: boolean;
      showCloseButton?: boolean;
      centered?: boolean;
      loading?: boolean;
      preventScroll?: boolean;
}

const THModal: React.FC<THModalProps> = ({
      isOpen,
      onClose,
      title,
      children,
      footer,
      size = 'md',
      className = '',
      overlayClassName = '',
      closeOnOverlayClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      centered = true,
      loading = false,
      preventScroll = true,
}) => {
      const sizes = {
            xs: 'max-w-xs',
            sm: 'max-w-sm',
            md: 'max-w-md',
            lg: 'max-w-lg',
            xl: 'max-w-xl',
            '2xl': 'max-w-2xl',
            full: 'max-w-full mx-4',
      };

      // Handle escape key
      useEffect(() => {
            const handleEscape = (e: KeyboardEvent) => {
                  if (closeOnEscape && e.key === 'Escape' && isOpen) {
                        onClose();
                  }
            };

            if (isOpen) {
                  document.addEventListener('keydown', handleEscape);
            }

            return () => document.removeEventListener('keydown', handleEscape);
      }, [isOpen, closeOnEscape, onClose]);

      // Prevent body scroll when modal is open
      useEffect(() => {
            if (preventScroll && isOpen) {
                  const originalStyle = window.getComputedStyle(document.body).overflow;
                  document.body.style.overflow = 'hidden';
                  return () => {
                        document.body.style.overflow = originalStyle;
                  };
            }
      }, [isOpen, preventScroll]);

      if (!isOpen) return null;

      const handleOverlayClick = (e: React.MouseEvent) => {
            if (closeOnOverlayClick && e.target === e.currentTarget) {
                  onClose();
            }
      };

      return (
            <div className='fixed inset-0 z-50 overflow-y-auto'>
                  <div
                        className={`
          flex min-h-screen items-center justify-center p-4 text-center
          ${centered ? 'sm:items-center' : 'sm:items-start sm:pt-6'}
        `}
                  >
                        {/* Overlay */}
                        <div
                              className={`
            fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300
            ${overlayClassName}
          `}
                              onClick={handleOverlayClick}
                              aria-hidden='true'
                        />

                        {/* Modal */}
                        <div
                              className={`
            relative inline-block w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all duration-300
            ${sizes[size]}
            ${className}
          `}
                              role='dialog'
                              aria-modal='true'
                              aria-labelledby={title ? 'modal-title' : undefined}
                        >
                              {/* Header */}
                              {(title || showCloseButton) && (
                                    <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200'>
                                          <div className='flex-1'>
                                                {title && (
                                                      <h3
                                                            id='modal-title'
                                                            className='text-lg font-medium leading-6 text-gray-900'
                                                      >
                                                            {title}
                                                      </h3>
                                                )}
                                          </div>
                                          {showCloseButton && (
                                                <button
                                                      type='button'
                                                      onClick={onClose}
                                                      className='ml-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'
                                                      disabled={loading}
                                                >
                                                      <span className='sr-only'>Close modal</span>
                                                      <X className='h-5 w-5' />
                                                </button>
                                          )}
                                    </div>
                              )}

                              {/* Body */}
                              <div className={`px-6 py-4 ${loading ? 'animate-pulse' : ''}`}>
                                    {loading ? (
                                          <div className='space-y-4'>
                                                <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                                                <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                                                <div className='h-4 bg-gray-200 rounded w-2/3'></div>
                                          </div>
                                    ) : (
                                          children
                                    )}
                              </div>

                              {/* Footer */}
                              {footer && (
                                    <div className='px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3'>
                                          {footer}
                                    </div>
                              )}
                        </div>
                  </div>
            </div>
      );
};

export default THModal;
