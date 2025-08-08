import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    Plus,
    Eye,
    Edit,
    Trash2,
    MapPin,
    BedDouble,
    Bath,
    Users,
    DollarSign,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { villaApi, type VillaFilters } from '@/api/villaApi';
import type { Villa } from '@/utils/types';

export const AdminVillas: React.FC = () => {
    const navigate = useNavigate();
    const [villas, setVillas] = useState<Villa[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [cityFilter, setCityFilter] = useState('');
    const [sortBy, setSortBy] = useState<'title' | 'pricePerNight' | 'createdAt'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [showFilters, setShowFilters] = useState(false);

    const fetchVillas = async () => {
        try {
            setLoading(true);
            setError(null);

            const filters: VillaFilters = {
                page: currentPage,
                limit: 12,
                sortBy,
                sortOrder,
            };

            if (statusFilter) {
                filters.status = statusFilter as any;
            }

            if (cityFilter) {
                filters.city = cityFilter;
            }

            const response = await villaApi.getAllVillas(filters);
            setVillas(response.villas);
            setTotalPages(response.pagination.pages);
            setTotalCount(response.pagination.total);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch villas');
            console.error('Error fetching villas:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVillas();
    }, [currentPage, statusFilter, cityFilter, sortBy, sortOrder]);

    const handleSearch = () => {
        setCurrentPage(1);
        fetchVillas();
    };

    const handleDelete = async (villaId: string) => {
        if (!confirm('Are you sure you want to delete this villa? This action cannot be undone.')) {
            return;
        }

        try {
            await villaApi.deleteVilla(villaId);
            fetchVillas(); // Refresh the list
        } catch (err: any) {
            alert('Failed to delete villa: ' + err.message);
        }
    };

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

    const filteredVillas = villas.filter(
        villa =>
            villa.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            villa.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            villa.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <button
                    onClick={() => navigate('create')}
                    className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                    <Plus className='w-4 h-4 mr-2' />
                    Add Villa
                </button>
            </div>

            {/* Search and Filters */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
                <div className='flex flex-col lg:flex-row gap-4'>
                    {/* Search */}
                    <div className='flex-1'>
                        <div className='relative'>
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                            <input
                                type='text'
                                placeholder='Search villas by title, city, or address...'
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                onKeyPress={e => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className='inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors'
                    >
                        <Filter className='w-4 h-4 mr-2' />
                        Filters
                    </button>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className='mt-4 pt-4 border-t border-gray-200'>
                        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value)}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                >
                                    <option value=''>All Statuses</option>
                                    <option value='AVAILABLE'>Available</option>
                                    <option value='UNAVAILABLE'>Unavailable</option>
                                    <option value='MAINTENANCE'>Maintenance</option>
                                </select>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>City</label>
                                <input
                                    type='text'
                                    placeholder='Filter by city'
                                    value={cityFilter}
                                    onChange={e => setCityFilter(e.target.value)}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value as any)}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                >
                                    <option value='createdAt'>Date Created</option>
                                    <option value='title'>Title</option>
                                    <option value='pricePerNight'>Price</option>
                                </select>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Order</label>
                                <select
                                    value={sortOrder}
                                    onChange={e => setSortOrder(e.target.value as any)}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                >
                                    <option value='desc'>Descending</option>
                                    <option value='asc'>Ascending</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Results Summary */}
            <div className='flex justify-between items-center'>
                <p className='text-gray-600'>
                    Showing {filteredVillas.length} of {totalCount} villas
                </p>
            </div>

            {/* Error State */}
            {error && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <p className='text-red-800'>{error}</p>
                </div>
            )}

            {/* Villas Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredVillas.map(villa => (
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
                                    to={`/admin/villas/${villa.id}`}
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
                                <button
                                    onClick={() => handleDelete(villa.id)}
                                    className='flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm'
                                >
                                    <Trash2 className='w-4 h-4 mr-1' />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredVillas.length === 0 && !loading && (
                <div className='text-center py-12'>
                    <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <Search className='w-8 h-8 text-gray-400' />
                    </div>
                    <h3 className='text-lg font-medium text-gray-900 mb-2'>No villas found</h3>
                    <p className='text-gray-600 mb-4'>Try adjusting your search criteria or filters.</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className='flex items-center justify-center space-x-2'>
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className='inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        <ChevronLeft className='w-4 h-4 mr-1' />
                        Previous
                    </button>

                    <div className='flex space-x-1'>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                        currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className='inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        Next
                        <ChevronRight className='w-4 h-4 ml-1' />
                    </button>
                </div>
            )}
        </div>
    );
};
