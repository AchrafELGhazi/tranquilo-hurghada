import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Edit,
    MapPin,
    BedDouble,
    Bath,
    Users,
    DollarSign,
    Calendar,
    Eye,
    EyeOff,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Home,
    Mail,
    Phone,
    Shield,
    Baby,
    Star,
} from 'lucide-react';
import { villaApi } from '@/api/villaApi';
import { bookingApi } from '@/api/bookingApi';
import { BookingStatusBadge } from '@/components/common/BookingStatusBadge';
import type { Villa, Booking } from '@/utils/types';
import { getAmenityDisplayName, getAmenityIcon } from '@/utils/amenitiesUtils';
import { formatPrice } from '@/utils/bookingUtils';

export const AdminVillaDetails: React.FC = () => {
    const { villaId, lang } = useParams<{ villaId: string; lang: string }>();
    const navigate = useNavigate();
    const [villa, setVilla] = useState<Villa | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'details' | 'bookings'>('details');

    useEffect(() => {
        if (!villaId) {
            navigate(`/${lang}/admin/villas`);
            return;
        }

        const fetchVillaDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                const [villaResponse, bookingsResponse] = await Promise.all([
                    villaApi.getVillaById(villaId),
                    bookingApi.getAllBookings({ villaId, limit: 50 }),
                ]);

                setVilla(villaResponse);

                // Handle both possible response formats
                if (Array.isArray(bookingsResponse.data)) {
                    setBookings(bookingsResponse.data);
                } else if (bookingsResponse && bookingsResponse.data) {
                    setBookings(bookingsResponse.data);
                } else {
                    setBookings([]);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch villa details');
                console.error('Error fetching villa details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchVillaDetails();
    }, [villaId, navigate, lang]);

    const getVillaStatusBadge = (status: Villa['status']) => {
        const statusConfig = {
            AVAILABLE: {
                bg: 'bg-green-100',
                text: 'text-green-800',
                border: 'border-green-200',
                icon: CheckCircle,
                label: 'Available',
            },
            UNAVAILABLE: {
                bg: 'bg-gray-100',
                text: 'text-gray-800',
                border: 'border-gray-200',
                icon: XCircle,
                label: 'Unavailable',
            },
            MAINTENANCE: {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                border: 'border-yellow-200',
                icon: Clock,
                label: 'Maintenance',
            },
        };

        const config = statusConfig[status];
        const Icon = config.icon;

        return (
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
            >
                <Icon className='w-3 h-3 mr-1' />
                {config.label}
            </span>
        );
    };

    const getRoleBadge = (role: string) => {
        const roleConfig = {
            ADMIN: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Shield },
            HOST: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Users },
            GUEST: { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Shield },
        };

        const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.GUEST;
        const Icon = config.icon;

        return (
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}
            >
                <Icon className='w-3 h-3 mr-1' />
                {role}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-[#E8DCC6] py-8 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-7xl mx-auto space-y-6'>
                    <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-8 text-center'>
                        <div className='w-8 h-8 border-2 border-[#D96F32]/30 border-t-[#D96F32] rounded-full animate-spin mx-auto mb-4'></div>
                        <p className='text-[#C75D2C]/70'>Loading villa details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !villa) {
        return (
            <div className='min-h-screen bg-[#E8DCC6] py-8 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-7xl mx-auto space-y-6'>
                    <div className='bg-red-50/80 backdrop-blur-sm border-2 border-red-200/60 rounded-xl p-6 flex items-start space-x-3'>
                        <AlertCircle className='w-5 h-5 text-red-600 mt-0.5 flex-shrink-0' />
                        <div>
                            <p className='text-red-800 font-semibold'>Error</p>
                            <p className='text-red-700 text-sm mt-1'>{error || 'Villa not found'}</p>
                            <Link
                                to={`/${lang}/admin/villas`}
                                className='inline-flex items-center mt-4 px-4 py-2 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white rounded-xl hover:from-[#C75D2C] hover:to-[#D96F32] transition-all duration-300 font-medium'
                            >
                                <ArrowLeft className='w-4 h-4 mr-2' />
                                Back to Villas
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen '>
            <div className='max-w-7xl mx-auto space-y-6'>
                {/* Header */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                    <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
                        <div className='flex items-start space-x-4'>
                            <div className='w-16 h-16 bg-gradient-to-br from-[#F8B259]/30 to-[#D96F32]/30 rounded-xl flex items-center justify-center'>
                                <Home className='w-8 h-8 text-[#D96F32]' />
                            </div>
                            <div>
                                <h1 className='text-2xl font-bold text-[#C75D2C] font-butler'>{villa.title}</h1>
                                <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2'>
                                    <div className='flex items-center text-[#C75D2C]/70'>
                                        <MapPin className='w-4 h-4 mr-1 text-[#D96F32]' />
                                        {villa.address}, {villa.city}, {villa.country}
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        {getVillaStatusBadge(villa.status)}
                                        {villa.isActive ? (
                                            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200'>
                                                <Eye className='w-3 h-3 mr-1' />
                                                Active
                                            </span>
                                        ) : (
                                            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200'>
                                                <EyeOff className='w-3 h-3 mr-1' />
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className='text-sm text-[#C75D2C]/60 mt-1'>ID: {villa.id}</p>
                            </div>
                        </div>
                        <div className='flex items-center space-x-3'>
                            <Link
                                to={`/${lang}/admin/villas`}
                                className='inline-flex items-center px-4 py-2 border-2 border-[#F8B259]/50 text-[#C75D2C] rounded-xl hover:bg-white/50 transition-all duration-300 font-medium'
                            >
                                <ArrowLeft className='w-4 h-4 mr-2' />
                                Back to Villas
                            </Link>
                            <Link
                                to={`/${lang}/admin/villas/${villa.id}/edit`}
                                className='inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white rounded-xl hover:from-[#C75D2C] hover:to-[#D96F32] transition-all duration-300 font-medium'
                            >
                                <Edit className='w-4 h-4 mr-2' />
                                Edit Villa
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl overflow-hidden'>
                    <div className='border-b-2 border-[#F8B259]/50'>
                        <nav className='flex'>
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`py-4 px-6 font-medium text-sm transition-all duration-300 ${
                                    activeTab === 'details'
                                        ? 'border-b-2 border-[#D96F32] text-[#D96F32] bg-white/20'
                                        : 'text-[#C75D2C]/70 hover:text-[#C75D2C] hover:bg-white/10'
                                }`}
                            >
                                Villa Details
                            </button>
                            <button
                                onClick={() => setActiveTab('bookings')}
                                className={`py-4 px-6 font-medium text-sm transition-all duration-300 ${
                                    activeTab === 'bookings'
                                        ? 'border-b-2 border-[#D96F32] text-[#D96F32] bg-white/20'
                                        : 'text-[#C75D2C]/70 hover:text-[#C75D2C] hover:bg-white/10'
                                }`}
                            >
                                Bookings ({bookings?.length || 0})
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className='p-6'>
                        {activeTab === 'details' ? (
                            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                                {/* Images */}
                                <div className='lg:col-span-2'>
                                    <div className='bg-white/60 backdrop-blur-sm border-2 border-[#F8B259]/50 rounded-2xl overflow-hidden'>
                                        <div className='aspect-video bg-gradient-to-br from-[#F8B259]/20 to-[#D96F32]/20 relative'>
                                            {villa.images && villa.images.length > 0 ? (
                                                <img
                                                    src={villa.images[0]}
                                                    alt={villa.title}
                                                    className='w-full h-full object-cover'
                                                    onError={e => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className='w-full h-full flex items-center justify-center text-[#C75D2C]/50'>
                                                    <Home className='w-16 h-16' />
                                                </div>
                                            )}
                                        </div>

                                        {villa.images && villa.images.length > 1 && (
                                            <div className='p-4'>
                                                <h3 className='font-semibold text-[#C75D2C] mb-3'>
                                                    Additional Images ({villa.images.length - 1})
                                                </h3>
                                                <div className='grid grid-cols-3 gap-3'>
                                                    {villa.images.slice(1).map((image, index) => (
                                                        <div
                                                            key={index}
                                                            className='aspect-square bg-gradient-to-br from-[#F8B259]/20 to-[#D96F32]/20 rounded-xl overflow-hidden border border-[#F8B259]/30'
                                                        >
                                                            <img
                                                                src={image}
                                                                alt={`${villa.title} ${index + 2}`}
                                                                className='w-full h-full object-cover'
                                                                onError={e => {
                                                                    e.currentTarget.style.display = 'none';
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Villa Info Sidebar */}
                                <div className='space-y-6'>
                                    {/* Basic Info */}
                                    <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-6'>
                                        <h3 className='font-semibold text-[#C75D2C] mb-4'>Basic Information</h3>
                                        <div className='space-y-4'>
                                            <div className='grid grid-cols-2 gap-4'>
                                                <div className='text-center bg-white/40 rounded-lg p-3'>
                                                    <BedDouble className='w-6 h-6 text-[#D96F32] mx-auto mb-1' />
                                                    <p className='font-bold text-[#C75D2C]'>{villa.bedrooms}</p>
                                                    <p className='text-xs text-[#C75D2C]/60'>Bedrooms</p>
                                                </div>
                                                <div className='text-center bg-white/40 rounded-lg p-3'>
                                                    <Bath className='w-6 h-6 text-[#D96F32] mx-auto mb-1' />
                                                    <p className='font-bold text-[#C75D2C]'>{villa.bathrooms}</p>
                                                    <p className='text-xs text-[#C75D2C]/60'>Bathrooms</p>
                                                </div>
                                            </div>

                                            <div className='grid grid-cols-2 gap-4'>
                                                <div className='text-center bg-white/40 rounded-lg p-3'>
                                                    <Users className='w-6 h-6 text-[#D96F32] mx-auto mb-1' />
                                                    <p className='font-bold text-[#C75D2C]'>{villa.maxGuests}</p>
                                                    <p className='text-xs text-[#C75D2C]/60'>Max Guests</p>
                                                </div>
                                                <div className='text-center bg-white/40 rounded-lg p-3'>
                                                    <DollarSign className='w-6 h-6 text-[#D96F32] mx-auto mb-1' />
                                                    <p className='font-bold text-[#C75D2C]'>
                                                        {formatPrice(Number(villa.pricePerNight), 'EUR')}
                                                    </p>
                                                    <p className='text-xs text-[#C75D2C]/60'>Per Night</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Owner Information */}
                                    {villa.owner && (
                                        <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-6'>
                                            <h3 className='font-semibold text-[#C75D2C] mb-4'>Owner Information</h3>
                                            <div className='space-y-3'>
                                                <div className='flex items-center space-x-3'>
                                                    <div className='w-10 h-10 bg-gradient-to-br from-[#F8B259]/30 to-[#D96F32]/30 rounded-lg flex items-center justify-center'>
                                                        <Users className='w-5 h-5 text-[#D96F32]' />
                                                    </div>
                                                    <div>
                                                        <p className='font-medium text-[#C75D2C]'>
                                                            {villa.owner.fullName}
                                                        </p>
                                                        <div className='flex items-center space-x-1 mt-1'>
                                                            {getRoleBadge(villa.owner.role)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex items-center space-x-2 text-sm text-[#C75D2C]/70'>
                                                    <Mail className='w-4 h-4 text-[#D96F32]' />
                                                    <span>{villa.owner.email}</span>
                                                </div>
                                                {villa.owner.phone && (
                                                    <div className='flex items-center space-x-2 text-sm text-[#C75D2C]/70'>
                                                        <Phone className='w-4 h-4 text-[#D96F32]' />
                                                        <span>{villa.owner.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Timestamps */}
                                    <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-6'>
                                        <h3 className='font-semibold text-[#C75D2C] mb-4'>Timeline</h3>
                                        <div className='space-y-3 text-sm'>
                                            <div>
                                                <p className='text-[#C75D2C]/60'>Created</p>
                                                <p className='font-medium text-[#C75D2C]'>
                                                    {formatDateTime(villa.createdAt)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className='text-[#C75D2C]/60'>Last Updated</p>
                                                <p className='font-medium text-[#C75D2C]'>
                                                    {formatDateTime(villa.updatedAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description and Amenities */}
                                <div className='lg:col-span-3 space-y-6'>
                                    {/* Description */}
                                    {villa.description && (
                                        <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-6'>
                                            <h3 className='font-semibold text-[#C75D2C] mb-4'>Description</h3>
                                            <p className='text-[#C75D2C]/80 leading-relaxed'>{villa.description}</p>
                                        </div>
                                    )}

                                    {/* Amenities */}
                                    <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-6'>
                                        <h3 className='font-semibold text-[#C75D2C] mb-4'>
                                            Amenities ({villa.amenities?.length || 0})
                                        </h3>
                                        {villa.amenities && villa.amenities.length > 0 ? (
                                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                                                {villa.amenities.map((amenity, index) => (
                                                    <div
                                                        key={index}
                                                        className='flex items-center space-x-3 p-3 bg-white/40 rounded-lg border border-[#F8B259]/30'
                                                    >
                                                        {getAmenityIcon(amenity, 'w-5 h-5 text-[#D96F32]')}
                                                        <span className='text-sm font-medium text-[#C75D2C]'>
                                                            {getAmenityDisplayName(amenity)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className='text-[#C75D2C]/60'>No amenities listed</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Bookings Tab */
                            <div className='space-y-6'>
                                <div className='text-center'>
                                    <h3 className='font-semibold text-lg text-[#C75D2C] mb-2'>Booking History</h3>
                                    <p className='text-[#C75D2C]/70'>All bookings for this villa</p>
                                </div>

                                {bookings && bookings.length > 0 ? (
                                    <>
                                        {/* Desktop Table */}
                                        <div className='hidden lg:block bg-white/60 backdrop-blur-sm border-2 border-[#F8B259]/50 rounded-2xl overflow-hidden'>
                                            <div className='overflow-x-auto'>
                                                <table className='w-full'>
                                                    <thead className='bg-gradient-to-r from-[#F8B259]/20 to-[#D96F32]/20 border-b-2 border-[#F8B259]/50'>
                                                        <tr>
                                                            <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                                                                Guest
                                                            </th>
                                                            <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                                                                Check-in
                                                            </th>
                                                            <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                                                                Check-out
                                                            </th>
                                                            <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                                                                Guests
                                                            </th>
                                                            <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                                                                Total Price
                                                            </th>
                                                            <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                                                                Status
                                                            </th>
                                                            <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                                                                Created
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className='divide-y divide-[#F8B259]/30'>
                                                        {bookings.map(booking => (
                                                            <tr
                                                                key={booking.id}
                                                                className='hover:bg-white/20 transition-colors duration-200'
                                                            >
                                                                <td className='px-6 py-4'>
                                                                    <div className='flex items-center space-x-3'>
                                                                        <div className='w-10 h-10 bg-gradient-to-br from-[#F8B259]/30 to-[#D96F32]/30 rounded-lg flex items-center justify-center'>
                                                                            <span className='text-sm font-medium text-[#C75D2C]'>
                                                                                {booking.guest?.fullName
                                                                                    ?.charAt(0)
                                                                                    ?.toUpperCase() || 'G'}
                                                                            </span>
                                                                        </div>
                                                                        <div>
                                                                            <p className='font-semibold text-[#C75D2C]'>
                                                                                {booking.guest?.fullName ||
                                                                                    'Unknown Guest'}
                                                                            </p>
                                                                            <p className='text-xs text-[#C75D2C]/60'>
                                                                                {booking.guest?.email || 'No email'}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className='px-6 py-4'>
                                                                    <p className='text-[#C75D2C] font-medium'>
                                                                        {formatDate(booking.checkIn)}
                                                                    </p>
                                                                    <p className='text-xs text-[#C75D2C]/60'>
                                                                        {new Date(booking.checkIn).toLocaleDateString(
                                                                            'en-US',
                                                                            { weekday: 'short' }
                                                                        )}
                                                                    </p>
                                                                </td>
                                                                <td className='px-6 py-4'>
                                                                    <p className='text-[#C75D2C] font-medium'>
                                                                        {formatDate(booking.checkOut)}
                                                                    </p>
                                                                    <p className='text-xs text-[#C75D2C]/60'>
                                                                        {new Date(booking.checkOut).toLocaleDateString(
                                                                            'en-US',
                                                                            { weekday: 'short' }
                                                                        )}
                                                                    </p>
                                                                </td>
                                                                <td className='px-6 py-4'>
                                                                    <div className='flex items-center space-x-3'>
                                                                        <div className='flex items-center space-x-1'>
                                                                            <Users className='w-4 h-4 text-[#D96F32]' />
                                                                            <span className='font-medium text-[#C75D2C]'>
                                                                                {booking.totalAdults}
                                                                            </span>
                                                                        </div>
                                                                        {booking.totalChildren > 0 && (
                                                                            <div className='flex items-center space-x-1'>
                                                                                <Baby className='w-4 h-4 text-[#D96F32]' />
                                                                                <span className='font-medium text-[#C75D2C]'>
                                                                                    {booking.totalChildren}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className='px-6 py-4'>
                                                                    <p className='font-bold text-[#C75D2C]'>
                                                                        {formatPrice(
                                                                            Number(booking.totalPrice),
                                                                            'EUR'
                                                                        )}
                                                                    </p>
                                                                    <p className='text-xs text-[#C75D2C]/60'>
                                                                        {booking.paymentMethod === 'BANK_TRANSFER'
                                                                            ? 'Bank Transfer'
                                                                            : 'On Arrival'}
                                                                    </p>
                                                                </td>
                                                                <td className='px-6 py-4'>
                                                                    <BookingStatusBadge status={booking.status} />
                                                                </td>
                                                                <td className='px-6 py-4'>
                                                                    <p className='text-[#C75D2C] font-medium'>
                                                                        {formatDate(booking.createdAt)}
                                                                    </p>
                                                                    <p className='text-xs text-[#C75D2C]/60'>
                                                                        {
                                                                            formatDateTime(booking.createdAt).split(
                                                                                ','
                                                                            )[1]
                                                                        }
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Mobile Cards */}
                                        <div className='lg:hidden space-y-4'>
                                            {bookings.map(booking => (
                                                <div
                                                    key={booking.id}
                                                    className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4 space-y-4'
                                                >
                                                    <div className='flex justify-between items-start'>
                                                        <div>
                                                            <h3 className='font-semibold text-[#C75D2C]'>
                                                                {booking.guest?.fullName || 'Unknown Guest'}
                                                            </h3>
                                                            <p className='text-sm text-[#C75D2C]/60'>
                                                                {booking.guest?.email || 'No email'}
                                                            </p>
                                                            <p className='text-xs text-[#C75D2C]/60'>
                                                                #{booking.id.slice(-8)}
                                                            </p>
                                                        </div>
                                                        <BookingStatusBadge status={booking.status} />
                                                    </div>

                                                    <div className='grid grid-cols-2 gap-4 text-sm'>
                                                        <div>
                                                            <p className='text-[#C75D2C]/60'>Check-in</p>
                                                            <p className='font-medium text-[#C75D2C]'>
                                                                {formatDate(booking.checkIn)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className='text-[#C75D2C]/60'>Check-out</p>
                                                            <p className='font-medium text-[#C75D2C]'>
                                                                {formatDate(booking.checkOut)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className='text-[#C75D2C]/60'>Guests</p>
                                                            <div className='flex items-center space-x-2'>
                                                                <div className='flex items-center space-x-1'>
                                                                    <Users className='w-4 h-4 text-[#D96F32]' />
                                                                    <span className='font-medium text-[#C75D2C]'>
                                                                        {booking.totalAdults}
                                                                    </span>
                                                                </div>
                                                                {booking.totalChildren > 0 && (
                                                                    <div className='flex items-center space-x-1'>
                                                                        <Baby className='w-4 h-4 text-[#D96F32]' />
                                                                        <span className='font-medium text-[#C75D2C]'>
                                                                            {booking.totalChildren}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className='text-[#C75D2C]/60'>Total</p>
                                                            <p className='font-bold text-[#C75D2C]'>
                                                                {formatPrice(
                                                                    Number(booking.totalPrice),
                                                                    'EUR'
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className='flex justify-between items-center pt-2 border-t border-[#F8B259]/30'>
                                                        <p className='text-xs text-[#C75D2C]/60'>
                                                            Created: {formatDate(booking.createdAt)}
                                                        </p>
                                                        <p className='text-xs text-[#C75D2C]/60'>
                                                            {booking.paymentMethod === 'BANK_TRANSFER'
                                                                ? 'Bank Transfer'
                                                                : 'Payment on Arrival'}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Booking Statistics */}
                                        <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-6'>
                                            <h3 className='font-semibold text-[#C75D2C] mb-4'>Booking Statistics</h3>
                                            <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
                                                {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED'].map(
                                                    status => {
                                                        const count = bookings.filter(b => b.status === status).length;
                                                        const percentage =
                                                            bookings.length > 0
                                                                ? Math.round((count / bookings.length) * 100)
                                                                : 0;
                                                        return (
                                                            <div
                                                                key={status}
                                                                className='text-center bg-white/40 rounded-lg p-3'
                                                            >
                                                                <p className='font-bold text-[#C75D2C] text-lg'>
                                                                    {count}
                                                                </p>
                                                                <p className='text-xs text-[#C75D2C]/60 mb-1'>
                                                                    {status.charAt(0) + status.slice(1).toLowerCase()}
                                                                </p>
                                                                <p className='text-xs text-[#D96F32] font-medium'>
                                                                    {percentage}%
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>

                                        {/* Revenue Summary */}
                                        <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-6'>
                                            <h3 className='font-semibold text-[#C75D2C] mb-4'>Revenue Summary</h3>
                                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                                <div className='text-center bg-white/40 rounded-lg p-4'>
                                                    <DollarSign className='w-8 h-8 text-[#D96F32] mx-auto mb-2' />
                                                    <p className='font-bold text-[#C75D2C] text-xl'>
                                                        {formatPrice(
                                                            bookings
                                                                .filter(b =>
                                                                    ['CONFIRMED', 'COMPLETED'].includes(b.status)
                                                                )
                                                                .reduce((sum, b) => sum + Number(b.totalPrice), 0),
                                                            'EUR'
                                                        )}
                                                    </p>
                                                    <p className='text-sm text-[#C75D2C]/60'>Total Revenue</p>
                                                </div>
                                                <div className='text-center bg-white/40 rounded-lg p-4'>
                                                    <Calendar className='w-8 h-8 text-[#D96F32] mx-auto mb-2' />
                                                    <p className='font-bold text-[#C75D2C] text-xl'>
                                                        {
                                                            bookings.filter(b =>
                                                                ['CONFIRMED', 'COMPLETED'].includes(b.status)
                                                            ).length
                                                        }
                                                    </p>
                                                    <p className='text-sm text-[#C75D2C]/60'>Successful Bookings</p>
                                                </div>
                                                <div className='text-center bg-white/40 rounded-lg p-4'>
                                                    <Users className='w-8 h-8 text-[#D96F32] mx-auto mb-2' />
                                                    <p className='font-bold text-[#C75D2C] text-xl'>
                                                        {bookings
                                                            .filter(b => ['CONFIRMED', 'COMPLETED'].includes(b.status))
                                                            .reduce(
                                                                (sum, b) => sum + (b.totalAdults + b.totalChildren),
                                                                0
                                                            )}
                                                    </p>
                                                    <p className='text-sm text-[#C75D2C]/60'>Total Guests Hosted</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-12 text-center'>
                                        <Calendar className='w-12 h-12 text-[#D96F32]/50 mx-auto mb-4' />
                                        <h3 className='text-lg font-semibold text-[#C75D2C] mb-2'>No Bookings Yet</h3>
                                        <p className='text-[#C75D2C]/70'>This villa hasn't received any bookings.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
