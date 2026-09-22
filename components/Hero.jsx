"use client";

import { motion } from "motion/react";
import { useApp } from "@/lib/store";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] } },
};

export default function Hero() {
  const { t, track } = useApp();

  return (
    <section className="hero" aria-labelledby="hero-h1">
      <div className="hero__shapes" aria-hidden="true">
        <span className="pill pill--1" />
        <span className="pill pill--2" />
        <span className="pill pill--3" />
        <span className="pill pill--4" />
      </div>
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
            <motion.a
              className="btn btn--primary btn--lg"
              href="#lead-form"
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -1 }}
              onClick={() => track("cta_click", { cta_location: "hero" })}
            >
              {t("hero.cta")}
            </motion.a>
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
