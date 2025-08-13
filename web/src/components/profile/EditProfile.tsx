import React, { useState, useEffect } from 'react';
import { Edit3, Mail, User, Phone, Calendar, AlertCircle } from 'lucide-react';
import { userApi, type UpdateProfileData } from '@/api/userApi';
import type { User as ComponentUser } from '@/utils/types';
import { THToast } from '@/components/common/Toast';
import { useAuth } from '@/contexts/AuthContext';

interface EditProfileProps {
    user: ComponentUser;
}

interface FormFieldProps {
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
    icon?: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    error,
    icon,
}) => (
    <div className='mb-6'>
        <label className='block text-sm font-medium text-[#C75D2C] mb-2'>
            {label} {required && <span className='text-red-500'>*</span>}
        </label>
        <div className='relative'>
            {icon && <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D96F32]'>{icon}</div>}
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full ${
                    icon ? 'pl-10' : ''
                } pr-4 py-3 border-2 rounded-xl bg-white/40 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none transition-all duration-300 ${
                    error ? 'border-red-500 focus:border-red-600' : 'border-[#F8B259]/50 focus:border-[#D96F32]'
                }`}
            />
        </div>
        {error && (
            <p className='mt-2 text-sm text-red-600 flex items-center'>
                <AlertCircle className='w-4 h-4 mr-1' />
                {error}
            </p>
        )}
    </div>
);

const EditProfile: React.FC<EditProfileProps> = ({ user }) => {
    const { updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [profileForm, setProfileForm] = useState<UpdateProfileData>({
        email: '',
        fullName: '',
        phone: '',
        dateOfBirth: '',
    });

    const formatDateForInput = (date: Date | string | undefined): string => {
        if (!date) return '';

        let dateObj: Date;

        if (typeof date === 'string') {
            if (date.includes('T')) {
                dateObj = new Date(date);
            } else if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                return date;
            } else {
                dateObj = new Date(date);
            }
        } else {
            dateObj = date;
        }

        if (isNaN(dateObj.getTime())) {
            return '';
        }

        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        if (user) {
            setProfileForm({
                email: user.email || '',
                fullName: user.fullName || '',
                phone: user.phone || '',
                dateOfBirth: formatDateForInput(user.dateOfBirth),
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const result = await userApi.updateProfile(profileForm);

            if (result.success && result.user) {
                // Update user data in AuthContext and localStorage
                updateUser({
                    email: profileForm.email,
                    fullName: profileForm.fullName,
                    phone: profileForm.phone,
                    dateOfBirth: profileForm.dateOfBirth ? new Date(profileForm.dateOfBirth) : undefined,
                });
                THToast.success('Profile updated successfully!');
            } else if (result.errors) {
                // Handle validation errors from backend
                const errorObj: Record<string, string> = {};
                result.errors.forEach(error => {
                    // Parse error messages to set field-specific errors
                    if (error.toLowerCase().includes('email')) {
                        errorObj.email = error;
                    } else if (error.toLowerCase().includes('phone')) {
                        errorObj.phone = error;
                    } else if (error.toLowerCase().includes('name')) {
                        errorObj.fullName = error;
                    } else if (error.toLowerCase().includes('date') || error.toLowerCase().includes('birth')) {
                        errorObj.dateOfBirth = error;
                    } else {
                        // General error
                        THToast.error('Update failed', error);
                    }
                });
                setErrors(errorObj);

                if (Object.keys(errorObj).length === 0) {
                    THToast.error('Update failed', result.errors.join(', '));
                }
            }
        } catch (error: any) {
            THToast.error('Update failed', error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='flex items-center mb-6'>
                <Edit3 className='w-5 h-5 text-[#D96F32] mr-2' />
                <h2 className='text-xl font-semibold text-[#C75D2C] font-butler'>Edit Profile</h2>
            </div>

            <form onSubmit={handleProfileUpdate}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                        label='Email'
                        type='email'
                        value={profileForm.email || ''}
                        onChange={value => setProfileForm(prev => ({ ...prev, email: value }))}
                        placeholder='Enter your email'
                        required
                        error={errors.email}
                        icon={<Mail className='w-4 h-4' />}
                    />

                    <FormField
                        label='Full Name'
                        value={profileForm.fullName || ''}
                        onChange={value => setProfileForm(prev => ({ ...prev, fullName: value }))}
                        placeholder='Enter your full name'
                        required
                        error={errors.fullName}
                        icon={<User className='w-4 h-4' />}
                    />

                    <FormField
                        label='Phone'
                        type='tel'
                        value={profileForm.phone || ''}
                        onChange={value => setProfileForm(prev => ({ ...prev, phone: value }))}
                        placeholder='Enter your phone number (+212... or 06... or 07...)'
                        error={errors.phone}
                        icon={<Phone className='w-4 h-4' />}
                    />

                    <FormField
                        label='Date of Birth'
                        type='date'
                        value={profileForm.dateOfBirth || ''}
                        onChange={value => setProfileForm(prev => ({ ...prev, dateOfBirth: value }))}
                        error={errors.dateOfBirth}
                        icon={<Calendar className='w-4 h-4' />}
                    />
                </div>

                <div className='mt-8'>
                    <button
                        type='submit'
                        disabled={loading}
                        className='bg-gradient-to-r cursor-pointer from-[#D96F32] to-[#C75D2C] text-white px-8 py-3 rounded-xl hover:from-[#C75D2C] hover:to-[#D96F32] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2'
                    >
                        {loading ? (
                            <>
                                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                                <span>Updating...</span>
                            </>
                        ) : (
                            <>
                                <Edit3 className='w-4 h-4' />
                                <span>Update Profile</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
