"use client";

import { useEffect } from "react";
import { useApp, AppProvider } from "@/lib/store";
import Header from "./Header";
import Hero from "./Hero";
import Benefits from "./Benefits";
import Tariffs from "./Tariffs";
import Coverage from "./Coverage";
import Business from "./Business";
import Steps from "./Steps";
import Faq from "./Faq";
import LeadForm from "./LeadForm";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";

function SkipLink() {
  const { t } = useApp();
  return (
    <a className="skip-link" href="#lead-form">
      {t("skipToForm")}
    </a>
  );
}

function Sections() {
  const { track } = useApp();
  useEffect(() => {
    track("page_view", { page_variant: "default" });
  }, [track]);

  return (
    <>
      <SkipLink />
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Tariffs />
        <Coverage />
        <Business />
        <Steps />
        <Faq />
        <LeadForm />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}

export default function LandingPage() {
  return (
    <AppProvider>
      <Sections />
    </AppProvider>
  );
}
