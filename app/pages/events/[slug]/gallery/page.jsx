"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { contentfulClient } from '@/lib/contentful';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import DomeGallery from '../../../../components/DomeGallery';

export default function EventGalleryPage() {
    const { slug } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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

    const { galleryImages } = event.fields;

    // Transform Contentful images to DomeGallery format with high quality
    const domeImages = galleryImages?.map(image => ({
        src: `https:${image.fields.file.url}?fm=jpg&q=90&w=1920`,
        alt: image.fields.title || 'Event Photo'
    })) || [];

    return (
        <div className="h-screen w-full bg-black relative overflow-hidden">
            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-50">
                <Link href={`/pages/events/${slug}`} className="inline-flex items-center gap-1.5 md:gap-2 text-white/80 hover:text-[#46b94e] transition-colors bg-black/20 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 hover:border-[#46b94e]/50 text-sm md:text-base">
                    <ArrowLeft size={16} className="md:w-5 md:h-5" /> Back
                </Link>
            </div>

            {domeImages.length > 0 ? (
                <DomeGallery
                    images={domeImages}
                    fit={isMobile ? 1.3 : 0.95}
                    fitBasis={isMobile ? "height" : "auto"}
                    minRadius={isMobile ? 700 : 800}
                    maxRadius={isMobile ? 1200 : 1600}
                    openedImageWidth={isMobile ? "min(95vw, 700px)" : "700px"}
                    openedImageHeight={isMobile ? "min(85vh, 700px)" : "700px"}
                    grayscale={true}
                    enlargedGrayscale={false}
                />
            ) : (
                <div className="h-full flex items-center justify-center text-gray-500 text-sm md:text-base px-4">
                    No images available.
                </div>
            )}
        </div>
    );
}
