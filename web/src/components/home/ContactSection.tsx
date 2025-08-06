import { Mail, MapPin, Phone } from "lucide-react";

const ContactSection = () => {
    return (
        <section className='py-20 bg-gradient-to-br from-terracotta to-burnt-orange'>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='text-center mb-16'>
                    <h2 className='font-butler-700 text-5xl text-cream mb-6'>Ready for Paradise?</h2>
                    <p className='font-roboto-400 text-xl text-cream-90 max-w-3xl mx-auto'>
                        Contact our team to plan your perfect getaway in Hurghada
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
                    <div className='text-center'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-cream-20 rounded-full mb-4'>
                            <Phone className='w-8 h-8 text-cream' />
                        </div>
                        <h3 className='font-butler-700 text-xl text-cream mb-2'>Call Us</h3>
                        <p className='font-roboto-400 text-cream-90'>+20 65 123 4567</p>
                    </div>

                    <div className='text-center'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-cream-20 rounded-full mb-4'>
                            <Mail className='w-8 h-8 text-cream' />
                        </div>
                        <h3 className='font-butler-700 text-xl text-cream mb-2'>Email</h3>
                        <p className='font-roboto-400 text-cream-90'>info@tranquilohurghada.com</p>
                    </div>

                    <div className='text-center'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-cream-20 rounded-full mb-4'>
                            <MapPin className='w-8 h-8 text-cream' />
                        </div>
                        <h3 className='font-butler-700 text-xl text-cream mb-2'>Location</h3>
                        <p className='font-roboto-400 text-cream-90'>Red Sea Coast, Hurghada</p>
                    </div>
                </div>

                <div className='text-center'>
                    <button className='px-12 py-4 bg-golden-yellow hover:bg-cream text-burnt-orange font-roboto-700 text-lg rounded-full transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1'>
                        Book Now - Special Offer
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;