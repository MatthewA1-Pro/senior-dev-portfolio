import { Suspense, lazy, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Github, Linkedin, ArrowUp } from "lucide-react";
import { MagneticButton } from "./ScrollReveal";
import ErrorBoundary from "./ErrorBoundary";
import { ViewportMount } from "./ViewportMount";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";
import {
  EMAIL,
  PHONE_DISPLAY,
  PHONE_INTL,
  GITHUB_URL,
  LINKEDIN_URL,
  WHATSAPP_URL,
  whatsappUrl,
  mailtoUrl,
} from "@/lib/contact";

const RamenShop = lazy(() =>
  import("./three/NarutoModels").then((m) => ({ default: m.RamenShop })),
);

const CONTACT_CHANNELS = [
  { icon: Mail, label: "Messenger Hawk", value: EMAIL, href: `mailto:${EMAIL}` },
  { icon: Phone, label: "Signal Transceiver", value: PHONE_DISPLAY, href: `tel:+${PHONE_INTL}` },
  { icon: MapPin, label: "Current Sector", value: "Lagos, Nigeria", href: undefined },
];

/** The menu board: each bowl is a kind of job. */
const MENU = [
  { id: "miso", kanji: "味噌", bowl: "Miso Ramen", job: "A full-stack build, start to launch" },
  { id: "shoyu", kanji: "醤油", bowl: "Shoyu Ramen", job: "AI features, agents or LLM integration" },
  { id: "tonkotsu", kanji: "豚骨", bowl: "Tonkotsu Ramen", job: "Rescue, fix or speed up an existing app" },
  { id: "tea", kanji: "お茶", bowl: "Just tea", job: "No project yet - just a conversation" },
] as const;

const NAV = [
  { href: "#about", label: "The Ninja Way" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "S-Rank Missions" },
  { href: "#ai-gallery", label: "AI Gallery" },
];

const SOCIALS = [
  { icon: Github, href: GITHUB_URL, label: "GitHub" },
  { icon: Linkedin, href: LINKEDIN_URL, label: "LinkedIn" },
  { icon: WhatsAppIcon, href: WHATSAPP_URL, label: "WhatsApp" },
];

/**
 * An Ichiraku order ticket in place of the old contact form. That form faked a
 * "sent" toast and delivered nothing, because no email service is configured.
 * The ticket composes the message and hands it to WhatsApp or the visitor's own
 * mail app, so both routes genuinely reach Matthew with no server involved.
 */
const OrderTicket = () => {
  const [choice, setChoice] = useState<(typeof MENU)[number]["id"]>("miso");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  const item = MENU.find((m) => m.id === choice) ?? MENU[0];
  const greeting = name.trim() ? `Hi Matthew, I'm ${name.trim()}.` : "Hi Matthew,";
  const body = [
    greeting,
    `I saw your portfolio and I'd like to order: ${item.bowl} - ${item.job}.`,
    note.trim(),
  ]
    .filter(Boolean)
    .join("\n\n");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[hsl(var(--sunset))]/25 bg-[#f4e9d6] text-[#2a1a10] shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
      {/* Noren-style header strip */}
      <div className="flex items-center justify-between bg-[#8f1d18] px-6 py-4 text-[#f8ecd8]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#f8ecd8]/75">Order ticket</p>
          <p className="font-display text-2xl">Ichiraku Ramen</p>
        </div>
        <span className="font-japanese text-4xl leading-none">一楽</span>
      </div>

      <div className="space-y-6 p-6 sm:p-8">
        <fieldset>
          <legend className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[#7a4a2a]">
            What are you ordering?
          </legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {MENU.map((m) => {
              const active = m.id === choice;
              return (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition-colors ${
                    active ? "border-[#c8321f] bg-[#c8321f]/10" : "border-[#2a1a10]/10 hover:border-[#2a1a10]/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="bowl"
                    value={m.id}
                    checked={active}
                    onChange={() => setChoice(m.id)}
                    className="sr-only"
                  />
                  <span className="font-japanese mt-0.5 w-9 shrink-0 text-lg leading-none text-[#c8321f]">{m.kanji}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold">{m.bowl}</span>
                    <span className="block text-xs leading-snug text-[#2a1a10]/70">{m.job}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="space-y-4">
          <div>
            <label htmlFor="order-name" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.3em] text-[#7a4a2a]">
              Name for the order
            </label>
            <input
              id="order-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              className="w-full rounded-lg border border-[#2a1a10]/15 bg-white/70 px-3 py-2.5 text-sm placeholder:text-[#2a1a10]/40 focus:border-[#c8321f] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="order-note" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.3em] text-[#7a4a2a]">
              Note for the chef <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <textarea
              id="order-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="A line or two about the project, timeline or budget"
              className="w-full resize-none rounded-lg border border-[#2a1a10]/15 bg-white/70 px-3 py-2.5 text-sm placeholder:text-[#2a1a10]/40 focus:border-[#c8321f] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a
            href={whatsappUrl(body)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-bold uppercase tracking-widest text-[#06241a] transition-transform hover:scale-[1.02]"
          >
            <WhatsAppIcon className="h-5 w-5" /> Send on WhatsApp
          </a>
          <a
            href={mailtoUrl(`Portfolio enquiry: ${item.bowl}`, body)}
            className="flex items-center justify-center gap-2.5 rounded-xl bg-[#2a1a10] px-4 py-3.5 text-sm font-bold uppercase tracking-widest text-[#f4e9d6] transition-transform hover:scale-[1.02]"
          >
            <Mail className="h-5 w-5" /> Send by email
          </a>
        </div>
        <p className="text-center text-xs text-[#2a1a10]/60">
          Opens WhatsApp or your email app with this order already written - just press send.
        </p>
      </div>
    </div>
  );
};

/**
 * The closing scene: the shop in its own unobstructed band, then the contact
 * block, then the footer.
 */
export const IchirakuFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="relative overflow-hidden bg-background">
      {/* Scene band: the shop, clear and lit, with only a thin edge fade */}
      <div
        className="relative h-[46vh] min-h-[320px] sm:h-[68vh] sm:min-h-[480px]"
        style={{ background: "radial-gradient(ellipse at 50% 70%, #3a1d0c 0%, #140b07 55%, hsl(var(--background)) 100%)" }}
      >
        <ViewportMount className="absolute inset-0">
          <ErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <RamenShop />
            </Suspense>
          </ErrorBoundary>
        </ViewportMount>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

        <div className="pointer-events-none container relative z-10 mx-auto hidden h-full items-end px-6 pb-10 sm:flex">
          <div className="flex w-full items-end justify-between gap-6">
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.4em] text-[hsl(var(--sunset))]">
                Konoha · After the mission
              </p>
              <p className="font-display text-4xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] md:text-6xl">
                Ichiraku Ramen
              </p>
            </div>
            <span className="hidden font-japanese text-5xl text-[hsl(var(--sunset))] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:block">
              一楽
            </span>
          </div>
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-6 py-16 lg:py-28">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-2 lg:gap-16">
          {/* Left: the invitation */}
          <div className="min-w-0">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="mb-4 inline-block rounded-md border border-primary/20 bg-primary/10 px-3 py-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary">End of the Trail</span>
              </div>
              <h2 className="mb-6 font-display text-4xl tracking-wide md:text-6xl">
                Meet Me At <br />
                <span className="gradient-text">Ichiraku</span>
              </h2>
              <p className="mb-10 max-w-md text-lg leading-relaxed text-muted-foreground">
                Whether you have a high-stakes mission or just want to talk system architecture over a
                warm bowl of ramen, my transceiver is always open.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <MagneticButton
                as="a"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-full bg-[#25D366] px-7 py-4 text-sm font-bold uppercase tracking-widest text-[#06241a] shadow-lg shadow-[#25D366]/20 sm:px-8 sm:py-5"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Message me on WhatsApp
              </MagneticButton>
            </motion.div>

            <div className="space-y-4">
              {CONTACT_CHANNELS.map((channel, i) => {
                const inner = (
                  <>
                    <div className="shrink-0 rounded-xl bg-primary/10 p-3.5 text-primary transition-transform duration-300 group-hover:scale-110">
                      <channel.icon className="h-5 w-5" />
                    </div>
                    {/* min-w-0 + break-all: without them a long email pushed
                        past the card edge on narrow phones. */}
                    <div className="min-w-0">
                      <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        {channel.label}
                      </p>
                      <p className="break-all text-[15px] font-medium text-white/90 sm:text-base">{channel.value}</p>
                    </div>
                  </>
                );
                const className =
                  "group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-card p-4 transition-all sm:gap-5 sm:p-5";

                return (
                  <motion.div
                    key={channel.label}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                  >
                    {channel.href ? (
                      <a href={channel.href} className={`${className} hover:border-primary/50`}>
                        {inner}
                      </a>
                    ) : (
                      <div className={className}>{inner}</div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: the order ticket */}
          <motion.div
            className="min-w-0"
            initial={{ opacity: 0, y: 30, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <OrderTicket />
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-white/[0.06] bg-[#07070a]">
        <div className="container mx-auto px-6 pb-8 pt-14">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <a href="#home" className="font-display text-3xl">
                <span className="text-primary">M</span>
                <span className="text-foreground">.</span>
              </a>
              <p className="mt-4 text-lg text-white">Matthew Oderinwale</p>
              <p className="mt-1 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Full-stack and AI engineer in Lagos, Nigeria, shipping products for clients worldwide.
              </p>
            </div>

            <nav aria-label="Footer">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.35em] text-[hsl(var(--sunset))]">The path</p>
              <ul className="space-y-2.5">
                {NAV.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.35em] text-[hsl(var(--sunset))]">Find me</p>
              <div className="flex gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/75 transition-colors hover:border-primary hover:text-primary"
                  >
                    <s.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
              <a
                href="#home"
                className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowUp className="h-3.5 w-3.5" /> Back to the village
              </a>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {currentYear} Matthew Oderinwale. All rights reserved.</p>
            <p className="flex items-center gap-2">
              <span className="font-japanese text-sm text-primary">火の意志</span>
              <span>Never going back on my word - that's my Ninja way.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
