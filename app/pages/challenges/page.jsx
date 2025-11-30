"use client";
import GlassyNavbar from '../../components/GlassyNavbar';
import DotGrid from '../../components/DotGrid';

export default function ChallengesPage() {
    const challenges = [
        { title: 'Daily Coding Challenge', difficulty: 'Easy - Hard', description: 'Solve one problem every day to improve your skills' },
        { title: 'Weekly Contest', difficulty: 'Medium - Hard', description: 'Compete with peers in our weekly coding contests' },
        { title: 'Monthly Hackathon', difficulty: 'All Levels', description: 'Build innovative projects in 24-48 hours' }
    ];

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
                        Challenges
                    </h1>

                    <p style={{
                        fontSize: '1.3rem',
                        maxWidth: '900px',
                        textAlign: 'center',
                        lineHeight: '1.8',
                        marginBottom: '60px',
                        opacity: 0.9
                    }}>
                        Test your coding skills with our curated challenges and competitions.
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '30px',
                        maxWidth: '1200px',
                        width: '100%'
                    }}>
                        {challenges.map((challenge, index) => (
                            <div key={index} style={{
                                background: 'rgba(255, 255, 255, 0.08)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.18)',
                                borderRadius: '20px',
                                padding: '35px',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(70, 185, 78, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#46b94e' }}>{challenge.title}</h3>
                                <p style={{
                                    fontSize: '0.9rem',
                                    marginBottom: '15px',
                                    opacity: 0.7,
                                    color: '#ffd700'
                                }}>
                                    {challenge.difficulty}
                                </p>
                                <p style={{ opacity: 0.8, lineHeight: '1.6' }}>{challenge.description}</p>
                            </div>
                        ))}
                    </div>
                </div></div>

            {/* Copyright Footer */}
            <div className="absolute bottom-[10px] w-full text-center z-20 text-white/60 text-xs font-sans px-4">
                <p>&#9426; Copyrights 2026 by GFG SRMIST DELHI NCR. All Rights Reserved.</p>
            </div>
        </div>
    );
}
