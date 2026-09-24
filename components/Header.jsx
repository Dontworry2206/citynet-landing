"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { PrimaryButton } from "./Buttons";

const LANGS = ["ru", "uz", "en"];

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.7" />
      <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M12 2.5v3" />
        <path d="M12 18.5v3" />
        <path d="M4.2 4.2l2.1 2.1" />
        <path d="M17.7 17.7l2.1 2.1" />
        <path d="M2.5 12h3" />
        <path d="M18.5 12h3" />
        <path d="M4.2 19.8l2.1-2.1" />
        <path d="M17.7 6.3l2.1-2.1" />
      </g>
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.5 2.4.8 3.7.9.6 0 1 .5 1 1v3.5c0 .6-.5 1-1 1C10.6 21.4 2.6 13.4 2.6 3.9c0-.6.5-1 1-1H7c.6 0 1 .4 1 1 .1 1.3.4 2.5.9 3.7.2.4.1.8-.2 1L6.6 10.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThemeToggle({ className }) {
  const { theme, toggleTheme, t } = useApp();
  return (
    <motion.button
      type="button"
      className={`theme-toggle js-theme-toggle ${className || ""}`}
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      aria-pressed={theme === "dark"}
      aria-label={theme === "dark" ? t("header.themeToLight") : t("header.themeToDark")}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.2 }}
          style={{ display: "flex" }}
        >
          {theme === "dark" ? <MoonIcon /> : <SunIcon />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

function LangSwitch({ className }) {
  const { lang, setLang } = useApp();
  return (
    <div className={`lang-switch ${className || ""}`} role="group" aria-label="Язык / Til / Language">
      {LANGS.map((code) => (
        <motion.button
          key={code}
          type="button"
          className={`lang-btn ${lang === code ? "is-active" : ""}`}
          onClick={() => setLang(code)}
          whileTap={{ scale: 0.92 }}
          aria-pressed={lang === code}
        >
          {code.toUpperCase()}
        </motion.button>
      ))}
    </div>
  );
}

export default function Header() {
  const { t, track, theme } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const cta = (location, { className = "", wrapperClassName = "", block = false } = {}) => (
    <PrimaryButton
      as="a"
      block={block}
      className={className}
      wrapperClassName={wrapperClassName}
      href="#lead-form"
      onClick={() => {
        track("cta_click", { cta_location: location });
        setMenuOpen(false);
      }}
    >
      {t("header.cta")}
    </PrimaryButton>
  );

  return (
    <header className="site-header" id="top">
      <div className="container header-row">
        <a className="brand" href="#top" aria-label="CITYNET">
          <img
            className="brand-logo"
            src={theme === "dark" ? "/img/logo-white.png" : "/img/logo-color.png"}
            alt="CITYNET"
            width={132}
            height={28}
          />
        </a>

        <nav className="main-nav" aria-label="Основная навигация">
          <a href="#tariffs">{t("header.navTariffs")}</a>
          <a href="#coverage">{t("header.navCoverage")}</a>
          <a href="#how">{t("header.navHow")}</a>
        </nav>

        <div className="header-actions">
          <a
            className="existing-client"
            href="tel:+998712021111"
            onClick={() => track("click_phone")}
          >
            <span>{t("header.existingClient")}</span>{" "}
            <span className="existing-client__link">{t("header.support")}</span>
          </a>

          <LangSwitch />
          <ThemeToggle />

          <a className="phone-link" href="tel:+998712021111" onClick={() => track("click_phone")}>
            <PhoneIcon />
            <span>71 202 11 11</span>
          </a>

          {cta("header", { className: "btn--sm", wrapperClassName: "header-cta" })}
        </div>

        <button
          type="button"
          className="burger"
          aria-expanded={menuOpen}
          aria-controls="mobileMenu"
          aria-label="Меню"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            id="mobileMenu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <div className="mobile-menu__row">
              <LangSwitch />
              <ThemeToggle />
            </div>
            <a href="#tariffs" onClick={() => setMenuOpen(false)}>{t("header.navTariffs")}</a>
            <a href="#coverage" onClick={() => setMenuOpen(false)}>{t("header.navCoverage")}</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>{t("header.navHow")}</a>
            <a href="tel:+998712021111" onClick={() => track("click_phone")}>71 202 11 11</a>
            {cta("mobile_menu", { block: true })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
