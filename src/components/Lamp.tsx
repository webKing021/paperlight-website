import { useEffect, useRef } from "react";

/**
 * Dust drifting in the lamp's light. A small canvas, ~40 motes, drawn only while the beam is
 * on screen and not at all for people who prefer reduced motion.
 */
function Dust() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // The beam widens as it falls, so a mote may stray further from the centre lower down.
    const spread = (y: number) => 14 + (y / H) ** 1.6 * (W * 0.34);
    const motes = Array.from({ length: 42 }, () => {
      const y = Math.random() * H;
      return {
        y,
        x: W / 2 + (Math.random() * 2 - 1) * spread(y),
        r: 0.5 + Math.random() * 1.3,
        vy: -(0.06 + Math.random() * 0.16),
        phase: Math.random() * Math.PI * 2,
        tw: 0.4 + Math.random() * 1.2,
      };
    });
    const warm = document.documentElement.classList.contains("dark") ? "255 236 205" : "205 130 20";

    let raf = 0;
    let on = false;
    let t = 0;
    const draw = () => {
      t += 1 / 60;
      ctx.clearRect(0, 0, W, H);
      for (const m of motes) {
        if (!still) {
          m.y += m.vy;
          m.x += Math.sin(t * 0.6 + m.phase) * 0.08;
          if (m.y < 0) {
            m.y = H;
            m.x = W / 2 + (Math.random() * 2 - 1) * spread(H);
          }
        }
        // Brighter near the centre of the beam and near the bottom, twinkling slowly.
        const centre = 1 - Math.min(1, Math.abs(m.x - W / 2) / spread(m.y));
        const a = (0.15 + 0.85 * centre) * (0.25 + 0.75 * (m.y / H)) * (0.55 + 0.45 * Math.sin(t * m.tw + m.phase));
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${warm} / ${Math.max(0, a).toFixed(3)})`;
        ctx.fill();
      }
      if (on && !still) raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (on) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} className="lamp-dust" />;
}

/** The beam: falls from the top of the page and lands on whatever sits below its container. */
export function Beam() {
  return (
    <div aria-hidden="true" className="lamp">
      <div className="lamp-on">
        <div className="lamp-wedge lamp-wide" />
        <div className="lamp-wedge lamp-mid" />
        <div className="lamp-haze">
          <div className="lamp-haze-tex" />
        </div>
        <div className="lamp-wedge lamp-core" />
        <div className="lamp-hot" />
        <div className="lamp-base" />
        <Dust />
      </div>
    </div>
  );
}

/** Where the light lands: a flare on the edge, and a rim of light running down the sides. */
export function Landing() {
  return (
    <>
      <div aria-hidden="true" className="rim-glow" />
      <div aria-hidden="true" className="rim-line" />
      <div aria-hidden="true" className="flare">
        <span className="flare-wide" />
        <span className="flare-streak" />
        <span className="flare-hot" />
      </div>
    </>
  );
}
