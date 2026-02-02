import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import TiltedCard from './TiltedCard';
import PixelCard from './PixelCard';
import ShapeBlur from './ShapeBlur';

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

export default function EventCard({ event }) {
    const { title, slug, date, venue, coverImage, registrationLink } = event.fields;
    const imageUrl = coverImage?.fields?.file?.url ? `https:${coverImage.fields.file.url}` : '/placeholder.jpg';

    const isCompleted = moment(date).isBefore(moment());
    const isUpcoming = moment(date).isAfter(moment());

    // Extract registration link from RichText
    const regLink = extractTextFromRichText(registrationLink);
    const hasExternalLink = regLink && regLink.trim() !== '';
    const registrationUrl = hasExternalLink
        ? regLink
        : `/pages/events/team-register?event=${encodeURIComponent(title)}&slug=${slug}`;

    return (
        <div className="block relative group w-full" style={{ maxWidth: '380px', minWidth: '320px' }}>
            <div className="relative w-full">
                {/* ShapeBlur Background Effect */}
                <div className="absolute -inset-4 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl">

                </div>

                <TiltedCard
                    containerHeight="auto"
                    containerWidth="100%"
                    imageHeight="auto"
                    imageWidth="100%"
                    rotateAmplitude={8}
                    scaleOnHover={1.02}
                    showMobileWarning={false}
                    showTooltip={false}
                    displayOverlayContent={false}
                >
                    <div className="flex flex-col h-full bg-[#0a0a0a] border border-white/10 rounded-[25px] overflow-hidden">
                        {/* Fixed height banner */}
                        <Link href={`/pages/events/${slug}`} className="relative w-full block h-[240px]">
                            <PixelCard
                                variant="default"
                                gap={8}
                                speed={30}
                                colors="#46b94e,#2f8d46,#1a5c2e"
                                noFocus={true}
                                className="w-full h-full !rounded-b-none"
                            >
                                <img
                                    src={imageUrl}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                />
                            </PixelCard>
                        </Link>

                        <div className="p-6 flex flex-col gap-4">
                            <Link href={`/pages/events/${slug}`}>
                                <h3 className="text-2xl font-bold text-white font-sf-pro leading-tight hover:text-[#46b94e] transition-colors">{title}</h3>
                            </Link>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-gray-300 font-sf-pro text-sm">
                                    <Calendar size={14} className="text-[#46b94e]" />
                                    {moment(date).format('MMM D, YYYY')}
                                </div>
                                <div className="flex items-center gap-2 text-gray-300 font-sf-pro text-sm">
                                    <Clock size={14} className="text-[#46b94e]" />
                                    {moment(date).format('h:mm A')}
                                </div>
                                <div className="flex items-center gap-2 text-gray-300 font-sf-pro text-sm">
                                    <MapPin size={14} className="text-[#46b94e]" />
                                    {venue}
                                </div>
                            </div>

                            <div className="mt-auto flex flex-col gap-3">
                                <Link href={`/pages/events/${slug}`} className="flex items-center gap-2 text-[#46b94e] font-medium font-sf-pro text-sm group-hover:translate-x-1 transition-transform">
                                    View Details <ArrowRight size={16} />
                                </Link>

                                {isUpcoming && (
                                    <Link
                                        href={registrationUrl}
                                        target={hasExternalLink ? "_blank" : undefined}
                                        rel={hasExternalLink ? "noopener noreferrer" : undefined}
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#46b94e] to-[#3da544] text-black font-bold py-2.5 rounded-xl hover:brightness-110 transition-all shadow-[0_0_15px_rgba(70,185,78,0.3)] font-sf-pro text-sm"
                                    >
                                        Register Now
                                    </Link>
                                )}

                                {isCompleted && (
                                    <Link
                                        href={`/pages/events/${slug}/gallery`}
                                        className="w-full flex items-center justify-center gap-2 bg-white/10 text-white font-bold py-2.5 rounded-xl hover:bg-white/20 transition-all border border-white/20 hover:border-white/40 font-sf-pro text-sm"
                                    >
                                        View Gallery
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </TiltedCard>
            </div>
        </div>
    );
}
