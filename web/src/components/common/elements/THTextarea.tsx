import React from 'react';
import { AlertCircle } from 'lucide-react';

interface THTextareaProps {
      label?: string;
      error?: string;
      helperText?: string;
      className?: string;
      containerClassName?: string;
      placeholder?: string;
      value?: string;
      onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
      onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
      onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
      disabled?: boolean;
      required?: boolean;
      id?: string;
      name?: string;
      rows?: number;
      cols?: number;
      maxLength?: number;
      resize?: 'none' | 'both' | 'horizontal' | 'vertical';
      autoResize?: boolean;
      showCharCount?: boolean;
}

const THTextarea: React.FC<THTextareaProps> = ({
      label,
      error,
      helperText,
      className = '',
      containerClassName = '',
      disabled = false,
      required = false,
      rows = 3,
      resize = 'vertical',
      autoResize = false,
      showCharCount = false,
      maxLength,
      value = '',
      onChange,
      ...props
}) => {
      const resizeClasses = {
            none: 'resize-none',
            both: 'resize',
            horizontal: 'resize-x',
            vertical: 'resize-y',
      };

      const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            if (autoResize) {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
            }
            onChange?.(e);
      };

      const charCount = value?.length || 0;
      const isOverLimit = maxLength ? charCount > maxLength : false;

      return (
            <div className={`w-full ${containerClassName}`}>
                  {label && (
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                              {label}
                              {required && <span className='text-red-500 ml-1'>*</span>}
                        </label>
                  )}

                  <div className='relative'>
                        <textarea
                              disabled={disabled}
                              required={required}
                              rows={rows}
                              maxLength={maxLength}
                              value={value}
                              onChange={handleChange}
                              className={`
            w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
            ${resizeClasses[resize]}
            ${className}
          `}
                              style={{
                                    minHeight: autoResize ? '2.5rem' : undefined,
                                    ...(autoResize && { overflow: 'hidden' }),
                              }}
                              {...props}
                        />

                        {/* Character count */}
                        {showCharCount && (maxLength || value) && (
                              <div className='absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-1 rounded'>
                                    <span className={isOverLimit ? 'text-red-500' : ''}>
                                          {charCount}
                                          {maxLength && `/${maxLength}`}
                                    </span>
                              </div>
                        )}
                  </div>

                  {error && (
                        <p className='mt-1 text-sm text-red-600 flex items-center'>
                              <AlertCircle className='h-4 w-4 mr-1' />
                              {error}
                        </p>
                  )}
                  {helperText && !error && <p className='mt-1 text-sm text-gray-500'>{helperText}</p>}

                  {/* Character count below textarea */}
                  {showCharCount && !error && !helperText && (maxLength || value) && (
                        <p className='mt-1 text-xs text-gray-500 text-right'>
                              <span className={isOverLimit ? 'text-red-500' : ''}>
                                    {charCount}
                                    {maxLength && `/${maxLength}`}
                              </span>
                        </p>
                  )}
            </div>
      );
};

export default THTextarea;
