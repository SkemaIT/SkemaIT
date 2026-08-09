import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Watermark() {
  const svgRef = useRef<SVGSVGElement>(null);
  const gradRef = useRef<SVGRadialGradientElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const svg = svgRef.current;
      const grad = gradRef.current;
      if (!svg || !grad) return;

      const safe = contextSafe!;
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      // Aparición sutil desde abajo
      if (!reduceMotion) {
        gsap.from(svg, {
          yPercent: 45,
          opacity: 0,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: svg,
            start: 'top 95%',
            once: true,
          },
        });
      }

      // Luz local: el centro del gradiente (accent -> primary) sigue al cursor.
      // cx/cy de un <radialGradient> solo se actualizan con setAttribute.
      let x = 500;
      let y = 120;
      let targetX = 500;
      let targetY = 120;

      const update = safe(() => {
        x += (targetX - x) * 0.14;
        y += (targetY - y) * 0.14;
        grad.setAttribute('cx', String(x));
        grad.setAttribute('cy', String(y));
      });
      gsap.ticker.add(update);

      const onMove = safe((e: PointerEvent) => {
        const ctm = svg.getScreenCTM();
        if (!ctm) return;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const p = pt.matrixTransform(ctm.inverse());
        targetX = p.x;
        targetY = p.y;
      });

      svg.addEventListener('pointermove', onMove);

      return () => {
        svg.removeEventListener('pointermove', onMove);
        gsap.ticker.remove(update);
      };
    },
    { scope: svgRef },
  );

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1000 200"
      role="img"
      aria-label="SkemaIT"
      className="pointer-events-auto mx-auto block w-full select-none"
    >
      <defs>
        <radialGradient
          id="spot"
          ref={gradRef}
          gradientUnits="userSpaceOnUse"
          cx="500"
          cy="120"
          r="150"
        >
          <stop offset="0%" stopColor="#E17246" />
          <stop offset="45%" stopColor="#4200D1" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.14)" />
        </radialGradient>
      </defs>
      <text
        x="500"
        y="152"
        textAnchor="middle"
        fontFamily="'Nunito Sans Variable', sans-serif"
        fontWeight="700"
        fontSize="180"
        letterSpacing="-2"
        fill="url(#spot)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.5"
        paintOrder="stroke"
        style={{ pointerEvents: 'none' }}
      >
        SkemaIT
      </text>
    </svg>
  );
}
