/**
 * Contact configuration - update these via .env or here for production
 */

export const contactConfig = {
  /** External pricing/checkout page (payments managed via Builder.ai) */
  pricingUrl: import.meta.env.VITE_PRICING_URL || "https://uphireiq.com/products#pricing",
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || "support@uphire.com",
  supportPhone: import.meta.env.VITE_SUPPORT_PHONE || "",
  legalEmail: import.meta.env.VITE_LEGAL_EMAIL || "legal@uphire.com",
  privacyEmail: import.meta.env.VITE_PRIVACY_EMAIL || "privacy@uphire.com",
  salesEmail: import.meta.env.VITE_SALES_EMAIL || "sales@uphire.com",
  billingEmail: import.meta.env.VITE_BILLING_EMAIL || "billing@uphire.com",
  noreplyEmail: import.meta.env.VITE_FROM_EMAIL || "noreply@uphire.com",
};
