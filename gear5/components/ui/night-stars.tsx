"use client";

import { useEffect, useRef } from "react";

type Dot = { x: number; y: number };

function seededRandom(seed: number) {
  let t = seed;
  return () => {
    t = (t * 1664525 + 1013904223) % 4294967296;
    return t / 4294967296;
  };
}

const starRand = seededRandom(7);
const STATIC_STARS = Array.from({ length: 110 }, () => {
  const size = starRand() * 0.9 + 0.35;
  return {
    x: starRand() * 100,
    y: starRand() * 58,
    size,
    opacity: starRand() * 0.45 + 0.2,
    duration: starRand() * 3.5 + 3,
    delay: starRand() * 5,
  };
});

const sparkRand = seededRandom(101);
const SPARKLE_STARS = Array.from({ length: 5 }, () => ({
  x: sparkRand() * 90 + 5,
  y: sparkRand() * 40 + 4,
  size: sparkRand() * 5 + 7,
  delay: sparkRand() * 4,
}));

function buildRidgePath(seed: number, count: number, minY: number, maxY: number, baseline: number) {
  const r = seededRandom(seed);
  const anchors = Array.from({ length: count }, (_, i) => ({
    x: (i / (count - 1)) * 400,
    y: baseline - (minY + r() * (maxY - minY)),
  }));
  let d = `M0,${baseline} L${anchors[0].x},${anchors[0].y}`;
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    const midX = (a.x + b.x) / 2;
    const bumpUp = Math.min(a.y, b.y) - 8;
    d += ` Q${midX},${bumpUp} ${b.x},${b.y}`;
  }
  const last = anchors[anchors.length - 1];
  d += ` L${last.x},${baseline} Z`;
  return d;
}

const HILL_PATH = buildRidgePath(31, 8, 6, 20, 62);
const CANOPY_PATH = buildRidgePath(19, 12, 10, 32, 62);

function Sparkle({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="absolute -translate-x-1/2 -translate-y-1/2">
      <path
        d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"
        fill="white"
      />
    </svg>
  );
}

export function NightStars({
  dotCount = 26,
  className = "",
}: {
  dotCount?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !container || !ctx) return;

    let width = 0;
    let height = 0;
    let mouseX = 0;
    let mouseY = 0;
    let hasMouse = false;
    let frameId = 0;

    const dots: Dot[] = Array.from({ length: dotCount }, () => ({ x: 0, y: 0 }));

    function resize() {
      width = container!.clientWidth;
      height = container!.clientHeight;
      canvas!.width = width;
      canvas!.height = height;
    }

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      hasMouse = true;
    }

    function onLeave() {
      hasMouse = false;
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      if (hasMouse) {
        const lead = dots[0];
        lead.x += (mouseX - lead.x) * 0.35;
        lead.y += (mouseY - lead.y) * 0.35;

        for (let i = 1; i < dots.length; i++) {
          const prev = dots[i - 1];
          const dot = dots[i];
          dot.x += (prev.x - dot.x) * 0.28;
          dot.y += (prev.y - dot.y) * 0.28;
        }

        for (let i = 0; i < dots.length - 1; i++) {
          const a = dots[i];
          const b = dots[i + 1];
          const fade = 1 - i / dots.length;
          ctx!.strokeStyle = `rgba(224, 221, 245, ${0.35 * fade})`;
          ctx!.lineWidth = 0.9 * fade;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();
        }

        dots.forEach((dot, i) => {
          const fade = 1 - i / dots.length;
          const size = 1.8 * fade + 0.3;
          if (i === 0) {
            ctx!.shadowColor = "rgba(226, 228, 255, 0.9)";
            ctx!.shadowBlur = 6;
          } else {
            ctx!.shadowBlur = 0;
          }
          ctx!.fillStyle = i === 0 ? "#f6f5fc" : `rgba(224, 221, 245, ${0.75 * fade})`;
          ctx!.beginPath();
          ctx!.arc(dot.x, dot.y, size, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.shadowBlur = 0;
        });
      }

      frameId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [dotCount]);

  return (
    <div
      ref={containerRef}
      className={`relative isolate h-80 w-full overflow-hidden rounded-xl border border-border ${className}`}
      style={{
        background:
          "linear-gradient(to bottom, #020206 0%, #07071a 26%, #12122c 46%, #1f1d38 64%, #322c46 82%, #453e54 100%)",
      }}
    >
      {/* milky way haze */}
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 90% 30% at 30% 20%, rgba(226,228,245,0.05), transparent 70%)",
          transform: "rotate(-8deg) scale(1.3)",
        }}
      />

      {/* moon glow halo */}
      <div
        className="absolute rounded-full blur-2xl"
        aria-hidden
        style={{
          left: "76%",
          top: "10%",
          width: 90,
          height: 90,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(226,228,245,0.35), transparent 70%)",
        }}
      />
      {/* moon body */}
      <div
        className="absolute rounded-full"
        aria-hidden
        style={{
          left: "76%",
          top: "10%",
          width: 30,
          height: 30,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle at 35% 32%, #ffffff, #e5e5f2 45%, #c3c3d6 75%, #9a9ab0 100%)",
          boxShadow: "0 0 18px 2px rgba(230,230,250,0.25)",
        }}
      />

      <div className="absolute inset-0" aria-hidden>
        {STATIC_STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={
              {
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                "--star-opacity": s.opacity,
                opacity: s.opacity,
                animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
              } as React.CSSProperties
            }
          />
        ))}
        {SPARKLE_STARS.map((s, i) => (
          <div
            key={`spark-${i}`}
            className="absolute"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              opacity: 0.85,
              animation: `twinkle ${4}s ease-in-out ${s.delay}s infinite`,
            }}
          >
            <Sparkle size={s.size} />
          </div>
        ))}
      </div>

      {/* vignette for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 40%, transparent 55%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full"
        viewBox="0 0 400 62"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d={HILL_PATH} fill="#141128" opacity={0.8} />
      </svg>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 opacity-60"
        aria-hidden
        style={{ background: "linear-gradient(to top, rgba(150,120,190,0.25), transparent)" }}
      />

      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full"
        viewBox="0 0 400 62"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d={CANOPY_PATH} fill="#050310" />
      </svg>

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full cursor-crosshair" />
    </div>
  );
}
