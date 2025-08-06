import ContactSection from "@/components/home/ContactSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HeroSection from "@/components/home/HeroSection";
import RoomShowcase from "@/components/home/RoomShowcase";
import TestimonialsSection from "@/components/home/TestimonialsSection";

// Main Home Component
const Home = () => {
    return (
        <div className='min-h-screen' style={{ backgroundColor: '#aaa' }}>
            {/* Custom CSS for animations */}
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
            <FeaturesSection />
            <RoomShowcase />
            <TestimonialsSection />
            <ContactSection />
        </div>
    );
};

export default Home;
