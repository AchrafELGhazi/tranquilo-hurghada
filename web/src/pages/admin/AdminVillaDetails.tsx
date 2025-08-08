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
    Loader,
    AlertCircle,
} from 'lucide-react';
import { villaApi } from '@/api/villaApi';
import { bookingApi } from '@/api/bookingApi';
import type { Villa, Booking } from '@/utils/types';

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

                console.log('Villa Response:', villaResponse);
                console.log('Bookings Response:', bookingsResponse);

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

    const getStatusBadge = (status: Villa['status']) => {
        const statusConfig = {
            AVAILABLE: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Available' },
            UNAVAILABLE: { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle, label: 'Unavailable' },
            MAINTENANCE: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Maintenance' },
        };

        const config = statusConfig[status];
        const Icon = config.icon;

        return (
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
            >
                <Icon className='w-4 h-4 mr-2' />
                {config.label}
            </span>
        );
    };

    const getBookingStatusBadge = (status: Booking['status']) => {
        const statusConfig = {
            PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
            CONFIRMED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed' },
            CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
            REJECTED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
            COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' },
        };

        const config = statusConfig[status];
        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
            >
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

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-96'>
                <div className='text-center'>
                    <Loader className='w-8 h-8 animate-spin text-blue-600 mx-auto mb-4' />
                    <p className='text-gray-600'>Loading villa details...</p>
                </div>
            </div>
        );
    }

    if (error || !villa) {
        return (
            <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
                <div className='flex items-center'>
                    <AlertCircle className='w-5 h-5 text-red-600 mr-2' />
                    <p className='text-red-800'>{error || 'Villa not found'}</p>
                </div>
                <Link
                    to={`/${lang}/admin/villas`}
                    className='inline-flex items-center mt-4 text-blue-600 hover:text-blue-700'
                >
                    <ArrowLeft className='w-4 h-4 mr-2' />
                    Back to Villas
                </Link>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                    <Link
                        to={`/${lang}/admin/villas`}
                        className='inline-flex items-center text-gray-600 hover:text-gray-900'
                    >
                        <ArrowLeft className='w-5 h-5 mr-2' />
                        Back to Villas
                    </Link>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-900'>{villa.title}</h1>
                        <div className='flex items-center space-x-4 mt-1'>
                            <div className='flex items-center text-gray-600'>
                                <MapPin className='w-4 h-4 mr-1' />
                                {villa.address}, {villa.city}, {villa.country}
                            </div>
                            {getStatusBadge(villa.status)}
                        </div>
                    </div>
                </div>
                <Link
                    to={`/${lang}/admin/villas/${villa.id}/edit`}
                    className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                    <Edit className='w-4 h-4 mr-2' />
                    Edit Villa
                </Link>
            </div>

            {/* Tabs */}
            <div className='border-b border-gray-200'>
                <nav className='-mb-px flex space-x-8'>
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'details'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Villa Details
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'bookings'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Bookings ({bookings?.length || 0})
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'details' ? (
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    {/* Images */}
                    <div className='lg:col-span-2'>
                        <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
                            <div className='aspect-video bg-gray-200'>
                                {villa.images && villa.images.length > 0 ? (
                                    <img
                                        src={villa.images[0]}
                                        alt={villa.title}
                                        className='w-full h-full object-cover'
                                        onError={e => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                ) : null}
                             
                            </div>

                            {villa.images && villa.images.length > 1 && (
                                <div className='p-4'>
                                    <h3 className='font-medium text-gray-900 mb-3'>
                                        Additional Images ({villa.images.length - 1})
                                    </h3>
                                    <div className='grid grid-cols-3 gap-3'>
                                        {villa.images.slice(1).map((image, index) => (
                                            <div
                                                key={index}
                                                className='aspect-square bg-gray-200 rounded-lg overflow-hidden'
                                            >
                                                <img
                                                    src={image}
                                                    alt={`${villa.title} ${index + 2}`}
                                                    className='w-full h-full object-cover'
                                                    onError={e => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                                <div className='w-full h-full flex items-center justify-center text-gray-400 text-xs'>
                                                    Failed to load
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Villa Info */}
                    <div className='space-y-6'>
                        {/* Basic Info */}
                        <div className='bg-white rounded-lg border border-gray-200 p-6'>
                            <h3 className='font-semibold text-lg text-gray-900 mb-4'>Basic Information</h3>

                            <div className='space-y-4'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='flex items-center'>
                                        <BedDouble className='w-5 h-5 text-gray-400 mr-3' />
                                        <div>
                                            <p className='text-sm text-gray-600'>Bedrooms</p>
                                            <p className='font-medium'>{villa.bedrooms}</p>
                                        </div>
                                    </div>
                                    <div className='flex items-center'>
                                        <Bath className='w-5 h-5 text-gray-400 mr-3' />
                                        <div>
                                            <p className='text-sm text-gray-600'>Bathrooms</p>
                                            <p className='font-medium'>{villa.bathrooms}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='flex items-center'>
                                        <Users className='w-5 h-5 text-gray-400 mr-3' />
                                        <div>
                                            <p className='text-sm text-gray-600'>Max Guests</p>
                                            <p className='font-medium'>{villa.maxGuests}</p>
                                        </div>
                                    </div>
                                    <div className='flex items-center'>
                                        <DollarSign className='w-5 h-5 text-gray-400 mr-3' />
                                        <div>
                                            <p className='text-sm text-gray-600'>Price per Night</p>
                                            <p className='font-medium'>
                                                {villaApi.formatPrice(Number(villa.pricePerNight))}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex items-center'>
                                    {villa.isActive ? (
                                        <Eye className='w-5 h-5 text-green-500 mr-3' />
                                    ) : (
                                        <EyeOff className='w-5 h-5 text-red-500 mr-3' />
                                    )}
                                    <div>
                                        <p className='text-sm text-gray-600'>Visibility</p>
                                        <p className='font-medium'>{villa.isActive ? 'Active' : 'Inactive'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Owner Info */}
                        <div className='bg-white rounded-lg border border-gray-200 p-6'>
                            <h3 className='font-semibold text-lg text-gray-900 mb-4'>Owner Information</h3>
                            <div className='space-y-3'>
                                <div>
                                    <p className='text-sm text-gray-600'>Name</p>
                                    <p className='font-medium'>{villa.owner.fullName}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Email</p>
                                    <p className='font-medium'>{villa.owner.email}</p>
                                </div>
                                {villa.owner.phone && (
                                    <div>
                                        <p className='text-sm text-gray-600'>Phone</p>
                                        <p className='font-medium'>{villa.owner.phone}</p>
                                    </div>
                                )}
                                <div>
                                    <p className='text-sm text-gray-600'>Role</p>
                                    <p className='font-medium'>{villa.owner.role}</p>
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className='bg-white rounded-lg border border-gray-200 p-6'>
                            <h3 className='font-semibold text-lg text-gray-900 mb-4'>Important Dates</h3>
                            <div className='space-y-3'>
                                <div className='flex items-center'>
                                    <Calendar className='w-5 h-5 text-gray-400 mr-3' />
                                    <div>
                                        <p className='text-sm text-gray-600'>Created</p>
                                        <p className='font-medium'>{formatDate(villa.createdAt)}</p>
                                    </div>
                                </div>
                                <div className='flex items-center'>
                                    <Calendar className='w-5 h-5 text-gray-400 mr-3' />
                                    <div>
                                        <p className='text-sm text-gray-600'>Last Updated</p>
                                        <p className='font-medium'>{formatDate(villa.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description and Amenities */}
                    <div className='lg:col-span-3 space-y-6'>
                        {/* Description */}
                        {villa.description && (
                            <div className='bg-white rounded-lg border border-gray-200 p-6'>
                                <h3 className='font-semibold text-lg text-gray-900 mb-4'>Description</h3>
                                <p className='text-gray-700 leading-relaxed'>{villa.description}</p>
                            </div>
                        )}

                        {/* Amenities */}
                        <div className='bg-white rounded-lg border border-gray-200 p-6'>
                            <h3 className='font-semibold text-lg text-gray-900 mb-4'>
                                Amenities ({villa.amenities?.length || 0})
                            </h3>
                            {villa.amenities && villa.amenities.length > 0 ? (
                                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
                                    {villa.amenities.map((amenity, index) => (
                                        <div key={index} className='flex items-center p-3 bg-gray-50 rounded-lg'>
                                            <span className='text-sm font-medium'>
                                                {villaApi.getAmenityDisplayName(amenity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className='text-gray-500'>No amenities listed</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                /* Bookings Tab */
                <div className='bg-white rounded-lg border border-gray-200'>
                    <div className='p-6 border-b border-gray-200'>
                        <h3 className='font-semibold text-lg text-gray-900'>Booking History</h3>
                        <p className='text-gray-600'>All bookings for this villa</p>
                    </div>

                    {bookings && bookings.length > 0 ? (
                        <div className='overflow-x-auto'>
                            <table className='w-full'>
                                <thead className='bg-gray-50'>
                                    <tr>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Guest
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Dates
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Guests
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Total Price
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Status
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Created
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='bg-white divide-y divide-gray-200'>
                                    {bookings.map(booking => (
                                        <tr key={booking.id} className='hover:bg-gray-50'>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <div>
                                                    <div className='text-sm font-medium text-gray-900'>
                                                        {booking.guest?.fullName || 'Unknown Guest'}
                                                    </div>
                                                    <div className='text-sm text-gray-500'>
                                                        {booking.guest?.email || 'No email'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <div className='text-sm text-gray-900'>
                                                    {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                                                </div>
                                                <div className='text-sm text-gray-500'>
                                                    {bookingApi.getStayDuration(booking.checkIn, booking.checkOut)}{' '}
                                                    nights
                                                </div>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                                {booking.totalGuests} guests
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                                {bookingApi.formatPrice(Number(booking.totalPrice))}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                {getBookingStatusBadge(booking.status)}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                                {formatDate(booking.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className='p-6 text-center'>
                            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <Calendar className='w-8 h-8 text-gray-400' />
                            </div>
                            <h3 className='text-lg font-medium text-gray-900 mb-2'>No Bookings Yet</h3>
                            <p className='text-gray-600'>This villa hasn't received any bookings.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
