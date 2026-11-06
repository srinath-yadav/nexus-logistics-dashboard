import gsap from "gsap";
import { useEffect, useRef, type ReactNode } from "react";
import type { Group } from "three";

/** Scales and spins its children in on first load. Must live INSIDE <Canvas>. */
const IntroSpin = ({ children }: { children: ReactNode }) => {
  const ref = useRef<Group>(null);

  useEffect(() => {
    const group = ref.current;
    if (!group) return;

    // Respect users who turned off animations in their OS settings
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timeline = gsap.timeline();
    timeline
      .fromTo(
        group.scale,
        { x: 0.7, y: 0.7, z: 0.7 },
        { x: 1, y: 1, z: 1, duration: 1.4, ease: "power3.out" },
      )
      .fromTo(
        group.rotation,
        { y: -1.2 },
        { y: 0, duration: 1.8, ease: "power3.out" },
        0,
      ); // the "0" = start at the same time as the scale tween

    return () => {
      timeline.kill(); // stop the animation if the component unmounts
    };
  }, []);

  return <group ref={ref}>{children}</group>;
};

export default IntroSpin;
