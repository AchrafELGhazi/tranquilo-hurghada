import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X, Eye, EyeOff, AlertCircle, Check, Loader, Home } from 'lucide-react';
import { villaApi, type UpdateVillaData } from '@/api/villaApi';
import type { Villa, VillaStatus } from '@/utils/types';
import { POPULAR_CITIES, POPULAR_AMENITIES } from '@/utils/constants';

 const AdminEditVilla: React.FC = () => {
    const { villaId } = useParams<{ villaId: string }>();
    const navigate = useNavigate();

    // Core state
    const [villa, setVilla] = useState<Villa | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        address: '',
        city: '',
        country: 'Morocco',
        pricePerNight: 0,
        maxGuests: 1,
        bedrooms: 1,
        bathrooms: 1,
        amenities: [] as string[],
        images: [] as string[],
        status: 'AVAILABLE' as VillaStatus,
        isActive: true,
    });

    // UI state
    const [newImageUrl, setNewImageUrl] = useState('');
    const [previewImages, setPreviewImages] = useState<{ [key: string]: boolean }>({});

    // Load villa data
    useEffect(() => {
        if (!villaId) {
            navigate('/admin/villas');
            return;
        }

        const fetchVilla = async () => {
            try {
                setLoading(true);
                const villaData = await villaApi.getVillaById(villaId);
                setVilla(villaData);
                setFormData({
                    title: villaData.title,
                    description: villaData.description || '',
                    address: villaData.address,
                    city: villaData.city,
                    country: villaData.country,
                    pricePerNight: villaData.pricePerNight,
                    maxGuests: villaData.maxGuests,
                    bedrooms: villaData.bedrooms,
                    bathrooms: villaData.bathrooms,
                    amenities: villaData.amenities || [],
                    images: villaData.images || [],
                    status: villaData.status,
                    isActive: villaData.isActive,
                });
            } catch (err: any) {
                setError(err.message || 'Failed to fetch villa');
            } finally {
                setLoading(false);
            }
        };

        fetchVilla();
    }, [villaId, navigate]);

    // Form handlers
    const handleInputChange = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAmenityToggle = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity],
        }));
    };

    const handleAddImage = () => {
        const url = newImageUrl.trim();
        if (!url) return;

        if (!formData.images.includes(url)) {
            setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
            setNewImageUrl('');
        }
    };

    const handleRemoveImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const toggleImagePreview = (url: string) => {
        setPreviewImages(prev => ({ ...prev, [url]: !prev[url] }));
    };

    const handleSubmit = async () => {
        if (!villaId) return;

        // Simple validation
        if (!formData.title.trim() || !formData.address.trim() || !formData.city) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.pricePerNight <= 0) {
            setError('Price must be greater than 0');
            return;
        }

        try {
            setSaving(true);
            setError(null);

            const updateData: UpdateVillaData = {
                title: formData.title.trim(),
                description: formData.description.trim() || undefined,
                address: formData.address.trim(),
                city: formData.city,
                country: formData.country,
                pricePerNight: formData.pricePerNight,
                maxGuests: formData.maxGuests,
                bedrooms: formData.bedrooms,
                bathrooms: formData.bathrooms,
                amenities: formData.amenities,
                images: formData.images,
                status: formData.status,
                isActive: formData.isActive,
            };

            await villaApi.updateVilla(villaId, updateData);
            setSuccess('Villa updated successfully!');

            // Auto-clear success message
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to update villa');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-96'>
                <div className='text-center'>
                    <Loader className='w-8 h-8 animate-spin text-blue-600 mx-auto mb-4' />
                    <p className='text-gray-600'>Loading villa...</p>
                </div>
            </div>
        );
    }

    if (!villa) {
        return (
            <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
                <div className='flex items-center'>
                    <AlertCircle className='w-5 h-5 text-red-600 mr-2' />
                    <p className='text-red-800'>Villa not found</p>
                </div>
                <Link to='/admin/villas' className='inline-flex items-center mt-4 text-blue-600 hover:text-blue-700'>
                    <ArrowLeft className='w-4 h-4 mr-2' />
                    Back to Villas
                </Link>
            </div>
        );
    }

    return (
        <div className='max-w-4xl mx-auto space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                    <Link to={`/admin/villas/${villaId}`} className='text-gray-600 hover:text-gray-900'>
                        <ArrowLeft className='w-5 h-5' />
                    </Link>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-900'>Edit Villa</h1>
                        <p className='text-gray-600'>{villa.title}</p>
                    </div>
                </div>
                <div className='flex space-x-3'>
                    <Link
                        to={`/admin/villas/${villaId}`}
                        className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200'
                    >
                        Cancel
                    </Link>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center'
                    >
                        {saving ? (
                            <>
                                <Loader className='w-4 h-4 mr-2 animate-spin' />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className='w-4 h-4 mr-2' />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Messages */}
            {success && (
                <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                    <div className='flex items-center'>
                        <Check className='w-5 h-5 text-green-600 mr-2' />
                        <p className='text-green-800'>{success}</p>
                    </div>
                </div>
            )}

            {error && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <div className='flex items-center'>
                        <AlertCircle className='w-5 h-5 text-red-600 mr-2' />
                        <p className='text-red-800'>{error}</p>
                    </div>
                </div>
            )}

            {/* Form */}
            <div className='bg-white rounded-lg border border-gray-200 p-6 space-y-6'>
                {/* Basic Info */}
                <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>Basic Information</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='md:col-span-2'>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Villa Title *</label>
                            <input
                                type='text'
                                value={formData.title}
                                onChange={e => handleInputChange('title', e.target.value)}
                                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                placeholder='Enter villa title'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>City *</label>
                            <select
                                value={formData.city}
                                onChange={e => handleInputChange('city', e.target.value)}
                                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            >
                                <option value=''>Select a city</option>
                                {POPULAR_CITIES.map(city => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Country</label>
                            <input
                                type='text'
                                value={formData.country}
                                onChange={e => handleInputChange('country', e.target.value)}
                                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>

                        <div className='md:col-span-2'>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Address *</label>
                            <input
                                type='text'
                                value={formData.address}
                                onChange={e => handleInputChange('address', e.target.value)}
                                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                placeholder='Enter full address'
                            />
                        </div>

                        <div className='md:col-span-2'>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => handleInputChange('description', e.target.value)}
                                rows={3}
                                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                placeholder='Describe the villa...'
                            />
                        </div>
                    </div>
                </div>

                {/* Capacity & Pricing */}
                <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>Capacity & Pricing</h3>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Bedrooms</label>
                            <input
                                type='number'
                                min='1'
                                max='20'
                                value={formData.bedrooms}
                                onChange={e => handleInputChange('bedrooms', parseInt(e.target.value) || 1)}
                                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Bathrooms</label>
                            <input
                                type='number'
                                min='1'
                                max='20'
                                value={formData.bathrooms}
                                onChange={e => handleInputChange('bathrooms', parseInt(e.target.value) || 1)}
                                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Max Guests</label>
                            <input
                                type='number'
                                min='1'
                                max='50'
                                value={formData.maxGuests}
                                onChange={e => handleInputChange('maxGuests', parseInt(e.target.value) || 1)}
                                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Price/Night (MAD)</label>
                            <input
                                type='number'
                                min='0'
                                step='0.01'
                                value={formData.pricePerNight}
                                onChange={e => handleInputChange('pricePerNight', parseFloat(e.target.value) || 0)}
                                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>
                    </div>
                </div>

                {/* Settings */}
                <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>Settings</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Status</label>
                            <select
                                value={formData.status}
                                onChange={e => handleInputChange('status', e.target.value)}
                                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            >
                                <option value='AVAILABLE'>Available</option>
                                <option value='UNAVAILABLE'>Unavailable</option>
                                <option value='MAINTENANCE'>Maintenance</option>
                            </select>
                        </div>

                        <div className='flex items-center pt-6'>
                            <input
                                type='checkbox'
                                id='isActive'
                                checked={formData.isActive}
                                onChange={e => handleInputChange('isActive', e.target.checked)}
                                className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                            />
                            <label htmlFor='isActive' className='ml-2 text-sm text-gray-700'>
                                Villa is active and visible
                            </label>
                        </div>
                    </div>
                </div>

                {/* Amenities */}
                <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                        Amenities ({formData.amenities.length} selected)
                    </h3>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
                        {POPULAR_AMENITIES.map(amenity => (
                            <label key={amenity} className='flex items-center space-x-2 cursor-pointer'>
                                <input
                                    type='checkbox'
                                    checked={formData.amenities.includes(amenity)}
                                    onChange={() => handleAmenityToggle(amenity)}
                                    className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                                />
                                <span className='text-sm text-gray-700'>{villaApi.getAmenityDisplayName(amenity)}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Images */}
                <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                        Images ({formData.images.length} added)
                    </h3>

                    {/* Add Image */}
                    <div className='mb-4'>
                        <div className='flex space-x-2'>
                            <input
                                type='url'
                                value={newImageUrl}
                                onChange={e => setNewImageUrl(e.target.value)}
                                className='flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                placeholder='https://example.com/image.jpg'
                                onKeyPress={e => e.key === 'Enter' && handleAddImage()}
                            />
                            <button
                                type='button'
                                onClick={handleAddImage}
                                disabled={!newImageUrl.trim()}
                                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center'
                            >
                                <Plus className='w-4 h-4 mr-1' />
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Image List */}
                    {formData.images.length > 0 ? (
                        <div className='space-y-2'>
                            {formData.images.map((imageUrl, index) => (
                                <div key={index} className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                                    <div className='flex-1'>
                                        <p className='text-sm font-medium text-gray-900'>
                                            Image {index + 1}{' '}
                                            {index === 0 && <span className='text-blue-600'>(Primary)</span>}
                                        </p>
                                        <p className='text-xs text-gray-500 truncate'>{imageUrl}</p>
                                    </div>

                                    <div className='flex space-x-1'>
                                        <button
                                            type='button'
                                            onClick={() => toggleImagePreview(imageUrl)}
                                            className='p-1 text-gray-400 hover:text-gray-600'
                                            title='Toggle preview'
                                        >
                                            {previewImages[imageUrl] ? (
                                                <EyeOff className='w-4 h-4' />
                                            ) : (
                                                <Eye className='w-4 h-4' />
                                            )}
                                        </button>
                                        <button
                                            type='button'
                                            onClick={() => handleRemoveImage(index)}
                                            className='p-1 text-red-400 hover:text-red-600'
                                            title='Remove image'
                                        >
                                            <X className='w-4 h-4' />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-8 border-2 border-dashed border-gray-300 rounded-lg'>
                            <Home className='w-8 h-8 text-gray-400 mx-auto mb-2' />
                            <p className='text-gray-500'>No images added yet</p>
                        </div>
                    )}

                    {/* Image Previews */}
                    {Object.entries(previewImages).map(
                        ([url, show]) =>
                            show && (
                                <div key={url} className='mt-4 p-4 border border-gray-200 rounded-lg'>
                                    <img
                                        src={url}
                                        alt='Preview'
                                        className='w-full max-w-sm h-48 object-cover rounded-lg mx-auto'
                                        onError={e => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling!.style.display = 'block';
                                        }}
                                    />
                                    <div style={{ display: 'none' }} className='text-center py-4 text-red-500'>
                                        <AlertCircle className='w-6 h-6 mx-auto mb-2' />
                                        <p className='text-sm'>Failed to load image</p>
                                    </div>
                                </div>
                            )
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminEditVilla;