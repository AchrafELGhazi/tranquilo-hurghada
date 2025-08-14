import apiService from "@/utils/api";

// Overview Statistics Interface
export interface OverviewStats {
    totalUsers: number;
    totalVillas: number;
    totalBookings: number;
    totalRevenue: number;
    revenueThisMonth: number;
    revenueLastMonth: number;
    revenueGrowth: number;
}

// User Statistics Interfaces
export interface UsersByRole {
    guests: number;
    hosts: number;
    admins: number;
}

export interface TopGuest {
    id: string;
    fullName: string;
    email: string;
    totalBookings: number;
    totalSpent: number;
}

export interface UserStats {
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    newUsersLastMonth: number;
    userGrowth: number;
    usersByRole: UsersByRole;
    topGuests: TopGuest[];
}

// Villa Statistics Interfaces
export interface TopVilla {
    id: string;
    title: string;
    city: string;
    totalBookings: number;
    totalRevenue: number;
    occupancyRate: number;
}

export interface VillaByCity {
    city: string;
    count: number;
    averagePrice: number;
}

export interface VillaStats {
    totalVillas: number;
    availableVillas: number;
    unavailableVillas: number;
    maintenanceVillas: number;
    newVillasThisMonth: number;
    averagePricePerNight: number;
    topVillas: TopVilla[];
    villasByCity: VillaByCity[];
}

// Booking Statistics Interfaces
export interface RecentBooking {
    id: string;
    guestName: string;
    villaTitle: string;
    checkIn: Date;
    checkOut: Date;
    status: string;
    totalPrice: number;
}

export interface BookingsByStatus {
    pending: number;
    confirmed: number;
    cancelled: number;
    rejected: number;
    completed: number;
}

export interface MonthlyBooking {
    month: string;
    year: number;
    bookings: number;
    revenue: number;
}

export interface BookingStats {
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
    recentBookings: RecentBooking[];
    bookingsByStatus: BookingsByStatus;
    monthlyBookings: MonthlyBooking[];
}

// Service Statistics Interfaces
export interface ServiceByCategory {
    category: string;
    count: number;
    totalRevenue: number;
}

export interface TopService {
    id: string;
    title: string;
    category: string;
    bookings: number;
    revenue: number;
}

export interface ServiceStats {
    totalServices: number;
    featuredServices: number;
    servicesByCategory: ServiceByCategory[];
    topServices: TopService[];
}

// Financial Statistics Interfaces
export interface MonthlyRevenue {
    month: string;
    year: number;
    revenue: number;
}

export interface FinancialStats {
    totalRevenue: number;
    villaRevenue: number;
    serviceRevenue: number;
    monthlyRevenue: MonthlyRevenue[];
    averageRevenuePerBooking: number;
    totalCommissions: number;
    pendingPayments: number;
}

// Trends Statistics Interfaces
export interface PopularDestination {
    city: string;
    bookings: number;
    growth: number;
}

export interface SeasonalTrend {
    month: number;
    monthName: string;
    bookings: number;
    revenue: number;
}

export interface PaymentMethod {
    method: string;
    count: number;
    percentage: number;
}

export interface TrendsStats {
    popularDestinations: PopularDestination[];
    seasonalTrends: SeasonalTrend[];
    paymentMethods: PaymentMethod[];
}

// Main Dashboard Statistics Interface
export interface DashboardStats {
    overview: OverviewStats;
    users: UserStats;
    villas: VillaStats;
    bookings: BookingStats;
    services: ServiceStats;
    financial: FinancialStats;
    trends: TrendsStats;
}

// API Response Interface
export interface StatsResponse {
    success: boolean;
    message: string;
    data: DashboardStats;
}

class StatsApi {
    async getDashboardStats(): Promise<StatsResponse> {
        return await apiService.get<DashboardStats>('/stats/dashboard');
    }
}

export const statsApi = new StatsApi();
export default statsApi;