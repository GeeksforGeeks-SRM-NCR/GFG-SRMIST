"use client";
import RecruitmentForm from '@/app/components/RecruitmentForm';
import Squares from '@/app/components/Squares';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RecruitmentPage() {
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