"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useApp } from "@/lib/store";
import { formatPhoneDisplay, newLeadId, normalizePhoneDigits, submitLead } from "@/lib/lead";
import { PrimaryButton } from "./Buttons";

const initialFields = { name: "", phone: "", address: "", tariff: "", consent: false, company: "" };

export default function LeadForm() {
  const { t, content, lang, selectedTariff, prefillAddress, formNonce, track } = useApp();
  const tr = t("form");

  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // null | "sending" | "success" | "error"
  const hasStartedRef = useRef(false);
  const idempotencyKeyRef = useRef(null);

  useEffect(() => {
    setFields((f) => ({
      ...f,
      tariff: selectedTariff || f.tariff,
      address: prefillAddress || f.address,
    }));
  }, [formNonce, selectedTariff, prefillAddress]);

  useEffect(() => {
    setStatus(null);
  }, [lang]);

  function update(name, value) {
    setFields((f) => ({ ...f, [name]: value }));
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      track("form_start");
    }
  }

  function validate() {
    const errs = {};
    if (fields.name.trim().length < 2 || fields.name.trim().length > 60) errs.name = tr.errors.name;
    if (normalizePhoneDigits(fields.phone).length !== 9) errs.phone = tr.errors.phone;
    if (fields.address.trim().length < 3) errs.address = tr.errors.address;
    if (!fields.consent) errs.consent = tr.errors.consent;
    setErrors(errs);
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (fields.company) return; // honeypot

    const errs = validate();
    const order = ["name", "phone", "address", "consent"];
    const firstKey = order.find((k) => errs[k]);
    if (firstKey) {
      track("form_error", { reason: "validation" });
      document.getElementById(`f-${firstKey}`)?.focus();
      return;
    }

    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = newLeadId();
    }

    const lead = {
      lead_id: idempotencyKeyRef.current,
      name: fields.name.trim(),
      phone: "+998" + normalizePhoneDigits(fields.phone),
      address: fields.address.trim(),
      tariff: fields.tariff || null,
      language: lang,
      page_variant: "default",
      consent_version: "v1",
      idempotency_key: idempotencyKeyRef.current,
      created_at: new Date().toISOString(),
    };

    setStatus("sending");
    try {
      await submitLead(lead);
      setStatus("success");
      track("generate_lead", { tariff_id: lead.tariff, form_id: "lead-form" });
      setFields(initialFields);
      hasStartedRef.current = false;
      idempotencyKeyRef.current = null;
    } catch {
      setStatus("error");
      track("form_error", { reason: "submit_failed" });
    }
  }

  return (
    <section className="section final-cta" id="lead-form" aria-labelledby="final-h2">
      <div className="hero__shapes hero__shapes--footer" aria-hidden="true">
        <span className="pill pill--5" />
        <span className="pill pill--6" />
      </div>
      <div className="container final-cta__grid">
        <div className="final-cta__text">
          <h2 id="final-h2">{t("finalCta.title")}</h2>
          <p className="section-subtitle">{t("finalCta.subtitle")}</p>
        </div>

        <form className="lead-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="f-name">{tr.nameLabel}</label>
            <input
              id="f-name"
              name="name"
              type="text"
              minLength={2}
              maxLength={60}
              required
              autoComplete="name"
              placeholder={tr.namePlaceholder}
              value={fields.name}
              className={errors.name ? "is-invalid" : ""}
              onChange={(e) => update("name", e.target.value)}
            />
            <p className="field-error" role="alert">{errors.name || ""}</p>
          </div>

          <div className="field">
            <label htmlFor="f-phone">{tr.phoneLabel}</label>
            <div className="phone-input">
              <span className="phone-input__prefix">+998</span>
              <input
                id="f-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                required
                autoComplete="tel"
                placeholder="XX XXX XX XX"
                value={fields.phone}
                className={errors.phone ? "is-invalid" : ""}
                onChange={(e) => update("phone", formatPhoneDisplay(normalizePhoneDigits(e.target.value)))}
              />
            </div>
            <p className="field-error" role="alert">{errors.phone || ""}</p>
          </div>

          <div className="field">
            <label htmlFor="f-address">{tr.addressLabel}</label>
            <input
              id="f-address"
              name="address"
              type="text"
              required
              list="coverageObjects"
              autoComplete="street-address"
              placeholder={tr.addressPlaceholder}
              value={fields.address}
              className={errors.address ? "is-invalid" : ""}
              onChange={(e) => update("address", e.target.value)}
            />
            <datalist id="coverageObjects">
              {content.coverage.map((row) => {
                const label = row.object[lang] || row.object.ru;
                return <option key={label} value={label} />;
              })}
            </datalist>
            <p className="field-error" role="alert">{errors.address || ""}</p>
          </div>

          <div className="field">
            <label htmlFor="f-tariff">{tr.tariffLabel}</label>
            <select id="f-tariff" name="tariff" value={fields.tariff} onChange={(e) => update("tariff", e.target.value)}>
              <option value="">{tr.tariffHelp}</option>
              {content.tariffs.map((tariff) => (
                <option key={tariff.id} value={tariff.id}>
                  {tariff.name} — {tariff.speed} {t("tariffs.speedUnit")} / {tariff.price.toLocaleString("ru-RU").replace(/,/g, " ")} {t("tariffs.perMonth")}
                </option>
              ))}
            </select>
          </div>

          <div className="field field--checkbox">
            <label className="checkbox-label">
              <input
                id="f-consent"
                name="consent"
                type="checkbox"
                required
                checked={fields.consent}
                onChange={(e) => update("consent", e.target.checked)}
              />
              <span>
                <span>{tr.consentPrefix}</span>
                <a href="https://citynet.uz/policy" target="_blank" rel="noopener noreferrer">
                  {tr.consentLink}
                </a>
              </span>
            </label>
            <p className="field-error" role="alert">{errors.consent || ""}</p>
          </div>

          <input
            type="text"
            name="company"
            id="f-company"
            className="honeypot"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={fields.company}
            onChange={(e) => update("company", e.target.value)}
          />

          <PrimaryButton
            className="btn--lg"
            type="submit"
            block
            disabled={status === "sending"}
          >
            {status === "sending" ? tr.sending : tr.submit}
          </PrimaryButton>

          <p className="lead-form__note">{tr.belowNote}</p>

          <AnimatePresence>
            {status === "success" && (
              <motion.div
                className="form-status form-status--success"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                role="status"
              >
                {tr.successTitle}. {tr.successText}
              </motion.div>
            )}
            {status === "error" && (
              <motion.div
                className="form-status form-status--error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                role="status"
              >
                {tr.errorText}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  );
}
