import { contentfulClient } from '@/lib/contentful'
import RecruitmentForm from '@/app/components/RecruitmentForm';
import Squares from '@/app/components/Squares';
import { Logo2 } from '@/app/logo/logo2';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getRecruitmentStatus() {
    try {
        const entries = await contentfulClient.getEntries({
            content_type: 'globalSettings',
            limit: 1
        })

        if (entries.items.length > 0) {
            return entries.items[0].fields.isRecruitmentOpen || false
        }
        return false
    } catch (error) {
        console.error('Error fetching global settings:', error)
        return false
    }
}

function RecruitmentClosed() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative">
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <Squares
                    speed={0.5}
                    squareSize={40}
                    direction='diagonal'
                    borderColor='#333'
                    hoverFillColor='#222'
                />
            </div>
            <div className="relative z-10 max-w-lg mx-auto p-8 bg-black/60 border border-white/10 rounded-3xl backdrop-blur-xl text-center">
                <div className="w-32 mx-auto mb-6">
                    <Logo2 />
                </div>
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🚫</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">
                    Recruitment is Currently Closed
                </h1>
                <p className="text-gray-400 mb-8">
                    Thank you for your interest in joining GeeksForGeeks SRMIST! 
                    Our recruitment process is currently not accepting new applications. 
                    Please check back later or follow us on social media for updates.
                </p>
                <Link 
                    href="/pages/about"
                    className="inline-block px-6 py-3 bg-[#46b94e] text-black font-bold rounded-xl hover:brightness-110 transition-all"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

export default async function RecruitmentPage() {
    const isRecruitmentOpen = await getRecruitmentStatus()

    if (!isRecruitmentOpen) {
        return <RecruitmentClosed />;
    }

    return (
        <div className="min-h-screen pt-24 pb-10 px-4 bg-black relative">
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <Squares
                    speed={0.5}
                    squareSize={40}
                    direction='diagonal'
                    borderColor='#333'
                    hoverFillColor='#222'
                />
            </div>
            <div className="relative z-10">
                <RecruitmentForm />
            </div>
        </div>
    );
}