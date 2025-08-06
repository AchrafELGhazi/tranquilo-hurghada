import { Car, Utensils, Waves, Wifi } from "lucide-react";

const FeaturesSection = () => {
    const features = [
        {
            icon: <Waves className='w-8 h-8' />,
            title: 'Red Sea Access',
            description: 'Private beach with crystal-clear waters and world-class diving spots',
        },
        {
            icon: <Utensils className='w-8 h-8' />,
            title: 'Gourmet Dining',
            description: 'Four restaurants serving international cuisine and local delicacies',
        },
        {
            icon: <Wifi className='w-8 h-8' />,
            title: 'Modern Amenities',
            description: 'High-speed WiFi, spa services, and 24/7 concierge support',
        },
        {
            icon: <Car className='w-8 h-8' />,
            title: 'Premium Services',
            description: 'Airport transfers, car rental, and personalized tour arrangements',
        },
    ];

    return (
        <section className='py-20 bg-cream'>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='text-center mb-16'>
                    <h2 className='font-butler-700 text-5xl text-burnt-orange mb-6'>Why Choose Tranquilo?</h2>
                    <p className='font-roboto-400 text-xl text-burnt-orange-70 max-w-3xl mx-auto'>
                        Discover unparalleled luxury and comfort in the heart of Hurghada's most pristine location
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className='group text-center p-8 rounded-2xl bg-white hover:bg-terracotta-10 transition-all duration-300 hover:shadow-xl hover:-translate-y-2'
                        >
                            <div className='inline-flex items-center justify-center w-16 h-16 bg-terracotta-20 text-terracotta rounded-full mb-6 group-hover:bg-terracotta group-hover:text-cream transition-all duration-300'>
                                {feature.icon}
                            </div>
                            <h3 className='font-butler-700 text-xl text-burnt-orange mb-4'>{feature.title}</h3>
                            <p className='font-roboto-400 text-burnt-orange-70 leading-relaxed'>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
export default FeaturesSection;