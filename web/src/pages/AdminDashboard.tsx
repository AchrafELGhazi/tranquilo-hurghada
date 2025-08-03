import React from 'react';
import { useTranslation } from 'react-i18next';

export const AdminDashboard: React.FC = () => {
      const { t } = useTranslation();

      const stats = [
            { name: t('admin.stats.totalUsers'), value: '12,345', icon: '👥', change: '+12%', positive: true },
            { name: t('admin.stats.revenue'), value: '$54,321', icon: '💰', change: '+8%', positive: true },
            { name: t('admin.stats.orders'), value: '1,234', icon: '📦', change: '-3%', positive: false },
            { name: t('admin.stats.sessions'), value: '98,765', icon: '📊', change: '+15%', positive: true },
      ];

      const recentActivities = [
            { id: 1, user: 'John Doe', action: 'Created new account', time: '2 minutes ago', type: 'user' },
            { id: 2, user: 'Jane Smith', action: 'Updated profile', time: '5 minutes ago', type: 'profile' },
            { id: 3, user: 'Mike Wilson', action: 'Made a purchase', time: '10 minutes ago', type: 'order' },
            { id: 4, user: 'Sarah Johnson', action: 'Left a review', time: '15 minutes ago', type: 'review' },
            { id: 5, user: 'Admin', action: 'Updated system settings', time: '1 hour ago', type: 'system' },
      ];

      return (
            <div className='space-y-6'>
                  {/* Page Header */}
                  <div>
                        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>{t('admin.dashboard')}</h1>
                        <p className='mt-2 text-gray-600 dark:text-gray-400'>{t('admin.dashboardDescription')}</p>
                  </div>

                  {/* Stats Grid */}
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {stats.map((stat, index) => (
                              <div
                                    key={index}
                                    className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'
                              >
                                    <div className='flex items-center justify-between'>
                                          <div>
                                                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                                                      {stat.name}
                                                </p>
                                                <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                                                      {stat.value}
                                                </p>
                                          </div>
                                          <div className='text-3xl'>{stat.icon}</div>
                                    </div>
                                    <div className='mt-4 flex items-center'>
                                          <span
                                                className={`text-sm font-medium ${
                                                      stat.positive
                                                            ? 'text-green-600 dark:text-green-400'
                                                            : 'text-red-600 dark:text-red-400'
                                                }`}
                                          >
                                                {stat.change}
                                          </span>
                                          <span className='text-sm text-gray-500 dark:text-gray-400 ml-2'>
                                                from last month
                                          </span>
                                    </div>
                              </div>
                        ))}
                  </div>

                  {/* Charts Row */}
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        {/* Revenue Chart */}
                        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
                              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                                    {t('admin.charts.revenue')}
                              </h3>
                              <div className='h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg'>
                                    <p className='text-gray-500 dark:text-gray-400'>📈 Revenue Chart Placeholder</p>
                              </div>
                        </div>

                        {/* User Growth Chart */}
                        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
                              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                                    {t('admin.charts.userGrowth')}
                              </h3>
                              <div className='h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg'>
                                    <p className='text-gray-500 dark:text-gray-400'>📊 User Growth Chart Placeholder</p>
                              </div>
                        </div>
                  </div>

                  {/* Recent Activity */}
                  <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
                        <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
                              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                                    {t('admin.recentActivity')}
                              </h3>
                        </div>
                        <div className='divide-y divide-gray-200 dark:divide-gray-700'>
                              {recentActivities.map(activity => (
                                    <div key={activity.id} className='px-6 py-4 flex items-center justify-between'>
                                          <div className='flex items-center space-x-4'>
                                                <div
                                                      className={`w-2 h-2 rounded-full ${
                                                            activity.type === 'user'
                                                                  ? 'bg-blue-500'
                                                                  : activity.type === 'profile'
                                                                  ? 'bg-green-500'
                                                                  : activity.type === 'order'
                                                                  ? 'bg-yellow-500'
                                                                  : activity.type === 'review'
                                                                  ? 'bg-purple-500'
                                                                  : 'bg-gray-500'
                                                      }`}
                                                ></div>
                                                <div>
                                                      <p className='text-sm font-medium text-gray-900 dark:text-white'>
                                                            {activity.user}
                                                      </p>
                                                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                                                            {activity.action}
                                                      </p>
                                                </div>
                                          </div>
                                          <span className='text-sm text-gray-500 dark:text-gray-400'>
                                                {activity.time}
                                          </span>
                                    </div>
                              ))}
                        </div>
                  </div>
            </div>
      );
};
