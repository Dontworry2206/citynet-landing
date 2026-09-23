"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
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

function HoverOrb() {
  const videoRef = useRef(null);
  const [hot, setHot] = useState(false);

  const play = () => videoRef.current?.play().catch(() => {});
  const pause = () => videoRef.current?.pause();

  // No transform/opacity on ancestors: they would isolate the video's blend
  // mode from the page background and bring the black square back.
  return (
    <div className="benefits__art" aria-hidden="true">
      <div
        className="orb"
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse") return;
          setHot(true);
          play();
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== "mouse") return;
          setHot(false);
          pause();
        }}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse") return;
          const v = videoRef.current;
          if (v) (v.paused ? play() : pause());
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
