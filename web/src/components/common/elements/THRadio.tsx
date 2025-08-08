import React from 'react';

interface THRadioProps {
      checked?: boolean;
      onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
      label?: string;
      value: string | number;
      name: string;
      disabled?: boolean;
      className?: string;
      id?: string;
      size?: 'sm' | 'md' | 'lg';
      color?: 'blue' | 'green' | 'red' | 'purple' | 'yellow';
      labelPosition?: 'left' | 'right';
}

const THRadio: React.FC<THRadioProps> = ({
      checked = false,
      onChange,
      label,
      value,
      name,
      disabled = false,
      className = '',
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
            blue: checked ? 'border-blue-600' : 'border-gray-300',
            green: checked ? 'border-green-600' : 'border-gray-300',
            red: checked ? 'border-red-600' : 'border-gray-300',
            purple: checked ? 'border-purple-600' : 'border-gray-300',
            yellow: checked ? 'border-yellow-500' : 'border-gray-300',
      };

      const dotColors = {
            blue: 'bg-blue-600',
            green: 'bg-green-600',
            red: 'bg-red-600',
            purple: 'bg-purple-600',
            yellow: 'bg-yellow-500',
      };

      const hoverColors = {
            blue: !disabled ? 'hover:border-blue-500' : '',
            green: !disabled ? 'hover:border-green-500' : '',
            red: !disabled ? 'hover:border-red-500' : '',
            purple: !disabled ? 'hover:border-purple-500' : '',
            yellow: !disabled ? 'hover:border-yellow-500' : '',
      };

      const dotSizes = {
            sm: 'w-1.5 h-1.5',
            md: 'w-2 h-2',
            lg: 'w-2.5 h-2.5',
      };

      const RadioElement = (
            <div className='relative'>
                  <input
                        type='radio'
                        checked={checked}
                        onChange={onChange}
                        value={value}
                        name={name}
                        disabled={disabled}
                        className='sr-only'
                        {...props}
                  />
                  <div
                        className={`
        ${sizes[size]} border-2 rounded-full flex items-center justify-center transition-colors cursor-pointer
        ${colors[color]}
        ${hoverColors[color]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
                  >
                        {checked && <div className={`${dotSizes[size]} ${dotColors[color]} rounded-full`}></div>}
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
                  {RadioElement}
                  {LabelElement && <span className={labelPosition === 'left' ? 'mr-2' : 'ml-2'}>{LabelElement}</span>}
            </label>
      );
};

export default THRadio;
