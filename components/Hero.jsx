"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useApp } from "@/lib/store";
import { PrimaryButton } from "./Buttons";

const HERO_LIGHT = "/video/hero-banner.mp4"; // 720p, ~2 MB
const HERO_HD = "/video/hero-banner-hd.mp4"; // 1080p, ~6.5 MB

// HD only for large, desktop-class screens on a connection that can take it;
// phones, tablets, slow links and data-saver users get the light file.
function pickHeroSrc() {
  const conn = navigator.connection;
  const slow = !!conn && (conn.saveData || /(^|-)(2g|3g)$/.test(conn.effectiveType || ""));
  const wantsLessData = window.matchMedia("(prefers-reduced-data: reduce)").matches;
  const bigScreen = window.matchMedia("(min-width: 1100px) and (hover: hover) and (pointer: fine)").matches;
  return bigScreen && !slow && !wantsLessData ? HERO_HD : HERO_LIGHT;
}

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
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    setVideoSrc(pickHeroSrc());
  }, []);

  // Pointer position, normalised to -0.5..0.5 across the hero.
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const sx = useSpring(nx, { stiffness: 60, damping: 20 });
  const sy = useSpring(ny, { stiffness: 60, damping: 20 });
  const shiftX = useTransform(sx, [-0.5, 0.5], [22, -22]);
  const shiftY = useTransform(sy, [-0.5, 0.5], [16, -16]);

  // Video drifts slower than the page while scrolling away.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  function onPointerMove(e) {
    if (reduced || e.pointerType !== "mouse") return;
    const r = sectionRef.current.getBoundingClientRect();
    nx.set((e.clientX - r.left) / r.width - 0.5);
    ny.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onPointerLeave() {
    nx.set(0);
    ny.set(0);
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
            src={videoSrc || undefined}
            autoPlay={!reduced}
            muted
            loop
            playsInline
            preload="auto"
          />
        </motion.div>
      </motion.div>
      <div className="hero__scrim" aria-hidden="true" />

      <div className="container hero__inner">
        <motion.div className="hero__content" variants={container} initial="hidden" animate="show">
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
