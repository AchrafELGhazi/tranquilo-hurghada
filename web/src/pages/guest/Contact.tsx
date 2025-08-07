import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Send, Calendar } from 'lucide-react';

export const Contact: React.FC = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setFormData({ name: '', email: '', message: '' });
        setIsSubmitting(false);
        
        alert('Message sent successfully!');
    };

    return (
        <div className='min-h-screen bg-[#E8DCC6]'>
            {/* Hero Section with Background */}
            <div className='relative min-h-[70vh] flex items-center justify-center overflow-hidden'>
                {/* Background Image */}
                <div className='absolute inset-0'>
                    <img
                        src='/images/villa-hero-bg.jpg'
                        alt='Tranquilo Hurghada Villa'
                        className='w-full h-full object-cover'
                        onError={e => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                    {/* Overlay */}
                    <div className='absolute inset-0 bg-gradient-to-b from-[#C75D2C]/70 via-[#D96F32]/60 to-[#F8B259]/80'></div>
                    <div className='absolute inset-0 bg-black/30'></div>
                </div>

                {/* Hero Content */}
                <div className='relative z-10 text-center space-y-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto'>
                    <h1 className='text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white font-butler drop-shadow-2xl'>
                        {t('contact.hero.title')}
                    </h1>
                    <p className='text-sm sm:text-lg lg:text-xl text-white/95 max-w-4xl mx-auto leading-relaxed drop-shadow-lg'>
                        {t('contact.hero.subtitle')}
                    </p>

                    {/* Decorative Elements */}
                    <div className='flex items-center justify-center space-x-4 pt-8'>
                        <div className='w-16 h-0.5 bg-white/60'></div>
                        <div className='w-3 h-3 bg-[#F8B259] rounded-full'></div>
                        <div className='w-24 h-0.5 bg-white/60'></div>
                        <div className='w-3 h-3 bg-[#F8B259] rounded-full'></div>
                        <div className='w-16 h-0.5 bg-white/60'></div>
                    </div>
                </div>

                {/* Floating particles */}
                <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                    <div className='absolute top-1/4 left-1/4 w-2 h-2 bg-[#F8B259]/30 rounded-full animate-pulse'></div>
                    <div className='absolute top-1/3 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-1000'></div>
                    <div className='absolute bottom-1/3 left-1/5 w-1.5 h-1.5 bg-[#F8B259]/40 rounded-full animate-pulse delay-2000'></div>
                </div>
            </div>

       

            {/* Main Content */}
            <div className='bg-[#E8DCC6] py-12 px-4 sm:px-6 lg:px-8 -mt-1'>
                <div className='max-w-12xl mx-auto space-y-12'>
                    {/* Contact Information - One Line */}
                    <div className='bg-white/30 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6 sm:p-8'>
                        <h2 className='text-2xl font-bold text-[#C75D2C] mb-6 font-butler text-center'>
                            {t('contact.info.title')}
                        </h2>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8'>
                            {/* Location */}
                            <div className='flex items-center space-x-4 group'>
                                <div className='p-3 bg-[#D96F32]/20 rounded-xl border border-[#D96F32]/30 group-hover:bg-[#D96F32]/30 transition-colors duration-300 flex-shrink-0'>
                                    <MapPin className='w-5 h-5 text-[#D96F32]' />
                                </div>
                                <div className='min-w-0'>
                                    <h3 className='text-[#C75D2C] font-semibold mb-1'>
                                        {t('contact.info.location.title')}
                                    </h3>
                                    <p className='text-[#C75D2C]/80 text-sm leading-relaxed'>
                                        Villa No. 276, Mubarak Housing 7<br />
                                        North Hurghada, Red Sea, Egypt
                                    </p>
                                </div>
                            </div>

                            {/* Phone & WhatsApp */}
                            <div className='flex items-center space-x-4 group'>
                                <div className='p-3 bg-[#D96F32]/20 rounded-xl border border-[#D96F32]/30 group-hover:bg-[#D96F32]/30 transition-colors duration-300 flex-shrink-0'>
                                    <Phone className='w-5 h-5 text-[#D96F32]' />
                                </div>
                                <div className='min-w-0'>
                                    <h3 className='text-[#C75D2C] font-semibold mb-1'>
                                        {t('contact.info.phone.title')}
                                    </h3>
                                    <a
                                        href='tel:+4917676230320'
                                        className='text-[#C75D2C]/80 text-sm hover:text-[#D96F32] transition-colors duration-300'
                                    >
                                        +49 176 7623 0320
                                    </a>
                                </div>
                            </div>

                            {/* Email */}
                            <div className='flex items-center space-x-4 group'>
                                <div className='p-3 bg-[#D96F32]/20 rounded-xl border border-[#D96F32]/30 group-hover:bg-[#D96F32]/30 transition-colors duration-300 flex-shrink-0'>
                                    <Mail className='w-5 h-5 text-[#D96F32]' />
                                </div>
                                <div className='min-w-0'>
                                    <h3 className='text-[#C75D2C] font-semibold mb-1'>
                                        {t('contact.info.email.title')}
                                    </h3>
                                    <a
                                        href='mailto:nabil.laaouina@outlook.com'
                                        className='text-[#C75D2C]/80 text-sm hover:text-[#D96F32] transition-colors duration-300 break-all'
                                    >
                                        nabil.laaouina@outlook.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form - Full Width */}
                    <div className='bg-white/30 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6 sm:p-8'>
                        <h2 className='text-2xl font-bold text-[#C75D2C] mb-6 font-butler text-center'>
                            {t('contact.form.title')}
                        </h2>

                        <form onSubmit={handleSubmit} className='max-w-4xl mx-auto space-y-6'>
                            {/* Name and Email Row */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {/* Name Field */}
                                <div>
                                    <label htmlFor='name' className='block text-sm font-semibold text-[#C75D2C] mb-2'>
                                        {t('contact.form.name.label')}
                                    </label>
                                    <input
                                        id='name'
                                        name='name'
                                        type='text'
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 border-2 border-[#F8B259]/70 rounded-xl bg-white/40 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] focus:bg-white/60 transition-all duration-300'
                                        required
                                        disabled={isSubmitting}
                                        placeholder={t('contact.form.name.placeholder')}
                                    />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor='email' className='block text-sm font-semibold text-[#C75D2C] mb-2'>
                                        {t('contact.form.email.label')}
                                    </label>
                                    <input
                                        id='email'
                                        name='email'
                                        type='email'
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 border-2 border-[#F8B259]/70 rounded-xl bg-white/40 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] focus:bg-white/60 transition-all duration-300'
                                        required
                                        disabled={isSubmitting}
                                        placeholder={t('contact.form.email.placeholder')}
                                    />
                                </div>
                            </div>

                            {/* Message Field - Full Width */}
                            <div>
                                <label htmlFor='message' className='block text-sm font-semibold text-[#C75D2C] mb-2'>
                                    {t('contact.form.message.label')}
                                </label>
                                <textarea
                                    id='message'
                                    name='message'
                                    rows={6}
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    className='w-full px-4 py-3 border-2 border-[#F8B259]/70 rounded-xl bg-white/40 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] focus:bg-white/60 transition-all duration-300 resize-none'
                                    required
                                    disabled={isSubmitting}
                                    placeholder={t('contact.form.message.placeholder')}
                                />
                            </div>

                            {/* Privacy Notice */}
                            <div className='text-xs text-[#C75D2C]/60 italic text-center'>
                                {t('contact.form.privacy')}
                            </div>

                            {/* Submit Button */}
                            <div className='flex justify-center'>
                                <button
                                    type='submit'
                                    disabled={isSubmitting}
                                    className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center space-x-2 ${
                                        isSubmitting
                                            ? 'bg-[#C75D2C]/50 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-[#D96F32] to-[#C75D2C] hover:from-[#C75D2C] hover:to-[#D96F32] hover:transform hover:-translate-y-0.5 active:transform active:translate-y-0'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                                            <span>{t('contact.form.sending')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className='w-4 h-4' />
                                            <span>{t('contact.form.send')}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Book Now CTA - Full Width */}
                    <div className='bg-gradient-to-r from-[#D96F32] to-[#F8B259] rounded-2xl p-8 text-center border-2 border-[#F8B259]'>
                        <h3 className='text-xl font-bold text-white mb-4 font-butler'>{t('contact.cta.title')}</h3>
                        <p className='text-white/90 text-sm mb-6'>{t('contact.cta.subtitle')}</p>
                        <button className='bg-white text-[#D96F32] font-bold py-3 px-8 rounded-xl hover:bg-white/90 hover:transform hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2 mx-auto'>
                            <Calendar className='w-4 h-4' />
                            <span>{t('contact.cta.button')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};