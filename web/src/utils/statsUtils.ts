/**
 * Utility functions for statistics formatting and calculations
 */

/**
 * Format currency values
 */
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2
    }).format(amount);
};

/**
 * Format percentage values
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`;
};

/**
 * Format numbers with commas
 */
export const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Get status color based on booking status
 */
export const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
        'PENDING': '#f59e0b',
        'CONFIRMED': '#10b981',
        'CANCELLED': '#ef4444',
        'REJECTED': '#f87171',
        'COMPLETED': '#059669'
    };
    return statusColors[status.toUpperCase()] || '#6b7280';
};

/**
 * Get growth trend direction
 */
export const getGrowthTrend = (growth: number): 'up' | 'down' | 'stable' => {
    if (growth > 0) return 'up';
    if (growth < 0) return 'down';
    return 'stable';
};

/**
 * Get trend icon based on growth value
 */
export const getTrendIcon = (trendValue?: number): string | null => {
    if (!trendValue) return null;
    return trendValue > 0 ? '↗️' : trendValue < 0 ? '↘️' : '➡️';
};

/**
 * Get trend color based on growth value
 */
export const getTrendColor = (trendValue?: number): string => {
    if (!trendValue) return '';
    return trendValue > 0 ? 'text-green-600' : trendValue < 0 ? 'text-red-600' : 'text-gray-600';
};

/**
 * Calculate conversion rate
 */
export const calculateConversionRate = (completed: number, total: number): number => {
    if (total === 0) return 0;
    return Number(((completed / total) * 100).toFixed(2));
};

/**
 * Format date to readable string
 */
export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};