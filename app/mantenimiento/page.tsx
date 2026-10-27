import type { Metadata } from "next";
import Image from "next/image";
import { CONTACT, waLink } from "@/lib/contact";

export const metadata: Metadata = {
  title: "En mantenimiento",
  description: "Estamos mejorando nuestra web. Volvemos muy pronto.",
  robots: { index: false, follow: false },
};

const TEAL = "#199cb5";
const GOLD = "#d4a03c";

export default function Mantenimiento() {
  return (
    <main
      className="grid min-h-screen place-items-center px-6 py-12 text-center text-[#0f1e2b]"
      style={{
        background:
          "radial-gradient(ellipse at 80% 10%, rgba(25,156,181,.20), transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(212,160,60,.20), transparent 50%), #f7f6f2",
      }}
    >
      <div className="max-w-lg">
        <div className="relative mx-auto h-56 w-56">
          {/* aro de bordado girando */}
          <div className="hoop absolute inset-0 rounded-full border-[3px] border-dashed" style={{ borderColor: TEAL }} />
          <div className="hoop-rev absolute inset-3 rounded-full border-2 border-dashed" style={{ borderColor: GOLD }} />
          <Image src="/logo.png" alt="DTG Bordados" width={150} height={160} priority className="absolute inset-0 m-auto h-[150px] w-auto" />
        </div>

        <span
          className="mt-8 inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em]"
          style={{ background: `${GOLD}26`, color: "#9a6f1c" }}
        >
          En mantenimiento
        </span>
        <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
          Estamos afinando <span style={{ color: TEAL }}>las puntadas</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Nuestra web está en mantenimiento para ofrecerte una mejor experiencia. Volvemos muy pronto.
        </p>

        <div className="mx-auto mt-6 h-1.5 w-56 overflow-hidden rounded-full bg-slate-200">
          <div className="progress h-full w-1/3 rounded-full" style={{ background: `linear-gradient(90deg, ${TEAL}, ${GOLD})` }} />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {CONTACT.whatsapp && (
            <a href={waLink("Hola, quisiera hacer una consulta")} className="rounded-full px-7 py-3.5 font-bold text-white shadow-lg" style={{ background: TEAL }}>
              Escríbenos por WhatsApp
            </a>
          )}
          {CONTACT.email && (
            <a href={`mailto:${CONTACT.email}`} className="rounded-full border-2 border-[#0f1e2b] px-7 py-3.5 font-bold">
              Escríbenos por correo
            </a>
          )}
          {CONTACT.instagram && (
            <a href={`https://instagram.com/${CONTACT.instagram}`} className="rounded-full border-2 border-[#0f1e2b] px-7 py-3.5 font-bold">
              Síguenos en Instagram
            </a>
          )}
        </div>

        <p className="mt-12 text-xs text-slate-500">© 2026 Bordados DTG, S. A. · El arte del bordado, una historia de familia</p>
      </div>
    </main>
  );
}
