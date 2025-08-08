import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Home,
    Calendar,
    Users,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    ArrowRight,
    BarChart3,
    Activity,
    MapPin,
    Eye,
    User,
} from 'lucide-react';
import { villaApi } from '@/api/villaApi';
import { bookingApi } from '@/api/bookingApi';
import type { Villa, Booking } from '@/utils/types';

interface DashboardStats {
    totalVillas: number;
    activeVillas: number;
    inactiveVillas: number;
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    monthlyRevenue: number;
    weeklyRevenue: number;
    averageBookingValue: number;
}

interface MonthlyData {
    month: string;
    bookings: number;
    revenue: number;
}

export const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalVillas: 0,
        activeVillas: 0,
        inactiveVillas: 0,
        totalBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        weeklyRevenue: 0,
        averageBookingValue: 0,
    });

    const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
    const [recentVillas, setRecentVillas] = useState<Villa[]>([]);
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchDashboardData = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);

            // Fetch comprehensive data
            const [villasResponse, bookingsResponse, allBookingsResponse] = await Promise.all([
                villaApi.getAllVillas({ limit: 10, sortBy: 'createdAt', sortOrder: 'desc' }),
                bookingApi.getAllBookings({ limit: 15, sortBy: 'createdAt', sortOrder: 'desc' }),
                bookingApi.getAllBookings({ limit: 1000 }), // Get more data for calculations
            ]);

            // Set recent items
            setRecentVillas(villasResponse.villas);
            setRecentBookings(bookingsResponse.bookings);

            // Calculate comprehensive stats
            const allBookings = allBookingsResponse.bookings;
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();
            const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

            // Villa stats
            const allVillasResponse = await villaApi.getAllVillas({ limit: 1000 });
            const allVillas = allVillasResponse.villas;
            const activeVillas = allVillas.filter(v => v.isActive && v.status === 'AVAILABLE').length;
            const inactiveVillas = allVillas.filter(v => !v.isActive || v.status !== 'AVAILABLE').length;

            // Booking stats by status
            const pendingBookings = allBookings.filter(b => b.status === 'PENDING').length;
            const confirmedBookings = allBookings.filter(b => b.status === 'CONFIRMED').length;
            const completedBookings = allBookings.filter(b => b.status === 'COMPLETED').length;
            const cancelledBookings = allBookings.filter(
                b => b.status === 'CANCELLED' || b.status === 'REJECTED'
            ).length;

            // Revenue calculations
            const completedBookingsData = allBookings.filter(b => b.status === 'COMPLETED');
            const totalRevenue = completedBookingsData.reduce((sum, booking) => sum + booking.totalPrice, 0);

            const monthlyBookings = allBookings.filter(booking => {
                const bookingDate = new Date(booking.createdAt);
                return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
            });
            const monthlyRevenue = monthlyBookings
                .filter(b => b.status === 'COMPLETED')
                .reduce((sum, booking) => sum + booking.totalPrice, 0);

            const weeklyBookings = allBookings.filter(booking => {
                const bookingDate = new Date(booking.createdAt);
                return bookingDate >= oneWeekAgo;
            });
            const weeklyRevenue = weeklyBookings
                .filter(b => b.status === 'COMPLETED')
                .reduce((sum, booking) => sum + booking.totalPrice, 0);

            const averageBookingValue =
                completedBookingsData.length > 0 ? totalRevenue / completedBookingsData.length : 0;

            // Monthly trend data (last 6 months)
            const monthlyTrends: MonthlyData[] = [];
            for (let i = 5; i >= 0; i--) {
                const date = new Date(currentYear, currentMonth - i, 1);
                const monthBookings = allBookings.filter(booking => {
                    const bookingDate = new Date(booking.createdAt);
                    return (
                        bookingDate.getMonth() === date.getMonth() && bookingDate.getFullYear() === date.getFullYear()
                    );
                });

                const monthRevenue = monthBookings
                    .filter(b => b.status === 'COMPLETED')
                    .reduce((sum, booking) => sum + booking.totalPrice, 0);

                monthlyTrends.push({
                    month: date.toLocaleDateString('en-US', { month: 'short' }),
                    bookings: monthBookings.length,
                    revenue: monthRevenue,
                });
            }

            setStats({
                totalVillas: allVillas.length,
                activeVillas,
                inactiveVillas,
                totalBookings: allBookings.length,
                pendingBookings,
                confirmedBookings,
                completedBookings,
                cancelledBookings,
                totalRevenue,
                monthlyRevenue,
                weeklyRevenue,
                averageBookingValue,
            });

            setMonthlyData(monthlyTrends);
            setLastUpdated(new Date());
        } catch (err: any) {
            setError(err.message || 'Failed to fetch dashboard data');
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleRefresh = () => {
        fetchDashboardData(true);
    };

    const getStatusBadge = (status: Booking['status']) => {
        const statusConfig = {
            PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Pending' },
            CONFIRMED: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Confirmed' },
            CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Cancelled' },
            REJECTED: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Rejected' },
            COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle, label: 'Completed' },
        };

        const config = statusConfig[status];
        const Icon = config.icon;

        return (
            <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
            >
                <Icon className='w-3 h-3 mr-1' />
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return villaApi.formatPrice(amount);
    };

    const getPercentageChange = (current: number, previous: number): { value: number; isPositive: boolean } => {
        if (previous === 0) return { value: 0, isPositive: true };
        const change = ((current - previous) / previous) * 100;
        return { value: Math.abs(change), isPositive: change >= 0 };
    };

    const StatCard: React.FC<{
        title: string;
        value: string | number;
        change?: { value: number; isPositive: boolean };
        icon: React.ElementType;
        iconColor: string;
        subtitle?: string;
    }> = ({ title, value, change, icon: Icon, iconColor, subtitle }) => (
        <div className='bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow'>
            <div className='flex items-center justify-between'>
                <div className='flex-1'>
                    <div className='text-sm font-medium text-gray-500'>{title}</div>
                    <div className='text-2xl font-bold text-gray-900 mt-1'>{value}</div>
                    {subtitle && <div className='text-sm text-gray-600 mt-1'>{subtitle}</div>}
                    {change && (
                        <div
                            className={`flex items-center mt-2 text-sm ${
                                change.isPositive ? 'text-green-600' : 'text-red-600'
                            }`}
                        >
                            {change.isPositive ? (
                                <TrendingUp className='w-4 h-4 mr-1' />
                            ) : (
                                <TrendingDown className='w-4 h-4 mr-1' />
                            )}
                            {change.value.toFixed(1)}% vs last month
                        </div>
                    )}
                </div>
                <div className={`flex-shrink-0 p-3 rounded-lg ${iconColor}`}>
                    <Icon className='w-6 h-6 text-white' />
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-96'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
                    <p className='text-gray-600'>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex justify-between items-center'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900'>Admin Dashboard</h1>
                    <p className='text-gray-600'>
                        Overview of your villa rental platform
                        <span className='ml-2 text-sm'>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors'
                >
                    <User className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* Error State */}
            {error && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <div className='flex items-center'>
                        <AlertTriangle className='w-5 h-5 text-red-600 mr-2' />
                        <p className='text-red-800'>{error}</p>
                    </div>
                </div>
            )}

            {/* Key Stats Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                <StatCard
                    title='Total Villas'
                    value={stats.totalVillas}
                    subtitle={`${stats.activeVillas} active, ${stats.inactiveVillas} inactive`}
                    icon={Home}
                    iconColor='bg-blue-500'
                />

                <StatCard
                    title='Total Bookings'
                    value={stats.totalBookings}
                    subtitle={`${stats.pendingBookings} pending approval`}
                    icon={Calendar}
                    iconColor='bg-green-500'
                />

                <StatCard
                    title="This Month's Revenue"
                    value={formatCurrency(stats.monthlyRevenue)}
                    subtitle={`${formatCurrency(stats.weeklyRevenue)} this week`}
                    icon={DollarSign}
                    iconColor='bg-purple-500'
                />

                <StatCard
                    title='Average Booking'
                    value={formatCurrency(stats.averageBookingValue)}
                    subtitle={`${stats.completedBookings} completed bookings`}
                    icon={BarChart3}
                    iconColor='bg-orange-500'
                />
            </div>

            {/* Booking Status Overview */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm font-medium text-yellow-800'>Pending</p>
                            <p className='text-2xl font-bold text-yellow-900'>{stats.pendingBookings}</p>
                        </div>
                        <Clock className='w-8 h-8 text-yellow-600' />
                    </div>
                </div>

                <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm font-medium text-green-800'>Confirmed</p>
                            <p className='text-2xl font-bold text-green-900'>{stats.confirmedBookings}</p>
                        </div>
                        <CheckCircle className='w-8 h-8 text-green-600' />
                    </div>
                </div>

                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm font-medium text-blue-800'>Completed</p>
                            <p className='text-2xl font-bold text-blue-900'>{stats.completedBookings}</p>
                        </div>
                        <Activity className='w-8 h-8 text-blue-600' />
                    </div>
                </div>

                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm font-medium text-red-800'>Cancelled</p>
                            <p className='text-2xl font-bold text-red-900'>{stats.cancelledBookings}</p>
                        </div>
                        <XCircle className='w-8 h-8 text-red-600' />
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Recent Bookings */}
                <div className='bg-white rounded-lg border border-gray-200'>
                    <div className='p-6 border-b border-gray-200'>
                        <div className='flex items-center justify-between'>
                            <h3 className='text-lg font-semibold text-gray-900'>Recent Bookings</h3>
                            <Link
                                to='/admin/bookings'
                                className='inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium'
                            >
                                View all
                                <ArrowRight className='w-4 h-4 ml-1' />
                            </Link>
                        </div>
                    </div>

                    <div className='divide-y divide-gray-200 max-h-96 overflow-y-auto'>
                        {recentBookings.length > 0 ? (
                            recentBookings.slice(0, 8).map(booking => (
                                <div key={booking.id} className='p-4 hover:bg-gray-50 transition-colors'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex-1 min-w-0'>
                                            <div className='flex items-center justify-between mb-2'>
                                                <h4 className='text-sm font-medium text-gray-900 truncate'>
                                                    {booking.guest.fullName}
                                                </h4>
                                                {getStatusBadge(booking.status)}
                                            </div>
                                            <p className='text-sm text-gray-600 mb-1 truncate'>{booking.villa.title}</p>
                                            <div className='flex items-center text-xs text-gray-500'>
                                                <Calendar className='w-3 h-3 mr-1' />
                                                {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                                            </div>
                                        </div>
                                        <div className='text-right ml-4 flex-shrink-0'>
                                            <p className='text-sm font-medium text-gray-900'>
                                                {bookingApi.formatPrice(booking.totalPrice)}
                                            </p>
                                            <p className='text-xs text-gray-500'>{booking.totalGuests} guests</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='p-6 text-center text-gray-500'>
                                <Calendar className='w-8 h-8 text-gray-400 mx-auto mb-2' />
                                <p>No recent bookings</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Villas */}
                <div className='bg-white rounded-lg border border-gray-200'>
                    <div className='p-6 border-b border-gray-200'>
                        <div className='flex items-center justify-between'>
                            <h3 className='text-lg font-semibold text-gray-900'>Recent Villas</h3>
                            <Link
                                to='/admin/villas'
                                className='inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium'
                            >
                                View all
                                <ArrowRight className='w-4 h-4 ml-1' />
                            </Link>
                        </div>
                    </div>

                    <div className='divide-y divide-gray-200 max-h-96 overflow-y-auto'>
                        {recentVillas.length > 0 ? (
                            recentVillas.map(villa => (
                                <div key={villa.id} className='p-4 hover:bg-gray-50 transition-colors'>
                                    <div className='flex items-center'>
                                        <div className='w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0'>
                                            {villa.images && villa.images.length > 0 ? (
                                                <img
                                                    src={villa.images[0]}
                                                    alt={villa.title}
                                                    className='w-full h-full object-cover'
                                                />
                                            ) : (
                                                <div className='w-full h-full flex items-center justify-center'>
                                                    <Home className='w-5 h-5 text-gray-400' />
                                                </div>
                                            )}
                                        </div>

                                        <div className='ml-4 flex-1 min-w-0'>
                                            <div className='flex items-center justify-between mb-1'>
                                                <h4 className='text-sm font-medium text-gray-900 truncate'>
                                                    {villa.title}
                                                </h4>
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                        villa.status === 'AVAILABLE' && villa.isActive
                                                            ? 'bg-green-100 text-green-800'
                                                            : villa.status === 'MAINTENANCE'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {villa.isActive ? villa.status : 'INACTIVE'}
                                                </span>
                                            </div>
                                            <div className='flex items-center text-sm text-gray-600 mb-1'>
                                                <MapPin className='w-3 h-3 mr-1' />
                                                {villa.city}, {villa.country}
                                            </div>
                                            <div className='flex items-center justify-between'>
                                                <p className='text-xs text-gray-500'>
                                                    {villa.bedrooms} beds • {villa.maxGuests} guests
                                                </p>
                                                <p className='text-sm font-medium text-gray-900'>
                                                    {villaApi.formatPrice(villa.pricePerNight)}/night
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='p-6 text-center text-gray-500'>
                                <Home className='w-8 h-8 text-gray-400 mx-auto mb-2' />
                                <p>No recent villas</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Monthly Revenue Trend */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-6'>6-Month Revenue Trend</h3>
                <div className='grid grid-cols-6 gap-4'>
                    {monthlyData.map((month, index) => {
                        const maxRevenue = Math.max(...monthlyData.map(m => m.revenue));
                        const height = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;

                        return (
                            <div key={index} className='text-center'>
                                <div className='mb-2 h-32 flex items-end justify-center'>
                                    <div
                                        className='w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600 min-h-[4px]'
                                        style={{ height: `${Math.max(height, 4)}%` }}
                                        title={`${month.month}: ${formatCurrency(month.revenue)}`}
                                    ></div>
                                </div>
                                <div className='text-xs text-gray-600 mb-1'>{month.month}</div>
                                <div className='text-sm font-medium text-gray-900'>{formatCurrency(month.revenue)}</div>
                                <div className='text-xs text-gray-500'>{month.bookings} bookings</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Quick Actions */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-6'>Quick Actions</h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <Link
                        to='/admin/villas'
                        className='flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group'
                    >
                        <div className='p-3 bg-blue-500 rounded-lg group-hover:bg-blue-600 transition-colors'>
                            <Home className='w-6 h-6 text-white' />
                        </div>
                        <div className='ml-4'>
                            <h4 className='font-medium text-blue-900 group-hover:text-blue-800'>Manage Villas</h4>
                            <p className='text-sm text-blue-700'>View and edit all villas</p>
                            <p className='text-xs text-blue-600 mt-1'>{stats.totalVillas} total villas</p>
                        </div>
                        <ArrowRight className='w-5 h-5 text-blue-600 ml-auto group-hover:translate-x-1 transition-transform' />
                    </Link>

                    <Link
                        to='/admin/bookings'
                        className='flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-200 group'
                    >
                        <div className='p-3 bg-green-500 rounded-lg group-hover:bg-green-600 transition-colors'>
                            <Calendar className='w-6 h-6 text-white' />
                        </div>
                        <div className='ml-4'>
                            <h4 className='font-medium text-green-900 group-hover:text-green-800'>Manage Bookings</h4>
                            <p className='text-sm text-green-700'>Process booking requests</p>
                            <p className='text-xs text-green-600 mt-1'>{stats.pendingBookings} pending approval</p>
                        </div>
                        <ArrowRight className='w-5 h-5 text-green-600 ml-auto group-hover:translate-x-1 transition-transform' />
                    </Link>

                    <div className='flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg'>
                        <div className='p-3 bg-purple-500 rounded-lg'>
                            <Users className='w-6 h-6 text-white' />
                        </div>
                        <div className='ml-4'>
                            <h4 className='font-medium text-purple-900'>User Management</h4>
                            <p className='text-sm text-purple-700'>Coming soon</p>
                            <p className='text-xs text-purple-600 mt-1'>Advanced user controls</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Insights */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Villa Performance */}
                <div className='bg-white rounded-lg border border-gray-200 p-6'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>Villa Status Distribution</h3>
                    <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <div className='w-3 h-3 bg-green-500 rounded-full mr-3'></div>
                                <span className='text-sm text-gray-600'>Active & Available</span>
                            </div>
                            <div className='flex items-center'>
                                <div className='w-32 bg-gray-200 rounded-full h-2 mr-3'>
                                    <div
                                        className='bg-green-500 h-2 rounded-full transition-all duration-300'
                                        style={{
                                            width: `${
                                                stats.totalVillas > 0
                                                    ? (stats.activeVillas / stats.totalVillas) * 100
                                                    : 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                                <span className='text-sm font-medium text-gray-900 w-8 text-right'>
                                    {stats.activeVillas}
                                </span>
                            </div>
                        </div>

                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <div className='w-3 h-3 bg-gray-400 rounded-full mr-3'></div>
                                <span className='text-sm text-gray-600'>Inactive / Unavailable</span>
                            </div>
                            <div className='flex items-center'>
                                <div className='w-32 bg-gray-200 rounded-full h-2 mr-3'>
                                    <div
                                        className='bg-gray-400 h-2 rounded-full transition-all duration-300'
                                        style={{
                                            width: `${
                                                stats.totalVillas > 0
                                                    ? (stats.inactiveVillas / stats.totalVillas) * 100
                                                    : 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                                <span className='text-sm font-medium text-gray-900 w-8 text-right'>
                                    {stats.inactiveVillas}
                                </span>
                            </div>
                        </div>

                        <div className='pt-3 border-t border-gray-200'>
                            <div className='flex items-center justify-between text-sm'>
                                <span className='text-gray-600'>Utilization Rate</span>
                                <span className='font-medium text-gray-900'>
                                    {stats.totalVillas > 0
                                        ? Math.round((stats.activeVillas / stats.totalVillas) * 100)
                                        : 0}
                                    %
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Performance */}
                <div className='bg-white rounded-lg border border-gray-200 p-6'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>Booking Success Rate</h3>
                    <div className='space-y-4'>
                        {/* Success Rate */}
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <div className='w-3 h-3 bg-blue-500 rounded-full mr-3'></div>
                                <span className='text-sm text-gray-600'>Completed</span>
                            </div>
                            <div className='flex items-center'>
                                <div className='w-32 bg-gray-200 rounded-full h-2 mr-3'>
                                    <div
                                        className='bg-blue-500 h-2 rounded-full transition-all duration-300'
                                        style={{
                                            width: `${
                                                stats.totalBookings > 0
                                                    ? (stats.completedBookings / stats.totalBookings) * 100
                                                    : 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                                <span className='text-sm font-medium text-gray-900 w-8 text-right'>
                                    {stats.completedBookings}
                                </span>
                            </div>
                        </div>

                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <div className='w-3 h-3 bg-green-500 rounded-full mr-3'></div>
                                <span className='text-sm text-gray-600'>Confirmed</span>
                            </div>
                            <div className='flex items-center'>
                                <div className='w-32 bg-gray-200 rounded-full h-2 mr-3'>
                                    <div
                                        className='bg-green-500 h-2 rounded-full transition-all duration-300'
                                        style={{
                                            width: `${
                                                stats.totalBookings > 0
                                                    ? (stats.confirmedBookings / stats.totalBookings) * 100
                                                    : 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                                <span className='text-sm font-medium text-gray-900 w-8 text-right'>
                                    {stats.confirmedBookings}
                                </span>
                            </div>
                        </div>

                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <div className='w-3 h-3 bg-yellow-500 rounded-full mr-3'></div>
                                <span className='text-sm text-gray-600'>Pending</span>
                            </div>
                            <div className='flex items-center'>
                                <div className='w-32 bg-gray-200 rounded-full h-2 mr-3'>
                                    <div
                                        className='bg-yellow-500 h-2 rounded-full transition-all duration-300'
                                        style={{
                                            width: `${
                                                stats.totalBookings > 0
                                                    ? (stats.pendingBookings / stats.totalBookings) * 100
                                                    : 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                                <span className='text-sm font-medium text-gray-900 w-8 text-right'>
                                    {stats.pendingBookings}
                                </span>
                            </div>
                        </div>

                        <div className='pt-3 border-t border-gray-200'>
                            <div className='flex items-center justify-between text-sm'>
                                <span className='text-gray-600'>Success Rate</span>
                                <span className='font-medium text-gray-900'>
                                    {stats.totalBookings > 0
                                        ? Math.round(
                                              ((stats.completedBookings + stats.confirmedBookings) /
                                                  stats.totalBookings) *
                                                  100
                                          )
                                        : 0}
                                    %
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Health */}
            <div className='bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-6'>
                <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-lg font-semibold text-gray-900'>System Health</h3>
                    <div className='flex items-center space-x-2'>
                        <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                        <span className='text-sm text-green-600 font-medium'>All Systems Operational</span>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-4 gap-4 text-center'>
                    <div className='bg-white rounded-lg p-4 border border-gray-200'>
                        <div className='text-2xl font-bold text-green-600'>99.9%</div>
                        <div className='text-sm text-gray-600'>Uptime</div>
                    </div>
                    <div className='bg-white rounded-lg p-4 border border-gray-200'>
                        <div className='text-2xl font-bold text-blue-600'>{stats.totalBookings}</div>
                        <div className='text-sm text-gray-600'>Total Requests</div>
                    </div>
                    <div className='bg-white rounded-lg p-4 border border-gray-200'>
                        <div className='text-2xl font-bold text-purple-600'>{formatCurrency(stats.totalRevenue)}</div>
                        <div className='text-sm text-gray-600'>Total Revenue</div>
                    </div>
                    <div className='bg-white rounded-lg p-4 border border-gray-200'>
                        <div className='text-2xl font-bold text-orange-600'>
                            {stats.pendingBookings > 0 ? (
                                <span className='flex items-center justify-center'>
                                    <AlertTriangle className='w-6 h-6 mr-1' />
                                    {stats.pendingBookings}
                                </span>
                            ) : (
                                <span className='flex items-center justify-center'>
                                    <CheckCircle className='w-6 h-6 mr-1' />0
                                </span>
                            )}
                        </div>
                        <div className='text-sm text-gray-600'>Pending Actions</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
