"use client";

import { motion } from "motion/react";
import { useApp } from "@/lib/store";

export default function Steps() {
  const { t } = useApp();
  const items = t("steps.items") || [];

  return (
    <section className="section steps" id="how" aria-labelledby="steps-h2">
      <div className="container">
        <div className="section-head">
          <h2 id="steps-h2">{t("steps.title")}</h2>
        </div>
        <ol className="steps__list">
          {items.map((item, i) => (
            <motion.li
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
