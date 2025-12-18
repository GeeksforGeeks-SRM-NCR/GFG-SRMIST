"use client";
import Squares from '../../components/Squares';

export default function ChallengesPage() {
    const challenges = [
        { title: 'Daily Coding Challenge', difficulty: 'Easy - Hard', description: 'Solve one problem every day to improve your skills' },
        { title: 'Weekly Contest', difficulty: 'Medium - Hard', description: 'Compete with peers in our weekly coding contests' },
        { title: 'Monthly Hackathon', difficulty: 'All Levels', description: 'Build innovative projects in 24-48 hours' }
    ];

    return (
        <div style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <Squares
                    speed={0.5}
                    squareSize={40}
                    direction='diagonal'
                    borderColor='#333'
                    hoverFillColor='#222'
                />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>

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

                    </h1>

                    <div style={{
                        background: 'rgba(0, 0, 0, 0.7)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        borderRadius: '20px',
                        padding: '60px 80px',
                        transition: 'all 0.3s ease',
                        cursor: 'default',
                        maxWidth: '600px'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(70, 185, 78, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <p style={{
                            fontSize: '1.5rem',
                            textAlign: 'center',
                            color: '#46b94e',
                            fontWeight: '500',
                            letterSpacing: '0.5px'
                        }}>
                            Page Under Development
                        </p>
                    </div>
                </div></div>

            {/* Copyright Footer */}
            <div className="absolute bottom-[10px] w-full text-center z-20 text-white/60 text-xs px-4">
                <p>&#9426; Copyrights 2026 by GFG SRMIST DELHI NCR. All Rights Reserved.</p>
            </div>
        </div>
    );
}
