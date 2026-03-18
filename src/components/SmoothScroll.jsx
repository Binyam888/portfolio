import { ReactLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
    const lenisRef = useRef();

    useEffect(() => {
        function update(time) {
            lenisRef.current?.lenis?.raf(time * 1000);
        }

        // Sync GSAP ticker with Lenis
        gsap.ticker.add(update);

        // Disable GSAP ticker lag smoothing for consistent frame timing
        gsap.ticker.lagSmoothing(0);

        // Connect Lenis scroll events to ScrollTrigger so pinning works smoothly
        const lenis = lenisRef.current?.lenis;
        if (lenis) {
            lenis.on('scroll', ScrollTrigger.update);
        }

        return () => {
            gsap.ticker.remove(update);
            if (lenis) {
                lenis.off('scroll', ScrollTrigger.update);
            }
        };
    }, []);

    return (
        <ReactLenis
            root
            ref={lenisRef}
            autoRaf={false}
            options={{
                lerp: 0.1,
                duration: 1.2,
                smoothTouch: false,
                smooth: true,
                syncTouch: true,
                syncTouchLerp: 0.06,
                touchInertiaMultiplier: 25,
            }}
        >
            {children}
        </ReactLenis>
    );
}
