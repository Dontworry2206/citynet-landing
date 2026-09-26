/**
 * Sends the lead to a real backend if NEXT_PUBLIC_LEAD_ENDPOINT is set.
 * Otherwise runs in DEMO mode: validates and shows success locally, but
 * nothing is sent or stored anywhere and no lead reaches any CRM — see
 * ТЗ section 7 for the intended server/CRM contract.
 */
export function submitLead(lead) {
  const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT;
  if (!endpoint) {
    return new Promise((resolve) => setTimeout(resolve, 500));
  }
  return fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  }).then((res) => {
    if (!res.ok) throw new Error("lead submit failed: " + res.status);
    return res.json().catch(() => ({}));
  });
}

export function newLeadId() {
  return typeof window !== "undefined" && window.crypto?.randomUUID ? window.crypto.randomUUID() : String(Date.now());
}

export function normalizePhoneDigits(value) {
  return value.replace(/\D/g, "").slice(0, 9);
}

export function formatPhoneDisplay(digits) {
  const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)];
  return parts.filter(Boolean).join(" ");
}
