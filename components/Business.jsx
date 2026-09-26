"use client";

import { motion, useReducedMotion } from "motion/react";
import { useApp } from "@/lib/store";

export default function Business() {
  const { t, goToForm, track } = useApp();
  const tr = t("business");
  const reduced = useReducedMotion();

  return (
    <section className="section biz" id="business" aria-labelledby="biz-h2">
      <div className="container">
        <div className="biz__panel">
          <div className="biz__text">
            <h2 id="biz-h2">{tr.title}</h2>
            <p className="biz__subtitle">{tr.subtitle}</p>
            <motion.button
              type="button"
              className="biz__cta"
              whileHover={reduced ? undefined : { y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              onClick={() => {
                track("cta_click", { cta_location: "business" });
                goToForm("", undefined, "business");
              }}
            >
              {tr.cta}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
            <p className="biz__note">
              {tr.note} {tr.phoneLead}{" "}
              <a href="tel:+998712021111" onClick={() => track("click_phone")}>71 202 11 11</a>
            </p>
          </div>

          <div className="biz__list">
            <p className="biz__list-title">{tr.listTitle}</p>
            <ul>
              {(tr.items || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
