"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { contentfulClient } from '@/lib/contentful';
import moment from 'moment';
import GlassyNavbar from '../../components/GlassyNavbar';
import Squares from '../../components/Squares';
import Link from 'next/link';
import { Calendar, User, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import NewsletterSubscribe from '../../components/NewsletterSubscribe';

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await contentfulClient.getEntries({
                    content_type: 'blogPost',
                    order: '-fields.publishDate',
                });
                setPosts(response.items);
            } catch (error) {
                console.error("Error fetching blog posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        // Check for URL parameters
        const confirmed = searchParams.get('confirmed');
        const error = searchParams.get('error');

        if (confirmed === 'true') {
            setNotification({
                type: 'success',
                message: '✓ Email confirmed! You\'re now subscribed to our newsletter.'
            });
            // Auto-dismiss after 5 seconds
            setTimeout(() => setNotification(null), 5000);
        } else if (error) {
            let errorMessage = 'Something went wrong. Please try again.';
            if (error === 'invalid_token') {
                errorMessage = 'Invalid or expired confirmation link.';
            } else if (error === 'server_error') {
                errorMessage = 'Server error. Please try again later.';
            }
            setNotification({
                type: 'error',
                message: errorMessage
            });
            setTimeout(() => setNotification(null), 5000);
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 z-0">
                <Squares
                    speed={0.5}
                    squareSize={40}
                    direction='diagonal'
                    borderColor='#333'
                    hoverFillColor='#222'
                />
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 pt-40">
                <GlassyNavbar />
                <div className="max-w-7xl mx-auto">
                    {/* Notification Banner */}
                    {notification && (
                        <div className={`mb-8 backdrop-blur-xl rounded-2xl border p-4 flex items-center gap-3 ${
                            notification.type === 'success' 
                                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                                : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}>
                            {notification.type === 'success' ? (
                                <CheckCircle size={20} />
                            ) : (
                                <XCircle size={20} />
                            )}
                            <p className="flex-1">{notification.message}</p>
                            <button 
                                onClick={() => setNotification(null)}
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Blog
                        </h1>
                        <p className="text-white/60 text-lg">
                            Latest insights, tutorials, and updates from GFG SRMIST
                        </p>
                    </div>
                    <div className="mb-12">
                        <NewsletterSubscribe/>
                    </div>

                    {/* Posts Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#46b94e]"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <BlogCard key={post.sys.id} post={post} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 text-gray-500">
                                    No blog posts found.  Check back soon!
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function BlogCard({ post }) {
    const { title, slug, excerpt, author, publishDate, featuredImage } = post.fields;
    const imageUrl = featuredImage?. fields?.file?.url 
        ? `https: ${featuredImage.fields.file.url}` 
        : '/placeholder-blog. jpg';

    return (
        <Link href={`/pages/blog/${slug}`}>
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/30 hover:shadow-2xl hover:shadow-green-500/20 cursor-pointer h-full flex flex-col">
                {/* Featured Image */}
                <div className="relative h-48 overflow-hidden">
                    <img 
                        src={imageUrl} 
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60"></div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-[#46b94e] transition-colors">
                        {title}
                    </h2>

                    <p className="text-white/60 text-sm mb-4 line-clamp-3 flex-1">
                        {excerpt || 'Click to read more...'}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-white/40 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-4">
                            {author && (
                                <div className="flex items-center gap-1">
                                    <User size={14} />
                                    <span>{author}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                <span>{moment(publishDate).format('MMM DD, YYYY')}</span>
                            </div>
                        </div>
                        <ArrowRight size={16} className="text-[#46b94e] group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </Link>
    );
}