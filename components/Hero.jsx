"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useApp } from "@/lib/store";
import { PrimaryButton } from "./Buttons";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] } },
};

export default function Hero() {
  const { t, track } = useApp();
  const reduced = useReducedMotion();
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  // Pointer position, normalised to -0.5..0.5 across the hero.
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const sx = useSpring(nx, { stiffness: 60, damping: 20 });
  const sy = useSpring(ny, { stiffness: 60, damping: 20 });
  const shiftX = useTransform(sx, [-0.5, 0.5], [22, -22]);
  const shiftY = useTransform(sy, [-0.5, 0.5], [16, -16]);

  // Spotlight follows the raw pointer in pixels.
  const px = useMotionValue(-400);
  const py = useMotionValue(-400);
  const spotX = useSpring(px, { stiffness: 140, damping: 22 });
  const spotY = useSpring(py, { stiffness: 140, damping: 22 });
  const spotlight = useMotionTemplate`radial-gradient(360px circle at ${spotX}px ${spotY}px, rgba(19,226,241,0.20), transparent 65%)`;

  // Video drifts slower than the page while scrolling away.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  function onPointerMove(e) {
    if (reduced || e.pointerType !== "mouse") return;
    const r = sectionRef.current.getBoundingClientRect();
    nx.set((e.clientX - r.left) / r.width - 0.5);
    ny.set((e.clientY - r.top) / r.height - 0.5);
    px.set(e.clientX - r.left);
    py.set(e.clientY - r.top);
  }
  function onPointerLeave() {
    nx.set(0);
    ny.set(0);
    px.set(-400);
    py.set(-400);
  }

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reduced) {
      v.pause();
      v.currentTime = 0;
    } else if (v.paused) {
      v.play().catch(() => {});
    }
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="hero"
      aria-labelledby="hero-h1"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <motion.div className="hero__media" aria-hidden="true" style={{ y: scrollY }}>
        <motion.div className="hero__media-inner" style={reduced ? undefined : { x: shiftX, y: shiftY }}>
          <video
            ref={videoRef}
            className="hero__video"
            src="/video/hero-banner.mp4"
            autoPlay={!reduced}
            muted
            loop
            playsInline
            preload="auto"
          />
        </motion.div>
      </motion.div>
      <div className="hero__scrim" aria-hidden="true" />
      {!reduced && <motion.div className="hero__spotlight" aria-hidden="true" style={{ background: spotlight }} />}

      <div className="container hero__inner">
        <motion.div className="hero__content" variants={container} initial="hidden" animate="show">
          <motion.p className="overline" variants={item}>
            {t("hero.overline")}
          </motion.p>
          <motion.h1 id="hero-h1" className="hero__h1" variants={item}>
            {t("hero.h1Line1")}
            <br />
            <span className="grad-text">{t("hero.h1Line2")}</span>
          </motion.h1>
          <motion.p className="hero__subtitle" variants={item}>
            {t("hero.subtitle")}
          </motion.p>
          <motion.div className="hero__actions" variants={item}>
            <PrimaryButton
              as="a"
              arrow
              className="btn--lg"
              href="#lead-form"
              onClick={() => track("cta_click", { cta_location: "hero" })}
            >
              {t("hero.cta")}
            </PrimaryButton>
            <a className="link-arrow" href="#tariffs">
              {t("hero.secondary")}
            </a>
          </motion.div>
          <motion.p className="hero__note" variants={item}>
            {t("hero.note")}
          </motion.p>
        </motion.div>
      </div>

    </section>
  );
}
