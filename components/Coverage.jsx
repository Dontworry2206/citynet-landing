"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { useApp } from "@/lib/store";
import { GhostButton } from "./Buttons";

function localized(field, lang) {
  return field[lang] || field.ru;
}

const PREVIEW_ROWS = 5;

export default function Coverage() {
  const { t, lang, content, goToForm, track } = useApp();
  const tr = t("coverage");
  const [district, setDistrict] = useState("");
  const [expanded, setExpanded] = useState(false);

  const districts = useMemo(() => {
    const seen = new Set();
    const out = [];
    content.coverage.forEach((row) => {
      const label = localized(row.district, lang);
      if (!seen.has(label)) {
        seen.add(label);
        out.push(label);
      }
    });
    return out;
  }, [content, lang]);

  const rows = useMemo(
    () => content.coverage.filter((row) => !district || localized(row.district, lang) === district),
    [content, district, lang]
  );

  const collapsible = rows.length > PREVIEW_ROWS;
  const visibleRows = collapsible && !expanded ? rows.slice(0, PREVIEW_ROWS) : rows;

  return (
    <section className="section coverage" id="coverage" aria-labelledby="coverage-h2">
      <div className="container">
        <div className="section-head">
          <h2 id="coverage-h2">{tr.title}</h2>
          <p className="section-subtitle">{tr.subtitle}</p>
        </div>

        <div className="coverage__filters">
          <label className="visually-hidden" htmlFor="districtFilter">
            {tr.filterDistrict}
          </label>
          <select id="districtFilter" value={district} onChange={(e) => {
              setDistrict(e.target.value);
              setExpanded(false);
            }}>
            <option value="">{tr.allDistricts}</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="coverage__table-wrap">
          <table className="coverage__table">
            <thead>
              <tr>
                <th>{tr.colDistrict}</th>
                <th>{tr.colStreet}</th>
                <th>{tr.colObject}</th>
                <th>{tr.colHouses}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => {
                const objectLabel = localized(row.object, lang);
                return (
                  <tr key={`${objectLabel}-${row.houses}`}>
                    <td>{localized(row.district, lang)}</td>
                    <td>{localized(row.street, lang)}</td>
                    <td>{objectLabel}</td>
                    <td>{row.houses}</td>
                    <td>
                      <motion.button
                        type="button"
                        className="row-cta"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          track("cta_click", { cta_location: "coverage_row" });
                          goToForm(undefined, objectLabel);
                        }}
                      >
                        {tr.rowCta}
                      </motion.button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <p className="coverage__no-results">{tr.noResults}</p>}
        {collapsible && (
          <div className="coverage__more">
            <GhostButton type="button" aria-expanded={expanded} onClick={() => setExpanded((v) => !v)}>
              {expanded ? tr.showLess : `${tr.showMore} (${rows.length - PREVIEW_ROWS})`}
            </GhostButton>
          </div>
        )}

        <div className="coverage__manual">
          <div>
            <h3>{tr.manualTitle}</h3>
            <p>{tr.manualText}</p>
          </div>
          <GhostButton
            as="a"
            href="#lead-form"
            onClick={() => track("cta_click", { cta_location: "coverage_manual" })}
          >
            {tr.manualCta}
          </GhostButton>
        </div>

        <div className="trust-stats">
          {content.trustStats.map((stat) => (
            <div key={stat.value} className="trust-stat">
              <p className="trust-stat__value">{stat.value}</p>
              <p className="trust-stat__label">{localized(stat, lang)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
