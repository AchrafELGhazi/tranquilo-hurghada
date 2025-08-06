import { Star } from "lucide-react";

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: 'Sarah Johnson',
            location: 'London, UK',
            rating: 5,
            text: 'Absolutely magical experience! The service was impeccable and the views were breathtaking.',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        },
        {
            name: 'Ahmed Hassan',
            location: 'Cairo, Egypt',
            rating: 5,
            text: 'Perfect blend of luxury and authenticity. The staff made our honeymoon unforgettable.',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        },
        {
            name: 'Maria Rodriguez',
            location: 'Barcelona, Spain',
            rating: 5,
            text: "The most beautiful hotel I've ever stayed at. Every detail was perfect!",
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        },
    ];

    return (
        <section className='py-20 bg-cream'>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='text-center mb-16'>
                    <h2 className='font-butler-700 text-5xl text-burnt-orange mb-6'>Guest Experiences</h2>
                    <p className='font-roboto-400 text-xl text-burnt-orange-70'>
                        Hear what our guests say about their stay
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300'
                        >
                            <div className='flex items-center mb-6'>
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className='w-16 h-16 rounded-full object-cover mr-4'
                                />
                                <div>
                                    <h4 className='font-roboto-700 text-burnt-orange text-lg'>{testimonial.name}</h4>
                                    <p className='font-roboto-400 text-burnt-orange-60 text-sm'>
                                        {testimonial.location}
                                    </p>
                                </div>
                            </div>

                            <div className='flex mb-4'>
                                {[...Array(testimonial.rating)].map((_, idx) => (
                                    <Star key={idx} className='w-5 h-5 text-golden-yellow fill-current' />
                                ))}
                            </div>

                            <p className='font-roboto-400 text-burnt-orange-80 italic leading-relaxed'>
                                "{testimonial.text}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;