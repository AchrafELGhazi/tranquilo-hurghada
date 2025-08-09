import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    MapPin,
    Home,
    Compass,
    PartyPopper,
    Clock,
    Calendar,
    Phone,
    Mail,
    CheckCircle,
    XCircle,
    Info,
    Star,
    Users,
    Wifi,
    Car,
    Waves,
    Sun,
    ChevronRight,
    ArrowRight,
    Send,
} from 'lucide-react';

interface TabItem {
    id: string;
    title: string;
    icon: React.ReactNode;
    sections: Section[];
}

interface Section {
    id: string;
    title: string;
    content: React.ReactNode;
}

const PracticalInfo: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('accommodation');
    const [activeSection, setActiveSection] = useState('included');
    const [scrollY, setScrollY] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        question: '',
        howDidYouKnow: '',
    });

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const tabs: TabItem[] = [
        {
            id: 'accommodation',
            title: t('practicalInfo.tabs.accommodation'),
            icon: <Home className='w-5 h-5' />,
            sections: [
                {
                    id: 'included',
                    title: t('practicalInfo.accommodation.included.title'),
                    content: (
                        <div className='space-y-6'>
                            <div className='bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-xl'>
                                <h4 className='text-lg font-bold text-emerald-800 mb-4 flex items-center'>
                                    <CheckCircle className='w-5 h-5 mr-2' />
                                    {t('practicalInfo.accommodation.included.subtitle')}
                                </h4>
                                <ul className='space-y-3'>
                                    <li className='flex items-start space-x-3'>
                                        <CheckCircle className='w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0' />
                                        <span className='text-emerald-700'>
                                            {t('practicalInfo.accommodation.included.items.villa')}
                                        </span>
                                    </li>
                                    <li className='flex items-start space-x-3'>
                                        <CheckCircle className='w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0' />
                                        <span className='text-emerald-700'>
                                            {t('practicalInfo.accommodation.included.items.pool')}
                                        </span>
                                    </li>
                                    <li className='flex items-start space-x-3'>
                                        <CheckCircle className='w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0' />
                                        <span className='text-emerald-700'>
                                            {t('practicalInfo.accommodation.included.items.housekeeping')}
                                        </span>
                                    </li>
                                    <li className='flex items-start space-x-3'>
                                        <CheckCircle className='w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0' />
                                        <span className='text-emerald-700'>
                                            {t('practicalInfo.accommodation.included.items.wifi')}
                                        </span>
                                    </li>
                                    <li className='flex items-start space-x-3'>
                                        <CheckCircle className='w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0' />
                                        <span className='text-emerald-700'>
                                            {t('practicalInfo.accommodation.included.items.transfer')}
                                        </span>
                                    </li>
                                    <li className='flex items-start space-x-3'>
                                        <CheckCircle className='w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0' />
                                        <span className='text-emerald-700'>
                                            {t('practicalInfo.accommodation.included.items.concierge')}
                                        </span>
                                    </li>
                                    <li className='flex items-start space-x-3'>
                                        <CheckCircle className='w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0' />
                                        <span className='text-emerald-700'>
                                            {t('practicalInfo.accommodation.included.items.welcome')}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ),
                },
                {
                    id: 'not-included',
                    title: t('practicalInfo.accommodation.notIncluded.title'),
                    content: (
                        <div className='space-y-6'>
                            <div className='bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl'>
                                <h4 className='text-lg font-bold text-amber-800 mb-4 flex items-center'>
                                    <XCircle className='w-5 h-5 mr-2' />
                                    {t('practicalInfo.accommodation.notIncluded.subtitle')}
                                </h4>
                                <ul className='space-y-3'>
                                    <li className='flex items-start space-x-3'>
                                        <XCircle className='w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0' />
                                        <span className='text-amber-700'>
                                            {t('practicalInfo.accommodation.notIncluded.items.meals')}
                                        </span>
                                    </li>
                                    <li className='flex items-start space-x-3'>
                                        <XCircle className='w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0' />
                                        <span className='text-amber-700'>
                                            {t('practicalInfo.accommodation.notIncluded.items.activities')}
                                        </span>
                                    </li>
                                    <li className='flex items-start space-x-3'>
                                        <XCircle className='w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0' />
                                        <span className='text-amber-700'>
                                            {t('practicalInfo.accommodation.notIncluded.items.spa')}
                                        </span>
                                    </li>
                                    <li className='flex items-start space-x-3'>
                                        <XCircle className='w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0' />
                                        <span className='text-amber-700'>
                                            {t('practicalInfo.accommodation.notIncluded.items.transport')}
                                        </span>
                                    </li>
                                    <li className='flex items-start space-x-3'>
                                        <XCircle className='w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0' />
                                        <span className='text-amber-700'>
                                            {t('practicalInfo.accommodation.notIncluded.items.shopping')}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ),
                },
                {
                    id: 'booking-conditions',
                    title: t('practicalInfo.accommodation.bookingConditions.title'),
                    content: (
                        <div className='space-y-6'>
                            <div className='bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl'>
                                <h4 className='text-lg font-bold text-blue-800 mb-4 flex items-center'>
                                    <Info className='w-5 h-5 mr-2' />
                                    {t('practicalInfo.accommodation.bookingConditions.subtitle')}
                                </h4>
                                <div className='space-y-4 text-blue-700'>
                                    <div>
                                        <h5 className='font-semibold mb-2'>
                                            {t('practicalInfo.accommodation.bookingConditions.payment.title')}
                                        </h5>
                                        <p className='text-sm'>
                                            {t('practicalInfo.accommodation.bookingConditions.payment.details')}
                                        </p>
                                    </div>
                                    <div>
                                        <h5 className='font-semibold mb-2'>
                                            {t('practicalInfo.accommodation.bookingConditions.cancellation.title')}
                                        </h5>
                                        <p className='text-sm'>
                                            {t('practicalInfo.accommodation.bookingConditions.cancellation.details')}
                                        </p>
                                    </div>
                                    <div>
                                        <h5 className='font-semibold mb-2'>
                                            {t('practicalInfo.accommodation.bookingConditions.checkin.title')}
                                        </h5>
                                        <p className='text-sm'>
                                            {t('practicalInfo.accommodation.bookingConditions.checkin.details')}
                                        </p>
                                    </div>
                                    <div>
                                        <h5 className='font-semibold mb-2'>
                                            {t('practicalInfo.accommodation.bookingConditions.checkout.title')}
                                        </h5>
                                        <p className='text-sm'>
                                            {t('practicalInfo.accommodation.bookingConditions.checkout.details')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    id: 'house-rules',
                    title: t('practicalInfo.accommodation.houseRules.title'),
                    content: (
                        <div className='space-y-6'>
                            <div className='bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl'>
                                <h4 className='text-lg font-bold text-red-800 mb-4 flex items-center'>
                                    <Info className='w-5 h-5 mr-2' />
                                    {t('practicalInfo.accommodation.houseRules.subtitle')}
                                </h4>
                                <ul className='space-y-3 text-red-700'>
                                    <li className='flex items-start space-x-3'>
                                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0' />
                                        <span className='text-sm'>
                                            {t('practicalInfo.accommodation.houseRules.rules.smoking')}
                                        </span>
                                    </li>
                                    <li className='flex items-start space-x-3'>
                                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0' />
                                        <span className='text-sm'>
                                            {t('practicalInfo.accommodation.houseRules.rules.parties')}
                                        </span>
                                    </li>
                                    <li className='flex items-start space-x-3'>
                                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0' />
                                        <span className='text-sm'>
                                            {t('practicalInfo.accommodation.houseRules.rules.pets')}
                                        </span>
                                    </li>
                                    <li className='flex items-start space-x-3'>
                                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0' />
                                        <span className='text-sm'>
                                            {t('practicalInfo.accommodation.houseRules.rules.noise')}
                                        </span>
                                    </li>
                                    <li className='flex items-start space-x-3'>
                                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0' />
                                        <span className='text-sm'>
                                            {t('practicalInfo.accommodation.houseRules.rules.capacity')}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'location',
            title: t('practicalInfo.tabs.location'),
            icon: <MapPin className='w-5 h-5' />,
            sections: [
                {
                    id: 'getting-there',
                    title: t('practicalInfo.location.gettingThere.title'),
                    content: (
                        <div className='space-y-6'>
                            <div className='bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl'>
                                <h4 className='text-lg font-bold text-green-800 mb-4 flex items-center'>
                                    <Car className='w-5 h-5 mr-2' />
                                    {t('practicalInfo.location.gettingThere.subtitle')}
                                </h4>
                                <div className='space-y-4 text-green-700'>
                                    <div>
                                        <h5 className='font-semibold mb-2'>
                                            {t('practicalInfo.location.gettingThere.airport.title')}
                                        </h5>
                                        <p className='text-sm'>
                                            {t('practicalInfo.location.gettingThere.airport.details')}
                                        </p>
                                    </div>
                                    <div>
                                        <h5 className='font-semibold mb-2'>
                                            {t('practicalInfo.location.gettingThere.transfer.title')}
                                        </h5>
                                        <p className='text-sm'>
                                            {t('practicalInfo.location.gettingThere.transfer.details')}
                                        </p>
                                    </div>
                                    <div>
                                        <h5 className='font-semibold mb-2'>
                                            {t('practicalInfo.location.gettingThere.taxi.title')}
                                        </h5>
                                        <p className='text-sm'>
                                            {t('practicalInfo.location.gettingThere.taxi.details')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    id: 'destination',
                    title: t('practicalInfo.location.destination.title'),
                    content: (
                        <div className='space-y-6'>
                            <div className='bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl'>
                                <h4 className='text-lg font-bold text-blue-800 mb-4 flex items-center'>
                                    <Compass className='w-5 h-5 mr-2' />
                                    {t('practicalInfo.location.destination.subtitle')}
                                </h4>
                                <div className='space-y-4 text-blue-700'>
                                    <p className='text-sm'>{t('practicalInfo.location.destination.description')}</p>
                                    <div>
                                        <h5 className='font-semibold mb-2'>
                                            {t('practicalInfo.location.destination.highlights.title')}
                                        </h5>
                                        <ul className='space-y-2 text-sm'>
                                            <li className='flex items-start space-x-2'>
                                                <Waves className='w-4 h-4 mt-1 flex-shrink-0' />
                                                <span>{t('practicalInfo.location.destination.highlights.redSea')}</span>
                                            </li>
                                            <li className='flex items-start space-x-2'>
                                                <Sun className='w-4 h-4 mt-1 flex-shrink-0' />
                                                <span>
                                                    {t('practicalInfo.location.destination.highlights.weather')}
                                                </span>
                                            </li>
                                            <li className='flex items-start space-x-2'>
                                                <Star className='w-4 h-4 mt-1 flex-shrink-0' />
                                                <span>{t('practicalInfo.location.destination.highlights.diving')}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'activities',
            title: t('practicalInfo.tabs.activities'),
            icon: <Compass className='w-5 h-5' />,
            sections: [
                {
                    id: 'marina',
                    title: t('practicalInfo.activities.marina.title'),
                    content: (
                        <div className='space-y-6'>
                            <div className='bg-cyan-50 border-l-4 border-cyan-500 p-6 rounded-r-xl'>
                                <h4 className='text-lg font-bold text-cyan-800 mb-4'>
                                    {t('practicalInfo.activities.marina.subtitle')}
                                </h4>
                                <p className='text-cyan-700 text-sm mb-4'>
                                    {t('practicalInfo.activities.marina.description')}
                                </p>
                                <div className='space-y-2'>
                                    <p className='text-sm text-cyan-600'>
                                        <strong>{t('practicalInfo.activities.marina.location')}</strong>
                                    </p>
                                    <p className='text-sm text-cyan-600'>
                                        <strong>{t('practicalInfo.activities.marina.hours')}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    id: 'old-town',
                    title: t('practicalInfo.activities.oldTown.title'),
                    content: (
                        <div className='space-y-6'>
                            <div className='bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl'>
                                <h4 className='text-lg font-bold text-orange-800 mb-4'>
                                    {t('practicalInfo.activities.oldTown.subtitle')}
                                </h4>
                                <p className='text-orange-700 text-sm mb-4'>
                                    {t('practicalInfo.activities.oldTown.description')}
                                </p>
                                <div className='space-y-2'>
                                    <p className='text-sm text-orange-600'>
                                        <strong>{t('practicalInfo.activities.oldTown.highlights')}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    id: 'el-gouna',
                    title: t('practicalInfo.activities.elGouna.title'),
                    content: (
                        <div className='space-y-6'>
                            <div className='bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-xl'>
                                <h4 className='text-lg font-bold text-purple-800 mb-4'>
                                    {t('practicalInfo.activities.elGouna.subtitle')}
                                </h4>
                                <p className='text-purple-700 text-sm mb-4'>
                                    {t('practicalInfo.activities.elGouna.description')}
                                </p>
                                <div className='space-y-2'>
                                    <p className='text-sm text-purple-600'>
                                        <strong>{t('practicalInfo.activities.elGouna.distance')}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    id: 'desert-safari',
                    title: t('practicalInfo.activities.desertSafari.title'),
                    content: (
                        <div className='space-y-6'>
                            <div className='bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl'>
                                <h4 className='text-lg font-bold text-yellow-800 mb-4'>
                                    {t('practicalInfo.activities.desertSafari.subtitle')}
                                </h4>
                                <p className='text-yellow-700 text-sm mb-4'>
                                    {t('practicalInfo.activities.desertSafari.description')}
                                </p>
                                <div className='space-y-2'>
                                    <p className='text-sm text-yellow-600'>
                                        <strong>{t('practicalInfo.activities.desertSafari.included')}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'entertainment',
            title: t('practicalInfo.tabs.entertainment'),
            icon: <PartyPopper className='w-5 h-5' />,
            sections: [
                {
                    id: 'red-sea-festival',
                    title: t('practicalInfo.entertainment.redSeaFestival.title'),
                    content: (
                        <div className='space-y-6'>
                            <div className='bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-xl'>
                                <h4 className='text-lg font-bold text-indigo-800 mb-4 flex items-center'>
                                    <Calendar className='w-5 h-5 mr-2' />
                                    {t('practicalInfo.entertainment.redSeaFestival.subtitle')}
                                </h4>
                                <p className='text-indigo-700 text-sm mb-4'>
                                    {t('practicalInfo.entertainment.redSeaFestival.description')}
                                </p>
                                <div className='space-y-2'>
                                    <p className='text-sm text-indigo-600'>
                                        <strong>{t('practicalInfo.entertainment.redSeaFestival.dates')}</strong>
                                    </p>
                                    <p className='text-sm text-indigo-600'>
                                        <strong>{t('practicalInfo.entertainment.redSeaFestival.location')}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    id: 'diving-competition',
                    title: t('practicalInfo.entertainment.divingCompetition.title'),
                    content: (
                        <div className='space-y-6'>
                            <div className='bg-teal-50 border-l-4 border-teal-500 p-6 rounded-r-xl'>
                                <h4 className='text-lg font-bold text-teal-800 mb-4'>
                                    {t('practicalInfo.entertainment.divingCompetition.subtitle')}
                                </h4>
                                <p className='text-teal-700 text-sm mb-4'>
                                    {t('practicalInfo.entertainment.divingCompetition.description')}
                                </p>
                                <div className='space-y-2'>
                                    <p className='text-sm text-teal-600'>
                                        <strong>{t('practicalInfo.entertainment.divingCompetition.when')}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    id: 'cultural-nights',
                    title: t('practicalInfo.entertainment.culturalNights.title'),
                    content: (
                        <div className='space-y-6'>
                            <div className='bg-rose-50 border-l-4 border-rose-500 p-6 rounded-r-xl'>
                                <h4 className='text-lg font-bold text-rose-800 mb-4'>
                                    {t('practicalInfo.entertainment.culturalNights.subtitle')}
                                </h4>
                                <p className='text-rose-700 text-sm mb-4'>
                                    {t('practicalInfo.entertainment.culturalNights.description')}
                                </p>
                                <div className='space-y-2'>
                                    <p className='text-sm text-rose-600'>
                                        <strong>{t('practicalInfo.entertainment.culturalNights.schedule')}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    id: 'ramadan',
                    title: t('practicalInfo.entertainment.ramadan.title'),
                    content: (
                        <div className='space-y-6'>
                            <div className='bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-xl'>
                                <h4 className='text-lg font-bold text-emerald-800 mb-4'>
                                    {t('practicalInfo.entertainment.ramadan.subtitle')}
                                </h4>
                                <p className='text-emerald-700 text-sm mb-4'>
                                    {t('practicalInfo.entertainment.ramadan.description')}
                                </p>
                                <div className='space-y-2'>
                                    <p className='text-sm text-emerald-600'>
                                        <strong>{t('practicalInfo.entertainment.ramadan.dates')}</strong>
                                    </p>
                                    <p className='text-sm text-emerald-600'>
                                        <strong>{t('practicalInfo.entertainment.ramadan.experience')}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ),
                },
            ],
        },
    ];

    const currentTab = tabs.find(tab => tab.id === activeTab);
    const currentSection = currentTab?.sections.find(section => section.id === activeSection);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
        // Reset form
        setFormData({ name: '', email: '', question: '', howDidYouKnow: '' });
    };

    return (
        <div className='min-h-screen bg-[#E8DCC6]'>
            {/* Hero Section */}
            <div className='relative min-h-[60vh] flex items-center justify-center overflow-hidden'>
                <div className='absolute inset-0' style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
                    <img
                        src='/images/practical-info-hero.jpg'
                        alt='Practical Information'
                        className='w-full h-full object-cover scale-110'
                        onError={e => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                    <div className='absolute inset-0 bg-gradient-to-b from-[#C75D2C]/80 via-[#D96F32]/70 to-[#F8B259]/60'></div>
                    <div className='absolute inset-0 bg-black/40'></div>
                </div>

                <div className='relative z-10 text-center space-y-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto'>
                    <div className='space-y-6'>
                        <h1 className='text-5xl sm:text-6xl lg:text-7xl font-bold text-white font-butler drop-shadow-2xl'>
                            {t('practicalInfo.hero.title')}
                        </h1>
                        <p className='text-xl sm:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-lg'>
                            {t('practicalInfo.hero.subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='bg-[#E8DCC6] relative z-10 -mt-1'>
                <div className='py-12 px-4 sm:px-6 lg:px-8'>
                    <div className='max-w-7xl mx-auto'>
                        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
                            {/* Left Sidebar - Tabs */}
                            <div className='lg:col-span-1'>
                                <div className='bg-white/60 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-3xl p-6 sticky top-8'>
                                    <h3 className='text-xl font-bold text-[#C75D2C] font-butler mb-6'>
                                        {t('practicalInfo.categories')}
                                    </h3>
                                    <nav className='space-y-2'>
                                        {tabs.map((tab, index) => (
                                            <div key={tab.id}>
                                                <button
                                                    onClick={() => {
                                                        setActiveTab(tab.id);
                                                        setActiveSection(tab.sections[0].id);
                                                    }}
                                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                                                        activeTab === tab.id
                                                            ? 'bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white shadow-lg'
                                                            : 'text-[#C75D2C] hover:bg-[#F8B259]/20'
                                                    }`}
                                                >
                                                    {tab.icon}
                                                    <span className='font-medium'>{`${index + 1}. ${tab.title}`}</span>
                                                </button>

                                                {/* Sub-sections */}
                                                {activeTab === tab.id && (
                                                    <div className='ml-4 mt-2 space-y-1'>
                                                        {tab.sections.map((section, sectionIndex) => (
                                                            <button
                                                                key={section.id}
                                                                onClick={() => setActiveSection(section.id)}
                                                                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                                                                    activeSection === section.id
                                                                        ? 'bg-[#F8B259]/30 text-[#C75D2C] font-medium'
                                                                        : 'text-[#C75D2C]/70 hover:bg-[#F8B259]/10'
                                                                }`}
                                                            >
                                                                {`${sectionIndex + 1}. ${section.title}`}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </nav>
                                </div>
                            </div>

                            {/* Right Content */}
                            <div className='lg:col-span-3'>
                                <div className='bg-white/60 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-3xl p-8'>
                                    {currentSection && (
                                        <div>
                                            <div className='mb-8'>
                                                <div className='flex items-center space-x-4 mb-4'>
                                                    {currentTab?.icon}
                                                    <h2 className='text-3xl font-bold text-[#C75D2C] font-butler'>
                                                        {currentTab?.title}
                                                    </h2>
                                                </div>
                                                <h3 className='text-2xl font-semibold text-[#D96F32] mb-6'>
                                                    {currentSection.title}
                                                </h3>
                                            </div>

                                            <div className='prose prose-lg max-w-none'>{currentSection.content}</div>
                                        </div>
                                    )}
                                </div>

                                {/* Contact Form */}
                                <div className='mt-8 bg-white/60 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-3xl p-8'>
                                    <h3 className='text-2xl font-bold text-[#C75D2C] font-butler mb-6'>
                                        {t('practicalInfo.contact.title')}
                                    </h3>

                                    <form onSubmit={handleFormSubmit} className='space-y-6'>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                            <div>
                                                <label className='block text-sm font-semibold text-[#C75D2C] mb-2'>
                                                    {t('practicalInfo.contact.form.name')}
                                                </label>
                                                <input
                                                    type='text'
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    className='w-full px-4 py-3 border-2 border-[#F8B259]/50 rounded-xl bg-white/80 text-[#C75D2C] focus:outline-none focus:border-[#D96F32] transition-all duration-300'
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className='block text-sm font-semibold text-[#C75D2C] mb-2'>
                                                    {t('practicalInfo.contact.form.email')}
                                                </label>
                                                <input
                                                    type='email'
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    className='w-full px-4 py-3 border-2 border-[#F8B259]/50 rounded-xl bg-white/80 text-[#C75D2C] focus:outline-none focus:border-[#D96F32] transition-all duration-300'
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className='block text-sm font-semibold text-[#C75D2C] mb-2'>
                                                {t('practicalInfo.contact.form.howDidYouKnow')}
                                            </label>
                                            <select
                                                value={formData.howDidYouKnow}
                                                onChange={e =>
                                                    setFormData({ ...formData, howDidYouKnow: e.target.value })
                                                }
                                                className='w-full px-4 py-3 border-2 border-[#F8B259]/50 rounded-xl bg-white/80 text-[#C75D2C] focus:outline-none focus:border-[#D96F32] transition-all duration-300'
                                                required
                                            >
                                                <option value=''>{t('practicalInfo.contact.form.selectOption')}</option>
                                                <option value='airbnb'>Airbnb</option>
                                                <option value='booking'>Booking.com</option>
                                                <option value='instagram'>Instagram</option>
                                                <option value='facebook'>Facebook</option>
                                                <option value='google'>Google</option>
                                                <option value='recommendation'>
                                                    {t('practicalInfo.contact.form.recommendation')}
                                                </option>
                                                <option value='other'>{t('practicalInfo.contact.form.other')}</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className='block text-sm font-semibold text-[#C75D2C] mb-2'>
                                                {t('practicalInfo.contact.form.question')}
                                            </label>
                                            <textarea
                                                value={formData.question}
                                                onChange={e => setFormData({ ...formData, question: e.target.value })}
                                                rows={4}
                                                className='w-full px-4 py-3 border-2 border-[#F8B259]/50 rounded-xl bg-white/80 text-[#C75D2C] focus:outline-none focus:border-[#D96F32] transition-all duration-300 resize-none'
                                                placeholder={t('practicalInfo.contact.form.questionPlaceholder')}
                                                required
                                            />
                                        </div>

                                        <div className='flex items-start space-x-3'>
                                            <input
                                                type='checkbox'
                                                id='privacy'
                                                className='mt-1 w-4 h-4 text-[#D96F32] border-2 border-[#F8B259]/50 rounded focus:ring-[#D96F32]'
                                                required
                                            />
                                            <label htmlFor='privacy' className='text-sm text-[#C75D2C]/80'>
                                                {t('practicalInfo.contact.form.privacy')}
                                            </label>
                                        </div>

                                        <button
                                            type='submit'
                                            className='group relative px-8 py-4 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white font-semibold rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl'
                                        >
                                            <span className='relative z-10 flex items-center space-x-3'>
                                                <Send className='w-5 h-5' />
                                                <span>{t('practicalInfo.contact.form.send')}</span>
                                            </span>
                                            <div className='absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action Section */}
                <div className='py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#D96F32]/20 to-[#F8B259]/20'>
                    <div className='max-w-6xl mx-auto'>
                        <div className='bg-white/60 backdrop-blur-lg border-2 border-[#F8B259]/70 rounded-3xl p-12'>
                            <div className='text-center space-y-8'>
                                <h2 className='text-4xl font-bold text-[#C75D2C] font-butler'>
                                    {t('practicalInfo.cta.title')}
                                </h2>
                                <p className='text-xl text-[#C75D2C]/80 max-w-3xl mx-auto'>
                                    {t('practicalInfo.cta.subtitle')}
                                </p>

                                <div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
                                    <button className='group relative px-8 py-4 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white font-semibold rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl'>
                                        <span className='relative z-10 flex items-center space-x-3'>
                                            <Calendar className='w-5 h-5' />
                                            <span>{t('practicalInfo.cta.bookNow')}</span>
                                        </span>
                                        <div className='absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                    </button>

                                    <button className='group px-8 py-4 backdrop-blur-md bg-white/20 border-2 border-[#F8B259]/50 text-[#C75D2C] hover:bg-white/40 hover:border-[#F8B259] transition-all duration-300 rounded-2xl font-semibold transform hover:-translate-y-0.5'>
                                        <span className='flex items-center space-x-3'>
                                            <Phone className='w-5 h-5' />
                                            <span>{t('practicalInfo.cta.contact')}</span>
                                        </span>
                                    </button>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-12'>
                                    <div className='text-center'>
                                        <div className='w-16 h-16 bg-gradient-to-r from-[#D96F32] to-[#F8B259] rounded-full flex items-center justify-center mx-auto mb-4'>
                                            <Phone className='w-8 h-8 text-white' />
                                        </div>
                                        <h3 className='text-lg font-bold text-[#C75D2C] mb-2'>
                                            {t('practicalInfo.cta.support.phone.title')}
                                        </h3>
                                        <p className='text-[#C75D2C]/80'>
                                            {t('practicalInfo.cta.support.phone.description')}
                                        </p>
                                    </div>

                                    <div className='text-center'>
                                        <div className='w-16 h-16 bg-gradient-to-r from-[#D96F32] to-[#F8B259] rounded-full flex items-center justify-center mx-auto mb-4'>
                                            <Mail className='w-8 h-8 text-white' />
                                        </div>
                                        <h3 className='text-lg font-bold text-[#C75D2C] mb-2'>
                                            {t('practicalInfo.cta.support.email.title')}
                                        </h3>
                                        <p className='text-[#C75D2C]/80'>
                                            {t('practicalInfo.cta.support.email.description')}
                                        </p>
                                    </div>

                                    <div className='text-center'>
                                        <div className='w-16 h-16 bg-gradient-to-r from-[#D96F32] to-[#F8B259] rounded-full flex items-center justify-center mx-auto mb-4'>
                                            <Clock className='w-8 h-8 text-white' />
                                        </div>
                                        <h3 className='text-lg font-bold text-[#C75D2C] mb-2'>
                                            {t('practicalInfo.cta.support.hours.title')}
                                        </h3>
                                        <p className='text-[#C75D2C]/80'>
                                            {t('practicalInfo.cta.support.hours.description')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Blog/News Section */}
                <div className='py-20 px-4 sm:px-6 lg:px-8'>
                    <div className='max-w-7xl mx-auto'>
                        <div className='text-center mb-16'>
                            <h2 className='text-4xl sm:text-5xl font-bold text-[#C75D2C] font-butler mb-6'>
                                {t('practicalInfo.news.title')}
                            </h2>
                            <div className='w-24 h-1 bg-[#F8B259] mx-auto mb-8'></div>
                            <p className='text-xl text-[#C75D2C]/80 max-w-3xl mx-auto'>
                                {t('practicalInfo.news.subtitle')}
                            </p>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                            {/* Blog Post 1 */}
                            <div className='bg-white/50 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-3xl overflow-hidden transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 group'>
                                <img
                                    src='/images/blog/hurghada-guide.jpg'
                                    alt='Hurghada Guide'
                                    className='w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-700'
                                    onError={e => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/images/blog/placeholder.jpg';
                                    }}
                                />
                                <div className='p-6'>
                                    <div className='flex items-center text-sm text-[#C75D2C]/70 mb-3'>
                                        <span>{t('practicalInfo.news.posts.hurghadaGuide.author')}</span>
                                        <span className='mx-2'>•</span>
                                        <span>{t('practicalInfo.news.posts.hurghadaGuide.date')}</span>
                                    </div>
                                    <h3 className='text-xl font-bold text-[#C75D2C] font-butler mb-3 group-hover:text-[#D96F32] transition-colors'>
                                        {t('practicalInfo.news.posts.hurghadaGuide.title')}
                                    </h3>
                                    <p className='text-[#C75D2C]/80 text-sm line-clamp-3'>
                                        {t('practicalInfo.news.posts.hurghadaGuide.excerpt')}
                                    </p>
                                    <button className='mt-4 text-[#D96F32] hover:text-[#C75D2C] transition-colors flex items-center space-x-2'>
                                        <span className='text-sm font-medium'>{t('practicalInfo.news.readMore')}</span>
                                        <ArrowRight className='w-4 h-4' />
                                    </button>
                                </div>
                            </div>

                            {/* Blog Post 2 */}
                            <div className='bg-white/50 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-3xl overflow-hidden transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 group'>
                                <img
                                    src='/images/blog/red-sea-diving.jpg'
                                    alt='Red Sea Diving'
                                    className='w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-700'
                                    onError={e => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/images/blog/placeholder.jpg';
                                    }}
                                />
                                <div className='p-6'>
                                    <div className='flex items-center text-sm text-[#C75D2C]/70 mb-3'>
                                        <span>{t('practicalInfo.news.posts.redSeaDiving.author')}</span>
                                        <span className='mx-2'>•</span>
                                        <span>{t('practicalInfo.news.posts.redSeaDiving.date')}</span>
                                    </div>
                                    <h3 className='text-xl font-bold text-[#C75D2C] font-butler mb-3 group-hover:text-[#D96F32] transition-colors'>
                                        {t('practicalInfo.news.posts.redSeaDiving.title')}
                                    </h3>
                                    <p className='text-[#C75D2C]/80 text-sm line-clamp-3'>
                                        {t('practicalInfo.news.posts.redSeaDiving.excerpt')}
                                    </p>
                                    <button className='mt-4 text-[#D96F32] hover:text-[#C75D2C] transition-colors flex items-center space-x-2'>
                                        <span className='text-sm font-medium'>{t('practicalInfo.news.readMore')}</span>
                                        <ArrowRight className='w-4 h-4' />
                                    </button>
                                </div>
                            </div>

                            {/* Blog Post 3 */}
                            <div className='bg-white/50 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-3xl overflow-hidden transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 group'>
                                <img
                                    src='/images/blog/desert-adventure.jpg'
                                    alt='Desert Adventure'
                                    className='w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-700'
                                    onError={e => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/images/blog/placeholder.jpg';
                                    }}
                                />
                                <div className='p-6'>
                                    <div className='flex items-center text-sm text-[#C75D2C]/70 mb-3'>
                                        <span>{t('practicalInfo.news.posts.desertAdventure.author')}</span>
                                        <span className='mx-2'>•</span>
                                        <span>{t('practicalInfo.news.posts.desertAdventure.date')}</span>
                                    </div>
                                    <h3 className='text-xl font-bold text-[#C75D2C] font-butler mb-3 group-hover:text-[#D96F32] transition-colors'>
                                        {t('practicalInfo.news.posts.desertAdventure.title')}
                                    </h3>
                                    <p className='text-[#C75D2C]/80 text-sm line-clamp-3'>
                                        {t('practicalInfo.news.posts.desertAdventure.excerpt')}
                                    </p>
                                    <button className='mt-4 text-[#D96F32] hover:text-[#C75D2C] transition-colors flex items-center space-x-2'>
                                        <span className='text-sm font-medium'>{t('practicalInfo.news.readMore')}</span>
                                        <ArrowRight className='w-4 h-4' />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* <div className='text-center mt-12'>
                            <button className='group px-8 py-4 backdrop-blur-md bg-white/60 border-2 border-[#F8B259]/50 text-[#C75D2C] hover:bg-white/80 hover:border-[#F8B259] transition-all duration-300 rounded-2xl font-semibold transform hover:-translate-y-0.5'>
                                <span className='flex items-center space-x-3'>
                                    <span>{t('practicalInfo.news.viewAll')}</span>
                                    <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform duration-300' />
                                </span>
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PracticalInfo;
