import React from 'react';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';

interface THAlertProps {
      type?: 'success' | 'error' | 'warning' | 'info';
      title?: string;
      children: React.ReactNode;
      onClose?: () => void;
      className?: string;
      variant?: 'filled' | 'outlined' | 'soft';
      size?: 'sm' | 'md' | 'lg';
      icon?: React.ReactNode | boolean;
      closable?: boolean;
      showIcon?: boolean;
}

const THAlert: React.FC<THAlertProps> = ({
      type = 'info',
      title,
      children,
      onClose,
      className = '',
      variant = 'soft',
      size = 'md',
      icon,
      closable = true,
      showIcon = true,
}) => {
      const icons = {
            success: <CheckCircle className='h-5 w-5' />,
            error: <XCircle className='h-5 w-5' />,
            warning: <AlertCircle className='h-5 w-5' />,
            info: <Info className='h-5 w-5' />,
      };

      const variants = {
            filled: {
                  success: 'bg-green-600 text-white border-green-600',
                  error: 'bg-red-600 text-white border-red-600',
                  warning: 'bg-yellow-500 text-white border-yellow-500',
                  info: 'bg-blue-600 text-white border-blue-600',
            },
            outlined: {
                  success: 'bg-white text-green-800 border-green-300 border-2',
                  error: 'bg-white text-red-800 border-red-300 border-2',
                  warning: 'bg-white text-yellow-800 border-yellow-300 border-2',
                  info: 'bg-white text-blue-800 border-blue-300 border-2',
            },
            soft: {
                  success: 'bg-green-50 text-green-800 border-green-200',
                  error: 'bg-red-50 text-red-800 border-red-200',
                  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
                  info: 'bg-blue-50 text-blue-800 border-blue-200',
            },
      };

      const iconColors = {
            filled: {
                  success: 'text-white',
                  error: 'text-white',
                  warning: 'text-white',
                  info: 'text-white',
            },
            outlined: {
                  success: 'text-green-600',
                  error: 'text-red-600',
                  warning: 'text-yellow-600',
                  info: 'text-blue-600',
            },
            soft: {
                  success: 'text-green-400',
                  error: 'text-red-400',
                  warning: 'text-yellow-400',
                  info: 'text-blue-400',
            },
      };

      const sizes = {
            sm: 'p-3 text-sm',
            md: 'p-4 text-sm',
            lg: 'p-6 text-base',
      };

      const closeButtonColors = {
            filled: {
                  success: 'text-white hover:bg-green-700',
                  error: 'text-white hover:bg-red-700',
                  warning: 'text-white hover:bg-yellow-600',
                  info: 'text-white hover:bg-blue-700',
            },
            outlined: {
                  success: 'text-green-600 hover:bg-green-100',
                  error: 'text-red-600 hover:bg-red-100',
                  warning: 'text-yellow-600 hover:bg-yellow-100',
                  info: 'text-blue-600 hover:bg-blue-100',
            },
            soft: {
                  success: 'text-green-600 hover:bg-green-100',
                  error: 'text-red-600 hover:bg-red-100',
                  warning: 'text-yellow-600 hover:bg-yellow-100',
                  info: 'text-blue-600 hover:bg-blue-100',
            },
      };

      const displayIcon = icon === false ? null : icon || (showIcon ? icons[type] : null);

      return (
            <div
                  className={`
      border rounded-lg transition-all duration-200
      ${variants[variant][type]}
      ${sizes[size]}
      ${className}
    `}
            >
                  <div className='flex items-start'>
                        {/* Icon */}
                        {displayIcon && (
                              <div className={`flex-shrink-0 ${iconColors[variant][type]}`}>{displayIcon}</div>
                        )}

                        {/* Content */}
                        <div className={`flex-1 ${displayIcon ? 'ml-3' : ''}`}>
                              {title && (
                                    <h3 className={`font-medium ${size === 'lg' ? 'text-lg' : 'text-sm'} mb-1`}>
                                          {title}
                                    </h3>
                              )}
                              <div className={title ? 'mt-2' : ''}>{children}</div>
                        </div>

                        {/* Close Button */}
                        {closable && onClose && (
                              <div className={`ml-auto pl-3 ${displayIcon ? '' : 'ml-3'}`}>
                                    <button
                                          onClick={onClose}
                                          className={`
                inline-flex rounded-md p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
                ${closeButtonColors[variant][type]}
              `}
                                    >
                                          <span className='sr-only'>Dismiss</span>
                                          <X className='h-4 w-4' />
                                    </button>
                              </div>
                        )}
                  </div>
            </div>
      );
};

export default THAlert;
