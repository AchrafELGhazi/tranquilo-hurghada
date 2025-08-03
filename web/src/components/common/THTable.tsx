import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import THCheckbox from './THCheckbox';

interface THTableColumn {
      key: string;
      title: string;
      sortable?: boolean;
      width?: string;
      align?: 'left' | 'center' | 'right';
      render?: (value: any, row: any, index: number) => React.ReactNode;
      className?: string;
}

interface THTableAction {
      label: string;
      icon?: React.ReactNode;
      onClick: (row: any, index: number) => void;
      variant?: 'primary' | 'secondary' | 'danger';
      disabled?: (row: any) => boolean;
}

interface THTableProps {
      data: any[];
      columns: THTableColumn[];
      sortable?: boolean;
      selectable?: boolean;
      actions?: THTableAction[];
      onSort?: (key: string, direction: 'asc' | 'desc') => void;
      onSelect?: (selectedIndices: number[]) => void;
      className?: string;
      loading?: boolean;
      emptyMessage?: string;
      pagination?: {
            current: number;
            pageSize: number;
            total: number;
            onChange: (page: number, pageSize: number) => void;
      };
      size?: 'sm' | 'md' | 'lg';
      striped?: boolean;
      bordered?: boolean;
      hoverable?: boolean;
}

const THTable: React.FC<THTableProps> = ({
      data = [],
      columns = [],
      sortable = true,
      selectable = false,
      actions = [],
      onSort,
      onSelect,
      className = '',
      loading = false,
      emptyMessage = 'No data available',
      size = 'md',
      striped = false,
      bordered = false,
      hoverable = true,
}) => {
      const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({
            key: null,
            direction: 'asc',
      });
      const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

      const sizes = {
            sm: 'px-3 py-2 text-xs',
            md: 'px-6 py-4 text-sm',
            lg: 'px-8 py-6 text-base',
      };

      const headerSizes = {
            sm: 'px-3 py-2 text-xs',
            md: 'px-6 py-3 text-xs',
            lg: 'px-8 py-4 text-sm',
      };

      const handleSort = (key: string) => {
            if (!sortable) return;

            let direction: 'asc' | 'desc' = 'asc';
            if (sortConfig.key === key && sortConfig.direction === 'asc') {
                  direction = 'desc';
            }
            setSortConfig({ key, direction });
            onSort && onSort(key, direction);
      };

      const handleSelectAll = (checked: boolean) => {
            if (checked) {
                  setSelectedRows(new Set(data.map((_, index) => index)));
            } else {
                  setSelectedRows(new Set());
            }
            onSelect && onSelect(Array.from(selectedRows));
      };

      const handleSelectRow = (index: number, checked: boolean) => {
            const newSelected = new Set(selectedRows);
            if (checked) {
                  newSelected.add(index);
            } else {
                  newSelected.delete(index);
            }
            setSelectedRows(newSelected);
            onSelect && onSelect(Array.from(newSelected));
      };

      const getSortIcon = (columnKey: string) => {
            if (sortConfig.key !== columnKey) {
                  return <ArrowUpDown className='h-4 w-4 opacity-50' />;
            }
            if (sortConfig.direction === 'asc') {
                  return <ArrowUp className='h-4 w-4' />;
            }
            return <ArrowDown className='h-4 w-4' />;
      };

      const getAlignmentClass = (align?: string) => {
            switch (align) {
                  case 'center':
                        return 'text-center';
                  case 'right':
                        return 'text-right';
                  default:
                        return 'text-left';
            }
      };

      if (loading) {
            return (
                  <div className={`overflow-x-auto ${className}`}>
                        <div className='min-w-full bg-white border border-gray-200 rounded-lg'>
                              <div className='animate-pulse'>
                                    <div className='bg-gray-50 h-12 rounded-t-lg'></div>
                                    {[...Array(5)].map((_, i) => (
                                          <div
                                                key={i}
                                                className='h-16 bg-white border-t border-gray-200 flex items-center px-6'
                                          >
                                                <div className='h-4 bg-gray-200 rounded w-full'></div>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </div>
            );
      }

      return (
            <div className={`overflow-x-auto ${className}`}>
                  <table
                        className={`min-w-full divide-y divide-gray-200 bg-white ${
                              bordered ? 'border border-gray-200 rounded-lg' : ''
                        }`}
                  >
                        <thead className='bg-gray-50'>
                              <tr>
                                    {selectable && (
                                          <th className={`${headerSizes[size]} text-left`}>
                                                <THCheckbox
                                                      checked={selectedRows.size === data.length && data.length > 0}
                                                      indeterminate={
                                                            selectedRows.size > 0 && selectedRows.size < data.length
                                                      }
                                                      onChange={e => handleSelectAll(e.target.checked)}
                                                />
                                          </th>
                                    )}
                                    {columns.map(column => (
                                          <th
                                                key={column.key}
                                                className={`
                  ${headerSizes[size]} font-medium text-gray-500 uppercase tracking-wider
                  ${getAlignmentClass(column.align)}
                  ${sortable && column.sortable !== false ? 'cursor-pointer hover:bg-gray-100 select-none' : ''}
                  ${column.className || ''}
                `}
                                                style={{ width: column.width }}
                                                onClick={() =>
                                                      sortable && column.sortable !== false && handleSort(column.key)
                                                }
                                          >
                                                <div className='flex items-center space-x-1'>
                                                      <span>{column.title}</span>
                                                      {sortable && column.sortable !== false && getSortIcon(column.key)}
                                                </div>
                                          </th>
                                    ))}
                                    {actions.length > 0 && (
                                          <th
                                                className={`${headerSizes[size]} text-right font-medium text-gray-500 uppercase tracking-wider`}
                                          >
                                                Actions
                                          </th>
                                    )}
                              </tr>
                        </thead>
                        <tbody className={`bg-white divide-y divide-gray-200 ${striped ? 'divide-y-0' : ''}`}>
                              {data.length === 0 ? (
                                    <tr>
                                          <td
                                                colSpan={
                                                      columns.length +
                                                      (selectable ? 1 : 0) +
                                                      (actions.length > 0 ? 1 : 0)
                                                }
                                                className={`${sizes[size]} text-center text-gray-500`}
                                          >
                                                {emptyMessage}
                                          </td>
                                    </tr>
                              ) : (
                                    data.map((row, rowIndex) => (
                                          <tr
                                                key={rowIndex}
                                                className={`
                  ${hoverable ? 'hover:bg-gray-50' : ''}
                  ${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''}
                  ${selectedRows.has(rowIndex) ? 'bg-blue-50' : ''}
                `}
                                          >
                                                {selectable && (
                                                      <td className={sizes[size]}>
                                                            <THCheckbox
                                                                  checked={selectedRows.has(rowIndex)}
                                                                  onChange={e =>
                                                                        handleSelectRow(rowIndex, e.target.checked)
                                                                  }
                                                            />
                                                      </td>
                                                )}
                                                {columns.map(column => (
                                                      <td
                                                            key={column.key}
                                                            className={`
                      ${sizes[size]} whitespace-nowrap text-gray-900
                      ${getAlignmentClass(column.align)}
                      ${column.className || ''}
                    `}
                                                      >
                                                            {column.render
                                                                  ? column.render(row[column.key], row, rowIndex)
                                                                  : row[column.key]}
                                                      </td>
                                                ))}
                                                {actions.length > 0 && (
                                                      <td
                                                            className={`${sizes[size]} whitespace-nowrap text-right font-medium`}
                                                      >
                                                            <div className='flex items-center justify-end space-x-2'>
                                                                  {actions.map((action, actionIndex) => {
                                                                        const isDisabled = action.disabled
                                                                              ? action.disabled(row)
                                                                              : false;
                                                                        const variantClasses = {
                                                                              primary: 'text-blue-600 hover:text-blue-800',
                                                                              secondary:
                                                                                    'text-gray-600 hover:text-gray-800',
                                                                              danger: 'text-red-600 hover:text-red-800',
                                                                        };

                                                                        return (
                                                                              <button
                                                                                    key={actionIndex}
                                                                                    onClick={() =>
                                                                                          !isDisabled &&
                                                                                          action.onClick(row, rowIndex)
                                                                                    }
                                                                                    disabled={isDisabled}
                                                                                    className={`
                              inline-flex items-center px-2 py-1 text-xs font-medium rounded transition-colors
                              ${
                                    isDisabled
                                          ? 'text-gray-400 cursor-not-allowed'
                                          : variantClasses[action.variant || 'primary']
                              }
                            `}
                                                                              >
                                                                                    {action.icon && (
                                                                                          <span className='mr-1'>
                                                                                                {action.icon}
                                                                                          </span>
                                                                                    )}
                                                                                    {action.label}
                                                                              </button>
                                                                        );
                                                                  })}
                                                            </div>
                                                      </td>
                                                )}
                                          </tr>
                                    ))
                              )}
                        </tbody>
                  </table>
            </div>
      );
};

export default THTable;
