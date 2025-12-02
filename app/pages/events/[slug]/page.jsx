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

    const { title, date, venue, coverImage, description, galleryImages, isRegistrationOpen } = event.fields;

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

            <div className="relative z-10 pt-24 pb-12">
                <div className="max-w-6xl mx-auto px-6">
                    <Link href="/pages/events" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#46b94e] mb-8 transition-colors group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Events
                    </Link>

                    {/* Hero Section */}
                    <div className="relative mb-16">
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
                            className="relative rounded-[30px] overflow-hidden aspect-[21/9] border border-white/10 shadow-2xl shadow-green-900/20"
                        >
                            <img
                                src={coverImage?.fields?.file?.url ? `https:${coverImage.fields.file.url}` : '/placeholder.jpg'}
                                alt={title}
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                                <div className="mb-6">
                                    <h1 className="text-4xl md:text-6xl font-bold text-white font-sf-pro">
                                        {title}
                                    </h1>                           </div>

                                <div className="flex flex-wrap gap-4 text-lg text-gray-200">
                                    <div className="flex items-center gap-2 bg-white/10 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
                                        <Calendar size={18} className="text-[#46b94e]" />
                                        <span className="font-sf-pro">{moment(date).format('MMMM D, YYYY')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/10 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
                                        <Clock size={18} className="text-[#46b94e]" />
                                        <span className="font-sf-pro">{moment(date).format('h:mm A')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/10 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
                                        <MapPin size={18} className="text-[#46b94e]" />
                                        <span className="font-sf-pro">{venue}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:col-span-2 space-y-8"
                        >
                            <div className="bg-white/5 border border-white/10 rounded-[25px] p-8 backdrop-blur-md relative overflow-hidden group hover:border-[#46b94e]/30 transition-colors duration-500">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Squares speed={0.2} squareSize={20} direction='diagonal' borderColor='#46b94e' hoverFillColor='#46b94e' />
                                </div>
                                <h2 className="text-3xl font-bold mb-6 text-[#46b94e] font-sf-pro">About Event</h2>
                                <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-sf-pro leading-relaxed">
                                    {documentToReactComponents(description)}
                                </div>
                            </div>
                        </motion.div>

                        {/* Sidebar Actions */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="space-y-6"
                        >
                            {isRegistrationOpen && (
                                <div className="bg-gradient-to-br from-[#46b94e]/10 to-emerald-900/10 border border-[#46b94e]/30 rounded-[25px] p-8 backdrop-blur-md relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[#46b94e]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <h3 className="text-2xl font-bold mb-2 font-sf-pro relative z-10">Registration Open!</h3>
                                    <p className="text-gray-400 mb-8 text-sm font-sf-pro relative z-10">Secure your spot for this event now. Limited seats available.</p>
                                    <Link
                                        href={`/pages/events/${slug}/register`}
                                        className="relative z-10 w-full flex items-center justify-center gap-3 bg-[#46b94e] text-black font-bold py-4 rounded-xl hover:bg-[#3da544] transition-all hover:scale-[1.02] shadow-lg shadow-green-500/20 font-sf-pro text-lg"
                                    >
                                        <Ticket size={22} />
                                        Register Now
                                    </Link>
                                </div>
                            )}

                            {galleryImages && galleryImages.length > 0 && (
                                <div className="bg-white/5 border border-white/10 rounded-[25px] p-8 backdrop-blur-md hover:bg-white/10 transition-colors duration-300">
                                    <h3 className="text-xl font-bold mb-2 font-sf-pro">Event Gallery</h3>
                                    <p className="text-gray-400 mb-6 text-sm font-sf-pro">Check out photos from this event.</p>
                                    <Link
                                        href={`/pages/events/${slug}/gallery`}
                                        className="w-full flex items-center justify-center gap-2 bg-transparent text-white font-bold py-4 rounded-xl hover:bg-white/10 transition-all border border-white/20 hover:border-white/40 font-sf-pro"
                                    >
                                        <ImageIcon size={20} />
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
