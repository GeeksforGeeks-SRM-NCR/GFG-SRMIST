"use client";
import GlassyNavbar from '../../components/GlassyNavbar';
import DotGrid from '../../components/DotGrid';

export default function EventsPage() {
    return (
        <div style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <DotGrid
                    dotSize={3}
                    gap={15}
                    baseColor="#073b0d"
                    activeColor="#128224"
                    proximity={120}
                    shockRadius={250}
                    shockStrength={5}
                    resistance={750}
                    returnDuration={1.5}
                />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
                <GlassyNavbar />

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '140px 40px 40px 40px',
                    color: 'white'
                }}>
                    <h1 style={{
                        fontSize: '4rem',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        textAlign: 'center',
                        color: '#46b94e'
                    }}>
                        Events
                    </h1>

                    <p style={{
                        fontSize: '1.3rem',
                        maxWidth: '900px',
                        textAlign: 'center',
                        lineHeight: '1.8',
                        marginBottom: '60px',
                        opacity: 0.9
                    }}>
                        Join us for exciting coding competitions, workshops, and tech talks. Stay tuned for upcoming events!
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '30px',
                        maxWidth: '1200px',
                        width: '100%'
                    }}>
                        {['Hackathon 2024', 'Workshop Series', 'Tech Talks'].map((event, index) => (
                            <div key={index} style={{
                                background: 'rgba(255, 255, 255, 0.08)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.18)',
                                borderRadius: '20px',
                                padding: '30px',
                                textAlign: 'center',
                                transition: 'transform 0.3s ease'
                            }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#46b94e' }}>{event}</h3>
                                <p style={{ opacity: 0.8 }}>Coming Soon</p>
                            </div>
                        ))}
                    </div></div>
            </div>

            {/* Copyright Footer */}
            <div className="absolute bottom-[10px] w-full text-center z-20 text-white/60 text-xs font-sans px-4">
                <p>&#9426; Copyrights 2026 by GFG SRMIST DELHI NCR. All Rights Reserved.</p>
            </div>
        </div>
    );
}
