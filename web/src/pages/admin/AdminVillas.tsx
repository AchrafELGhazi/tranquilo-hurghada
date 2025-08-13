import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Eye, Edit, MapPin, BedDouble, Bath, Users, RefreshCw, AlertCircle, Home } from 'lucide-react';
import { villaApi } from '@/api/villaApi';
import type { Villa } from '@/utils/types';
import { formatPrice } from '@/utils/bookingUtils';

export const AdminVillas: React.FC = () => {
    const { lang } = useParams();
    const [villas, setVillas] = useState<Villa[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVillas = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await villaApi.getAllVillas();
            setVillas(response.villas);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch villas');
            console.error('Error fetching villas:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVillas();
    }, []);

    const getStatusBadge = (status: Villa['status']) => {
        const statusConfig = {
            AVAILABLE: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', label: 'Available' },
            UNAVAILABLE: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', label: 'Unavailable' },
            MAINTENANCE: {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                border: 'border-yellow-200',
                label: 'Maintenance',
            },
        };

        const config = statusConfig[status];
        return (
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
            >
                {config.label}
            </span>
        );
    };

    return (
        <div className='min-h-screen'>
            <div className='max-w-7xl mx-auto space-y-6'>
                {/* Header */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                        <div>
                            <h1 className='text-2xl font-bold text-[#C75D2C] font-butler'>Admin Villa</h1>
                            <p className='text-[#C75D2C]/70 mt-1'>Manage your villa</p>
                        </div>
                        <div className='flex items-center space-x-3'>
                            <button
                                onClick={fetchVillas}
                                disabled={loading}
                                className='flex items-center space-x-2 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white px-4 py-2 rounded-xl font-medium hover:from-[#C75D2C] hover:to-[#D96F32] transition-all duration-300 disabled:opacity-50'
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                <span>Refresh</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className='bg-red-50/80 backdrop-blur-sm border-2 border-red-200/60 rounded-xl p-4 flex items-start space-x-3'>
                        <AlertCircle className='w-5 h-5 text-red-600 mt-0.5 flex-shrink-0' />
                        <div>
                            <p className='text-red-800 font-semibold'>Error</p>
                            <p className='text-red-700 text-sm mt-1'>{error}</p>
                        </div>
                    </div>
                )}

                {/* Villas Cards */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                    {loading ? (
                        <div className='text-center py-12'>
                            <div className='w-8 h-8 border-2 border-[#D96F32]/30 border-t-[#D96F32] rounded-full animate-spin mx-auto mb-4'></div>
                            <p className='text-[#C75D2C]/70'>Loading villas...</p>
                        </div>
                    ) : villas.length === 0 ? (
                        <div className='text-center py-12'>
                            <Home className='w-12 h-12 text-[#D96F32]/50 mx-auto mb-4' />
                            <h3 className='text-lg font-semibold text-[#C75D2C] mb-2'>No villas found</h3>
                            <p className='text-[#C75D2C]/70'>Try adjusting your search or filter criteria.</p>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {villas.map(villa => (
                                <div
                                    key={villa.id}
                                    className='bg-white/60 backdrop-blur-sm border-2 border-[#F8B259]/50 rounded-2xl overflow-hidden hover:bg-white/80 hover:border-[#D96F32]/70 transition-all duration-300 shadow-lg hover:shadow-xl'
                                >
                                    {/* Villa Image */}
                                    <div className='aspect-video bg-gradient-to-br from-[#F8B259]/20 to-[#DEB887]/20 relative'>
                                        {villa.images && villa.images.length > 0 ? (
                                            <img
                                                src={villa.images[0]}
                                                alt={villa.title}
                                                className='w-full h-full object-cover'
                                            />
                                        ) : (
                                            <div className='w-full h-full flex items-center justify-center text-[#C75D2C]/50'>
                                                <Home className='w-12 h-12' />
                                            </div>
                                        )}
                                        <div className='absolute top-3 right-3'>{getStatusBadge(villa.status)}</div>
                                    </div>

                                    {/* Villa Details */}
                                    <div className='p-4'>
                                        <div className='mb-3'>
                                            <h3 className='font-semibold text-lg text-[#C75D2C] mb-1 line-clamp-1'>
                                                {villa.title}
                                            </h3>
                                            <div className='flex items-center text-[#C75D2C]/70 text-sm'>
                                                <MapPin className='w-4 h-4 mr-1 text-[#D96F32]' />
                                                {villa.city}, {villa.country}
                                            </div>
                                        </div>

                                        {/* Villa Stats */}
                                        <div className='grid grid-cols-3 gap-3 mb-4 text-sm'>
                                            <div className='flex items-center text-[#C75D2C]/70 bg-white/40 rounded-lg px-2 py-1'>
                                                <BedDouble className='w-4 h-4 mr-1 text-[#D96F32]' />
                                                <span className='font-medium'>{villa.bedrooms}</span>
                                            </div>
                                            <div className='flex items-center text-[#C75D2C]/70 bg-white/40 rounded-lg px-2 py-1'>
                                                <Bath className='w-4 h-4 mr-1 text-[#D96F32]' />
                                                <span className='font-medium'>{villa.bathrooms}</span>
                                            </div>
                                            <div className='flex items-center text-[#C75D2C]/70 bg-white/40 rounded-lg px-2 py-1'>
                                                <Users className='w-4 h-4 mr-1 text-[#D96F32]' />
                                                <span className='font-medium'>{villa.maxGuests}</span>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className='flex items-center justify-center mb-4'>
                                            <div className='flex items-center text-xl font-bold text-[#C75D2C] bg-gradient-to-r from-[#F8B259]/20 to-[#DEB887]/20 px-4 py-2 rounded-xl border border-[#F8B259]/30'>
                                                {formatPrice(villa.pricePerNight)}
                                                <span className='text-sm text-[#C75D2C]/70 font-normal ml-1'>
                                                    /night
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className='flex space-x-2'>
                                            <Link
                                                to={`/${lang}/admin/villas/${villa.id}`}
                                                className='flex-1 inline-flex items-center justify-center px-3 py-2 bg-[#D96F32]/20 text-[#D96F32] rounded-xl hover:bg-[#D96F32]/30 transition-all duration-300 text-sm font-medium'
                                            >
                                                <Eye className='w-4 h-4 mr-1' />
                                                View
                                            </Link>
                                            <Link
                                                to={`/${lang}/admin/villas/${villa.id}/edit`}
                                                className='flex-1 inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white rounded-xl hover:from-[#C75D2C] hover:to-[#D96F32] transition-all duration-300 text-sm font-medium'
                                            >
                                                <Edit className='w-4 h-4 mr-1' />
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
