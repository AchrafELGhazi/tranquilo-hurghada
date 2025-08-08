import React from 'react';

interface THButtonProps {
      variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost' | 'link';
      size?: 'sm' | 'md' | 'lg' | 'xl';
      disabled?: boolean;
      loading?: boolean;
      leftIcon?: React.ReactNode;
      rightIcon?: React.ReactNode;
      onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
      children: React.ReactNode;
      className?: string;
      type?: 'button' | 'submit' | 'reset';
}

const THButton: React.FC<THButtonProps> = ({
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      leftIcon,
      rightIcon,
      onClick,
      children,
      className = '',
      type = 'button',
      ...props
}) => {
      const baseClasses =
            'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

      const variants = {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
            secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500',
            success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
            danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
            warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500',
            outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
            ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
            link: 'text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline focus:ring-blue-500',
      };

      const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-sm',
            lg: 'px-6 py-3 text-base',
            xl: 'px-8 py-4 text-lg',
      };

      return (
            <button
                  type={type}
                  className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
                  disabled={disabled || loading}
                  onClick={onClick}
                  {...props}
            >
                  {loading && <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2'></div>}
                  {leftIcon && <span className='mr-2'>{leftIcon}</span>}
                  {children}
                  {rightIcon && <span className='ml-2'>{rightIcon}</span>}
            </button>
      );
};

export default THButton;
