import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import TiltedCard from './TiltedCard';
import PixelCard from './PixelCard';
import ShapeBlur from './ShapeBlur';

export default function EventCard({ event }) {
    const { title, slug, date, venue, coverImage } = event.fields;
    const imageUrl = coverImage?.fields?.file?.url ? `https:${coverImage.fields.file.url}` : '/placeholder.jpg';

    const imageDetails = coverImage?.fields?.file?.details?.image;
    const aspectRatio = imageDetails ? `${imageDetails.width}/${imageDetails.height}` : '3/4';

    return (
        <Link href={`/pages/events/${slug}`} className="block relative group w-full max-w-[400px]" style={{ flex: '1 1 300px' }}>
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
                        <div className="relative w-full" style={{ aspectRatio: aspectRatio }}>
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
                        </div>

                        <div className="p-6 flex flex-col gap-4">
                            <h3 className="text-2xl font-bold text-white font-sf-pro leading-tight">{title}</h3>

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

                            <div className="flex items-center gap-2 text-[#46b94e] font-medium font-sf-pro text-sm group-hover:translate-x-1 transition-transform mt-auto">
                                View Details <ArrowRight size={16} />
                            </div>
                        </div>
                    </div>
                </TiltedCard>
            </div>
        </Link>
    );
}
