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

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

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
        lerp: 0.06,          
        smoothWheel: true,
        smoothTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}