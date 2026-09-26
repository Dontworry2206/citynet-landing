"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useApp } from "@/lib/store";
import { formatPhoneDisplay, newLeadId, normalizePhoneDigits, submitLead } from "@/lib/lead";

const SRC = { dark: "/img/mascot-blue.webp", light: "/img/mascot-white.webp" };
const HINT_KEY = "citynet_chat_hint_seen";

const fill = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
const formatSum = (n) => n.toLocaleString("ru-RU").replace(/,/g, " ");

function findCoverage(content, lang, text) {
  const q = text.trim().toLowerCase();
  if (q.length < 3) return null;
  return (
    content.coverage.find((row) =>
      [row.object, row.street].some((field) =>
        Object.values(field).some((v) => {
          const l = String(v).toLowerCase();
          return l.includes(q) || q.includes(l);
        })
      )
    ) || null
  );
}

export default function ChatWidget() {
  const { t, lang, theme, content, goToForm, track } = useApp();
  const tr = t("chat");
  const reduced = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState(null); // goal | address | name | phone | done | null (bot busy)
  const [value, setValue] = useState("");
  const [nameError, setNameError] = useState(false);

  const data = useRef({ tariff: null, address: "", name: "", phone: "", leadId: null });
  const timers = useRef([]);
  const idRef = useRef(0);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const launcherRef = useRef(null);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const push = useCallback((from, text) => {
    setMessages((m) => [...m, { id: ++idRef.current, from, text }]);
  }, []);

  const say = useCallback(
    (texts, then) => {
      setStep(null);
      setTyping(true);
      let delay = 0;
      texts.forEach((text, i) => {
        delay += reduced ? 150 : 450 + Math.min(text.length * 10, 650);
        timers.current.push(
          setTimeout(() => {
            push("bot", text);
            if (i === texts.length - 1) {
              setTyping(false);
              then && then();
            }
          }, delay)
        );
      });
    },
    [push, reduced]
  );

  const start = useCallback(() => {
    clearTimers();
    data.current = { tariff: null, address: "", name: "", phone: "", leadId: null };
    setMessages([]);
    setValue("");
    setNameError(false);
    say([tr.greet, tr.askGoal], () => setStep("goal"));
  }, [say, tr]);

  // Start the dialogue on first open, and again whenever the language changes.
  useEffect(() => {
    if (open) start();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);
  const started = useRef(false);
  useEffect(() => {
    if (open && !started.current) {
      started.current = true;
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Nudge: one small hint bubble a few seconds after load, once per session.
  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(HINT_KEY) === "1";
    } catch {}
    if (seen) return;
    const show = setTimeout(() => setHint(true), 7000);
    const hide = setTimeout(() => setHint(false), 19000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages, typing, step, reduced, open]);

  useEffect(() => {
    if (open && (step === "address" || step === "name" || step === "phone")) inputRef.current?.focus();
  }, [open, step]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && closeChat();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function openChat() {
    setOpen(true);
    setHint(false);
    try {
      window.sessionStorage.setItem(HINT_KEY, "1");
    } catch {}
    track("chat_open");
  }
  function closeChat() {
    setOpen(false);
    launcherRef.current?.focus();
  }

  function goToBusinessForm() {
    track("chat_to_form", { step: "business" });
    closeChat();
    goToForm("", undefined, "business");
  }

  function pickGoal(goal) {
    push("user", goal.label);
    if (goal.id === "business") {
      data.current.tariff = null;
      track("chat_goal", { goal: goal.id });
      say([tr.businessRoute], () => setStep("business"));
      return;
    }
    const tariff = content.tariffs.find((x) => x.id === goal.tariff);
    data.current.tariff = tariff;
    track("chat_goal", { goal: goal.id, tariff_id: tariff.id });
    say(
      [fill(tr.recommend, { name: tariff.name, speed: tariff.speed, price: formatSum(tariff.price) }), tr.askAddress],
      () => setStep("address")
    );
  }

  function skipToForm() {
    const d = data.current;
    track("chat_to_form", { step });
    closeChat();
    goToForm(d.tariff?.id, d.address || undefined);
  }

  async function submitLeadFromChat() {
    const d = data.current;
    if (!d.leadId) d.leadId = newLeadId();
    const lead = {
      lead_id: d.leadId,
      name: d.name,
      phone: "+998" + d.phone,
      address: d.address,
      tariff: d.tariff?.id || null,
      language: lang,
      page_variant: "default",
      source: "chat",
      consent_version: "v1",
      idempotency_key: d.leadId,
      created_at: new Date().toISOString(),
    };
    setStep(null);
    setTyping(true);
    try {
      await submitLead(lead);
      setTyping(false);
      track("generate_lead", { tariff_id: lead.tariff, form_id: "chat" });
      say([tr.done], () => setStep("done"));
    } catch {
      setTyping(false);
      track("form_error", { reason: "chat_submit_failed" });
      say([tr.error], () => setStep("phone"));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const d = data.current;
    const text = value.trim();
    if (!text) return;

    if (step === "address") {
      push("user", text);
      setValue("");
      d.address = text;
      const hit = findCoverage(content, lang, text);
      const found = hit ? fill(tr.addrFound, { object: hit.object[lang] || hit.object.ru }) : tr.addrUnknown;
      say([found, tr.askName], () => setStep("name"));
    } else if (step === "name") {
      if (text.length < 2 || text.length > 60) {
        setNameError(true);
        return;
      }
      setNameError(false);
      push("user", text);
      setValue("");
      d.name = text;
      say([fill(tr.askPhone, { name: text })], () => setStep("phone"));
    } else if (step === "phone") {
      const digits = normalizePhoneDigits(text);
      if (digits.length !== 9) {
        setNameError(true);
        return;
      }
      setNameError(false);
      push("user", "+998 " + formatPhoneDisplay(digits));
      setValue("");
      d.phone = digits;
      submitLeadFromChat();
    }
  }

  const src = SRC[theme === "dark" ? "dark" : "light"];
  const inputStep = step === "address" || step === "name" || step === "phone";
  const errorText = nameError ? (step === "phone" ? tr.badPhone : tr.badName) : "";

  return (
    <div className="chat">
      <AnimatePresence>
        {open && (
          <motion.section
            key="panel"
            className="chat__panel"
            role="dialog"
            aria-label={tr.title}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            <header className="chat__head">
              <span className="chat__avatar" aria-hidden="true">
                <img src={src} alt="" draggable={false} />
              </span>
              <div className="chat__who">
                <p className="chat__title">{tr.title}</p>
                <p className="chat__sub">{tr.subtitle}</p>
              </div>
              <button type="button" className="chat__close" onClick={closeChat} aria-label={tr.close}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            <div className="chat__list" ref={listRef} role="log" aria-live="polite">
              {messages.map((m) => (
                <motion.p
                  key={m.id}
                  className={`chat__msg chat__msg--${m.from}`}
                  initial={reduced ? false : { opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.22 }}
                >
                  {m.text}
                </motion.p>
              ))}
              {typing && (
                <p className="chat__msg chat__msg--bot chat__typing" aria-hidden="true">
                  <span /><span /><span />
                </p>
              )}

              {step === "goal" && (
                <div className="chat__chips">
                  {(tr.goals || []).map((g) => (
                    <button key={g.id} type="button" className="chat__chip" onClick={() => pickGoal(g)}>
                      {g.label}
                    </button>
                  ))}
                </div>
              )}
              {step === "business" && (
                <div className="chat__chips">
                  <button type="button" className="chat__chip chat__chip--solid" onClick={goToBusinessForm}>
                    {tr.businessCta}
                  </button>
                  <button type="button" className="chat__chip" onClick={start}>
                    {tr.restart}
                  </button>
                </div>
              )}
              {step === "done" && (
                <div className="chat__chips">
                  <button type="button" className="chat__chip" onClick={start}>
                    {tr.restart}
                  </button>
                </div>
              )}
            </div>

            {inputStep && (
              <form className="chat__foot" onSubmit={handleSubmit} noValidate>
                {errorText && <p className="chat__error" role="alert">{errorText}</p>}
                <div className="chat__inputrow">
                  {step === "phone" && <span className="chat__prefix">+998</span>}
                  <input
                    ref={inputRef}
                    className={`chat__input ${nameError ? "is-invalid" : ""}`}
                    type={step === "phone" ? "tel" : "text"}
                    inputMode={step === "phone" ? "tel" : undefined}
                    autoComplete={step === "phone" ? "tel" : step === "name" ? "name" : "off"}
                    maxLength={step === "phone" ? 12 : 80}
                    value={value}
                    placeholder={
                      step === "phone" ? tr.phonePlaceholder : step === "name" ? tr.namePlaceholder : tr.addressPlaceholder
                    }
                    aria-label={
                      step === "phone" ? tr.phonePlaceholder : step === "name" ? tr.namePlaceholder : tr.addressPlaceholder
                    }
                    onChange={(e) => {
                      setNameError(false);
                      setValue(step === "phone" ? formatPhoneDisplay(normalizePhoneDigits(e.target.value)) : e.target.value);
                    }}
                  />
                  <button type="submit" className="chat__send" aria-label={tr.send}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                {step === "phone" && (
                  <p className="chat__note">
                    {tr.phoneNote}{" "}
                    <a href="https://citynet.uz/policy" target="_blank" rel="noopener noreferrer">
                      {t("form.consentLink")}
                    </a>
                  </p>
                )}
                <button type="button" className="chat__link" onClick={skipToForm}>
                  {tr.openForm}
                </button>
              </form>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hint && !open && (
          <motion.button
            key="hint"
            type="button"
            className="chat__hint"
            onClick={openChat}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
          >
            {tr.hint}
          </motion.button>
        )}
      </AnimatePresence>

      {!open && (
        <motion.button
          ref={launcherRef}
          type="button"
          className="chat__launcher"
          onClick={openChat}
          aria-label={tr.open}
          aria-haspopup="dialog"
          initial={reduced ? false : { opacity: 0, y: 24, scale: 0.6 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: reduced ? 0 : 1.2 }}
          whileHover={reduced ? undefined : { scale: 1.08, rotate: -4 }}
          whileTap={{ scale: 0.94 }}
        >
          <span className="chat__bob">
            <img src={src} alt="" draggable={false} />
          </span>
        </motion.button>
      )}
    </div>
  );
}
