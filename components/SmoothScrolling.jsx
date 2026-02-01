'use client';
import { ReactLenis } from 'lenis/react';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

export default function SmoothScrolling({ children }) {
    const lenisRef = useRef();

    useEffect(() => {
        function update(time) {
            if (lenisRef.current?.lenis) {
                lenisRef.current.lenis.raf(time * 1000);
            }
        }

        gsap.ticker.add(update);

        return () => {
            gsap.ticker.remove(update);
        };
    }, []);

    return (
        <ReactLenis root ref={lenisRef} autoRaf={false}>
            {children}
        </ReactLenis>
    );
}
