"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useApp } from "@/lib/store";

const ICONS = [
  <svg key="0" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 21s7-5.2 7-11.6A7 7 0 0 0 5 9.4C5 15.8 12 21 12 21Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="12" cy="9.5" r="2.2" stroke="currentColor" strokeWidth="1.6" />
  </svg>,
  <svg key="1" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 21h8M12 18v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>,
  <svg key="2" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 3v4M12 17v4M4.9 12H3M21 12h-1.9M6 6l1.8 1.8M18 18l-1.8-1.8M18 6l-1.8 1.8M6 18l1.8-1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
  </svg>,
  <svg key="3" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M4 12.5 9 17l11-11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
];

// Timestamps (s) in benefits.mp4 where the sphere is fully assembled.
const REST_FRAMES = [2.4, 4.3];

function HoverOrb() {
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const [hot, setHot] = useState(false);
  const reduced = useReducedMotion();

  const rafRef = useRef(0);

  function play() {
    const v = videoRef.current;
    if (!v) return;
    cancelAnimationFrame(rafRef.current);
    v.playbackRate = 1;
    v.play().catch(() => {});
  }

  function pause() {
    cancelAnimationFrame(rafRef.current);
    videoRef.current?.pause();
  }

  // The clip cycles: the sphere assembles, scatters, and re-forms. Instead of
  // freezing mid-scatter, keep playing (faster) to the next whole-sphere frame
  // and stop exactly there.
  function settle() {
    const v = videoRef.current;
    if (!v) return;
    cancelAnimationFrame(rafRef.current);
    if (v.paused) v.play().catch(() => {});
    v.playbackRate = 2;

    let target = REST_FRAMES.find((r) => r > v.currentTime + 0.05);
    let wrapped = target !== undefined;
    if (!wrapped) target = REST_FRAMES[0];
    let prev = v.currentTime;

    const tick = () => {
      const now = v.currentTime;
      if (!wrapped && now < prev - 0.5) wrapped = true;
      prev = now;
      if (wrapped && now >= target) {
        v.pause();
        v.currentTime = target;
        v.playbackRate = 1;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // Start on a frame where the sphere is fully drawn.
  function showRestFrame() {
    const v = videoRef.current;
    if (v && v.paused && v.currentTime < 0.1) v.currentTime = REST_FRAMES[0];
  }

  // Touch screens have no hover: play while the orb is on screen instead.
  useEffect(() => {
    if (reduced || !window.matchMedia("(hover: none)").matches) return;
    const el = wrapRef.current;
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : pause()),
      { threshold: 0.45 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  // No transform/opacity on ancestors: they would isolate the video's blend
  // mode from the page background and bring the black square back.
  return (
    <div className="benefits__art" aria-hidden="true">
      <div
        ref={wrapRef}
        className="orb"
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse") return;
          setHot(true);
          play();
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== "mouse") return;
          setHot(false);
          settle();
        }}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse") return;
          const v = videoRef.current;
          if (v) (v.paused ? play() : settle());
        }}
      >
        <motion.video
          ref={videoRef}
          className="orb__video"
          src="/video/benefits.mp4"
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
          onLoadedData={showRestFrame}
          animate={{ scale: hot ? 1.3 : 1.2 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
        />
      </div>
    </div>
  );
}

export default function Benefits() {
  const { t } = useApp();
  const items = t("benefits.items") || [];

  return (
    <section className="section benefits" aria-labelledby="benefits-h2">
      <div className="container benefits__grid">
        <div className="benefits__text">
          <h2 id="benefits-h2">{t("benefits.title")}</h2>
          <p className="section-subtitle">{t("benefits.subtitle")}</p>
          <ul className="benefits__list">
            {items.map((item, i) => (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <span className="benefit-icon">{ICONS[i]}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
        <HoverOrb />
      </div>
    </section>
  );
}
