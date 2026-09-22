"use client";

import { useApp } from "@/lib/store";

export default function Footer() {
  const { t, lang, content, track } = useApp();
  const tr = t("footer");
  const address = content.contacts.address[lang] || content.contacts.address.ru;

  return (
    <footer className="site-footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img src="/img/logo-white.png" alt="CITYNET" width={132} height={28} />
          <p className="footer__disclaimer">{tr.disclaimer}</p>
        </div>

        <div className="footer__col">
          <h3>{tr.colInternet}</h3>
          <a href="#tariffs">{tr.linkTariffs}</a>
          <a href="#coverage">{tr.linkCoverage}</a>
          <a href="#how">{tr.linkHow}</a>
          <a href="https://citynet.uz/profile" target="_blank" rel="noopener noreferrer">{tr.linkProfile}</a>
        </div>

        <div className="footer__col">
          <h3>{tr.colCompany}</h3>
          <a href="https://citynet.uz/about" target="_blank" rel="noopener noreferrer">{tr.linkAbout}</a>
          <a href="https://citynet.uz" target="_blank" rel="noopener noreferrer">{tr.linkBusiness}</a>
          <a href="tel:+998712021111" onClick={() => track("click_phone")}>{tr.linkSupport}</a>
        </div>

        <div className="footer__col">
          <h3>{tr.colDocs}</h3>
          <a href="https://citynet.uz/policy" target="_blank" rel="noopener noreferrer">{tr.linkPolicy}</a>
          <a href="https://citynet.uz/assets/oferta.pdf" target="_blank" rel="noopener noreferrer">{tr.linkOffer}</a>
        </div>

        <div className="footer__col footer__contacts">
          <h3>{tr.supportLabel}</h3>
          <a className="footer__phone" href="tel:+998712021111" onClick={() => track("click_phone")}>+998 71 202 11 11</a>
          <a href="mailto:info@citynet.uz">info@citynet.uz</a>
          <p className="footer__address">{address}</p>
          <div className="footer__social">
            <a href="https://www.instagram.com/citynet.uzb/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
              </svg>
            </a>
            <a
              href="https://t.me/citynetit"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              onClick={() => track("click_telegram")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 3.5 3 10.6c-.9.36-.9 1.63.02 1.94l4.4 1.47 1.7 5.3c.28.87 1.4 1.05 1.94.32l2.3-3.1 4.6 3.4c.8.6 1.94.16 2.1-.82l2.6-14.1c.17-.95-.75-1.7-1.66-1.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path d="M9.4 14 18 6.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </a>
            <a href="https://www.facebook.com/citynet.uzb/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14.5 21v-6.7h2.3l.4-2.7h-2.7V9.7c0-.8.2-1.3 1.4-1.3h1.4V6c-.7-.1-1.5-.2-2.3-.2-2.3 0-3.9 1.4-3.9 4v2.2H8.6v2.7h2.5V21"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="container footer__legal">
        <p>{tr.legal}</p>
      </div>
    </footer>
  );
}
