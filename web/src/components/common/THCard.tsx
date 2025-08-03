import React from 'react';

interface THCardProps {
      title?: string;
      subtitle?: string;
      children: React.ReactNode;
      actions?: React.ReactNode;
      className?: string;
      headerClassName?: string;
      bodyClassName?: string;
      footerClassName?: string;
      footer?: React.ReactNode;
      variant?: 'default' | 'outlined' | 'elevated' | 'filled';
      size?: 'sm' | 'md' | 'lg';
      clickable?: boolean;
      onClick?: () => void;
      loading?: boolean;
      hoverable?: boolean;
}

const THCard: React.FC<THCardProps> = ({
      title,
      subtitle,
      children,
      actions,
      footer,
      className = '',
      headerClassName = '',
      bodyClassName = '',
      footerClassName = '',
      variant = 'default',
      size = 'md',
      clickable = false,
      onClick,
      loading = false,
      hoverable = false,
}) => {
      const variants = {
            default: 'bg-white border border-gray-200 shadow-sm',
            outlined: 'bg-white border-2 border-gray-300',
            elevated: 'bg-white border border-gray-200 shadow-lg',
            filled: 'bg-gray-50 border border-gray-200',
      };

      const sizes = {
            sm: {
                  padding: 'p-4',
                  headerPadding: 'px-4 py-3',
                  bodyPadding: 'px-4 pb-4',
                  footerPadding: 'px-4 py-3',
            },
            md: {
                  padding: 'p-6',
                  headerPadding: 'px-6 py-4',
                  bodyPadding: 'px-6 py-4',
                  footerPadding: 'px-6 py-4',
            },
            lg: {
                  padding: 'p-8',
                  headerPadding: 'px-8 py-6',
                  bodyPadding: 'px-8 py-6',
                  footerPadding: 'px-8 py-6',
            },
      };

      const baseClasses = `
    rounded-lg transition-all duration-200
    ${variants[variant]}
    ${clickable || hoverable ? 'hover:shadow-md cursor-pointer' : ''}
    ${loading ? 'animate-pulse' : ''}
    ${className}
  `;

      const CardContent = () => (
            <>
                  {(title || subtitle || actions) && (
                        <div className={`border-b border-gray-200 ${sizes[size].headerPadding} ${headerClassName}`}>
                              <div className='flex items-start justify-between'>
                                    <div className='flex-1 min-w-0'>
                                          {title && (
                                                <h3 className='text-lg font-medium text-gray-900 truncate'>{title}</h3>
                                          )}
                                          {subtitle && <p className='text-sm text-gray-500 mt-1'>{subtitle}</p>}
                                    </div>
                                    {actions && (
                                          <div className='flex items-center space-x-2 ml-4 flex-shrink-0'>
                                                {actions}
                                          </div>
                                    )}
                              </div>
                        </div>
                  )}

                  <div
                        className={`
        ${title || subtitle || actions ? sizes[size].bodyPadding : sizes[size].padding}
        ${bodyClassName}
      `}
                  >
                        {loading ? (
                              <div className='space-y-3'>
                                    <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                                    <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                                    <div className='h-4 bg-gray-200 rounded w-2/3'></div>
                              </div>
                        ) : (
                              children
                        )}
                  </div>

                  {footer && (
                        <div className={`border-t border-gray-200 ${sizes[size].footerPadding} ${footerClassName}`}>
                              {footer}
                        </div>
                  )}
            </>
      );

      if (clickable && onClick) {
            return (
                  <button
                        onClick={onClick}
                        className={`${baseClasses} w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                        disabled={loading}
                  >
                        <CardContent />
                  </button>
            );
      }

      return (
            <div className={baseClasses}>
                  <CardContent />
            </div>
      );
};

export default THCard;
