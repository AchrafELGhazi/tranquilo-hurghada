import React from 'react';
import { Check, Minus } from 'lucide-react';

interface THCheckboxProps {
      checked?: boolean;
      onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
      label?: string;
      disabled?: boolean;
      className?: string;
      id?: string;
      name?: string;
      value?: string;
      indeterminate?: boolean;
      size?: 'sm' | 'md' | 'lg';
      color?: 'blue' | 'green' | 'red' | 'purple' | 'yellow';
      labelPosition?: 'left' | 'right';
}

const THCheckbox: React.FC<THCheckboxProps> = ({
      checked = false,
      onChange,
      label,
      disabled = false,
      className = '',
      indeterminate = false,
      size = 'md',
      color = 'blue',
      labelPosition = 'right',
      ...props
}) => {
      const sizes = {
            sm: 'w-3 h-3',
            md: 'w-4 h-4',
            lg: 'w-5 h-5',
      };

      const colors = {
            blue: checked || indeterminate ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white',
            green: checked || indeterminate ? 'bg-green-600 border-green-600' : 'border-gray-300 bg-white',
            red: checked || indeterminate ? 'bg-red-600 border-red-600' : 'border-gray-300 bg-white',
            purple: checked || indeterminate ? 'bg-purple-600 border-purple-600' : 'border-gray-300 bg-white',
            yellow: checked || indeterminate ? 'bg-yellow-500 border-yellow-500' : 'border-gray-300 bg-white',
      };

      const hoverColors = {
            blue: !disabled ? 'hover:border-blue-500' : '',
            green: !disabled ? 'hover:border-green-500' : '',
            red: !disabled ? 'hover:border-red-500' : '',
            purple: !disabled ? 'hover:border-purple-500' : '',
            yellow: !disabled ? 'hover:border-yellow-500' : '',
      };

      const iconSizes = {
            sm: 'h-2 w-2',
            md: 'h-3 w-3',
            lg: 'h-4 w-4',
      };

      const CheckboxElement = (
            <div className='relative'>
                  <input
                        type='checkbox'
                        checked={checked}
                        onChange={onChange}
                        disabled={disabled}
                        className='sr-only'
                        {...props}
                  />
                  <div
                        className={`
        ${sizes[size]} border-2 rounded-sm flex items-center justify-center transition-colors cursor-pointer
        ${colors[color]}
        ${hoverColors[color]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
                  >
                        {indeterminate ? (
                              <Minus className={`${iconSizes[size]} text-white`} />
                        ) : checked ? (
                              <Check className={`${iconSizes[size]} text-white`} />
                        ) : null}
                  </div>
            </div>
      );

      const LabelElement = label && (
            <span
                  className={`text-sm text-gray-700 ${disabled ? 'opacity-50' : ''} ${
                        size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
                  }`}
            >
                  {label}
            </span>
      );

      return (
            <label
                  className={`
      inline-flex items-center cursor-pointer 
      ${disabled ? 'cursor-not-allowed' : ''} 
      ${labelPosition === 'left' ? 'flex-row-reverse' : ''} 
      ${className}
    `}
            >
                  {CheckboxElement}
                  {LabelElement && <span className={labelPosition === 'left' ? 'mr-2' : 'ml-2'}>{LabelElement}</span>}
            </label>
      );
};

export default THCheckbox;
