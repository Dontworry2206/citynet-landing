"use client";

import { useEffect, useRef } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useApp } from "@/lib/store";

const SRC = { dark: "/img/mascot-blue.webp", light: "/img/mascot-white.webp" };

// Geometry in source-image pixels (both renders share the same pose).
const W = 640;
const H = 959;
const NECK_Y = 422; // head/body split line, through the neck
const EYES = [
  { x: 296, y: 272 },
  { x: 410, y: 266 },
];
const EYE_D = 100;

const pct = (v, total) => `${(v / total) * 100}%`;
const clamp = (v) => Math.max(-1, Math.min(1, v));

const SPRING = { stiffness: 110, damping: 15, mass: 0.7 };

export default function Mascot() {
  const { theme } = useApp();
  const reduced = useReducedMotion();
  const rootRef = useRef(null);
  const visibleRef = useRef(false);
  const lastMoveRef = useRef(0);
  const jump = useAnimationControls();
  const shadow = useAnimationControls();

  // Where the cursor is relative to the robot, -1..1 on each axis.
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const sx = useSpring(nx, SPRING);
  const sy = useSpring(ny, SPRING);

  const headRotY = useTransform(sx, [-1, 1], [-16, 16]);
  const headRotX = useTransform(sy, [-1, 1], [11, -11]);
  const headRotZ = useTransform(sx, [-1, 1], [-4, 4]);
  const headX = useTransform(sx, [-1, 1], [-9, 9]);
  const headY = useTransform(sy, [-1, 1], [-5, 7]);
  const bodyX = useTransform(sx, [-1, 1], [-5, 5]);
  const bodyRot = useTransform(sx, [-1, 1], [-1.8, 1.8]);
  const glintX = useTransform(sx, [-1, 1], [-15, 15]);
  const glintY = useTransform(sy, [-1, 1], [-13, 13]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || reduced) return;

    const io = new IntersectionObserver(([e]) => (visibleRef.current = e.isIntersecting), { threshold: 0.1 });
    io.observe(el);

    const onMove = (e) => {
      if (!visibleRef.current || (e.pointerType && e.pointerType !== "mouse")) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.3; // aim at the head
      nx.set(clamp((e.clientX - cx) / (window.innerWidth * 0.4)));
      ny.set(clamp((e.clientY - cy) / (window.innerHeight * 0.4)));
      lastMoveRef.current = performance.now();
    };
    const onLeave = () => {
      nx.set(0);
      ny.set(0);
    };

    // With no mouse (phones) or a still one, it glances around by itself.
    const wander = setInterval(() => {
      if (!visibleRef.current || performance.now() - lastMoveRef.current < 3500) return;
      nx.set((Math.random() * 2 - 1) * 0.7);
      ny.set((Math.random() * 2 - 1) * 0.45);
    }, 2400);

    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      io.disconnect();
      clearInterval(wander);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, nx, ny]);

  function hop() {
    if (reduced) return;
    jump.start({
      y: [0, -54, 0, -10, 0],
      scaleX: [1, 0.97, 1.03, 0.99, 1],
      scaleY: [1, 1.05, 0.95, 1.01, 1],
      transition: { duration: 0.9, times: [0, 0.35, 0.65, 0.82, 1], ease: "easeOut" },
    });
    shadow.start({
      scale: [1, 0.62, 1, 0.9, 1],
      opacity: [1, 0.45, 1, 0.8, 1],
      transition: { duration: 0.9, times: [0, 0.35, 0.65, 0.82, 1], ease: "easeOut" },
    });
  }

  const src = SRC[theme === "dark" ? "dark" : "light"];
  const neckPct = (NECK_Y / H) * 100;

  return (
    <div className="benefits__art" aria-hidden="true">
      <motion.div
        ref={rootRef}
        className={`mascot mascot--${theme}`}
        whileHover={reduced ? undefined : { scale: 1.035 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        onPointerDown={hop}
      >
        <div className="mascot__glow" />
        <motion.div className="mascot__shadow" animate={shadow} />

        <motion.div className="mascot__jump" animate={jump}>
          <div className="mascot__float">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                className="mascot__stack"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
              >
                <motion.img
                  className="mascot__part"
                  src={src}
                  alt=""
                  draggable={false}
                  loading="lazy"
                  style={{
                    clipPath: `inset(${neckPct}% 0 0 0)`,
                    x: reduced ? 0 : bodyX,
                    rotate: reduced ? 0 : bodyRot,
                    transformOrigin: "50% 92%",
                  }}
                />

                <motion.div
                  className="mascot__head"
                  style={{
                    transformPerspective: 750,
                    transformOrigin: `50% ${neckPct}%`,
                    rotateY: reduced ? 0 : headRotY,
                    rotateX: reduced ? 0 : headRotX,
                    rotate: reduced ? 0 : headRotZ,
                    x: reduced ? 0 : headX,
                    y: reduced ? 0 : headY,
                  }}
                >
                  <img
                    className="mascot__part"
                    src={src}
                    alt=""
                    draggable={false}
                    loading="lazy"
                    style={{ clipPath: `inset(0 0 ${100 - neckPct}% 0)` }}
                  />
                  {EYES.map((eye, i) => (
                    <div
                      key={i}
                      className="mascot__eye"
                      style={{ left: pct(eye.x, W), top: pct(eye.y, H), width: pct(EYE_D, W) }}
                    >
                      <motion.span
                        className="mascot__glint"
                        style={{ x: reduced ? 0 : glintX, y: reduced ? 0 : glintY }}
                      />
                      <span className="mascot__lid" style={{ animationDelay: `${i * 0.06}s` }} />
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
