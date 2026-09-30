/** One place for every way to reach Matthew, so the hero, contact and footer never drift apart. */

export const EMAIL = "oderinwalematthew3@gmail.com";

/** 0913 850 8184 in international form, reused for tel: and wa.me links. */
export const PHONE_INTL = "2349138508184";
export const PHONE_DISPLAY = "+234 913 850 8184";

export const GITHUB_URL = "https://github.com/MatthewA1-Pro";
export const LINKEDIN_URL = "https://www.linkedin.com/in/matthew-oderinwale-a2181b41a/";

export const DEFAULT_WHATSAPP_MESSAGE = "Hi Matthew, I saw your portfolio and I have a mission for you.";

export const whatsappUrl = (text: string = DEFAULT_WHATSAPP_MESSAGE) =>
  `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(text)}`;

export const WHATSAPP_URL = whatsappUrl();

/**
 * Opens the visitor's own mail app with the message already written. Only
 * works where a desktop mail app is configured, so it is the fallback.
 */
export const mailtoUrl = (subject: string, body: string) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

/** Gmail's web compose window, pre-addressed and pre-written. */
export const gmailComposeUrl = (subject: string, body: string) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}&su=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;

/** Outlook on the web's compose window, pre-addressed and pre-written. */
export const outlookComposeUrl = (subject: string, body: string) =>
  `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(EMAIL)}&subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
