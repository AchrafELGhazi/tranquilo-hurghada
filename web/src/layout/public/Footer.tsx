import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube, Award, Star } from 'lucide-react';

export const Footer: React.FC = () => {
    const { t } = useTranslation();
    const { lang } = useParams();

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Youtube, href: '#', label: 'YouTube' },
    ];

    const quickLinks = [
        { label: t('navigation.home'), href: `/${lang}` },
        { label: t('navigation.about'), href: `/${lang}/about` },
        { label: t('navigation.services'), href: `/${lang}/services` },
        { label: t('navigation.contact'), href: `/${lang}/contact` },
    ];

    const legalLinks = [
        { label: t('footer.privacy'), href: `/${lang}/privacy` },
        { label: t('footer.terms'), href: `/${lang}/terms` },
        { label: t('footer.cookies'), href: `/${lang}/cookies` },
        { label: t('footer.accessibility'), href: `/${lang}/accessibility` },
    ];

    return (
        <footer className='relative bg-gradient-to-br from-[#D96F32] via-[#C75D2C] to-[#F8B259] text-[#F3E9DC] overflow-hidden'>
            {/* Ambient Background Effects */}
            <div className='absolute inset-0'>
                <div className='absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-[#F8B259]/20 via-transparent to-transparent rounded-full blur-3xl opacity-60'></div>
                <div className='absolute bottom-0 right-0 w-80 h-80 bg-gradient-radial from-[#D96F32]/20 via-transparent to-transparent rounded-full blur-3xl opacity-40'></div>
                <div className='absolute inset-0 bg-black/10 backdrop-blur-sm'></div>
            </div>

            <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Main Footer Content */}
                <div className='pt-8 sm:pt-12 lg:pt-16 pb-6 sm:pb-8 lg:pb-12'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12'>
                        {/* Brand Section */}
                        <div className='lg:col-span-2 space-y-4 sm:space-y-6'>
                            {/* Logo */}
                            <div className='group'>
                                <Link to={`/${lang}`}>
                                    <img
                                        src='/images/tranquilo-hurghada-logo.png'
                                        alt='Tranquilo Hurghada Logo'
                                        className='h-12 sm:h-20 w-auto object-contain'
                                        onError={e => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                        }}
                                    />
                                </Link>
                            </div>

                            {/* Description */}
                            <div className='space-y-3 sm:space-y-4'>
                                <h3 className='text-lg sm:text-xl font-semibold text-[#F3E9DC] font-butler tracking-wide'>
                                    {/* {t('footer.brandTitle')} */}
                                </h3>
                                <p className='text-[#F3E9DC]/80 leading-relaxed text-sm max-w-md'>
                                    {t('footer.brandDescription')}
                                </p>
                            </div>

                            {/* Awards & Certifications */}
                            <div className='flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 pt-2'>
                                <div className='flex items-center space-x-2 bg-[#F3E9DC]/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-[#F3E9DC]/20'>
                                    <Award className='w-4 h-4 text-[#F8B259]' />
                                    <span className='text-xs font-medium text-[#F3E9DC]'>
                                        {t('footer.awardWinner')}
                                    </span>
                                </div>
                                <div className='flex items-center space-x-2 bg-[#F3E9DC]/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-[#F3E9DC]/20'>
                                    <Star className='w-4 h-4 text-[#F8B259]' />
                                    <span className='text-xs font-medium text-[#F3E9DC]'>
                                        {t('footer.fiveStarRated')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className='space-y-4 sm:space-y-6'>
                            <h3 className='text-lg font-semibold text-[#F3E9DC] font-butler'>
                                {t('footer.quickLinks')}
                            </h3>
                            <ul className='space-y-2 sm:space-y-3'>
                                {quickLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            to={link.href}
                                            className='group flex items-center text-[#F3E9DC]/70 hover:text-[#F3E9DC] transition-all duration-300 text-sm'
                                        >
                                            <span className='w-2 h-2 bg-[#F8B259] rounded-full mr-3 transition-transform duration-300 group-hover:scale-125'></span>
                                            <span className='group-hover:translate-x-1 transition-transform duration-300'>
                                                {link.label}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className='space-y-4 sm:space-y-6'>
                            <h3 className='text-lg font-semibold text-[#F3E9DC] font-butler'>
                                {t('footer.contactInfo')}
                            </h3>
                            <div className='space-y-3 sm:space-y-4'>
                                {/* Location */}
                                <div className='flex items-start space-x-3 group'>
                                    <div className='mt-1 p-2 bg-[#F3E9DC]/10 backdrop-blur-sm rounded-lg border border-[#F3E9DC]/20 group-hover:bg-[#F3E9DC]/20 transition-colors duration-300'>
                                        <MapPin className='w-4 h-4 text-[#F8B259]' />
                                    </div>
                                    <div>
                                        <p className='text-[#F3E9DC]/90 text-sm font-medium'>North Hurghada, Red Sea</p>
                                        <p className='text-[#F3E9DC]/70 text-xs'>Villa No. 276, Mubarak Housing 7</p>
                                        <p className='text-[#F3E9DC]/70 text-xs'>Red Sea Governorate, Egypt</p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className='flex items-start space-x-3 group'>
                                    <div className='mt-1 p-2 bg-[#F3E9DC]/10 backdrop-blur-sm rounded-lg border border-[#F3E9DC]/20 group-hover:bg-[#F3E9DC]/20 transition-colors duration-300'>
                                        <Phone className='w-4 h-4 text-[#F8B259]' />
                                    </div>
                                    <div>
                                        <p className='text-[#F3E9DC]/90 text-sm font-medium'>Phone & WhatsApp</p>
                                        <a
                                            href='tel:+4917676230320'
                                            className='text-[#F3E9DC]/70 text-xs hover:text-[#F3E9DC] transition-colors duration-300'
                                        >
                                            +49 176 7623 0320
                                        </a>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className='flex items-start space-x-3 group'>
                                    <div className='mt-1 p-2 bg-[#F3E9DC]/10 backdrop-blur-sm rounded-lg border border-[#F3E9DC]/20 group-hover:bg-[#F3E9DC]/20 transition-colors duration-300'>
                                        <Mail className='w-4 h-4 text-[#F8B259]' />
                                    </div>
                                    <div>
                                        <p className='text-[#F3E9DC]/90 text-sm font-medium'>Email</p>
                                        <a
                                            href='mailto:nabil.laaouina@outlook.com'
                                            className='text-[#F3E9DC]/70 text-xs hover:text-[#F3E9DC] transition-colors duration-300'
                                        >
                                            nabil.laaouina@outlook.com
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className='border-t border-[#F3E9DC]/20 py-4 sm:py-6 lg:py-8'>
                    <div className='flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0'>
                        {/* Social Links */}
                        <div className='flex items-center space-x-3 sm:space-x-4'>
                            <span className='text-[#F3E9DC]/70 text-sm font-medium mr-2 hidden sm:inline'>
                                {t('footer.followUs')}
                            </span>
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    aria-label={social.label}
                                    className='group p-2 sm:p-3 bg-[#F3E9DC]/10 backdrop-blur-sm rounded-full border border-[#F3E9DC]/20 hover:bg-[#F3E9DC]/20 hover:border-[#F3E9DC]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#F8B259]/20'
                                >
                                    <social.icon className='w-4 h-4 text-[#F3E9DC]/70 group-hover:text-[#F3E9DC] transition-colors duration-300' />
                                </a>
                            ))}
                        </div>

                        {/* Copyright and Legal Links combined */}
                        <div className='flex flex-col items-center lg:items-end space-y-2'>
                            <p className='text-[#F3E9DC]/60 text-sm text-center lg:text-right'>
                                © 2025 {t('footer.companyName')}. {t('footer.allRightsReserved')}.
                            </p>
                            <div className='flex flex-wrap items-center justify-center lg:justify-end gap-3 sm:gap-4'>
                                {legalLinks.map((link, index) => (
                                    <React.Fragment key={index}>
                                        <Link
                                            to={link.href}
                                            className='text-[#F3E9DC]/60 hover:text-[#F3E9DC] text-xs transition-colors duration-300 hover:underline whitespace-nowrap'
                                        >
                                            {link.label}
                                        </Link>
                                        {index < legalLinks.length - 1 && (
                                            <span className='text-[#F3E9DC]/40 text-xs'>•</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
