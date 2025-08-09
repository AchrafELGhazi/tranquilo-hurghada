import ArticlesSection from '@/components/home/ArticlesSection';
import BookingSection from '@/components/home/BookingSection';
import ExploreHurghada from '@/components/home/ExploreHurghada';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import VillaShowcase from '@/components/home/VillaShowcase';

const Home = () => {
    return (
        <div className='min-h-screen bg-cream'>
            <style>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 1s ease-out;
                }

                .animate-fade-in-up-delay {
                    animation: fade-in-up 1s ease-out 0.3s both;
                }
            `}</style>

            <HeroSection />
            <BookingSection />
            <VillaShowcase />
            <ServicesSection />
            <ExploreHurghada />
            <ArticlesSection />
        </div>
    );
};

export default Home;
