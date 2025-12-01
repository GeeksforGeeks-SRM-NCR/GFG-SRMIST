"use client";
import { useState, useEffect } from 'react';
import { contentfulClient } from '@/lib/contentful';
import Link from 'next/link';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import moment from 'moment';
import GlassyNavbar from '../../components/GlassyNavbar';

import Squares from '../../components/Squares';
import LightRays from '../../components/LightRays';

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await contentfulClient.getEntries({
                    content_type: 'event',
                    order: 'fields.date',
                });
                setEvents(response.items);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const filterEvents = (tab) => {
        const now = moment();
        return events.filter(event => {
            const eventDate = moment(event.fields.date);
            if (tab === 'current') {
                return eventDate.isSame(now, 'day');
            } else if (tab === 'upcoming') {
                return eventDate.isAfter(now, 'day');
            } else {
                return eventDate.isBefore(now, 'day');
            }
        });
    };

    const filteredEvents = filterEvents(activeTab);

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

            {/* Layer 3: Content */}
            <div className="relative z-10 p-8 pt-40">
                <GlassyNavbar />
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#46b94e] to-emerald-400 text-center">
                        Events
                    </h1>

                    {/* Tabs */}
                    <div className="flex gap-4 mb-12 p-1 bg-white/5 rounded-xl w-fit backdrop-blur-sm border border-white/10 mx-auto">
                        {['upcoming', 'current', 'completed'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-lg capitalize transition-all duration-300 ${activeTab === tab
                                    ? 'bg-[#46b94e] text-black font-bold shadow-lg shadow-green-500/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#46b94e]"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((event) => (
                                    <Link
                                        href={`/pages/events/${event.fields.slug}`}
                                        key={event.sys.id}
                                        className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#46b94e]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-900/20"
                                    >
                                        <div className="aspect-video relative overflow-hidden">
                                            <img
                                                src={event.fields.coverImage?.fields?.file?.url ? `https:${event.fields.coverImage.fields.file.url}` : '/placeholder.jpg'}
                                                alt={event.fields.title}
                                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{event.fields.title}</h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-300">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={14} className="text-[#46b94e]" />
                                                        {moment(event.fields.date).format('MMM D, YYYY')}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={14} className="text-[#46b94e]" />
                                                        {moment(event.fields.date).format('h:mm A')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-center gap-2 text-gray-400 mb-4 text-sm">
                                                <MapPin size={16} className="text-[#46b94e]" />
                                                {event.fields.venue}
                                            </div>
                                            <div className="flex items-center justify-between text-[#46b94e] font-medium group-hover:translate-x-2 transition-transform">
                                                View Details
                                                <ArrowRight size={18} />
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 text-gray-500">
                                    No {activeTab} events found.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
