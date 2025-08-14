import React from 'react';
import {
    // Technology & Internet
    Wifi,
    Monitor,
    Tv,
    Smartphone,
    Speaker,
    Gamepad2,
    Music,
    Radio,
    Headphones,
    Printer,
    Computer,
    Zap,

    // Kitchen & Dining
    Utensils,
    ChefHat,
    Coffee,
    Wine,
    UtensilsCrossed,
    Cookie,
    GlassWater,
    Beef,

    // Laundry & Cleaning
    Shirt,
    WashingMachine,
    Sparkles,

    // Climate Control
    Snowflake,
    Thermometer,
    Fan,
    Flame,
    Wind,
    Sun,

    // Outdoor & Recreation
    Waves,
    Trees,
    Flower,
    Umbrella,
    Mountain,
    Tent,
    Sofa,
    Armchair,
    Dumbbell,
    Activity,
    Target,
    Music4,
    Book,
    Gamepad,
    Baby,

    // Transportation & Parking
    Car,
    Bike,
    Key,
    Battery,
    Plane,
    Train,
    Bus,

    // Security & Safety
    Shield,
    Camera,
    Lock,
    Heart,
    Eye,
    ShieldCheck,
    KeyRound,

    // Views & Location
    MapPin,
    Sunrise,
    Sunset,
    Telescope,
    Compass,
    Map,

    // Bedroom & Sleeping
    Bed,
    Moon,
    SunDim,
    Clock,

    // Bathroom & Personal Care
    Bath,
    Droplets,
    Scissors,
    ShowerHead,

    // Accessibility
    Accessibility,
    ArrowUp,
    Volume2,
    Hand,

    // Family & Children
    Users,
    Crown,

    // Pets
    Dog,
    Cat,
    PawPrint,
    Home,

    // Business & Work
    Briefcase,
    Laptop,
    FileText,
    Presentation,
    Calendar,
    Phone,

    // Luxury & Premium
    Star,
    Award,
    Gift,
    Gem,
    Martini,
    PartyPopper,

    // Health & Wellness
    HeartHandshake,
    Leaf,
    Flower2,
    Apple,

    // Services
    Package,
    ShoppingBag,
    Info,
    UserCheck,

    // Unique Features
    Building,
    Castle,
    TreePine,
    Recycle,
    Lightbulb,
    Droplet,

    // Seasonal & Weather
    CloudSnow,
    CloudSun,

    // Special Occasions
    Cake,
    Building2,
} from 'lucide-react';

/**
 * Get the appropriate icon component for a given amenity
 * @param amenity - The amenity string to get an icon for
 * @param className - Optional className for styling (defaults to 'w-5 h-5 text-[#D96F32]')
 * @returns React.JSX.Element - The appropriate icon component
 */
export const getAmenityIcon = (amenity: string, className: string = 'w-5 h-5 text-[#D96F32]'): React.JSX.Element => {
    const amenityLower = amenity.toLowerCase().replace(/[_\s-]/g, '');

    // Internet & Technology
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) {
        return <Wifi className={className} />;
    }
    if (amenityLower.includes('tv') || amenityLower.includes('television') || amenityLower.includes('smarttv')) {
        return <Tv className={className} />;
    }
    if (amenityLower.includes('netflix') || amenityLower.includes('streaming')) {
        return <Monitor className={className} />;
    }
    if (amenityLower.includes('gaming') || amenityLower.includes('console')) {
        return <Gamepad2 className={className} />;
    }
    if (amenityLower.includes('sound') || amenityLower.includes('speaker') || amenityLower.includes('bluetooth')) {
        return <Speaker className={className} />;
    }
    if (amenityLower.includes('computer') || amenityLower.includes('workspace')) {
        return <Computer className={className} />;
    }
    if (amenityLower.includes('printer')) {
        return <Printer className={className} />;
    }
    if (amenityLower.includes('charging') || amenityLower.includes('usb')) {
        return <Zap className={className} />;
    }

    // Kitchen & Dining
    if (amenityLower.includes('kitchen') || amenityLower.includes('kitchenette')) {
        return <ChefHat className={className} />;
    }
    if (amenityLower.includes('microwave')) {
        return <Zap className={className} />; // Using Zap as microwave alternative
    }
    if (amenityLower.includes('dishwasher')) {
        return <Utensils className={className} />;
    }
    if (amenityLower.includes('refrigerator') || amenityLower.includes('freezer')) {
        return <Snowflake className={className} />; // Using Snowflake as refrigerator alternative
    }
    if (amenityLower.includes('oven') || amenityLower.includes('stove')) {
        return <Flame className={className} />;
    }
    if (amenityLower.includes('coffee') || amenityLower.includes('espresso')) {
        return <Coffee className={className} />;
    }
    if (amenityLower.includes('blender') || amenityLower.includes('toaster')) {
        return <Cookie className={className} />;
    }
    if (amenityLower.includes('dining') || amenityLower.includes('table')) {
        return <UtensilsCrossed className={className} />;
    }
    if (amenityLower.includes('bbq') || amenityLower.includes('barbecue') || amenityLower.includes('grill')) {
        return <Flame className={className} />;
    }
    if (amenityLower.includes('wine') || amenityLower.includes('bar') || amenityLower.includes('minibar')) {
        return <Wine className={className} />;
    }

    // Laundry & Cleaning
    if (amenityLower.includes('washing') || amenityLower.includes('washer')) {
        return <WashingMachine className={className} />;
    }
    if (amenityLower.includes('dryer')) {
        return <Shirt className={className} />;
    }
    if (amenityLower.includes('iron')) {
        return <Shirt className={className} />;
    }
    if (amenityLower.includes('vacuum')) {
        return <Wind className={className} />;
    }
    if (amenityLower.includes('cleaning') || amenityLower.includes('housekeeping')) {
        return <Sparkles className={className} />;
    }

    // Climate Control
    if (amenityLower.includes('airconditioning') || amenityLower.includes('centralair')) {
        return <Snowflake className={className} />;
    }
    if (amenityLower.includes('heating') || amenityLower.includes('centralheating')) {
        return <Thermometer className={className} />;
    }
    if (amenityLower.includes('fireplace')) {
        return <Flame className={className} />;
    }
    if (amenityLower.includes('fan')) {
        return <Fan className={className} />;
    }

    // Outdoor & Recreation
    if (amenityLower.includes('pool') || amenityLower.includes('swimming')) {
        return <Waves className={className} />;
    }
    if (amenityLower.includes('hottub') || amenityLower.includes('jacuzzi') || amenityLower.includes('spa')) {
        return <Waves className={className} />;
    }
    if (amenityLower.includes('garden') || amenityLower.includes('courtyard')) {
        return <Trees className={className} />;
    }
    if (amenityLower.includes('balcony') || amenityLower.includes('terrace') || amenityLower.includes('patio')) {
        return <Umbrella className={className} />;
    }
    if (amenityLower.includes('sauna') || amenityLower.includes('steamroom')) {
        return <Droplets className={className} />;
    }
    if (amenityLower.includes('gym') || amenityLower.includes('fitness')) {
        return <Dumbbell className={className} />;
    }
    if (amenityLower.includes('tennis') || amenityLower.includes('basketball')) {
        return <Target className={className} />;
    }
    if (amenityLower.includes('playground') || amenityLower.includes('children')) {
        return <Baby className={className} />;
    }
    if (amenityLower.includes('games') || amenityLower.includes('pooltable') || amenityLower.includes('pingpong')) {
        return <Gamepad className={className} />;
    }

    // Transportation & Parking
    if (amenityLower.includes('parking') || amenityLower.includes('garage')) {
        return <Car className={className} />;
    }
    if (amenityLower.includes('bicycle') || amenityLower.includes('bike')) {
        return <Bike className={className} />;
    }
    if (amenityLower.includes('electriccar') || amenityLower.includes('charging')) {
        return <Battery className={className} />;
    }
    if (amenityLower.includes('airport') || amenityLower.includes('shuttle')) {
        return <Plane className={className} />;
    }
    if (amenityLower.includes('transport')) {
        return <Bus className={className} />;
    }

    // Security & Safety
    if (amenityLower.includes('security') || amenityLower.includes('safe')) {
        return <Shield className={className} />;
    }
    if (amenityLower.includes('camera')) {
        return <Camera className={className} />;
    }
    if (amenityLower.includes('alarm') || amenityLower.includes('smoke')) {
        return <ShieldCheck className={className} />;
    }
    if (amenityLower.includes('lock') || amenityLower.includes('keypad')) {
        return <Lock className={className} />;
    }
    if (amenityLower.includes('firstaid')) {
        return <Heart className={className} />;
    }

    // Views & Location
    if (
        amenityLower.includes('view') ||
        amenityLower.includes('ocean') ||
        amenityLower.includes('sea') ||
        amenityLower.includes('mountain') ||
        amenityLower.includes('city')
    ) {
        return <Eye className={className} />;
    }
    if (amenityLower.includes('beach') || amenityLower.includes('waterfront')) {
        return <Waves className={className} />;
    }
    if (amenityLower.includes('sunset') || amenityLower.includes('sunrise')) {
        return <Sunrise className={className} />;
    }

    // Bedroom & Sleeping
    if (amenityLower.includes('bedroom') || amenityLower.includes('bed') || amenityLower.includes('master')) {
        return <Bed className={className} />;
    }
    if (amenityLower.includes('crib') || amenityLower.includes('babycot')) {
        return <Baby className={className} />;
    }
    if (amenityLower.includes('blackout') || amenityLower.includes('darkening')) {
        return <Moon className={className} />;
    }

    // Bathroom & Personal Care
    if (amenityLower.includes('bathroom') || amenityLower.includes('ensuite')) {
        return <Bath className={className} />;
    }
    if (amenityLower.includes('bathtub') || amenityLower.includes('jetted')) {
        return <Bath className={className} />;
    }
    if (amenityLower.includes('shower') || amenityLower.includes('rainfall')) {
        return <ShowerHead className={className} />;
    }
    if (amenityLower.includes('hairdryer')) {
        return <Scissors className={className} />;
    }
    if (amenityLower.includes('towels') || amenityLower.includes('robes')) {
        return <Shirt className={className} />;
    }

    // Accessibility
    if (amenityLower.includes('wheelchair') || amenityLower.includes('accessible')) {
        return <Accessibility className={className} />;
    }
    if (amenityLower.includes('elevator')) {
        return <ArrowUp className={className} />;
    }
    if (amenityLower.includes('hearing') || amenityLower.includes('visual')) {
        return <Eye className={className} />;
    }

    // Family & Children
    if (amenityLower.includes('family') || amenityLower.includes('child')) {
        return <Users className={className} />;
    }
    if (amenityLower.includes('highchair') || amenityLower.includes('babygate')) {
        return <Baby className={className} />;
    }
    if (amenityLower.includes('stroller') || amenityLower.includes('carseat')) {
        return <Baby className={className} />;
    }
    if (amenityLower.includes('babysitting')) {
        return <Heart className={className} />;
    }

    // Pets
    if (amenityLower.includes('pet') || amenityLower.includes('dog') || amenityLower.includes('cat')) {
        return <PawPrint className={className} />;
    }

    // Business & Work
    if (amenityLower.includes('workspace') || amenityLower.includes('office') || amenityLower.includes('desk')) {
        return <Briefcase className={className} />;
    }
    if (amenityLower.includes('business') || amenityLower.includes('meeting')) {
        return <Building2 className={className} />;
    }
    if (amenityLower.includes('conference') || amenityLower.includes('projector')) {
        return <Presentation className={className} />;
    }

    // Luxury & Premium
    if (amenityLower.includes('luxury') || amenityLower.includes('premium')) {
        return <Crown className={className} />;
    }
    if (amenityLower.includes('concierge') || amenityLower.includes('butler')) {
        return <UserCheck className={className} />;
    }
    if (amenityLower.includes('chef') || amenityLower.includes('catering')) {
        return <ChefHat className={className} />;
    }
    if (amenityLower.includes('champagne') || amenityLower.includes('welcome')) {
        return <PartyPopper className={className} />;
    }
    if (amenityLower.includes('marble') || amenityLower.includes('designer')) {
        return <Gem className={className} />;
    }

    // Health & Wellness
    if (amenityLower.includes('massage') || amenityLower.includes('wellness')) {
        return <HeartHandshake className={className} />;
    }
    if (amenityLower.includes('yoga') || amenityLower.includes('meditation')) {
        return <Leaf className={className} />;
    }
    if (amenityLower.includes('organic') || amenityLower.includes('healthy')) {
        return <Apple className={className} />;
    }

    // Services
    if (amenityLower.includes('checkin') || amenityLower.includes('checkout')) {
        return <Clock className={className} />;
    }
    if (amenityLower.includes('luggage') || amenityLower.includes('storage')) {
        return <Package className={className} />;
    }
    if (amenityLower.includes('delivery') || amenityLower.includes('grocery')) {
        return <ShoppingBag className={className} />;
    }
    if (amenityLower.includes('tour') || amenityLower.includes('guide')) {
        return <MapPin className={className} />;
    }

    // Unique Features
    if (amenityLower.includes('rooftop') || amenityLower.includes('penthouse')) {
        return <Building className={className} />;
    }
    if (amenityLower.includes('historic') || amenityLower.includes('castle')) {
        return <Castle className={className} />;
    }
    if (amenityLower.includes('treehouse') || amenityLower.includes('eco')) {
        return <TreePine className={className} />;
    }
    if (amenityLower.includes('solar') || amenityLower.includes('sustainable')) {
        return <Sun className={className} />;
    }
    if (amenityLower.includes('generator') || amenityLower.includes('backup')) {
        return <Zap className={className} />;
    }

    // Seasonal & Weather
    if (amenityLower.includes('winter') || amenityLower.includes('ski')) {
        return <CloudSnow className={className} />;
    }
    if (amenityLower.includes('summer') || amenityLower.includes('allseason')) {
        return <CloudSun className={className} />;
    }

    // Special Occasions
    if (amenityLower.includes('wedding') || amenityLower.includes('event')) {
        return <PartyPopper className={className} />;
    }
    if (amenityLower.includes('romantic') || amenityLower.includes('honeymoon')) {
        return <Heart className={className} />;
    }
    if (amenityLower.includes('birthday') || amenityLower.includes('celebration')) {
        return <Cake className={className} />;
    }

    // Default fallback
    return <div className={`w-5 h-5 bg-[#F8B259] rounded-full ${className.includes('text-') ? '' : 'opacity-80'}`} />;
};

/**
 * Get amenity display name with proper formatting
 * @param amenity - The amenity string to format
 * @returns string - Formatted display name
 */
export const getAmenityDisplayName = (amenity: string): string => {
    const amenityMap: Record<string, string> = {
        // Internet & Technology
        wifi: 'Wi-Fi',
        high_speed_internet: 'High-Speed Internet',
        smart_tv: 'Smart TV',
        cable_tv: 'Cable TV',
        netflix: 'Netflix',
        streaming_services: 'Streaming Services',
        gaming_console: 'Gaming Console',
        sound_system: 'Sound System',
        bluetooth_speaker: 'Bluetooth Speaker',
        computer_workspace: 'Computer Workspace',
        charging_stations: 'Charging Stations',
        usb_outlets: 'USB Outlets',

        // Kitchen & Dining
        kitchen: 'Kitchen',
        full_kitchen: 'Full Kitchen',
        kitchenette: 'Kitchenette',
        microwave: 'Microwave',
        dishwasher: 'Dishwasher',
        refrigerator: 'Refrigerator',
        coffee_maker: 'Coffee Maker',
        espresso_machine: 'Espresso Machine',
        dining_table: 'Dining Table',
        breakfast_bar: 'Breakfast Bar',
        outdoor_dining: 'Outdoor Dining',
        barbecue_grill: 'Barbecue Grill',
        bbq: 'BBQ/Grill',

        // Laundry & Cleaning
        washing_machine: 'Washing Machine',
        washer_dryer: 'Washer & Dryer',
        ironing_board: 'Ironing Board',
        vacuum_cleaner: 'Vacuum Cleaner',
        cleaning_supplies: 'Cleaning Supplies',
        laundry_service: 'Laundry Service',

        // Climate Control
        air_conditioning: 'Air Conditioning',
        central_air: 'Central Air',
        central_heating: 'Central Heating',
        electric_fireplace: 'Electric Fireplace',
        gas_fireplace: 'Gas Fireplace',
        wood_fireplace: 'Wood Fireplace',
        ceiling_fans: 'Ceiling Fans',
        portable_fans: 'Portable Fans',
        space_heater: 'Space Heater',

        // Outdoor Spaces
        private_pool: 'Private Pool',
        shared_pool: 'Shared Pool',
        indoor_pool: 'Indoor Pool',
        heated_pool: 'Heated Pool',
        infinity_pool: 'Infinity Pool',
        pool_heating: 'Pool Heating',
        hot_tub: 'Hot Tub',
        steam_room: 'Steam Room',
        private_garden: 'Private Garden',
        outdoor_shower: 'Outdoor Shower',
        outdoor_kitchen: 'Outdoor Kitchen',
        fire_pit: 'Fire Pit',
        outdoor_fireplace: 'Outdoor Fireplace',
        rooftop_access: 'Rooftop Access',
        sun_loungers: 'Sun Loungers',
        beach_chairs: 'Beach Chairs',

        // Parking & Transportation
        free_parking: 'Free Parking',
        private_parking: 'Private Parking',
        covered_parking: 'Covered Parking',
        street_parking: 'Street Parking',
        valet_parking: 'Valet Parking',
        electric_car_charging: 'Electric Car Charging',
        bicycle_rental: 'Bicycle Rental',
        scooter_rental: 'Scooter Rental',
        car_rental: 'Car Rental',
        airport_shuttle: 'Airport Shuttle',
        public_transport_access: 'Public Transport Access',

        // Security & Safety
        security_system: 'Security System',
        security_cameras: 'Security Cameras',
        alarm_system: 'Alarm System',
        safe_deposit_box: 'Safe Deposit Box',
        smoke_detector: 'Smoke Detector',
        carbon_monoxide_detector: 'Carbon Monoxide Detector',
        fire_extinguisher: 'Fire Extinguisher',
        first_aid_kit: 'First Aid Kit',
        security_guard: 'Security Guard',
        gated_community: 'Gated Community',
        keypad_entry: 'Keypad Entry',
        smart_lock: 'Smart Lock',

        // Views & Location
        ocean_view: 'Ocean View',
        sea_view: 'Sea View',
        beach_view: 'Beach View',
        mountain_view: 'Mountain View',
        city_view: 'City View',
        garden_view: 'Garden View',
        pool_view: 'Pool View',
        lake_view: 'Lake View',
        river_view: 'River View',
        forest_view: 'Forest View',
        countryside_view: 'Countryside View',
        sunset_view: 'Sunset View',
        sunrise_view: 'Sunrise View',
        panoramic_view: 'Panoramic View',
        beach_access: 'Beach Access',
        private_beach: 'Private Beach',
        direct_beach_access: 'Direct Beach Access',

        // Family & Children
        family_friendly: 'Family Friendly',
        child_friendly: 'Child Friendly',
        high_chair: 'High Chair',
        baby_gate: 'Baby Gate',
        children_books_toys: 'Children Books & Toys',
        children_dinnerware: 'Children Dinnerware',
        baby_monitor: 'Baby Monitor',
        changing_table: 'Changing Table',
        baby_bath: 'Baby Bath',
        car_seat: 'Car Seat',
        babysitting_service: 'Babysitting Service',
        children_pool: 'Children Pool',

        // Pet Amenities
        pet_friendly: 'Pet Friendly',
        dog_friendly: 'Dog Friendly',
        cat_friendly: 'Cat Friendly',
        pet_bed: 'Pet Bed',
        pet_bowls: 'Pet Bowls',
        pet_toys: 'Pet Toys',
        dog_park_nearby: 'Dog Park Nearby',
        pet_sitting_service: 'Pet Sitting Service',
        pet_grooming: 'Pet Grooming',
        fenced_yard: 'Fenced Yard',

        // Luxury & Premium
        luxury_amenities: 'Luxury Amenities',
        concierge_service: 'Concierge Service',
        butler_service: 'Butler Service',
        maid_service: 'Maid Service',
        daily_housekeeping: 'Daily Housekeeping',
        room_service: 'Room Service',
        private_chef: 'Private Chef',
        catering_service: 'Catering Service',
        champagne_welcome: 'Champagne Welcome',
        welcome_basket: 'Welcome Basket',
        fresh_flowers: 'Fresh Flowers',
        premium_toiletries: 'Premium Toiletries',
        marble_bathroom: 'Marble Bathroom',
        designer_furniture: 'Designer Furniture',
        art_collection: 'Art Collection',
        wine_cellar: 'Wine Cellar',
        wine_tasting: 'Wine Tasting',
        private_bar: 'Private Bar',
        mini_bar: 'Mini Bar',

        // Health & Wellness
        fitness_room: 'Fitness Room',
        personal_trainer: 'Personal Trainer',
        massage_service: 'Massage Service',
        spa_treatments: 'Spa Treatments',
        meditation_space: 'Meditation Space',
        yoga_studio: 'Yoga Studio',
        pilates_equipment: 'Pilates Equipment',
        wellness_programs: 'Wellness Programs',
        detox_programs: 'Detox Programs',
        organic_garden: 'Organic Garden',
        healthy_meals: 'Healthy Meals',

        // Special Features
        '24_hour_checkin': '24-Hour Check-in',
        early_checkin: 'Early Check-in',
        late_checkout: 'Late Checkout',
        luggage_storage: 'Luggage Storage',
        dry_cleaning: 'Dry Cleaning',
        grocery_delivery: 'Grocery Delivery',
        meal_delivery: 'Meal Delivery',
        tour_booking: 'Tour Booking',
        ticket_booking: 'Ticket Booking',
        translation_service: 'Translation Service',
        local_guide: 'Local Guide',
        travel_planning: 'Travel Planning',
    };

    return amenityMap[amenity] || amenity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};
