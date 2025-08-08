import type { Language } from "./types";

export const supportedLanguages = ['en', 'fr', 'ru', 'de'] as const;

export const languages: Language[] = [
    {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇺🇸',
        rtl: false,
    },
    {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        flag: '🇫🇷',
        rtl: false,
    },
    {
        code: 'ru',
        name: 'Russian',
        nativeName: 'Русский',
        flag: '🇷🇺',
        rtl: false,
    },
    {
        code: 'de',
        name: 'German',
        nativeName: 'Deutsch',
        flag: '🇩🇪',
        rtl: false,
    },
];

export const mottos = [
    'The Gateway to Your Hurghada Adventure',
    'From Desert Dunes to Coral Reefs—Start Here',
    'Your Red Sea Escape Awaits',
    'Paradise found in Hurghada',
];

export const colorMap = {
    PENDING: '#f59e0b',
    CONFIRMED: '#10b981',
    COMPLETED: '#059669',
    CANCELLED: '#6b7280',
    REJECTED: '#ef4444'
};

export const statusMap = {
    PENDING: 'Pending Approval',
    CONFIRMED: 'Confirmed',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    REJECTED: 'Rejected'
};

export const POPULAR_AMENITIES = [
    'wifi',
    'pool',
    'parking',
    'kitchen',
    'air_conditioning',
    'heating',
    'tv',
    'washing_machine',
    'dishwasher',
    'balcony',
    'garden',
    'terrace',
    'gym',
    'spa',
    'bbq',
    'fireplace',
    'hot_tub',
    'beach_access',
    'mountain_view',
    'city_view'
];

export const POPULAR_CITIES = [
    'Marrakech',
    'Casablanca',
    'Fez',
    'Rabat',
    'Agadir',
    'Tangier',
    'Meknes',
    'Ouarzazate',
    'Essaouira',
    'Chefchaouen'
];
