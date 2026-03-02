/**
 * Calendly integration config - set VITE_CALENDLY_URL in .env
 * Get your URL from https://calendly.com → Share → Copy link
 */

export const calendlyConfig = {
  /** Main scheduling URL - e.g. https://calendly.com/your-username/interview */
  url:
    (import.meta as any).env?.VITE_CALENDLY_URL ||
    "https://calendly.com/uphireiq/interview",
};

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: {
        url: string;
        prefill?: {
          name?: string;
          email?: string;
          customAnswers?: Record<string, string>;
        };
        utm?: Record<string, string>;
      }) => void;
      showPopup: () => void;
      closePopup: () => void;
    };
  }
}

export interface CalendlyPrefill {
  name: string;
  email: string;
  position?: string;
  skills?: string;
}

/** Open Calendly popup with candidate prefill. Falls back to new tab if widget not loaded. */
export function openCalendlyScheduling(prefill: CalendlyPrefill, roleTitle?: string) {
  const baseUrl = calendlyConfig.url;
  const params = new URLSearchParams();
  params.set("name", prefill.name);
  params.set("email", prefill.email);
  if (roleTitle) params.set("a1", roleTitle); // custom field: Position
  if (prefill.skills) params.set("a2", prefill.skills); // custom field: Skills

  const fullUrl = `${baseUrl}?${params.toString()}`;

  if (typeof window !== "undefined" && window.Calendly) {
    window.Calendly.initPopupWidget({
      url: baseUrl,
      prefill: {
        name: prefill.name,
        email: prefill.email,
        customAnswers: {
          a1: roleTitle || prefill.position || "",
          a2: prefill.skills || "",
        },
      },
    });
    window.Calendly.showPopup();
  } else {
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  }
}
