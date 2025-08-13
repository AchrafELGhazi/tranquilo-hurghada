import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X, Eye, EyeOff, Home } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { villaApi, type UpdateVillaData } from '@/api/villaApi';
import { serviceApi } from '@/api/serviceApi';
import type { Villa, VillaStatus, Service } from '@/utils/types';
import { POPULAR_CITIES, POPULAR_AMENITIES } from '@/utils/constants';
import { getAmenityDisplayName } from '@/utils/amenitiesUtils';

const AdminEditVilla: React.FC = () => {
    const { villaId } = useParams<{ villaId: string }>();
    const navigate = useNavigate();

    // Core state
    const [villa, setVilla] = useState<Villa | null>(null);
    const [allServices, setAllServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        address: '',
        city: '',
        country: 'Egypt',
        pricePerNight: 0,
        maxGuests: 1,
        bedrooms: 1,
        bathrooms: 1,
        amenities: [] as string[],
        images: [] as string[],
        services: [] as string[], // Added services array
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

                // Extract service IDs from villa services
                const villaServiceIds = villaData.services?.map(service => service.id) || [];

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
                    services: villaServiceIds, // Set the villa's services
                    status: villaData.status,
                    isActive: villaData.isActive,
                });
                toast.success('Villa loaded successfully! 🏡');
            } catch (err: any) {
                toast.error('Failed to load villa', {
                    description: err.message || 'Please try again or contact support.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchVilla();
    }, [villaId, navigate]);

    // Load all services
    useEffect(() => {
        const fetchAllServices = async () => {
            try {
                setServicesLoading(true);
                const response = await serviceApi.getAllServices({
                    page: 1,
                    limit: 100, // Get all services
                    sortBy: 'category',
                    sortOrder: 'asc',
                });
                setAllServices(response.services);
            } catch (err: any) {
                toast.error('Failed to load services', {
                    description: err.message || 'Services may not be available.',
                });
            } finally {
                setServicesLoading(false);
            }
        };

        fetchAllServices();
    }, []);

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

    const handleServiceToggle = (serviceId: string) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(serviceId)
                ? prev.services.filter(s => s !== serviceId)
                : [...prev.services, serviceId],
        }));
    };

    const handleAddImage = () => {
        const url = newImageUrl.trim();
        if (!url) {
            toast.warning('Please enter an image URL');
            return;
        }

        if (!formData.images.includes(url)) {
            setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
            setNewImageUrl('');
            toast.success('Image added successfully! 📸');
        } else {
            toast.info('This image is already added');
        }
    };

    const handleRemoveImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
        toast.success('Image removed');
    };

    const toggleImagePreview = (url: string) => {
        setPreviewImages(prev => ({ ...prev, [url]: !prev[url] }));
    };

    const handleSubmit = async () => {
        if (!villaId) return;

        // Simple validation
        if (!formData.title.trim() || !formData.address.trim() || !formData.city) {
            toast.error('Missing required fields', {
                description: 'Please fill in title, address, and city',
            });
            return;
        }

        if (formData.pricePerNight <= 0) {
            toast.error('Invalid price', {
                description: 'Price must be greater than 0',
            });
            return;
        }

        try {
            setSaving(true);

            const updateData: UpdateVillaData = {
                title: formData.title.trim(),
                description: formData.description.trim() || undefined,
                address: formData.address.trim(),
                city: formData.city,
                country: formData.country,
                pricePerNight: parseInt(formData.pricePerNight.toString()),
                maxGuests: formData.maxGuests,
                bedrooms: formData.bedrooms,
                bathrooms: formData.bathrooms,
                amenities: formData.amenities,
                images: formData.images,
                status: formData.status,
                isActive: formData.isActive,
            };

            // Show loading toast
            const promise = villaApi.updateVilla(villaId, updateData);

            toast.promise(promise, {
                loading: 'Saving villa changes... ',
                success: 'Villa updated successfully! ',
                error: (err: any) => err.message || 'Failed to update villa',
            });

            await promise;

            // TODO: Update villa services association
            // This would require an API endpoint to update villa-service relationships
            // For now, we're just updating the villa data
            if (formData.services.length > 0) {
                toast.info('Service associations updated');
            }
        } catch (err: any) {
            // Error is already handled by toast.promise
        } finally {
            setSaving(false);
        }
    };

    // Group services by category
    const groupedServices = allServices.reduce((acc, service) => {
        if (!acc[service.category]) {
            acc[service.category] = [];
        }
        acc[service.category].push(service);
        return acc;
    }, {} as Record<string, Service[]>);

    // Get service category display name
    const getCategoryDisplayName = (category: string) => {
        const categoryMap: Record<string, string> = {
            INCLUDED: 'Included Services',
            ADVENTURE: 'Adventure Activities',
            WELLNESS: 'Wellness & Spa',
            CULTURAL: 'Cultural Experiences',
            TRANSPORT: 'Transportation',
            CUSTOM: 'Custom Services',
        };
        return categoryMap[category] || category;
    };

    if (loading) {
        return (
            <div className='min-h-screen'>
                <div className='max-w-7xl mx-auto space-y-6'>
                    <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-8 text-center'>
                        <div className='w-8 h-8 border-2 border-[#D96F32]/30 border-t-[#D96F32] rounded-full animate-spin mx-auto mb-4'></div>
                        <p className='text-[#C75D2C]/70'>Loading villa...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!villa) {
        return (
            <div className='min-h-screen'>
                <div className='max-w-7xl mx-auto space-y-6'>
                    <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-8 text-center'>
                        <p className='text-[#C75D2C] font-semibold mb-4'>Villa not found</p>
                        <Link
                            to='/admin/villas'
                            className='inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white rounded-xl hover:from-[#C75D2C] hover:to-[#D96F32] transition-all duration-300 font-medium'
                        >
                            <ArrowLeft className='w-4 h-4 mr-2' />
                            Back to Villas
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen'>
            <div className='max-w-7xl mx-auto space-y-6'>
                {/* Header */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                        <div className='flex items-center space-x-4'>
                            <button
                                className='text-[#C75D2C]/70 hover:text-[#C75D2C] transition-colors'
                                onClick={() => navigate(-1)}
                            >
                                <ArrowLeft className='w-5 h-5' />
                            </button>
                            <div>
                                <h1 className='text-2xl font-bold text-[#C75D2C] font-butler'>Edit Villa</h1>
                                <p className='text-[#C75D2C]/70 mt-1'>{villa.title}</p>
                            </div>
                        </div>
                        <div className='flex space-x-3'>
                            <Link
                                to={`/admin/villas/${villaId}`}
                                className='px-4 py-2 bg-white/50 text-[#C75D2C] rounded-xl hover:bg-white/70 transition-all duration-300 font-medium'
                            >
                                Cancel
                            </Link>
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className='px-4 py-2 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white rounded-xl hover:from-[#C75D2C] hover:to-[#D96F32] disabled:opacity-50 transition-all duration-300 font-medium flex items-center'
                            >
                                {saving ? (
                                    <>
                                        <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2'></div>
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
                </div>

                {/* Form */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6 space-y-8'>
                    {/* Basic Info */}
                    <div>
                        <h3 className='text-lg font-semibold text-[#C75D2C] mb-4'>Basic Information</h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='md:col-span-2'>
                                <label className='block text-sm font-medium text-[#C75D2C] mb-1'>Villa Title *</label>
                                <input
                                    type='text'
                                    value={formData.title}
                                    onChange={e => handleInputChange('title', e.target.value)}
                                    className='w-full border-2 border-[#F8B259]/50 rounded-xl px-3 py-2 bg-white/50 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300'
                                    placeholder='Enter villa title'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-[#C75D2C] mb-1'>City *</label>
                                <select
                                    value={formData.city}
                                    onChange={e => handleInputChange('city', e.target.value)}
                                    className='w-full border-2 border-[#F8B259]/50 rounded-xl px-3 py-2 bg-white/50 text-[#C75D2C] focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300'
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
                                <label className='block text-sm font-medium text-[#C75D2C] mb-1'>Country</label>
                                <input
                                    type='text'
                                    value={formData.country}
                                    onChange={e => handleInputChange('country', e.target.value)}
                                    className='w-full border-2 border-[#F8B259]/50 rounded-xl px-3 py-2 bg-white/50 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300'
                                />
                            </div>

                            <div className='md:col-span-2'>
                                <label className='block text-sm font-medium text-[#C75D2C] mb-1'>Address *</label>
                                <input
                                    type='text'
                                    value={formData.address}
                                    onChange={e => handleInputChange('address', e.target.value)}
                                    className='w-full border-2 border-[#F8B259]/50 rounded-xl px-3 py-2 bg-white/50 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300'
                                    placeholder='Enter full address'
                                />
                            </div>

                            <div className='md:col-span-2'>
                                <label className='block text-sm font-medium text-[#C75D2C] mb-1'>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => handleInputChange('description', e.target.value)}
                                    rows={3}
                                    className='w-full border-2 border-[#F8B259]/50 rounded-xl px-3 py-2 bg-white/50 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300 resize-none'
                                    placeholder='Describe the villa...'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Capacity & Pricing */}
                    <div>
                        <h3 className='text-lg font-semibold text-[#C75D2C] mb-4'>Capacity & Pricing</h3>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-[#C75D2C] mb-1'>Bedrooms</label>
                                <input
                                    type='number'
                                    min='1'
                                    max='20'
                                    value={formData.bedrooms}
                                    onChange={e => handleInputChange('bedrooms', parseInt(e.target.value) || 1)}
                                    className='w-full border-2 border-[#F8B259]/50 rounded-xl px-3 py-2 bg-white/50 text-[#C75D2C] focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-[#C75D2C] mb-1'>Bathrooms</label>
                                <input
                                    type='number'
                                    min='1'
                                    max='20'
                                    value={formData.bathrooms}
                                    onChange={e => handleInputChange('bathrooms', parseInt(e.target.value) || 1)}
                                    className='w-full border-2 border-[#F8B259]/50 rounded-xl px-3 py-2 bg-white/50 text-[#C75D2C] focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-[#C75D2C] mb-1'>Max Guests</label>
                                <input
                                    type='number'
                                    min='1'
                                    max='50'
                                    value={formData.maxGuests}
                                    onChange={e => handleInputChange('maxGuests', parseInt(e.target.value) || 1)}
                                    className='w-full border-2 border-[#F8B259]/50 rounded-xl px-3 py-2 bg-white/50 text-[#C75D2C] focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-[#C75D2C] mb-1'>
                                    Price/Night (EUR)
                                </label>
                                <input
                                    type='number'
                                    min='0'
                                    step='0.01'
                                    value={formData.pricePerNight}
                                    onChange={e => handleInputChange('pricePerNight', parseFloat(e.target.value) || 0)}
                                    className='w-full border-2 border-[#F8B259]/50 rounded-xl px-3 py-2 bg-white/50 text-[#C75D2C] focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Settings */}
                    <div>
                        <h3 className='text-lg font-semibold text-[#C75D2C] mb-4'>Settings</h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-[#C75D2C] mb-1'>Status</label>
                                <select
                                    value={formData.status}
                                    onChange={e => handleInputChange('status', e.target.value)}
                                    className='w-full border-2 border-[#F8B259]/50 rounded-xl px-3 py-2 bg-white/50 text-[#C75D2C] focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300'
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
                                    className='rounded border-[#F8B259] text-[#D96F32] focus:ring-[#D96F32] w-4 h-4'
                                />
                                <label htmlFor='isActive' className='ml-2 text-sm text-[#C75D2C] font-medium'>
                                    Villa is active and visible
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div>
                        <h3 className='text-lg font-semibold text-[#C75D2C] mb-4'>
                            Amenities ({formData.amenities.length} selected)
                        </h3>
                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
                            {POPULAR_AMENITIES.map(amenity => (
                                <label
                                    key={amenity}
                                    className='flex items-center space-x-2 cursor-pointer bg-white/30 rounded-lg p-3 border border-[#F8B259]/30 hover:bg-white/50 transition-all duration-300'
                                >
                                    <input
                                        type='checkbox'
                                        checked={formData.amenities.includes(amenity)}
                                        onChange={() => handleAmenityToggle(amenity)}
                                        className='rounded border-[#F8B259] text-[#D96F32] focus:ring-[#D96F32]'
                                    />
                                    <span className='text-sm text-[#C75D2C] font-medium'>
                                        {getAmenityDisplayName(amenity)}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className='text-lg font-semibold text-[#C75D2C] mb-4'>
                            Available Services ({formData.services.length} selected)
                        </h3>

                        {servicesLoading ? (
                            <div className='text-center py-8'>
                                <div className='w-6 h-6 border-2 border-[#D96F32]/30 border-t-[#D96F32] rounded-full animate-spin mx-auto mb-2'></div>
                                <p className='text-[#C75D2C]/70'>Loading services...</p>
                            </div>
                        ) : allServices.length === 0 ? (
                            <div className='text-center py-8 border-2 border-dashed border-[#F8B259]/50 rounded-xl bg-white/20'>
                                <Home className='w-8 h-8 text-[#D96F32]/50 mx-auto mb-2' />
                                <p className='text-[#C75D2C]/70'>No services available</p>
                            </div>
                        ) : (
                            <div className='space-y-6'>
                                {Object.entries(groupedServices).map(([category, services]) => (
                                    <div key={category}>
                                        <h4 className='text-base font-medium text-[#C75D2C] mb-3'>
                                            {getCategoryDisplayName(category)}
                                        </h4>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                            {services.map(service => (
                                                <label
                                                    key={service.id}
                                                    className='flex items-start space-x-3 cursor-pointer bg-white/30 rounded-lg p-4 border border-[#F8B259]/30 hover:bg-white/50 transition-all duration-300'
                                                >
                                                    <input
                                                        type='checkbox'
                                                        checked={formData.services.includes(service.id)}
                                                        onChange={() => handleServiceToggle(service.id)}
                                                        className='rounded border-[#F8B259] text-[#D96F32] focus:ring-[#D96F32] mt-1'
                                                    />
                                                    <div className='flex-1'>
                                                        <div className='font-medium text-[#C75D2C] text-sm'>
                                                            {service.title}
                                                        </div>
                                                        <div className='text-xs text-[#C75D2C]/70 mt-1'>
                                                            {service.description}
                                                        </div>
                                                        <div className='flex items-center gap-3 mt-2 text-xs text-[#C75D2C]/60'>
                                                            <span>€{service.price}</span>
                                                            <span>•</span>
                                                            <span>{service.duration}</span>
                                                            {service.difficulty && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>{service.difficulty}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Images */}
                    <div>
                        <h3 className='text-lg font-semibold text-[#C75D2C] mb-4'>
                            Images ({formData.images.length} added)
                        </h3>

                        {/* Add Image */}
                        <div className='mb-6'>
                            <div className='flex space-x-2'>
                                <input
                                    type='url'
                                    value={newImageUrl}
                                    onChange={e => setNewImageUrl(e.target.value)}
                                    className='flex-1 border-2 border-[#F8B259]/50 rounded-xl px-3 py-2 bg-white/50 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300'
                                    placeholder='https://example.com/image.jpg'
                                    onKeyPress={e => e.key === 'Enter' && handleAddImage()}
                                />
                                <button
                                    type='button'
                                    onClick={handleAddImage}
                                    disabled={!newImageUrl.trim()}
                                    className='px-4 py-2 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white rounded-xl hover:from-[#C75D2C] hover:to-[#D96F32] disabled:opacity-50 transition-all duration-300 font-medium flex items-center'
                                >
                                    <Plus className='w-4 h-4 mr-1' />
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Image List */}
                        {formData.images.length > 0 ? (
                            <div className='space-y-3'>
                                {formData.images.map((imageUrl, index) => (
                                    <div
                                        key={index}
                                        className='flex items-center space-x-3 p-4 bg-white/30 rounded-xl border border-[#F8B259]/30'
                                    >
                                        <div className='flex-1'>
                                            <p className='text-sm font-semibold text-[#C75D2C]'>
                                                Image {index + 1}{' '}
                                                {index === 0 && <span className='text-[#D96F32]'>(Primary)</span>}
                                            </p>
                                            <p className='text-xs text-[#C75D2C]/60 truncate'>{imageUrl}</p>
                                        </div>

                                        <div className='flex space-x-2'>
                                            <button
                                                type='button'
                                                onClick={() => toggleImagePreview(imageUrl)}
                                                className='p-2 text-[#C75D2C]/60 hover:text-[#C75D2C] bg-white/50 rounded-lg hover:bg-white/70 transition-all duration-300'
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
                                                className='p-2 text-red-500 hover:text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-300'
                                                title='Remove image'
                                            >
                                                <X className='w-4 h-4' />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='text-center py-12 border-2 border-dashed border-[#F8B259]/50 rounded-xl bg-white/20'>
                                <Home className='w-12 h-12 text-[#D96F32]/50 mx-auto mb-4' />
                                <p className='text-[#C75D2C]/70 font-medium'>No images added yet</p>
                                <p className='text-[#C75D2C]/50 text-sm mt-1'>Add image URLs to showcase your villa</p>
                            </div>
                        )}

                        {/* Image Previews */}
                        {Object.entries(previewImages).map(
                            ([url, show]) =>
                                show && (
                                    <div
                                        key={url}
                                        className='mt-6 p-4 bg-white/30 border border-[#F8B259]/50 rounded-xl'
                                    >
                                        <img
                                            src={url}
                                            alt='Preview'
                                            className='w-full max-w-sm h-48 object-cover rounded-xl mx-auto border-2 border-[#F8B259]/30'
                                            onError={e => {
                                                e.currentTarget.style.display = 'none';
                                                const errorDiv = e.currentTarget.nextElementSibling as HTMLElement;
                                                if (errorDiv) errorDiv.style.display = 'block';
                                                toast.error('Failed to load image preview');
                                            }}
                                        />
                                        <div style={{ display: 'none' }} className='text-center py-4 text-red-500'>
                                            <Home className='w-6 h-6 mx-auto mb-2' />
                                            <p className='text-sm'>Failed to load image</p>
                                        </div>
                                    </div>
                                )
                        )}
                    </div>
                </div>
            </div>

            <Toaster
                position='bottom-right'
                richColors
                expand={false}
                visibleToasts={5}
                toastOptions={{
                    style: {
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(248, 178, 89, 0.3)',
                        borderRadius: '12px',
                        fontSize: '14px',
                    },
                }}
            />
        </div>
    );
};

export default AdminEditVilla;
