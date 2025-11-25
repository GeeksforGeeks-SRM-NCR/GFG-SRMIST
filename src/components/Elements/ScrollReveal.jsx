import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {React.RefObject<HTMLElement>} [props.scrollContainerRef]
 * @param {boolean} [props.enableBlur=true]
 * @param {boolean} [props.enableGradient=true]
 * @param {boolean} [props.enableScale=true]
 * @param {boolean} [props.enableSlide=true]
 * @param {number} [props.baseOpacity=0]
 * @param {number} [props.baseRotation=5]
 * @param {number} [props.blurStrength=8]
 * @param {number} [props.stagger=0.05]
 * @param {string} [props.containerClassName='']
 * @param {string} [props.textClassName='']
 * @param {string} [props.rotationEnd='bottom bottom']
 * @param {string} [props.wordAnimationEnd='bottom bottom']
 * @param {'premium' | 'elegant' | 'dynamic'} [props.animationStyle='premium']
 */
const ScrollReveal = ({
    children,
    scrollContainerRef,
    enableBlur = true,
    enableGradient = true,
    enableScale = true,
    enableSlide = true,
    baseOpacity = 0,
    baseRotation = 5,
    blurStrength = 8,
    stagger = 0.05,
    containerClassName = '',
    textClassName = '',
    rotationEnd = 'bottom bottom',
    wordAnimationEnd = 'bottom bottom',
    animationStyle = 'premium' // 'premium', 'elegant', 'dynamic'
}) => {
    const containerRef = useRef(null);

    const splitText = useMemo(() => {
        const text = typeof children === 'string' ? children : '';
        return text.split(/(\s+)/).map((word, index) => {
            if (word.match(/^\s+$/)) return word;

            // Split word into characters for more granular animation
            const chars = word.split('').map((char, charIndex) => (
                <span
                    className="char"
                    key={`${index}-${charIndex}`}
                    style={{ display: 'inline-block' }}
                >
                    {char}
                </span>
            ));

            return (
                <span className="word" key={index} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                    {chars}
                </span>
            );
        });
    }, [children]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;
        const wordElements = el.querySelectorAll('.word');
        const charElements = el.querySelectorAll('.char');

        // Container rotation animation
        gsap.fromTo(
            el,
            {
                transformOrigin: '0% 50%',
                rotate: baseRotation,
                scale: 0.95
            },
            {
                ease: 'power2.out',
                rotate: 0,
                scale: 1,
                scrollTrigger: {
                    trigger: el,
                    scroller,
                    start: 'top bottom',
                    end: rotationEnd,
                    scrub: 1.5
                }
            }
        );

        // Premium multi-layered word animations
        if (animationStyle === 'premium') {
            // Opacity and blur animation
            gsap.fromTo(
                wordElements,
                {
                    opacity: baseOpacity,
                    filter: enableBlur ? `blur(${blurStrength}px)` : 'blur(0px)',
                    scale: enableScale ? 0.8 : 1,
                    y: enableSlide ? 30 : 0,
                    willChange: 'transform, opacity, filter'
                },
                {
                    ease: 'power3.out',
                    opacity: 1,
                    filter: 'blur(0px)',
                    scale: 1,
                    y: 0,
                    stagger: stagger,
                    scrollTrigger: {
                        trigger: el,
                        scroller,
                        start: 'top bottom-=15%',
                        end: wordAnimationEnd,
                        scrub: 1.2
                    }
                }
            );

            // Gradient color shift effect
            if (enableGradient) {
                gsap.fromTo(
                    wordElements,
                    {
                        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.3) 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    },
                    {
                        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)',
                        stagger: stagger,
                        scrollTrigger: {
                            trigger: el,
                            scroller,
                            start: 'top bottom-=15%',
                            end: wordAnimationEnd,
                            scrub: 1.2
                        }
                    }
                );
            }

            // Character-level micro animations
            gsap.fromTo(
                charElements,
                {
                    rotateX: -45,
                    transformOrigin: '50% 100%'
                },
                {
                    rotateX: 0,
                    stagger: 0.01,
                    ease: 'back.out(1.2)',
                    scrollTrigger: {
                        trigger: el,
                        scroller,
                        start: 'top bottom-=10%',
                        end: wordAnimationEnd,
                        scrub: 1
                    }
                }
            );
        } else if (animationStyle === 'elegant') {
            // Elegant fade and slide
            gsap.fromTo(
                wordElements,
                {
                    opacity: 0,
                    y: 50,
                    filter: enableBlur ? 'blur(10px)' : 'blur(0px)',
                    willChange: 'transform, opacity, filter'
                },
                {
                    ease: 'power2.out',
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    stagger: 0.04,
                    scrollTrigger: {
                        trigger: el,
                        scroller,
                        start: 'top bottom-=20%',
                        end: wordAnimationEnd,
                        scrub: 1
                    }
                }
            );
        } else if (animationStyle === 'dynamic') {
            // Dynamic bounce and scale
            gsap.fromTo(
                wordElements,
                {
                    opacity: 0,
                    scale: 0.5,
                    rotation: -10,
                    filter: enableBlur ? 'blur(12px)' : 'blur(0px)',
                    willChange: 'transform, opacity, filter'
                },
                {
                    ease: 'elastic.out(1, 0.5)',
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    filter: 'blur(0px)',
                    stagger: 0.02,
                    scrollTrigger: {
                        trigger: el,
                        scroller,
                        start: 'top bottom-=20%',
                        end: wordAnimationEnd,
                        scrub: 0.8
                    }
                }
            );
        }

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [
        scrollContainerRef,
        enableBlur,
        enableGradient,
        enableScale,
        enableSlide,
        baseRotation,
        baseOpacity,
        rotationEnd,
        wordAnimationEnd,
        blurStrength,
        animationStyle
    ]);

    return (
        <h2
            ref={containerRef}
            className={`scroll-reveal ${containerClassName}`}
            style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d'
            }}
        >
            <p
                className={`scroll-reveal-text ${textClassName}`}
                style={{
                    lineHeight: '1.6',
                    transformStyle: 'preserve-3d'
                }}
            >
                {splitText}
            </p>
        </h2>
    );
};

export default ScrollReveal;
