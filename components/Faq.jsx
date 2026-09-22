"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useApp } from "@/lib/store";

export default function Faq() {
  const { t, lang } = useApp();
  const items = t("faq.items") || [];
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="section faq" aria-labelledby="faq-h2">
      <div className="container container--narrow">
        <div className="section-head">
          <h2 id="faq-h2">{t("faq.title")}</h2>
        </div>
        <div className="faq__list">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div className="faq__item" key={`${lang}-${i}`}>
                <button
                  type="button"
                  className="faq__question"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  {item.q}
                  <span className="plus" aria-hidden="true">
                    <span className="plus-h" />
                    <motion.span
                      className="plus-v"
                      animate={{ scaleY: isOpen ? 0 : 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <p className="faq__answer-inner">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
