import type { Metadata } from "next";
import Image from "next/image";
import { CONTACT, waLink } from "@/lib/contact";

export const metadata: Metadata = {
  title: "DTG Bordados | Enlaces",
  description: "Cotiza tu bordado por WhatsApp y conoce nuestros servicios.",
};

const TEAL = "#199cb5";
const GOLD = "#d4a03c";

const SERVICES = [
  ["Bordado de logos", "Alta densidad sobre prendas premium", "Hola, quiero cotizar el bordado de mi logo"],
  ["Uniformes empresariales", "Producción por lotes con control de color", "Hola, quiero cotizar uniformes bordados"],
  ["Gorras y accesorios", "Gorras, bolsos, toallas y más", "Hola, quiero cotizar gorras bordadas"],
  ["Personalización", "Nombres y cargos en cada prenda", "Hola, quiero personalizar prendas con nombres"],
  ["Digitalización de arte", "Convertimos tu logo en puntadas", "Hola, necesito digitalizar mi logo para bordado"],
] as const;

const ICONS = {
  wa: "M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.6L3 21zm5.6-12c.2 2.7 2.9 5.4 5.6 5.6l1.3-1.3-2-1-1 .8c-.9-.4-1.9-1.4-2.3-2.3l.8-1-1-2L8.6 9z",
  ig: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.5-2.2h.01",
  ph: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  pin: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  web: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-9 9h18M12 3c2.5 2.5 3.5 5.5 3.5 9S14.5 18.5 12 21c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3z",
};

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const card =
  "stitch flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg";

export default function Enlaces() {
  const social = [
    CONTACT.whatsapp && { href: waLink(), label: "WhatsApp", d: ICONS.wa },
    CONTACT.instagram && { href: `https://instagram.com/${CONTACT.instagram}`, label: "Instagram", d: ICONS.ig },
    CONTACT.phone && { href: `tel:${CONTACT.phone}`, label: "Llamar", d: ICONS.ph },
  ].filter(Boolean) as { href: string; label: string; d: string }[];

  return (
    <main
      className="min-h-screen px-5 py-12"
      style={{
        background:
          "radial-gradient(ellipse at 80% 0%, rgba(25,156,181,.18), transparent 55%), radial-gradient(ellipse at 0% 100%, rgba(212,160,60,.18), transparent 50%), #f7f6f2",
      }}
    >
      <div className="mx-auto flex max-w-md flex-col items-center text-center text-[#0f1e2b]">
        <Image src="/logo.png" alt="DTG Bordados" width={150} height={160} priority className="h-[150px] w-auto" />
        <h1 className="mt-4 text-2xl font-black tracking-tight">Bordados DTG</h1>
        <p className="mt-1 text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: GOLD }}>
          Panamá · 25 años bordando
        </p>
        <p className="mt-2 text-sm text-slate-600">El arte del bordado, una historia de familia</p>

        {social.length > 0 && (
          <div className="mt-5 flex gap-3">
            {social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white transition-transform hover:scale-110"
                style={{ color: TEAL }}
              >
                <Icon d={s.d} />
              </a>
            ))}
          </div>
        )}

        {/* destacado */}
        <a
          href={waLink()}
          className="relative mt-7 w-full rounded-2xl px-6 py-5 text-left text-white shadow-lg transition-transform hover:scale-[1.02]"
          style={{ background: `linear-gradient(135deg, ${TEAL}, #0e6f84)` }}
        >
          <span className="absolute right-4 top-3 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest">
            ★ Destacado
          </span>
          <span className="block text-lg font-bold">Cotizar por WhatsApp</span>
          <span className="block text-sm text-white/80">Escríbenos directamente</span>
        </a>

        <h2 className="mt-9 text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Nuestros servicios</h2>
        <div className="mt-4 grid w-full gap-3 text-left">
          {SERVICES.map(([t, d, msg], i) => (
            <a key={t} href={waLink(msg)} className={card}>
              <span
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl font-mono text-sm font-bold text-white"
                style={{ background: i % 2 ? GOLD : TEAL }}
              >
                0{i + 1}
              </span>
              <span className="flex-1">
                <span className="block font-bold">{t}</span>
                <span className="block text-xs text-slate-500">{d}</span>
              </span>
              <span className="text-slate-300">→</span>
            </a>
          ))}

          <a href="/" className={card}>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white" style={{ background: "#0f1e2b" }}>
              <Icon d={ICONS.web} />
            </span>
            <span className="flex-1">
              <span className="block font-bold">Ver sitio web</span>
              <span className="block text-xs text-slate-500">Conoce nuestra historia y servicios</span>
            </span>
            <span className="text-slate-300">→</span>
          </a>

          {CONTACT.instagram && (
            <a href={`https://instagram.com/${CONTACT.instagram}`} className={card}>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white" style={{ background: GOLD }}>
                <Icon d={ICONS.ig} />
              </span>
              <span className="flex-1">
                <span className="block font-bold">Instagram</span>
                <span className="block text-xs text-slate-500">@{CONTACT.instagram}</span>
              </span>
              <span className="text-slate-300">→</span>
            </a>
          )}

          {(CONTACT.mapsUrl || CONTACT.address) && (
            <a href={CONTACT.mapsUrl || "#"} className={card}>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white" style={{ background: TEAL }}>
                <Icon d={ICONS.pin} />
              </span>
              <span className="flex-1">
                <span className="block font-bold">Ubicación</span>
                <span className="block text-xs text-slate-500">{CONTACT.address}</span>
              </span>
              <span className="text-slate-300">→</span>
            </a>
          )}
        </div>

        <footer className="mt-10 text-xs text-slate-500">
          {CONTACT.hours && <p className="mb-1">{CONTACT.hours}</p>}
          <p>© 2026 Bordados DTG, S. A.</p>
        </footer>
      </div>
    </main>
  );
}
