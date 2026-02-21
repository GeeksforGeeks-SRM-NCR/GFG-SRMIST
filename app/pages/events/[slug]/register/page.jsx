"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { contentfulClient } from '@/lib/contentful';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TeamRegistrationForm from '@/app/components/TeamRegistrationForm';
import Squares from '@/app/components/Squares';
import LightRays from '@/app/components/LightRays';

export default function EventRegistrationPage() {
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

    const { title, isRegOpen, noMembers, date } = event.fields;

    // Check if the event date has passed
    const isEventPast = date ? new Date(date) < new Date() : false;

    // Open if: (isRegOpen is true or undefined) AND the event is not in the past
    const isActuallyOpen = (isRegOpen === true || isRegOpen === undefined) && !isEventPast;

    if (!isActuallyOpen) {
        return (
            <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white">
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md text-center space-y-4">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-red-400">Registrations Closed</h1>
                    <p className="text-gray-400">
                        {isEventPast
                            ? `This event has already concluded on ${new Date(date).toLocaleDateString()}.`
                            : `We are no longer accepting registrations for `}
                        {!isEventPast && <span className="text-white font-semibold">{title}</span>}
                    </p>
                    <Link
                        href={`/pages/events/${slug}`}
                        className="inline-block mt-4 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium border border-white/10"
                    >
                        Return to Event
                    </Link>
                </div>
            </div>
        );
    }

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
                <div className="max-w-3xl mx-auto px-6">
                    <Link href={`/pages/events/${slug}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-[#46b94e] mb-8 transition-colors">
                        <ArrowLeft size={20} /> Back to Event Details
                    </Link>

                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#46b94e] to-emerald-400">
                            Register for {title}
                        </h1>
                        <p className="text-gray-400">Fill out the form below to secure your spot.</p>
                    </div>

                    <TeamRegistrationForm eventName={title} noMembers={noMembers || "4"} />
                </div>
            </div>
        </div>
    );
}
