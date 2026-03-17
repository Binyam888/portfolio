import { ReactLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function SmoothScroll({ children }) {
    const lenisRef = useRef();

    useEffect(() => {
        function update(time) {
            lenisRef.current?.lenis?.raf(time * 1000);
        }

        // Sync GSAP ticker with Lenis
        gsap.ticker.add(update);

        // Disable GSAP ticker lag smoothing
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(update);
        };
    }, []);

    return (
        <ReactLenis
            root
            ref={lenisRef}
            autoRaf={false}
            options={{
                lerp: 0.08,
                duration: 2,
                smoothTouch: false,
                smooth: true,
            }}
        >
            {children}
        </ReactLenis>
    );
}
