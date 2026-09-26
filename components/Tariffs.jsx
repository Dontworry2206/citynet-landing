"use client";

import { motion } from "motion/react";
import { useApp } from "@/lib/store";
import { PrimaryButton } from "./Buttons";

function formatPrice(sum) {
  return sum.toLocaleString("ru-RU").replace(/,/g, " ");
}

export default function Tariffs() {
  const { t, content, goToForm, track } = useApp();
  const tr = t("tariffs");
  const descriptions = tr.descriptions || {};

  return (
    <section className="section tariffs" id="tariffs" aria-labelledby="tariffs-h2">
      <div className="container">
        <div className="section-head">
          <h2 id="tariffs-h2">{tr.title}</h2>
          <p className="section-subtitle">{tr.subtitle}</p>
        </div>

        <div className="tariff-grid">
          {content.tariffs.map((tariff, i) => (
            <motion.div
              key={tariff.id}
              className={`tariff-card ${tariff.featured ? "tariff-card--featured" : ""}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              {tariff.featured && (
                <span className="tariff-ribbon" aria-hidden="true">
                  <span>HIT</span>
                </span>
              )}
              <p className="tariff-card__name">{tariff.name}</p>
              <p className="tariff-card__speed">
                {tariff.speed}
                <span>{tr.speedUnit}</span>
              </p>
              <p className="tariff-card__price">
                {formatPrice(tariff.price)} <span>{tr.perMonth}</span>
              </p>
              <p className="tariff-card__desc">{descriptions[tariff.id]}</p>
              <PrimaryButton
                type="button"
                block
                onClick={() => {
                  track("select_tariff", { tariff_id: tariff.id });
                  goToForm(tariff.id);
                }}
              >
                {tr.cta} {tariff.name}
              </PrimaryButton>
            </motion.div>
          ))}
        </div>

        <p className="tariffs__footnote">{tr.footnote}</p>
      </div>
    </section>
  );
}
