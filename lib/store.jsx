"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CITYNET_CONTENT } from "./content";

const AppContext = createContext(null);

function readStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function getByPath(obj, path) {
  return path.split(".").reduce((node, key) => (node == null ? undefined : node[key]), obj);
}

export function AppProvider({ children }) {
  const [lang, setLangState] = useState(CITYNET_CONTENT.defaultLanguage);
  const [theme, setThemeState] = useState("light");
  const [selectedTariff, setSelectedTariff] = useState("");
  const [prefillAddress, setPrefillAddress] = useState("");
  const [segment, setSegment] = useState("home"); // "home" | "business"
  const [formNonce, setFormNonce] = useState(0);

  useEffect(() => {
    const storedLang = readStorage("citynet_lang");
    if (storedLang && CITYNET_CONTENT.languages.includes(storedLang)) setLangState(storedLang);
    const storedTheme = readStorage("citynet_theme");
    if (storedTheme === "light" || storedTheme === "dark") setThemeState(storedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0F1236" : "#161A46");
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    const apply = () => {
      document.title = getByPath(CITYNET_CONTENT.strings[lang], "meta.title") || "CITYNET";
      const desc = getByPath(CITYNET_CONTENT.strings[lang], "meta.description");
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && desc) metaDesc.setAttribute("content", desc);
    };
    // On first mount, Next's own metadata effect writes the static server
    // title right after ours runs, clobbering it once. Re-applying a few
    // times over the next tick(s) outlasts that one-time overwrite without
    // fighting it on every render.
    apply();
    const timers = [0, 50, 300].map((ms) => setTimeout(apply, ms));
    return () => timers.forEach(clearTimeout);
  }, [lang]);

  const setLang = useCallback((next) => {
    setLangState(next);
    writeStorage("citynet_lang", next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      writeStorage("citynet_theme", next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key) => {
      const value = getByPath(CITYNET_CONTENT.strings[lang], key);
      return value == null ? "" : value;
    },
    [lang]
  );

  const goToForm = useCallback((tariffId, address, nextSegment = "home") => {
    setSegment(nextSegment);
    if (tariffId !== undefined) setSelectedTariff(tariffId);
    if (address !== undefined) setPrefillAddress(address);
    setFormNonce((n) => n + 1);
    requestAnimationFrame(() => {
      document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const track = useCallback(
    (event, params) => {
      const payload = { event, language: lang, ...params };
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(payload);
      if (typeof window !== "undefined" && window.location.search.includes("debug=1")) {
        // eslint-disable-next-line no-console
        console.debug("[citynet:event]", payload);
      }
    },
    [lang]
  );

  const value = useMemo(
    () => ({
      lang,
      setLang,
      theme,
      toggleTheme,
      t,
      content: CITYNET_CONTENT,
      selectedTariff,
      prefillAddress,
      segment,
      setSegment,
      formNonce,
      goToForm,
      track,
    }),
    [lang, setLang, theme, toggleTheme, t, selectedTariff, prefillAddress, segment, formNonce, goToForm, track]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
