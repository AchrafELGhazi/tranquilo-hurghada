
export const calculateNights = (checkIn: string, checkOut: string): number => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};


export const calculateTotalPrice = (pricePerNight: number, checkIn: string, checkOut: string): number => {
    const nights = calculateNights(checkIn, checkOut);
    return pricePerNight * nights;
};


export const formatPrice = (price: number, currency: string = 'EUR'): string => {
    const currencyOptions: Record<string, { locale: string; currency: string }> = {
        MAD: { locale: 'ar-MA', currency: 'MAD' },
        USD: { locale: 'en-US', currency: 'USD' },
        EUR: { locale: 'en-GB', currency: 'EUR' }
    };

    const options = currencyOptions[currency] || currencyOptions.MAD;

    return new Intl.NumberFormat(options.locale, {
        style: 'currency',
        currency: options.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};