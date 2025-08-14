export const calculatePercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number(((current - previous) / previous * 100).toFixed(2));
};

export const formatCurrency = (amount: number, currency = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2
    }).format(amount);
};

export const getDateRanges = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const startOfThisMonth = new Date(currentYear, currentMonth, 1);
    const endOfThisMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
    const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfLastMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    const startOfThisYear = new Date(currentYear, 0, 1);
    const endOfThisYear = new Date(currentYear, 11, 31, 23, 59, 59);
    const startOfLastYear = new Date(currentYear - 1, 0, 1);
    const endOfLastYear = new Date(currentYear - 1, 11, 31, 23, 59, 59);

    return {
        startOfThisMonth,
        endOfThisMonth,
        startOfLastMonth,
        endOfLastMonth,
        startOfThisYear,
        endOfThisYear,
        startOfLastYear,
        endOfLastYear
    };
};

export const calculateAverageStay = (bookings: any[]): number => {
    if (!bookings.length) return 0;

    const totalDays = bookings.reduce((sum, booking) => {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
    }, 0);

    return Number((totalDays / bookings.length).toFixed(2));
};

export const calculateOccupancyRate = (bookings: any[]): number => {
    if (!bookings.length) return 0;

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const daysInYear = Math.ceil((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));

    const occupiedDays = bookings
        .filter(booking => booking.status === 'CONFIRMED' || booking.status === 'COMPLETED')
        .reduce((sum, booking) => {
            const checkIn = new Date(booking.checkIn);
            const checkOut = new Date(booking.checkOut);
            const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
            return sum + days;
        }, 0);

    return Number(((occupiedDays / daysInYear) * 100).toFixed(2));
};

export const getTopPerforming = (items: any[], sortBy = 'revenue', limit = 5): any[] => {
    return items
        .map(item => {
            if (item.bookings) {
                const totalBookings = item.bookings.length;
                const totalRevenue = item.bookings.reduce((sum: number, booking: any) =>
                    sum + Number(booking.totalPrice), 0
                );
                const occupancyRate = calculateOccupancyRate(item.bookings);

                return {
                    ...item,
                    totalBookings,
                    totalRevenue,
                    occupancyRate
                };
            }
            return item;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'bookings':
                    return b.totalBookings - a.totalBookings;
                case 'revenue':
                    return b.totalRevenue - a.totalRevenue;
                case 'occupancy':
                    return b.occupancyRate - a.occupancyRate;
                default:
                    return 0;
            }
        })
        .slice(0, limit);
};

export const calculateRevenue = (bookings: any[], services: any[] = []): number => {
    const bookingRevenue = bookings.reduce((sum, booking) => sum + Number(booking.totalPrice), 0);
    const serviceRevenue = services.reduce((sum, service) => sum + Number(service.totalPrice), 0);
    return bookingRevenue + serviceRevenue;
};

export const getMonthlyData = (data: any[], dateField = 'createdAt'): any[] => {
    const monthlyMap = new Map();

    data.forEach(item => {
        const date = new Date(item[dateField]);
        const key = `${date.getFullYear()}-${date.getMonth()}`;

        if (!monthlyMap.has(key)) {
            monthlyMap.set(key, {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                monthName: date.toLocaleDateString('en-US', { month: 'long' }),
                count: 0,
                revenue: 0
            });
        }

        const monthData = monthlyMap.get(key);
        monthData.count += 1;
        if (item.totalPrice) {
            monthData.revenue += Number(item.totalPrice);
        }
    });

    return Array.from(monthlyMap.values()).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
    });
};

export const calculateConversionRate = (completed: number, total: number): number => {
    if (total === 0) return 0;
    return Number(((completed / total) * 100).toFixed(2));
};

export const getSeasonalTrends = (bookings: any[]): any[] => {
    const seasons = {
        'Spring': [2, 3, 4], // Mar, Apr, May
        'Summer': [5, 6, 7], // Jun, Jul, Aug
        'Autumn': [8, 9, 10], // Sep, Oct, Nov
        'Winter': [11, 0, 1]  // Dec, Jan, Feb
    };

    const seasonalData = Object.entries(seasons).map(([season, months]) => {
        const seasonBookings = bookings.filter(booking =>
            months.includes(new Date(booking.checkIn).getMonth())
        );

        return {
            season,
            bookings: seasonBookings.length,
            revenue: seasonBookings.reduce((sum, booking) => sum + Number(booking.totalPrice), 0),
            averageBookingValue: seasonBookings.length > 0
                ? seasonBookings.reduce((sum, booking) => sum + Number(booking.totalPrice), 0) / seasonBookings.length
                : 0
        };
    });

    return seasonalData;
};

export const calculateGrowthRate = (currentPeriod: number, previousPeriod: number): {
    growth: number;
    isPositive: boolean;
    trend: 'up' | 'down' | 'stable';
} => {
    const growth = calculatePercentageChange(currentPeriod, previousPeriod);

    return {
        growth: Math.abs(growth),
        isPositive: growth >= 0,
        trend: growth > 0 ? 'up' : growth < 0 ? 'down' : 'stable'
    };
};

export const getDateRange = (period: 'week' | 'month' | 'quarter' | 'year'): {
    start: Date;
    end: Date;
} => {
    const now = new Date();
    const start = new Date();

    switch (period) {
        case 'week':
            start.setDate(now.getDate() - 7);
            break;
        case 'month':
            start.setMonth(now.getMonth() - 1);
            break;
        case 'quarter':
            start.setMonth(now.getMonth() - 3);
            break;
        case 'year':
            start.setFullYear(now.getFullYear() - 1);
            break;
    }

    return { start, end: now };
};

export const calculateAverageRating = (ratings: number[]): number => {
    if (!ratings.length) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return Number((sum / ratings.length).toFixed(2));
};

export const groupByTimeInterval = (
    data: any[],
    dateField: string,
    interval: 'day' | 'week' | 'month' | 'year' = 'month'
): any[] => {
    const grouped = new Map();

    data.forEach(item => {
        const date = new Date(item[dateField]);
        let key: string;

        switch (interval) {
            case 'day':
                key = date.toISOString().split('T')[0];
                break;
            case 'week':
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                key = weekStart.toISOString().split('T')[0];
                break;
            case 'month':
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                break;
            case 'year':
                key = date.getFullYear().toString();
                break;
        }

        if (!grouped.has(key)) {
            grouped.set(key, []);
        }
        grouped.get(key).push(item);
    });

    return Array.from(grouped.entries()).map(([period, items]) => ({
        period,
        count: items.length,
        items
    })).sort((a, b) => a.period.localeCompare(b.period));
};

export const calculateCancellationRate = (
    totalBookings: number,
    cancelledBookings: number
): number => {
    if (totalBookings === 0) return 0;
    return Number(((cancelledBookings / totalBookings) * 100).toFixed(2));
};

export const getTopCities = (villas: any[], limit = 5): any[] => {
    const cityStats = new Map();

    villas.forEach(villa => {
        const city = villa.city;
        if (!cityStats.has(city)) {
            cityStats.set(city, {
                city,
                count: 0,
                averagePrice: 0,
                totalRevenue: 0,
                bookings: 0
            });
        }

        const stats = cityStats.get(city);
        stats.count += 1;
        stats.averagePrice = (stats.averagePrice * (stats.count - 1) + Number(villa.pricePerNight)) / stats.count;

        if (villa.bookings) {
            stats.bookings += villa.bookings.length;
            stats.totalRevenue += villa.bookings.reduce((sum: number, booking: any) =>
                sum + Number(booking.totalPrice), 0
            );
        }
    });

    return Array.from(cityStats.values())
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, limit);
};

export const calculateMetrics = (data: any[]): {
    total: number;
    average: number;
    median: number;
    min: number;
    max: number;
} => {
    if (!data.length) {
        return { total: 0, average: 0, median: 0, min: 0, max: 0 };
    }

    const numbers = data.map(item => Number(item)).filter(num => !isNaN(num));
    const sorted = numbers.sort((a, b) => a - b);

    const total = numbers.reduce((sum, num) => sum + num, 0);
    const average = total / numbers.length;
    const median = numbers.length % 2 === 0
        ? (sorted[numbers.length / 2 - 1] + sorted[numbers.length / 2]) / 2
        : sorted[Math.floor(numbers.length / 2)];

    return {
        total: Number(total.toFixed(2)),
        average: Number(average.toFixed(2)),
        median: Number(median.toFixed(2)),
        min: sorted[0] || 0,
        max: sorted[sorted.length - 1] || 0
    };
};

export const formatPercentage = (value: number, decimals = 1): string => {
    return `${value.toFixed(decimals)}%`;
};

export const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-US').format(value);
};

export const calculateDaysBetween = (startDate: Date, endDate: Date): number => {
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

export const getQuarterFromDate = (date: Date): number => {
    return Math.floor(date.getMonth() / 3) + 1;
};

export const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
    return date >= startDate && date <= endDate;
};