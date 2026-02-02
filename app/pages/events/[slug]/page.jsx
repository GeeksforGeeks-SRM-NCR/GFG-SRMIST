"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { contentfulClient } from '@/lib/contentful';
import Link from 'next/link';
import { Calendar, MapPin, Clock, ArrowLeft, Image as ImageIcon, Ticket } from 'lucide-react';
import moment from 'moment';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { motion } from 'framer-motion';

import Squares from '../../../components/Squares';
import LightRays from '../../../components/LightRays';

import ShapeBlur from '../../../components/ShapeBlur';

// Helper function to extract plain text from RichText document
function extractTextFromRichText(richText) {
    if (!richText || typeof richText === 'string') {
        return richText || '';
    }

    if (richText.content && Array.isArray(richText.content)) {
        return richText.content
            .map(node => {
                if (node.content && Array.isArray(node.content)) {
                    return node.content
                        .map(textNode => textNode.value || '')
                        .join('');
                }
                return '';
            })
            .join('\n');
    }

    return '';
}

export default function EventDetailsPage() {
    const { slug } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await contentfulClient.getEntries({
                    content_type: 'event',
                    'fields.slug': slug,
                    limit: 1,
                });
                if (response.items.length > 0) {
                    setEvent(response.items[0]);
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchEvent();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#46b94e]"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white">
                <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
                <Link href="/pages/events" className="text-[#46b94e] hover:underline">Back to Events</Link>
            </div>
        );
    }

    const { title, date, venue, coverImage, description, galleryImages, isRegistrationOpen, registrationLink } = event.fields;

    // Extract registration link from RichText
    const regLink = extractTextFromRichText(registrationLink);
    const hasExternalLink = regLink && regLink.trim() !== '';
    const registrationUrl = hasExternalLink
        ? regLink
        : `/pages/events/${slug}/register`;

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Layer 1: Squares Background */}
            <div className="fixed inset-0 z-0">
                <Squares
                    speed={0.5}
                    squareSize={40}
                    direction='diagonal'
                    borderColor='#333'
                    hoverFillColor='#222'
                />
            </div>

            {/* Layer 2: LightRays Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <LightRays
                    raysColor="#46b94e"
                    raysOrigin="top-center"
                    raysSpeed={1.5}
                    lightSpread={0.8}
                    rayLength={1.2}
                    followMouse={true}
                    mouseInfluence={0.1}
                    noiseAmount={0.1}
                    distortion={0.05}
                    className="custom-rays"
                />
            </div>

            <div className="relative z-10 pt-16 md:pt-24 pb-8 md:pb-12">
                <div className="max-w-6xl mx-auto px-4 md:px-6">
                    <Link href="/pages/events" className="inline-flex items-center gap-1.5 md:gap-2 text-gray-400 hover:text-[#46b94e] mb-6 md:mb-8 transition-colors group text-sm md:text-base">
                        <ArrowLeft size={16} className="md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" /> Back to Events
                    </Link>

                    {/* Hero Section */}
                    <div className="relative mb-8 md:mb-16">
                        {/* ShapeBlur Glow */}
                        <div className="absolute -inset-10 -z-10 opacity-60 blur-3xl">
                            <ShapeBlur
                                variation={0}
                                pixelRatioProp={0.5}
                                shapeSize={1.5}
                                roundness={0.5}
                                borderSize={0.05}
                                circleSize={0.5}
                                circleEdge={0.5}
                                className="w-full h-full"
                            />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative rounded-[20px] md:rounded-[30px] overflow-hidden aspect-[16/9] md:aspect-[21/9] border border-white/10 shadow-2xl shadow-green-900/20"
                        >
                            <img
                                src={coverImage?.fields?.file?.url ? `https:${coverImage.fields.file.url}` : '/placeholder.jpg'}
                                alt={title}
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                            <div className="absolute bottom-0 left-0 p-4 md:p-8 lg:p-12 w-full">
                                <div className="mb-3 md:mb-6">
                                    <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-white font-sf-pro leading-tight">
                                        {title}
                                    </h1>
                                </div>

                                <div className="flex flex-wrap gap-2 md:gap-4 text-sm md:text-base lg:text-lg text-gray-200">
                                    <div className="flex items-center gap-1.5 md:gap-2 bg-white/10 px-3 py-1.5 md:px-5 md:py-2.5 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
                                        <Calendar size={14} className="md:w-[18px] md:h-[18px] text-[#46b94e]" />
                                        <span className="font-sf-pro">{moment(date).format('MMM D, YYYY')}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 md:gap-2 bg-white/10 px-3 py-1.5 md:px-5 md:py-2.5 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
                                        <Clock size={14} className="md:w-[18px] md:h-[18px] text-[#46b94e]" />
                                        <span className="font-sf-pro">{moment(date).format('h:mm A')}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 md:gap-2 bg-white/10 px-3 py-1.5 md:px-5 md:py-2.5 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
                                        <MapPin size={14} className="md:w-[18px] md:h-[18px] text-[#46b94e]" />
                                        <span className="font-sf-pro truncate max-w-[150px] md:max-w-none">{venue}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12">
                        {/* Main Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:col-span-2 space-y-8"
                        >
                            <div className="bg-white/5 border border-white/10 rounded-[20px] md:rounded-[25px] p-5 md:p-8 backdrop-blur-md relative overflow-hidden group hover:border-[#46b94e]/30 transition-colors duration-500">
                                <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-[#46b94e] font-sf-pro">About Event</h2>
                                <div className="prose prose-invert prose-sm md:prose-lg max-w-none text-gray-300 font-sf-pro leading-relaxed">
                                    {documentToReactComponents(description)}
                                </div>
                            </div>
                        </motion.div>

                        {/* Sidebar Actions */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="space-y-4 md:space-y-6"
                        >
                            {isRegistrationOpen && (
                                <div className="bg-gradient-to-br from-[#46b94e]/10 to-emerald-900/10 border border-[#46b94e]/30 rounded-[20px] md:rounded-[25px] p-5 md:p-8 backdrop-blur-md relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[#46b94e]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <h3 className="text-xl md:text-2xl font-bold mb-2 font-sf-pro relative z-10">Registration Open!</h3>
                                    <p className="text-gray-400 mb-5 md:mb-8 text-xs md:text-sm font-sf-pro relative z-10">Secure your spot for this event now. Limited seats available.</p>
                                    <Link
                                        href={registrationUrl}
                                        target={hasExternalLink ? "_blank" : undefined}
                                        rel={hasExternalLink ? "noopener noreferrer" : undefined}
                                        className="relative z-10 w-full flex items-center justify-center gap-2 md:gap-3 bg-[#46b94e] text-black font-bold py-3 md:py-4 rounded-xl hover:bg-[#3da544] transition-all hover:scale-[1.02] shadow-lg shadow-green-500/20 font-sf-pro text-base md:text-lg"
                                    >
                                        <Ticket size={18} className="md:w-[22px] md:h-[22px]" />
                                        Register Now
                                    </Link>
                                </div>
                            )}

                            {galleryImages && galleryImages.length > 0 && (
                                <div className="bg-white/5 border border-white/10 rounded-[20px] md:rounded-[25px] p-5 md:p-8 backdrop-blur-md hover:bg-white/10 transition-colors duration-300">
                                    <h3 className="text-lg md:text-xl font-bold mb-2 font-sf-pro">Event Gallery</h3>
                                    <p className="text-gray-400 mb-4 md:mb-6 text-xs md:text-sm font-sf-pro">Check out photos from this event.</p>
                                    <Link
                                        href={`/pages/events/${slug}/gallery`}
                                        className="w-full flex items-center justify-center gap-2 bg-transparent text-white font-bold py-3 md:py-4 rounded-xl hover:bg-white/10 transition-all border border-white/20 hover:border-white/40 font-sf-pro text-sm md:text-base"
                                    >
                                        <ImageIcon size={18} className="md:w-5 md:h-5" />
                                        View Gallery
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
