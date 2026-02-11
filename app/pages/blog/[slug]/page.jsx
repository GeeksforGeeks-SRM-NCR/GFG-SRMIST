"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { contentfulClient } from '@/lib/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import GlassyNavbar from '../../../components/GlassyNavbar';
import Squares from '../../../components/Squares';
import moment from 'moment';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';

export default function BlogPostPage() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await contentfulClient.getEntries({
                    content_type: 'blogPost',
                    'fields.slug': slug,
                    limit: 1,
                });
                if (response.items. length > 0) {
                    setPost(response.items[0]);
                }
            } catch (error) {
                console.error("Error fetching blog post:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPost();
        }
    }, [slug]);

    const renderOptions = {
        renderNode: {
            [BLOCKS. PARAGRAPH]: (node, children) => (
                <p className="text-white/80 leading-relaxed mb-6">{children}</p>
            ),
            [BLOCKS.HEADING_1]: (node, children) => (
                <h1 className="text-4xl font-bold text-white mb-6 mt-8">{children}</h1>
            ),
            [BLOCKS. HEADING_2]: (node, children) => (
                <h2 className="text-3xl font-bold text-white mb-4 mt-6">{children}</h2>
            ),
            [BLOCKS.HEADING_3]: (node, children) => (
                <h3 className="text-2xl font-bold text-white mb-3 mt-4">{children}</h3>
            ),
            [BLOCKS.UL_LIST]: (node, children) => (
                <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">{children}</ul>
            ),
            [BLOCKS.OL_LIST]: (node, children) => (
                <ol className="list-decimal list-inside text-white/80 mb-6 space-y-2">{children}</ol>
            ),
        },
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#46b94e]"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-black flex justify-center items-center text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
                    <Link href="/pages/blog" className="text-[#46b94e] hover: underline">
                        ← Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    const { title, content, author, publishDate, featuredImage } = post.fields;
    const imageUrl = featuredImage?.fields?.file?.url 
        ? `https:${featuredImage.fields.file.url}` 
        : null;

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
            <div className="relative z-10 pt-40 pb-20">
                <GlassyNavbar />
                
                <div className="max-w-4xl mx-auto px-6">
                    {/* Back Button */}
                    <Link 
                        href="/pages/blog"
                        className="inline-flex items-center gap-2 text-white/60 hover:text-[#46b94e] transition-colors mb-8"
                    >
                        <ArrowLeft size={20} />
                        Back to Blog
                    </Link>

                    {/* Article Header */}
                    <article className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
                        {imageUrl && (
                            <div className="mb-8 -mt-8 -mx-8 md:-mx-12 rounded-t-3xl overflow-hidden">
                                <img 
                                    src={imageUrl} 
                                    alt={title}
                                    className="w-full h-64 md:h-96 object-cover"
                                />
                            </div>
                        )}

                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            {title}
                        </h1>

                        {/* Meta */}
                        <div className="flex items-center gap-6 text-white/60 text-sm mb-8 pb-8 border-b border-white/10">
                            {author && (
                                <div className="flex items-center gap-2">
                                    <User size={16} />
                                    <span>{author}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{moment(publishDate).format('MMMM DD, YYYY')}</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {documentToReactComponents(content, renderOptions)}
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
}