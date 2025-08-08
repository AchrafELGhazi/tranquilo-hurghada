import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const AdminSidebar: React.FC = () => {
      const { t } = useTranslation();
      const location = useLocation();
      const { lang } = useParams();
      const [isCollapsed, setIsCollapsed] = useState(false);

      const adminNavigation = [
            { name: t('admin.dashboard'), href: `/${lang}/admin`, exact: true },
            { name: t('admin.users'), href: `/${lang}/admin/users` },
            { name: t('admin.bookings'), href: `/${lang}/admin/bookings`},
            { name: t('admin.villas'), href: `/${lang}/admin/villas`},

      ];

      const isActive = (href: string, exact?: boolean) => {
            if (exact) {
                  return location.pathname === href;
            }
            return location.pathname.startsWith(href);
      };

      return (
            <aside
                  className={`bg-gray-800 text-white transition-all duration-300 ${
                        isCollapsed ? 'w-16' : 'w-64'
                  } min-h-screen flex flex-col`}
            >
                  {/* Sidebar Header */}
                  <div className='p-4 border-b border-gray-700'>
                        <div className='flex items-center justify-between'>
                              <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
                                    <div className='w-8 h-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg flex items-center justify-center'>
                                          <svg
                                                className='w-5 h-5 text-white'
                                                fill='none'
                                                stroke='currentColor'
                                                viewBox='0 0 24 24'
                                          >
                                                <path
                                                      strokeLinecap='round'
                                                      strokeLinejoin='round'
                                                      strokeWidth={2}
                                                      d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                                                />
                                          </svg>
                                    </div>
                                    {!isCollapsed && <span className='text-xl font-bold'>{t('admin.title')}</span>}
                              </div>
                              <button
                                    onClick={() => setIsCollapsed(!isCollapsed)}
                                    className='p-1 rounded hover:bg-gray-700 transition-colors'
                              >
                                    <svg
                                          className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                                          fill='none'
                                          stroke='currentColor'
                                          viewBox='0 0 24 24'
                                    >
                                          <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M11 19l-7-7 7-7m8 14l-7-7 7-7'
                                          />
                                    </svg>
                              </button>
                        </div>
                  </div>

                  {/* Navigation Menu */}
                  <nav className='flex-1 px-4 py-6 space-y-2'>
                        {adminNavigation.map(item => {
                              const active = isActive(item.href, item.exact);
                              return (
                                    <Link
                                          key={item.href}
                                          to={item.href}
                                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                active
                                                      ? 'bg-red-600 text-white'
                                                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                          } ${isCollapsed ? 'justify-center' : ''}`}
                                          title={isCollapsed ? item.name : undefined}
                                    >
                                          {!isCollapsed && <span>{item.name}</span>}
                                    </Link>
                              );
                        })}
                  </nav>

                  {/* User Info */}
                  <div className='p-4 border-t border-gray-700'>
                        <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
                              <div className='w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center'>
                                    <span className='text-sm font-medium'>A</span>
                              </div>
                              {!isCollapsed && (
                                    <div className='flex-1 min-w-0'>
                                          <p className='text-sm font-medium text-white truncate'>Admin User</p>
                                          <p className='text-xs text-gray-400 truncate'>admin@example.com</p>
                                    </div>
                              )}
                        </div>
                  </div>
            </aside>
      );
};
