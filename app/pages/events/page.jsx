"use client";
import { useState, useEffect } from 'react';
import { contentfulClient } from '@/lib/contentful';
import moment from 'moment';

import Squares from '../../components/Squares';
import LightRays from '../../components/LightRays';
import EventCard from '../../components/EventCard';

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
                <div className="max-w-7xl mx-auto">


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
                        <div className="flex flex-wrap justify-center gap-8">
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((event) => (
                                    <EventCard key={event.sys.id} event={event} />
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
