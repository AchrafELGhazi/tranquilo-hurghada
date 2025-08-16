import React, { useState, useEffect } from 'react';
import { RefreshCw, BarChart3, Users, Home, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { statsApi } from '@/api/statsApi';
import type { DashboardStats } from '@/api/statsApi';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/statsUtils';

// Components
import { StatCard } from '@/components/adminDashboard/StatCard';
import { LoadingDashboard, ErrorMessage } from '@/components/adminDashboard/LoadingError';
import { RecentBookingsTable } from '@/components/adminDashboard/RecentBookingsTable';
import { TopItemsList } from '@/components/adminDashboard/TopItemsList';
import { PaymentMethodsChart } from '@/components/adminDashboard/PaymentMethodsChart';
import { PopularDestinations } from '@/components/adminDashboard/PopularDestinations';

export const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await statsApi.getDashboardStats();
            setStats(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch dashboard statistics');
            console.error('Failed to fetch stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) return <LoadingDashboard />;

    if (error) {
        return (
            <div className='min-h-screen'>
                <div className='max-w-7xl mx-auto space-y-6'>
                    <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                        <h1 className='text-2xl font-bold text-[#C75D2C] font-butler'>Admin Dashboard</h1>
                        <p className='text-[#C75D2C]/70 mt-1'>Statistics overview</p>
                    </div>
                    <ErrorMessage message={error} onRetry={fetchStats} />
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className='min-h-screen'>
                <div className='max-w-7xl mx-auto space-y-6'>
                    <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                        <h1 className='text-2xl font-bold text-[#C75D2C] font-butler'>Admin Dashboard</h1>
                        <p className='text-[#C75D2C]/70 mt-1'>No data available</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen'>
            <div className='max-w-7xl mx-auto space-y-6'>
                {/* Header */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                        <div>
                            <h1 className='text-2xl font-bold text-[#C75D2C] font-butler flex items-center'>
                                <BarChart3 className='w-7 h-7 mr-2' />
                                Admin Dashboard
                            </h1>
                            <p className='text-[#C75D2C]/70 mt-1'>Comprehensive business analytics</p>
                        </div>
                        <button
                            onClick={fetchStats}
                            disabled={loading}
                            className='flex items-center space-x-2 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white px-4 py-2 rounded-xl font-medium hover:from-[#C75D2C] hover:to-[#D96F32] transition-all duration-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed'
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Overview Stats */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    <StatCard
                        title='Total Revenue'
                        value={formatCurrency(stats.overview.totalRevenue)}
                        subtitle='All time villa revenue'
                        trend={stats.overview.revenueGrowth}
                        icon={<DollarSign className='w-6 h-6 text-green-600' />}
                        color='green'
                    />
                    <StatCard
                        title='Total Bookings'
                        value={formatNumber(stats.overview.totalBookings)}
                        subtitle='All time reservations'
                        icon={<Calendar className='w-6 h-6 text-blue-600' />}
                        color='blue'
                    />
                    {/* <StatCard
                        title='Total Villas'
                        value={formatNumber(stats.overview.totalVillas)}
                        subtitle='Active properties'
                        icon={<Home className='w-6 h-6 text-purple-600' />}
                        color='purple'
                    /> */}
                    <StatCard
                        title='Total Users'
                        value={formatNumber(stats.overview.totalUsers)}
                        subtitle='Registered users'
                        trend={stats.users.userGrowth}
                        icon={<Users className='w-6 h-6 text-indigo-600' />}
                        color='indigo'
                    />
                </div>

                {/* Booking Status Overview */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                    <h2 className='text-lg font-semibold text-[#C75D2C] font-butler mb-4 flex items-center'>
                        <Calendar className='w-5 h-5 mr-2' />
                        Booking Status Overview
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
                        <StatCard title='Pending' value={stats.bookings.pendingBookings} icon='⏳' color='yellow' />
                        <StatCard title='Confirmed' value={stats.bookings.confirmedBookings} icon='✅' color='green' />
                        <StatCard title='Completed' value={stats.bookings.completedBookings} icon='🎉' color='blue' />
                        <StatCard title='Cancelled' value={stats.bookings.cancelledBookings} icon='❌' color='red' />
                        <StatCard title='Rejected' value={stats.bookings.rejectedBookings} icon='🚫' color='red' />
                    </div>
                </div>

                {/* Key Performance Metrics */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                    <h2 className='text-lg font-semibold text-[#C75D2C] font-butler mb-4 flex items-center'>
                        <TrendingUp className='w-5 h-5 mr-2' />
                        Key Performance Metrics
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        <StatCard
                            title='Average Booking Value'
                            value={formatCurrency(stats.bookings.averageBookingValue)}
                            subtitle='Per reservation'
                            icon='💵'
                            color='green'
                        />
                        <StatCard
                            title='Average Stay Duration'
                            value={`${stats.bookings.averageStayDuration} days`}
                            subtitle='Guest stays'
                            icon='📊'
                            color='blue'
                        />
                        <StatCard
                            title='Occupancy Rate'
                            value={formatPercentage(stats.bookings.occupancyRate)}
                            subtitle='This year'
                            icon='🏨'
                            color='purple'
                        />
                    </div>
                </div>

                {/* Financial Overview */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                    <h2 className='text-lg font-semibold text-[#C75D2C] font-butler mb-4 flex items-center'>
                        <DollarSign className='w-5 h-5 mr-2' />
                        Financial Overview
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        <StatCard
                            title='Villa Revenue'
                            value={formatCurrency(stats.financial.villaRevenue)}
                            subtitle='From accommodations'
                            icon='🏠'
                            color='green'
                        />
                        <StatCard
                            title='Total Commissions'
                            value={formatCurrency(stats.financial.totalCommissions)}
                            subtitle='10% commission'
                            icon='💼'
                            color='blue'
                        />
                        <StatCard
                            title='Pending Payments'
                            value={formatCurrency(stats.financial.pendingPayments)}
                            subtitle='Awaiting payment'
                            icon='⏰'
                            color='yellow'
                        />
                    </div>
                </div>

                {/* User Analytics */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                    <h2 className='text-lg font-semibold text-[#C75D2C] font-butler mb-4 flex items-center'>
                        <Users className='w-5 h-5 mr-2' />
                        User Analytics
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        <StatCard
                            title='Guests'
                            value={stats.users.usersByRole.guests}
                            subtitle='Customer accounts'
                            icon='🧳'
                            color='blue'
                        />
                        <StatCard
                            title='Hosts'
                            value={stats.users.usersByRole.hosts}
                            subtitle='Property owners'
                            icon='🔑'
                            color='green'
                        />
                        <StatCard
                            title='Admins'
                            value={stats.users.usersByRole.admins}
                            subtitle='System administrators'
                            icon='⚙️'
                            color='purple'
                        />
                    </div>
                </div>

                {/* Villa Status */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                    <h2 className='text-lg font-semibold text-[#C75D2C] font-butler mb-4 flex items-center'>
                        <Home className='w-5 h-5 mr-2' />
                        Villa Status
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        <StatCard
                            title='Available Villas'
                            value={stats.villas.availableVillas}
                            subtitle='Ready for booking'
                            icon='✅'
                            color='green'
                        />
                        <StatCard
                            title='Unavailable Villas'
                            value={stats.villas.unavailableVillas}
                            subtitle='Temporarily closed'
                            icon='🚫'
                            color='yellow'
                        />
                        <StatCard
                            title='Under Maintenance'
                            value={stats.villas.maintenanceVillas}
                            subtitle='Being serviced'
                            icon='🔧'
                            color='red'
                        />
                    </div>
                </div>

                {/* Service Overview */}
                {stats.services.totalServices > 0 && (
                    <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                        <h2 className='text-lg font-semibold text-[#C75D2C] font-butler mb-4 flex items-center'>
                            <span className='text-xl mr-2'>🛎️</span>
                            Service Overview
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <StatCard
                                title='Total Services'
                                value={stats.services.totalServices}
                                subtitle='Available add-ons'
                                icon='🛎️'
                                color='blue'
                            />
                            <StatCard
                                title='Featured Services'
                                value={stats.services.featuredServices}
                                subtitle='Highlighted offerings'
                                icon='⭐'
                                color='yellow'
                            />
                        </div>
                    </div>
                )}

                {/* Recent Bookings */}
                {stats.bookings.recentBookings.length > 0 && (
                    <RecentBookingsTable bookings={stats.bookings.recentBookings} />
                )}

                {/* Top Performers */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    {/* {stats.villas.topVillas.length > 0 && (
                        <TopItemsList
                            title='Top Performing Villas'
                            items={stats.villas.topVillas}
                            type='villa'
                            icon={<Home className='w-5 h-5 mr-2' />}
                        />
                    )} */}

                    {stats.users.topGuests.length > 0 && (
                        <TopItemsList
                            title='Top Guests'
                            items={stats.users.topGuests}
                            type='guest'
                            icon={<Users className='w-5 h-5 mr-2' />}
                        />
                    )}

                    {stats.services.topServices.length > 0 && (
                        <TopItemsList
                            title='Top Services'
                            items={stats.services.topServices}
                            type='service'
                            icon={<span className='text-xl mr-2'>🛎️</span>}
                        />
                    )}
                </div>

                {/* Payment Methods & Destinations */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    {stats.trends.paymentMethods.length > 0 && (
                        <PaymentMethodsChart paymentMethods={stats.trends.paymentMethods} />
                    )}

                    {stats.trends.popularDestinations.length > 0 && (
                        <PopularDestinations destinations={stats.trends.popularDestinations} />
                    )}
                </div>
            </div>
        </div>
    );
};
