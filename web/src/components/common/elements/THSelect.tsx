import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

interface THSelectOption {
      value: string | number;
      label: string;
      disabled?: boolean;
}

interface THSelectProps {
      options?: THSelectOption[];
      value?: string | number;
      onChange?: (value: string | number) => void;
      placeholder?: string;
      label?: string;
      error?: string;
      helperText?: string;
      className?: string;
      containerClassName?: string;
      disabled?: boolean;
      required?: boolean;
      searchable?: boolean;
      multiple?: boolean;
      id?: string;
      name?: string;
}

const THSelect: React.FC<THSelectProps> = ({
      options = [],
      value,
      onChange,
      placeholder = 'Select an option',
      label,
      error,
      helperText,
      className = '',
      containerClassName = '',
      disabled = false,
      required = false,
      searchable = false,
      multiple = false,
      ...props
}) => {
      const [isOpen, setIsOpen] = useState(false);
      const [searchTerm, setSearchTerm] = useState('');
      const selectRef = useRef<HTMLDivElement>(null);

      const selectedOption = options.find(opt => opt.value === value);

      const filteredOptions = searchable
            ? options.filter(option => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
            : options;

      useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                  if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                        setIsOpen(false);
                        setSearchTerm('');
                  }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

      const handleSelect = (optionValue: string | number) => {
            onChange?.(optionValue);
            setIsOpen(false);
            setSearchTerm('');
      };

      return (
            <div className={`relative w-full ${containerClassName}`} ref={selectRef}>
                  {label && (
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                              {label}
                              {required && <span className='text-red-500 ml-1'>*</span>}
                        </label>
                  )}

                  <div className='relative'>
                        <button
                              type='button'
                              disabled={disabled}
                              className={`
            w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'}
            ${className}
          `}
                              onClick={() => !disabled && setIsOpen(!isOpen)}
                              {...props}
                        >
                              <span className='block truncate text-gray-900'>
                                    {selectedOption ? selectedOption.label : placeholder}
                              </span>
                              <ChevronDown
                                    className={`absolute inset-y-0 right-0 pr-3 flex items-center h-4 w-4 text-gray-400 transition-transform ${
                                          isOpen ? 'transform rotate-180' : ''
                                    }`}
                              />
                        </button>

                        {isOpen && !disabled && (
                              <div className='absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden'>
                                    {searchable && (
                                          <div className='p-2 border-b border-gray-200'>
                                                <input
                                                      type='text'
                                                      placeholder='Search options...'
                                                      value={searchTerm}
                                                      onChange={e => setSearchTerm(e.target.value)}
                                                      className='w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent'
                                                      onClick={e => e.stopPropagation()}
                                                />
                                          </div>
                                    )}
                                    <div className='max-h-48 overflow-auto'>
                                          {filteredOptions.length === 0 ? (
                                                <div className='px-3 py-2 text-gray-500 text-sm'>No options found</div>
                                          ) : (
                                                filteredOptions.map(option => (
                                                      <button
                                                            key={option.value}
                                                            type='button'
                                                            disabled={option.disabled}
                                                            className={`
                      w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors
                      ${value === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}
                      ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                                                            onClick={() =>
                                                                  !option.disabled && handleSelect(option.value)
                                                            }
                                                      >
                                                            {option.label}
                                                      </button>
                                                ))
                                          )}
                                    </div>
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
            </div>
      );
};

export default THSelect;
