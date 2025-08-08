import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface THBreadcrumbItem {
      label: string;
      href?: string;
      onClick?: () => void;
      icon?: React.ReactNode;
      active?: boolean;
}

interface THBreadcrumbProps {
      items: THBreadcrumbItem[];
      separator?: React.ReactNode;
      className?: string;
      showHomeIcon?: boolean;
      maxItems?: number;
      size?: 'sm' | 'md' | 'lg';
}

const THBreadcrumb: React.FC<THBreadcrumbProps> = ({
      items = [],
      separator = <ChevronRight className='h-4 w-4' />,
      className = '',
      showHomeIcon = false,
      maxItems,
      size = 'md',
}) => {
      const sizes = {
            sm: 'text-xs',
            md: 'text-sm',
            lg: 'text-base',
      };

      const spacingSizes = {
            sm: 'space-x-1',
            md: 'space-x-1 md:space-x-3',
            lg: 'space-x-2 md:space-x-4',
      };

      // Handle max items display
      let displayItems = items;
      if (maxItems && items.length > maxItems) {
            const firstItem = items[0];
            const lastItems = items.slice(-(maxItems - 1));
            displayItems = [firstItem, { label: '...', onClick: undefined }, ...lastItems];
      }

      return (
            <nav className={`flex ${className}`} aria-label='Breadcrumb'>
                  <ol className={`inline-flex items-center ${spacingSizes[size]}`}>
                        {displayItems.map((item, index) => (
                              <li key={index} className='inline-flex items-center'>
                                    {index > 0 && (
                                          <span className='mx-2 text-gray-400 flex items-center'>{separator}</span>
                                    )}
                                    <div className='flex items-center'>
                                          {/* Show home icon for first item if enabled */}
                                          {index === 0 && showHomeIcon && <Home className='h-4 w-4 mr-1' />}

                                          {/* Show custom icon if provided */}
                                          {item.icon && <span className='mr-1'>{item.icon}</span>}

                                          {/* Render clickable or non-clickable item */}
                                          {item.onClick || item.href ? (
                                                <button
                                                      onClick={item.onClick}
                                                      className={`
                    font-medium transition-colors hover:text-blue-800 focus:outline-none focus:underline
                    ${item.active ? 'text-blue-600' : 'text-blue-600 hover:text-blue-800'}
                    ${sizes[size]}
                  `}
                                                      disabled={item.label === '...'}
                                                >
                                                      {item.label}
                                                </button>
                                          ) : (
                                                <span className={`font-medium text-gray-500 ${sizes[size]}`}>
                                                      {item.label}
                                                </span>
                                          )}
                                    </div>
                              </li>
                        ))}
                  </ol>
            </nav>
      );
};

export default THBreadcrumb;
