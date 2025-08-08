import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Search, Eye, Edit, MapPin, BedDouble, Bath, Users, DollarSign } from 'lucide-react';
import { villaApi, type VillaFilters } from '@/api/villaApi';
import type { Villa } from '@/utils/types';

export const AdminVillas: React.FC = () => {
    const { lang } = useParams();
    const [villas, setVillas] = useState<Villa[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVillas = async () => {
        try {
            setLoading(true);
            setError(null);

            const filters: VillaFilters = {
                page: 1,
                limit: 1,
            };

            const response = await villaApi.getAllVillas(filters);
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
            AVAILABLE: { bg: 'bg-green-100', text: 'text-green-800', label: 'Available' },
            UNAVAILABLE: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unavailable' },
            MAINTENANCE: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Maintenance' },
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

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-96'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex justify-between items-center'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900'>Villa Management</h1>
                    <p className='text-gray-600'>Manage all villas in the system</p>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <p className='text-red-800'>{error}</p>
                </div>
            )}

            {/* Villas Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {villas.map(villa => (
                    <div
                        key={villa.id}
                        className='bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow'
                    >
                        {/* Villa Image */}
                        <div className='aspect-video bg-gray-200 relative'>
                            {villa.images && villa.images.length > 0 ? (
                                <img src={villa.images[0]} alt={villa.title} className='w-full h-full object-cover' />
                            ) : (
                                <div className='w-full h-full flex items-center justify-center text-gray-400'>
                                    No Image
                                </div>
                            )}
                            <div className='absolute top-3 right-3'>{getStatusBadge(villa.status)}</div>
                        </div>

                        {/* Villa Details */}
                        <div className='p-4'>
                            <div className='mb-3'>
                                <h3 className='font-semibold text-lg text-gray-900 mb-1'>{villa.title}</h3>
                                <div className='flex items-center text-gray-600 text-sm'>
                                    <MapPin className='w-4 h-4 mr-1' />
                                    {villa.city}, {villa.country}
                                </div>
                            </div>

                            {/* Villa Stats */}
                            <div className='grid grid-cols-3 gap-3 mb-4 text-sm'>
                                <div className='flex items-center text-gray-600'>
                                    <BedDouble className='w-4 h-4 mr-1' />
                                    {villa.bedrooms} beds
                                </div>
                                <div className='flex items-center text-gray-600'>
                                    <Bath className='w-4 h-4 mr-1' />
                                    {villa.bathrooms} baths
                                </div>
                                <div className='flex items-center text-gray-600'>
                                    <Users className='w-4 h-4 mr-1' />
                                    {villa.maxGuests} guests
                                </div>
                            </div>

                            {/* Price */}
                            <div className='flex items-center justify-between mb-4'>
                                <div className='flex items-center text-lg font-semibold text-gray-900'>
                                    <DollarSign className='w-4 h-4 mr-1' />
                                    {villaApi.formatPrice(villa.pricePerNight)}
                                    <span className='text-sm text-gray-600 font-normal'>/night</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className='flex space-x-2'>
                                <Link
                                    to={`/${lang}/admin/villas/${villa.id}`}
                                    className='flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm'
                                >
                                    <Eye className='w-4 h-4 mr-1' />
                                    View
                                </Link>
                                <Link
                                    to={`/admin/villas/${villa.id}/edit`}
                                    className='flex-1 inline-flex items-center justify-center px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm'
                                >
                                    <Edit className='w-4 h-4 mr-1' />
                                    Edit
                                </Link>
                         
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {villas.length === 0 && !loading && (
                <div className='text-center py-12'>
                    <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <Search className='w-8 h-8 text-gray-400' />
                    </div>
                    <h3 className='text-lg font-medium text-gray-900 mb-2'>No villas found</h3>
                    <p className='text-gray-600 mb-4'>Try adjusting your search criteria or filters.</p>
                </div>
            )}
        </div>
    );
};
