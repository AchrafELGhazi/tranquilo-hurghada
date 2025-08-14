import { Role } from '@prisma/client';
import prisma from '../config/database';
import {
    calculatePercentageChange,
    getDateRanges,
    calculateAverageStay,
    getTopPerforming,
    calculateOccupancyRate
} from '../utils/stats.utils';

interface DashboardStats {
    overview: {
        totalUsers: number;
        totalVillas: number;
        totalBookings: number;
        totalRevenue: number;
        revenueThisMonth: number;
        revenueLastMonth: number;
        revenueGrowth: number;
    };
    users: {
        totalUsers: number;
        activeUsers: number;
        newUsersThisMonth: number;
        newUsersLastMonth: number;
        userGrowth: number;
        usersByRole: {
            guests: number;
            hosts: number;
            admins: number;
        };
        topGuests: Array<{
            id: string;
            fullName: string;
            email: string;
            totalBookings: number;
            totalSpent: number;
        }>;
    };
    villas: {
        totalVillas: number;
        availableVillas: number;
        unavailableVillas: number;
        maintenanceVillas: number;
        newVillasThisMonth: number;
        averagePricePerNight: number;
        topVillas: Array<{
            id: string;
            title: string;
            city: string;
            totalBookings: number;
            totalRevenue: number;
            occupancyRate: number;
        }>;
        villasByCity: Array<{
            city: string;
            count: number;
            averagePrice: number;
        }>;
    };
    bookings: {
        totalBookings: number;
        pendingBookings: number;
        confirmedBookings: number;
        cancelledBookings: number;
        rejectedBookings: number;
        completedBookings: number;
        bookingsThisMonth: number;
        bookingsLastMonth: number;
        bookingGrowth: number;
        averageBookingValue: number;
        averageStayDuration: number;
        occupancyRate: number;
        recentBookings: Array<{
            id: string;
            guestName: string;
            villaTitle: string;
            checkIn: Date;
            checkOut: Date;
            status: string;
            totalPrice: number;
        }>;
        bookingsByStatus: {
            pending: number;
            confirmed: number;
            cancelled: number;
            rejected: number;
            completed: number;
        };
        monthlyBookings: Array<{
            month: string;
            year: number;
            bookings: number;
            revenue: number;
        }>;
    };
    services: {
        totalServices: number;
        featuredServices: number;
        servicesByCategory: Array<{
            category: string;
            count: number;
            totalRevenue: number;
        }>;
        topServices: Array<{
            id: string;
            title: string;
            category: string;
            bookings: number;
            revenue: number;
        }>;
    };
    financial: {
        totalRevenue: number;
        villaRevenue: number;
        serviceRevenue: number;
        monthlyRevenue: Array<{
            month: string;
            year: number;
            revenue: number;
        }>;
        averageRevenuePerBooking: number;
        totalCommissions: number;
        pendingPayments: number;
    };
    trends: {
        popularDestinations: Array<{
            city: string;
            bookings: number;
            growth: number;
        }>;
        seasonalTrends: Array<{
            month: number;
            monthName: string;
            bookings: number;
            revenue: number;
        }>;
        paymentMethods: Array<{
            method: string;
            count: number;
            percentage: number;
        }>;
    };
}

export const getComprehensiveStats = async (
    userId: string,
    userRole: Role
): Promise<DashboardStats> => {
    const { startOfThisMonth, endOfThisMonth, startOfLastMonth, endOfLastMonth } = getDateRanges();

    // Base filters for role-based access
    const isAdmin = userRole === 'ADMIN';
    const isHost = userRole === 'HOST';

    const villaFilter = isAdmin ? {} : isHost ? { ownerId: userId } : {};
    const bookingFilter = isAdmin ? {} : isHost ? { villa: { ownerId: userId } } : { guestId: userId };

    try {
        // User Statistics (Admin only)
        const userStats = isAdmin ? await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { isActive: true } }),
            prisma.user.count({
                where: {
                    createdAt: { gte: startOfThisMonth, lte: endOfThisMonth }
                }
            }),
            prisma.user.count({
                where: {
                    createdAt: { gte: startOfLastMonth, lt: startOfThisMonth }
                }
            }),
            prisma.user.groupBy({
                by: ['role'],
                _count: { role: true }
            }),
            prisma.user.findMany({
                where: { role: 'GUEST' },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    guestBookings: {
                        select: {
                            totalPrice: true
                        }
                    }
                },
                take: 5
            })
        ]) : [0, 0, 0, 0, [], []];

        // Villa Statistics
        const villaStats = await Promise.all([
            prisma.villa.count({ where: { ...villaFilter, isActive: true } }),
            prisma.villa.groupBy({
                by: ['status'],
                where: { ...villaFilter, isActive: true },
                _count: { status: true }
            }),
            prisma.villa.count({
                where: {
                    ...villaFilter,
                    isActive: true,
                    createdAt: { gte: startOfThisMonth, lte: endOfThisMonth }
                }
            }),
            prisma.villa.aggregate({
                where: { ...villaFilter, isActive: true },
                _avg: { pricePerNight: true }
            }),
            prisma.villa.findMany({
                where: { ...villaFilter, isActive: true },
                select: {
                    id: true,
                    title: true,
                    city: true,
                    pricePerNight: true,
                    bookings: {
                        where: { status: 'COMPLETED' },
                        select: { totalPrice: true, checkIn: true, checkOut: true }
                    }
                }
            }),
            prisma.villa.groupBy({
                by: ['city'],
                where: { ...villaFilter, isActive: true },
                _count: { city: true },
                _avg: { pricePerNight: true }
            })
        ]);

        // Booking Statistics
        const bookingStats = await Promise.all([
            prisma.booking.count({ where: bookingFilter }),
            prisma.booking.groupBy({
                by: ['status'],
                where: bookingFilter,
                _count: { status: true }
            }),
            prisma.booking.count({
                where: {
                    ...bookingFilter,
                    createdAt: { gte: startOfThisMonth, lte: endOfThisMonth }
                }
            }),
            prisma.booking.count({
                where: {
                    ...bookingFilter,
                    createdAt: { gte: startOfLastMonth, lt: startOfThisMonth }
                }
            }),
            prisma.booking.findMany({
                where: bookingFilter,
                select: {
                    id: true,
                    checkIn: true,
                    checkOut: true,
                    status: true,
                    totalPrice: true,
                    guest: { select: { fullName: true } },
                    villa: { select: { title: true } }
                },
                orderBy: { createdAt: 'desc' },
                take: 10
            }),
            prisma.booking.aggregate({
                where: bookingFilter,
                _avg: { totalPrice: true }
            }),
            prisma.booking.findMany({
                where: bookingFilter,
                select: {
                    checkIn: true,
                    checkOut: true,
                    totalPrice: true,
                    status: true,
                    createdAt: true,
                    villa: { select: { city: true } }
                }
            })
        ]);

        // Service Statistics
        const serviceStats = await Promise.all([
            prisma.service.count({ where: { isActive: true } }),
            prisma.service.count({ where: { isFeatured: true, isActive: true } }),
            prisma.service.groupBy({
                by: ['category'],
                where: { isActive: true },
                _count: { category: true }
            }),
            prisma.service.findMany({
                where: { isActive: true },
                select: {
                    id: true,
                    title: true,
                    category: true,
                    bookingServices: {
                        select: {
                            quantity: true
                        }
                    }
                },
                take: 10
            })
        ]);

        // Financial Statistics (Villa revenue only from completed bookings)
        const financialStats = await Promise.all([
            prisma.booking.aggregate({
                where: { ...bookingFilter, status: 'COMPLETED' },
                _sum: { totalPrice: true }
            }),
            prisma.booking.aggregate({
                where: { ...bookingFilter, isPaid: false },
                _sum: { totalPrice: true }
            }),
            prisma.booking.groupBy({
                by: ['paymentMethod'],
                where: bookingFilter,
                _count: { paymentMethod: true }
            })
        ]);

        // Destructure results
        const [totalUsers, activeUsers, newUsersThisMonth, newUsersLastMonth, usersByRole, topGuestsData] = userStats;
        const [totalVillas, villasByStatus, newVillasThisMonth, averagePriceData, topVillasData, villasByCity] = villaStats;
        const [totalBookings, bookingsByStatus, bookingsThisMonth, bookingsLastMonth, recentBookings, averageBookingValue, allBookings] = bookingStats;
        const [totalServices, featuredServices, servicesByCategory, topServicesData] = serviceStats;
        const [totalRevenueData, pendingPaymentsData, paymentMethodStats] = financialStats;

        // Calculate derived metrics
        const userGrowth = calculatePercentageChange(newUsersThisMonth as number, newUsersLastMonth as number);
        const bookingGrowth = calculatePercentageChange(bookingsThisMonth, bookingsLastMonth);
        const averageStayDuration = calculateAverageStay(allBookings);
        const occupancyRate = calculateOccupancyRate(allBookings);

        // Process top guests
        const processedTopGuests = Array.isArray(topGuestsData) ? topGuestsData.map(guest => ({
            ...guest,
            totalBookings: guest.guestBookings.length,
            totalSpent: guest.guestBookings.reduce((sum, booking) => sum + Number(booking.totalPrice), 0)
        })).slice(0, 5) : [];

        // Process top villas
        const processedTopVillas = getTopPerforming(topVillasData, 'revenue').slice(0, 5);

        // Process top services (by booking count since no pricing)
        const processedTopServices = topServicesData.map(service => ({
            id: service.id,
            title: service.title,
            category: service.category,
            bookings: service.bookingServices.length,
            revenue: 0 // No revenue calculation since services don't have pricing
        })).sort((a, b) => b.bookings - a.bookings).slice(0, 5);

        // Process monthly data
        const monthlyData = allBookings.reduce((acc: any[], booking: any) => {
            const date = new Date(booking.createdAt);
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            const existing = acc.find(item => item.key === key);

            if (existing) {
                existing.bookings += 1;
                existing.revenue += Number(booking.totalPrice);
            } else {
                acc.push({
                    key,
                    month: date.toLocaleDateString('en-US', { month: 'long' }),
                    year: date.getFullYear(),
                    bookings: 1,
                    revenue: Number(booking.totalPrice)
                });
            }
            return acc;
        }, []);

        // Calculate seasonal trends
        const seasonalTrends = Array.from({ length: 12 }, (_, i) => {
            const monthBookings = allBookings.filter(booking =>
                new Date(booking.checkIn).getMonth() === i
            );
            return {
                month: i + 1,
                monthName: new Date(0, i).toLocaleDateString('en-US', { month: 'long' }),
                bookings: monthBookings.length,
                revenue: monthBookings.reduce((sum, booking) => sum + Number(booking.totalPrice), 0)
            };
        });

        // Calculate revenue metrics (Villa revenue only from completed bookings)
        const totalRevenue = Number(totalRevenueData._sum.totalPrice || 0);
        const pendingPayments = Number(pendingPaymentsData._sum.totalPrice || 0);

        // Calculate this month and last month revenue from completed bookings
        const thisMonthBookings = allBookings.filter(booking =>
            booking.status === 'COMPLETED' &&
            new Date(booking.createdAt) >= startOfThisMonth &&
            new Date(booking.createdAt) <= endOfThisMonth
        );
        const lastMonthBookings = allBookings.filter(booking =>
            booking.status === 'COMPLETED' &&
            new Date(booking.createdAt) >= startOfLastMonth &&
            new Date(booking.createdAt) < startOfThisMonth
        );

        const revenueThisMonth = thisMonthBookings.reduce((sum, booking) => sum + Number(booking.totalPrice), 0);
        const revenueLastMonth = lastMonthBookings.reduce((sum, booking) => sum + Number(booking.totalPrice), 0);
        const revenueGrowth = calculatePercentageChange(revenueThisMonth, revenueLastMonth);

        // Build comprehensive stats object
        return {
            overview: {
                totalUsers: totalUsers as number,
                totalVillas,
                totalBookings,
                totalRevenue,
                revenueThisMonth,
                revenueLastMonth,
                revenueGrowth
            },
            users: {
                totalUsers: totalUsers as number,
                activeUsers: activeUsers as number,
                newUsersThisMonth: newUsersThisMonth as number,
                newUsersLastMonth: newUsersLastMonth as number,
                userGrowth,
                usersByRole: {
                    guests: Array.isArray(usersByRole) ? usersByRole.find(u => u.role === 'GUEST')?._count.role || 0 : 0,
                    hosts: Array.isArray(usersByRole) ? usersByRole.find(u => u.role === 'HOST')?._count.role || 0 : 0,
                    admins: Array.isArray(usersByRole) ? usersByRole.find(u => u.role === 'ADMIN')?._count.role || 0 : 0
                },
                topGuests: processedTopGuests
            },
            villas: {
                totalVillas,
                availableVillas: villasByStatus.find(v => v.status === 'AVAILABLE')?._count.status || 0,
                unavailableVillas: villasByStatus.find(v => v.status === 'UNAVAILABLE')?._count.status || 0,
                maintenanceVillas: villasByStatus.find(v => v.status === 'MAINTENANCE')?._count.status || 0,
                newVillasThisMonth,
                averagePricePerNight: Number(averagePriceData._avg.pricePerNight || 0),
                topVillas: processedTopVillas,
                villasByCity: villasByCity.map(city => ({
                    city: city.city,
                    count: city._count.city,
                    averagePrice: Number(city._avg.pricePerNight || 0)
                }))
            },
            bookings: {
                totalBookings,
                pendingBookings: bookingsByStatus.find(b => b.status === 'PENDING')?._count.status || 0,
                confirmedBookings: bookingsByStatus.find(b => b.status === 'CONFIRMED')?._count.status || 0,
                cancelledBookings: bookingsByStatus.find(b => b.status === 'CANCELLED')?._count.status || 0,
                rejectedBookings: bookingsByStatus.find(b => b.status === 'REJECTED')?._count.status || 0,
                completedBookings: bookingsByStatus.find(b => b.status === 'COMPLETED')?._count.status || 0,
                bookingsThisMonth,
                bookingsLastMonth,
                bookingGrowth,
                averageBookingValue: Number(averageBookingValue._avg.totalPrice || 0),
                averageStayDuration,
                occupancyRate,
                recentBookings: recentBookings.map(booking => ({
                    id: booking.id,
                    guestName: booking.guest.fullName,
                    villaTitle: booking.villa.title,
                    checkIn: booking.checkIn,
                    checkOut: booking.checkOut,
                    status: booking.status,
                    totalPrice: Number(booking.totalPrice)
                })),
                bookingsByStatus: {
                    pending: bookingsByStatus.find(b => b.status === 'PENDING')?._count.status || 0,
                    confirmed: bookingsByStatus.find(b => b.status === 'CONFIRMED')?._count.status || 0,
                    cancelled: bookingsByStatus.find(b => b.status === 'CANCELLED')?._count.status || 0,
                    rejected: bookingsByStatus.find(b => b.status === 'REJECTED')?._count.status || 0,
                    completed: bookingsByStatus.find(b => b.status === 'COMPLETED')?._count.status || 0
                },
                monthlyBookings: monthlyData
            },
            services: {
                totalServices,
                featuredServices,
                servicesByCategory: servicesByCategory.map(cat => ({
                    category: cat.category,
                    count: cat._count.category,
                    totalRevenue: 0 // Calculate from bookingServices if needed
                })),
                topServices: processedTopServices
            },
            financial: {
                totalRevenue, // All-time villa revenue from completed bookings
                villaRevenue: totalRevenue, // Same as total since we only count villa revenue
                serviceRevenue: 0, // No service revenue calculation
                monthlyRevenue: monthlyData.map(item => ({
                    month: item.month,
                    year: item.year,
                    revenue: item.revenue
                })),
                averageRevenuePerBooking: Number(averageBookingValue._avg.totalPrice || 0),
                totalCommissions: totalRevenue * 0.1, // 10% commission on villa revenue
                pendingPayments
            },
            trends: {
                popularDestinations: villasByCity.map(city => ({
                    city: city.city,
                    bookings: city._count.city,
                    growth: 0 // Would need historical data to calculate
                })).slice(0, 5),
                seasonalTrends,
                paymentMethods: paymentMethodStats.map(method => {
                    const total = paymentMethodStats.reduce((sum, m) => sum + m._count.paymentMethod, 0);
                    return {
                        method: method.paymentMethod,
                        count: method._count.paymentMethod,
                        percentage: total > 0 ? (method._count.paymentMethod / total) * 100 : 0
                    };
                })
            }
        };

    } catch (error) {
        console.error('Error fetching comprehensive stats:', error);
        throw new Error('Failed to fetch dashboard statistics');
    }
};