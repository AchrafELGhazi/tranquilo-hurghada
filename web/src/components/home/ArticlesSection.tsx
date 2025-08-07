import { Clock, User, ArrowRight, BookOpen, Bookmark } from 'lucide-react';

const ArticlesSection = () => {
    const featuredArticle = {
        title: 'The Ultimate Guide to Red Sea Diving: Hidden Gems of Hurghada',
        excerpt:
            'Discover the most spectacular diving spots in the Red Sea, from vibrant coral gardens to underwater shipwrecks that tell stories of ancient maritime adventures.',
        image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        author: 'Marina El-Rashid',
        readTime: '8 min read',
        date: 'Dec 15, 2024',
        category: 'Adventure',
    };

    const articles = [
        {
            title: 'Authentic Egyptian Cuisine: A Culinary Journey Through Hurghada',
            excerpt:
                'Explore the rich flavors and traditions of Egyptian gastronomy, from street food classics to fine dining experiences.',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            author: 'Chef Ahmed Hassan',
            readTime: '5 min read',
            date: 'Dec 12, 2024',
            category: 'Culture',
        },
        {
            title: 'Desert Safari Adventures: Beyond the Red Sea Coast',
            excerpt:
                'Venture into the Eastern Desert for quad biking, camel riding, and unforgettable Bedouin experiences.',
            image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            author: 'Omar Farouk',
            readTime: '6 min read',
            date: 'Dec 10, 2024',
            category: 'Adventure',
        },
        {
            title: 'Luxury Villa Living: Making the Most of Your Red Sea Retreat',
            excerpt:
                'Expert tips on how to fully enjoy your private villa experience, from sunrise yoga to sunset cocktails.',
            image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            author: 'Sophia Chen',
            readTime: '4 min read',
            date: 'Dec 8, 2024',
            category: 'Lifestyle',
        },
        {
            title: 'Island Hopping: Discovering the Giftun Islands Paradise',
            excerpt:
                'A comprehensive guide to exploring the pristine islands just off the Hurghada coast, perfect for day trips.',
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            author: 'Captain Youssef',
            readTime: '7 min read',
            date: 'Dec 5, 2024',
            category: 'Travel',
        },
    ];

    const getCategoryColor = (category : string) => {
        switch (category.toLowerCase()) {
            case 'adventure':
                return 'bg-orange-100 text-orange-800';
            case 'culture':
                return 'bg-amber-100 text-amber-800';
            case 'lifestyle':
                return 'bg-yellow-100 text-yellow-800';
            case 'travel':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-orange-100 text-orange-800';
        }
    };

    return (
        <section className='relative py-20 px-6 bg-gradient-to-br from-orange-50 to-white overflow-hidden'>
            {/* Background Elements */}
            <div className='absolute top-10 left-10 w-32 h-32 bg-gradient-radial from-orange-200/20 to-transparent rounded-full blur-2xl'></div>
            <div className='absolute bottom-20 right-10 w-48 h-48 bg-gradient-radial from-yellow-200/20 to-transparent rounded-full blur-3xl'></div>

            <div className='max-w-7xl mx-auto'>
                {/* Section Header */}
                <div className='text-center mb-16'>
                    <div className='inline-block px-4 py-2 backdrop-blur-md bg-orange-100/50 border border-orange-200/50 rounded-full text-orange-700 font-medium text-sm tracking-wider uppercase mb-6'>
                        Travel Insights
                    </div>
                    <h2 className='font-butler text-5xl md:text-6xl text-orange-900 mb-6 leading-tight'>
                        Stories &
                        <span className='block text-amber-600 font-bold text-3xl md:text-4xl mt-2 font-sans tracking-wide'>
                            INSPIRATION
                        </span>
                    </h2>
                    <p className='text-lg text-orange-700/80 max-w-3xl mx-auto leading-relaxed'>
                        Discover insider tips, local secrets, and inspiring stories to enhance your Hurghada adventure
                    </p>
                </div>

                {/* Featured Article */}
                <div className='bg-white/80 backdrop-blur-md border border-orange-200/50 rounded-3xl overflow-hidden shadow-xl mb-12 group hover:shadow-2xl transition-all duration-500'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-0'>
                        {/* Featured Image */}
                        <div className='relative overflow-hidden aspect-[16/10] lg:aspect-auto'>
                            <img
                                src={featuredArticle.image}
                                alt={featuredArticle.title}
                                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/20'></div>

                            {/* Featured Badge */}
                            <div className='absolute top-6 left-6 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-sm font-bold rounded-full flex items-center space-x-2'>
                                <BookOpen className='w-4 h-4' />
                                <span>FEATURED</span>
                            </div>

                            {/* Category */}
                            <div className='absolute top-6 right-6 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-orange-700'>
                                {featuredArticle.category}
                            </div>
                        </div>

                        {/* Featured Content */}
                        <div className='p-8 lg:p-12 flex flex-col justify-center'>
                            <h3 className='text-2xl lg:text-3xl font-bold text-orange-900 mb-4 leading-tight group-hover:text-orange-700 transition-colors duration-300'>
                                {featuredArticle.title}
                            </h3>
                            <p className='text-orange-700/80 leading-relaxed mb-6 text-base lg:text-lg'>
                                {featuredArticle.excerpt}
                            </p>

                            {/* Article Meta */}
                            <div className='flex items-center justify-between mb-6 text-sm text-orange-600'>
                                <div className='flex items-center space-x-4'>
                                    <div className='flex items-center space-x-2'>
                                        <User className='w-4 h-4' />
                                        <span>{featuredArticle.author}</span>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <Clock className='w-4 h-4' />
                                        <span>{featuredArticle.readTime}</span>
                                    </div>
                                </div>
                                <span className='text-orange-500'>{featuredArticle.date}</span>
                            </div>

                            <button className='group flex items-center space-x-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold py-4 px-6 rounded-xl hover:from-orange-700 hover:to-orange-800 hover:shadow-lg hover:transform hover:-translate-y-1 transition-all duration-300 self-start'>
                                <span>Read Full Article</span>
                                <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-300' />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Articles Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
                    {articles.map((article, index) => (
                        <div
                            key={index}
                            className='group bg-white/80 backdrop-blur-md border border-orange-200/50 rounded-2xl overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-500 cursor-pointer'
                        >
                            {/* Article Image */}
                            <div className='relative overflow-hidden aspect-[16/9]'>
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                                />
                                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>

                                {/* Category Badge */}
                                <div
                                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                                        article.category
                                    )}`}
                                >
                                    {article.category}
                                </div>

                                {/* Bookmark Icon */}
                                <button className='absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-orange-600 hover:bg-white hover:scale-110 transition-all duration-300'>
                                    <Bookmark className='w-4 h-4' />
                                </button>

                                {/* Read Time */}
                                <div className='absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium flex items-center space-x-1'>
                                    <Clock className='w-3 h-3' />
                                    <span>{article.readTime}</span>
                                </div>
                            </div>

                            {/* Article Content */}
                            <div className='p-6'>
                                <h4 className='text-lg font-bold text-orange-900 mb-3 leading-tight group-hover:text-orange-700 transition-colors duration-300'>
                                    {article.title}
                                </h4>
                                <p className='text-orange-700/80 text-sm leading-relaxed mb-4'>{article.excerpt}</p>

                                {/* Article Footer */}
                                <div className='flex items-center justify-between text-sm text-orange-600'>
                                    <div className='flex items-center space-x-2'>
                                        <User className='w-4 h-4' />
                                        <span>{article.author}</span>
                                    </div>
                                    <span className='text-orange-500'>{article.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Newsletter Subscription */}
                <div className='bg-gradient-to-r from-orange-600 via-orange-700 to-amber-600 rounded-3xl p-12 text-center'>
                    <h3 className='text-3xl font-bold text-white mb-4 font-butler'>Stay Inspired</h3>
                    <p className='text-white/90 text-lg mb-8 max-w-2xl mx-auto'>
                        Get the latest travel stories, insider tips, and exclusive offers delivered to your inbox
                    </p>

                    <div className='max-w-md mx-auto'>
                        <div className='flex gap-3'>
                            <input
                                type='email'
                                placeholder='Enter your email address'
                                className='flex-1 px-4 py-3 rounded-xl bg-white/90 backdrop-blur-sm border border-white/50 text-orange-900 placeholder-orange-700/60 focus:outline-none focus:bg-white focus:border-white transition-all duration-300'
                            />
                            <button className='px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 hover:transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2'>
                                <span>Subscribe</span>
                                <ArrowRight className='w-4 h-4' />
                            </button>
                        </div>
                        <p className='text-white/70 text-xs mt-3'>Unsubscribe anytime. We respect your privacy.</p>
                    </div>
                </div>

                {/* View All Articles Button */}
                <div className='text-center mt-12'>
                    <button className='group bg-white/80 backdrop-blur-md border-2 border-orange-200/50 text-orange-700 font-semibold py-4 px-8 rounded-xl hover:bg-orange-50/80 hover:border-orange-300/60 hover:transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-3 mx-auto'>
                        <span>View All Articles</span>
                        <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform duration-300' />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ArticlesSection;
