const RoomShowcase = () => {
    const rooms = [
        {
            name: 'Ocean View Suite',
            price: 'From $299/night',
            image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            features: ['Sea View', 'King Bed', 'Balcony', 'Spa Bath'],
        },
        {
            name: 'Desert Villa',
            price: 'From $199/night',
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            features: ['Garden View', 'Private Pool', 'Terrace', 'Kitchenette'],
        },
        {
            name: 'Presidential Suite',
            price: 'From $599/night',
            image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            features: ['Panoramic View', '2 Bedrooms', 'Butler Service', 'Private Beach'],
        },
    ];

    return (
        <section className='py-20 bg-gradient-to-br from-burnt-orange-10 to-golden-yellow-10'>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='text-center mb-16'>
                    <h2 className='font-butler-700 text-5xl text-burnt-orange mb-6'>Luxury Accommodations</h2>
                    <p className='font-roboto-400 text-xl text-burnt-orange-70 max-w-3xl mx-auto'>
                        Each room is meticulously designed to provide the ultimate comfort and breathtaking views
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {rooms.map((room, index) => (
                        <div
                            key={index}
                            className='group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'
                        >
                            <div className='relative h-64 overflow-hidden'>
                                <img
                                    src={room.image}
                                    alt={room.name}
                                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                                />
                                <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                <div className='absolute top-4 right-4 bg-golden-yellow text-burnt-orange px-4 py-2 rounded-full font-roboto-700 text-sm'>
                                    {room.price}
                                </div>
                            </div>

                            <div className='p-6'>
                                <h3 className='font-butler-700 text-2xl text-burnt-orange mb-4'>{room.name}</h3>

                                <div className='flex flex-wrap gap-2 mb-6'>
                                    {room.features.map((feature, idx) => (
                                        <span
                                            key={idx}
                                            className='px-3 py-1 bg-terracotta-20 text-terracotta text-sm rounded-full font-roboto-500'
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                </div>

                                <button className='w-full py-3 bg-terracotta hover:bg-burnt-orange text-cream font-roboto-500 rounded-xl transition-colors duration-300'>
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RoomShowcase;