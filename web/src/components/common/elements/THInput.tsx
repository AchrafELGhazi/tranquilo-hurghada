import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface THInputProps {
      type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
      label?: string;
      error?: string;
      helperText?: string;
      leftIcon?: React.ReactNode;
      rightIcon?: React.ReactNode;
      onRightIconClick?: () => void;
      className?: string;
      containerClassName?: string;
      placeholder?: string;
      value?: string;
      onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
      onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
      onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
      disabled?: boolean;
      required?: boolean;
      id?: string;
      name?: string;
}

const THInput: React.FC<THInputProps> = ({
      type = 'text',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      onRightIconClick,
      className = '',
      containerClassName = '',
      disabled = false,
      required = false,
      ...props
}) => {
      const [showPassword, setShowPassword] = useState(false);

      const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

      return (
            <div className={`w-full ${containerClassName}`}>
                  {label && (
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                              {label}
                              {required && <span className='text-red-500 ml-1'>*</span>}
                        </label>
                  )}
                  <div className='relative'>
                        {leftIcon && (
                              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <span className='text-gray-400'>{leftIcon}</span>
                              </div>
                        )}
                        <input
                              type={inputType}
                              disabled={disabled}
                              required={required}
                              className={`
            w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon || type === 'password' ? 'pr-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
            ${className}
          `}
                              {...props}
                        />
                        {type === 'password' && (
                              <button
                                    type='button'
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600'
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={disabled}
                              >
                                    {showPassword ? (
                                          <EyeOff className='h-4 w-4 text-gray-400' />
                                    ) : (
                                          <Eye className='h-4 w-4 text-gray-400' />
                                    )}
                              </button>
                        )}
                        {rightIcon && type !== 'password' && (
                              <button
                                    type='button'
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600'
                                    onClick={onRightIconClick}
                                    disabled={disabled}
                              >
                                    <span className='text-gray-400'>{rightIcon}</span>
                              </button>
                        )}
                  </div>
                  {error && (
                        <p className='mt-1 text-sm text-red-600 flex items-center'>
                              <AlertCircle className='h-4 w-4 mr-1' />
                              {error}
                        </p>
                  )}
                  {helperText && !error && <p className='mt-1 text-sm text-gray-500'>{helperText}</p>}
            </div>
      );
};

export default THInput;
