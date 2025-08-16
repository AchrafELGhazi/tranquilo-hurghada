import React from 'react';
import { LogIn, X } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface SignInModalProps {
    isOpen: boolean;
    onClose: () => void;
    villaTitle: string;
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, villaTitle }) => {

    const { lang } = useParams()
    const handleSignIn = () => { 
        window.location.href = `/${lang}/signin`;
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
            <div className='bg-white/95 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100'>
                <div className='flex items-center justify-between mb-6'>
                    <h3 className='text-2xl font-bold text-[#C75D2C] font-butler'>Sign in Required</h3>
                    <button onClick={onClose} className='p-2 hover:bg-[#F8B259]/20 rounded-xl transition-colors group'>
                        <X className='w-5 h-5 text-[#C75D2C] group-hover:rotate-90 transition-transform duration-200 cursor-pointer' />
                    </button>
                </div>

                <div className='text-center mb-6'>
                    <p className='text-[#C75D2C] mb-4'>
                        To complete your booking for <strong className='text-[#D96F32]'>{villaTitle}</strong>, please
                        sign in to your account.
                    </p>
                </div>

                <div className='flex flex-col space-y-3'>
                    <button
                        onClick={handleSignIn}
                        className='w-full bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white py-3 px-6 rounded-xl font-bold hover:from-[#C75D2C] hover:to-[#D96F32] hover:transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2'
                    >
                        <LogIn className='w-5 h-5' />
                        <span>Sign In</span>
                    </button>
                    <button
                        onClick={onClose}
                        className='w-full bg-white/50 text-[#C75D2C] py-3 px-6 rounded-xl font-semibold border-2 border-[#F8B259]/50 hover:bg-white/70 transition-all duration-300'
                    >
                        Continue as Guest
                    </button>
                    <p className='text-sm text-center text-[#C75D2C]/70'>
                        <strong>Note:</strong> Continuing as a guest will not allow you to complete the booking.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignInModal;
