"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CONTACT, waLink } from "@/lib/contact";

const TEAL = "#199cb5";
const DEEP = "#0f5f73"; // turquesa profundo: botones y textos sobre fondos claros
const INK = "#0f1e2b";
const PALE = "#e3f1f5";

const wrap = "mx-auto w-full max-w-7xl px-4 md:px-8";

/** Barra de categorías = secciones de la página. */
const SECCIONES: [string, string][] = [
  ["Nuestra historia", "#nosotros"],
  ["Nuestro taller", "#taller"],
  ["Servicios de bordado", "#servicios"],
  ["Impresión digital DTF", "#dtf"],
  ["Proceso de bordado", "#proceso"],
  ["Contacto y cotización", "#contacto"],
];

const telefono = CONTACT.whatsapp.replace(/^(\d{3})(\d{4})(\d{4})$/, "+$1 $2-$3");

type IconoProps = { className?: string };
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const IcoAudifonos = ({ className = "h-5 w-5" }: IconoProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h2.5v4.5H4zM17.5 14H20v4.5h-2.5zM20 18.5a3.5 3.5 0 0 1-3.5 3.5H13" />
  </svg>
);
const IcoTel = ({ className = "h-5 w-5" }: IconoProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
);
const IcoCorreo = ({ className = "h-5 w-5" }: IconoProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6zm0 1 9 6 9-6" />
  </svg>
);
const IcoInstagram = ({ className = "h-5 w-5" }: IconoProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.5-2.2h.01" />
  </svg>
);
const IcoPin = ({ className = "h-5 w-5" }: IconoProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
  </svg>
);
const IcoLibro = ({ className = "h-5 w-5" }: IconoProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4zm0 13a3 3 0 0 1 3-3h11M9 8h6" />
  </svg>
);
const IcoMenu = ({ className = "h-6 w-6" }: IconoProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} strokeWidth={2.2} aria-hidden>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const IcoCerrar = ({ className = "h-6 w-6" }: IconoProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} strokeWidth={2.2} aria-hidden>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
const IcoAguja = ({ className = "h-5 w-5" }: IconoProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <path d="M18 3 8 13m0 0 1 3-4 5 5-4 3 1M8 13l-3-1" />
    <circle cx="18.5" cy="4.5" r="1.5" />
  </svg>
);
const IcoWhatsApp = ({ className = "h-5 w-5" }: IconoProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const IcoUsuarios = ({ className = "h-5 w-5" }: IconoProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 19v-1.5a3.5 3.5 0 0 0-2.5-3.35M15 5.2a3 3 0 0 1 0 5.6" />
  </svg>
);
const IcoEngranaje = ({ className = "h-5 w-5" }: IconoProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </svg>
);
const IcoEtiqueta = ({ className = "h-5 w-5" }: IconoProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8zM7.5 7.5h.01" />
  </svg>
);

/** Color al pasar el mouse en los menús desplegables. */
const NARANJA = "#f26a1b";

/** Fila de un menú desplegable: al pasar el mouse o enfocar, texto e ícono pasan a naranja. */
const FILA =
  "group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-white hover:text-[#f26a1b] focus-visible:bg-white focus-visible:text-[#f26a1b] focus-visible:outline-none";
/** Texto secundario dentro de una fila: acompaña el cambio de color. */
const FILA_SUB = "block text-sm text-slate-500 transition-colors group-hover:text-[#f26a1b]/80 group-focus-visible:text-[#f26a1b]/80";

/**
 * Menú desplegable de la fila superior. Se abre al pasar el mouse, con clic o con teclado;
 * se cierra con Esc o al hacer clic fuera. Contáctenos y Conectar usan el mismo.
 */
function Desplegable({
  etiqueta,
  icono,
  ancho,
  alineacion = "izquierda",
  children,
}: {
  etiqueta: string;
  icono: React.ReactNode;
  ancho: string;
  alineacion?: "izquierda" | "centro";
  children: React.ReactNode;
}) {
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => {
      if (caja.current && !caja.current.contains(e.target as Node)) setAbierto(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", esc);
    };
  }, [abierto]);

  return (
    <div
      ref={caja}
      className="relative"
      onMouseEnter={() => setAbierto(true)}
      onMouseLeave={() => setAbierto(false)}
    >
      <button
        type="button"
        aria-expanded={abierto}
        aria-haspopup="true"
        onClick={() => setAbierto((v) => !v)}
        className="flex items-center gap-2 whitespace-nowrap py-2 text-[15px] font-bold transition-colors hover:text-[#f26a1b]"
        style={{ color: abierto ? NARANJA : DEEP }}
      >
        {icono}
        {etiqueta}
        <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform ${abierto ? "rotate-180" : ""}`} {...stroke} aria-hidden>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {abierto && (
        <div
          className={`absolute top-full z-50 max-w-[calc(100vw-2rem)] rounded-b-xl rounded-tr-xl border border-slate-200 p-3 text-[15px] shadow-2xl ${ancho} ${
            alineacion === "centro" ? "-left-24" : "left-0"
          }`}
          style={{ background: PALE, color: INK }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/** Menú "Contáctenos": llamar, WhatsApp, correo, Instagram y taller. */
function MenuContacto() {
  return (
    <Desplegable etiqueta="Contáctenos" icono={<IcoAudifonos />} ancho="w-80">
      {CONTACT.phone && (
        <a href={`tel:+${CONTACT.phone}`} className={FILA}>
          <IcoTel className="h-5 w-5 shrink-0" />
          <span>
            <b>{telefono}</b> <span className="text-slate-500 group-hover:text-[#f26a1b]/80">· Llamar</span>
          </span>
        </a>
      )}
      {CONTACT.whatsapp && (
        <a href={waLink()} target="_blank" rel="noopener noreferrer" className={FILA}>
          <IcoWhatsApp className="h-5 w-5 shrink-0 text-[#1fae5a] transition-colors group-hover:text-[#f26a1b]" />
          <span>Escríbenos por WhatsApp</span>
        </a>
      )}
      {CONTACT.email && (
        <a href={`mailto:${CONTACT.email}`} className={FILA}>
          <IcoCorreo className="h-5 w-5 shrink-0" />
          <span className="min-w-0">
            Envíanos un correo
            <span className={`${FILA_SUB} truncate`}>{CONTACT.email}</span>
          </span>
        </a>
      )}
      {CONTACT.instagram && (
        <a href={`https://www.instagram.com/${CONTACT.instagram}`} target="_blank" rel="noopener noreferrer" className={FILA}>
          <IcoInstagram className="h-5 w-5 shrink-0" />
          <span>Instagram @{CONTACT.instagram}</span>
        </a>
      )}
      {CONTACT.address && (
        <a href={CONTACT.mapsUrl || "#contacto"} {...(CONTACT.mapsUrl && { target: "_blank", rel: "noopener noreferrer" })} className={FILA}>
          <IcoPin className="h-5 w-5 shrink-0" />
          <span className="min-w-0">
            Visita nuestro taller
            <span className={FILA_SUB}>{CONTACT.address}</span>
          </span>
        </a>
      )}
    </Desplegable>
  );
}

/** Menú "Conectar": dos columnas, como la referencia (redes a la izquierda, contenido del sitio a la derecha). */
function MenuConectar() {
  const titulo = "mb-1 px-3 text-lg font-light text-slate-600";
  return (
    <Desplegable etiqueta="Conectar" icono={<IcoUsuarios />} ancho="w-[34rem]" alineacion="centro">
      <div className="grid gap-x-4 sm:grid-cols-2">
        <div>
          <p className={titulo}>Redes</p>
          {CONTACT.instagram && (
            <a href={`https://www.instagram.com/${CONTACT.instagram}`} target="_blank" rel="noopener noreferrer" className={FILA}>
              <IcoInstagram className="h-6 w-6 shrink-0" />
              <span className="font-medium">Instagram</span>
            </a>
          )}
          {CONTACT.whatsapp && (
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className={FILA}>
              <IcoWhatsApp className="h-6 w-6 shrink-0 text-[#1fae5a] transition-colors group-hover:text-[#f26a1b]" />
              <span className="font-medium">WhatsApp</span>
            </a>
          )}
          {CONTACT.email && (
            <a href={`mailto:${CONTACT.email}`} className={FILA}>
              <IcoCorreo className="h-6 w-6 shrink-0" />
              <span className="font-medium">Correo</span>
            </a>
          )}
        </div>
        <div className="mt-3 sm:mt-0">
          <p className={titulo}>Conoce DTG</p>
          <a href="#nosotros" className={FILA}>
            <IcoLibro className="h-6 w-6 shrink-0" />
            <span className="font-medium">Nuestra historia</span>
          </a>
          <a href="#taller" className={FILA}>
            <IcoAguja className="h-6 w-6 shrink-0" />
            <span className="font-medium">Nuestro taller</span>
          </a>
          <a href="#servicios" className={FILA}>
            <IcoEtiqueta className="h-6 w-6 shrink-0" />
            <span className="font-medium">Servicios de bordado</span>
          </a>
          <a href="#dtf" className={FILA}>
            <IcoAguja className="h-6 w-6 shrink-0" />
            <span className="font-medium">Impresión digital DTF</span>
          </a>
          <a href="#proceso" className={FILA}>
            <IcoEngranaje className="h-6 w-6 shrink-0" />
            <span className="font-medium">Proceso de bordado</span>
          </a>
        </div>
      </div>
    </Desplegable>
  );
}

export default function SiteHeader() {
  const [panel, setPanel] = useState(false);
  const [bajo, setBajo] = useState(false);
  const [consulta, setConsulta] = useState("");
  const campo = useRef<HTMLInputElement>(null);

  // Al bajar, la barra de categorías (fija) muestra el logo y el botón de cotizar.
  useEffect(() => {
    const onScroll = () => setBajo(window.scrollY > 260);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!panel) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setPanel(false);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [panel]);

  function cotizarRapido(e: React.FormEvent) {
    e.preventDefault();
    const texto = consulta.trim();
    if (!texto) return campo.current?.focus();
    window.open(waLink(`Hola, quiero cotizar: ${texto.slice(0, 200)}`), "_blank", "noopener,noreferrer");
    setConsulta("");
  }

  const boton =
    "flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[15px] font-bold text-white transition-colors hover:bg-white hover:text-[#0f5f73]";

  return (
    <>
      <header>
        {/* 1 · Marca, atajos y contacto */}
        <div className="bg-white">
          <div className={`${wrap} flex items-stretch justify-between gap-4`}>
            <a href="#inicio" className="flex shrink-0 items-center gap-3 py-2">
              <Image src="/logo.png" alt="DTG Bordados, ir al inicio" width={84} height={90} priority className="h-[64px] w-auto md:h-[76px]" />
              <span className="hidden text-lg font-black uppercase leading-none tracking-[0.25em] sm:block" style={{ color: INK }}>
                DTG
                <span className="mt-1 block text-[15px] tracking-[0.32em]" style={{ color: "#d4a03c" }}>
                  Bordados
                </span>
              </span>
            </a>

            <nav aria-label="Atajos" className="hidden flex-1 items-center gap-8 pl-4 lg:flex">
              <MenuContacto />
              <MenuConectar />
              <a href="#nosotros" className="flex items-center gap-2 whitespace-nowrap py-2 text-[15px] font-bold transition-colors hover:text-[#199cb5]" style={{ color: DEEP }}>
                <IcoLibro />
                Historia familiar
              </a>
              <a href="#taller" className="hidden items-center gap-2 whitespace-nowrap py-2 text-[15px] font-bold transition-colors hover:text-[#199cb5] 2xl:flex" style={{ color: DEEP }}>
                <IcoAguja />
                Nuestro taller
              </a>
            </nav>

            {/* panel derecho (como "Iniciar sesión / carrito" de la referencia) */}
            <div className="flex items-center gap-4 md:px-6" style={{ background: undefined }}>
              <div className="hidden h-full items-center gap-5 px-6 md:flex" style={{ background: PALE }}>
                {CONTACT.whatsapp && (
                  <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[15px] font-bold" style={{ color: DEEP }}>
                    <IcoWhatsApp className="h-5 w-5 text-[#1fae5a]" />
                    {telefono}
                  </a>
                )}
                <span className="h-7 w-px bg-slate-300" aria-hidden />
                <a
                  href="#contacto"
                  className="rounded-full px-6 py-2.5 text-[15px] font-bold text-white shadow-md transition-transform hover:scale-105"
                  style={{ background: TEAL }}
                >
                  Cotizar
                </a>
              </div>
              <a
                href="#contacto"
                className="rounded-full px-5 py-2 text-sm font-bold text-white shadow-md md:hidden"
                style={{ background: TEAL }}
              >
                Cotizar
              </a>
            </div>
          </div>
        </div>

        {/* 2 · Aviso */}
        <div style={{ background: INK }} className="text-white">
          <p className={`${wrap} py-2 text-center text-[13px] font-semibold sm:text-sm`}>
            25 años bordando identidades en Panamá, con un legado familiar desde 1946.{" "}
            <a href="#nosotros" className="underline underline-offset-2 hover:text-[#d4a03c]">
              Conoce nuestra historia
            </a>
          </p>
        </div>

        {/* 3 · Cotización rápida y accesos directos */}
        <div style={{ background: TEAL }}>
          <div className={`${wrap} flex flex-col gap-3 py-3 md:flex-row md:items-center`}>
            <form onSubmit={cotizarRapido} role="search" className="relative flex-1 md:max-w-xl">
              <label htmlFor="cotizacion-rapida" className="sr-only">
                ¿Qué necesitas bordar o imprimir?
              </label>
              <input
                id="cotizacion-rapida"
                ref={campo}
                value={consulta}
                onChange={(e) => setConsulta(e.target.value)}
                maxLength={200}
                autoComplete="off"
                placeholder="¿Qué necesitas bordar o imprimir?"
                className="w-full rounded-md bg-white py-3 pl-4 pr-14 text-[15px] italic text-slate-800 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-white/40"
              />
              <button
                type="submit"
                aria-label="Cotizar por WhatsApp"
                title="Cotizar por WhatsApp"
                className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-[#1fae5a] transition-colors hover:bg-[#1fae5a] hover:text-white"
              >
                <IcoWhatsApp className="h-6 w-6" />
              </button>
            </form>

            <div className="hidden flex-wrap items-stretch gap-3 md:ml-auto md:flex">
              <a href="#dtf" className={boton} style={{ background: DEEP }}>
                <IcoAguja className="h-5 w-5" />
                Impresión DTF
              </a>
              <a
                href={waLink("Hola, necesito digitalizar mi logo para bordado")}
                target="_blank"
                rel="noopener noreferrer"
                className={boton}
                style={{ background: DEEP }}
              >
                <IcoLibro className="h-5 w-5" />
                Digitalizar mi logo
              </a>
              <a href="#contacto" className={`${boton} flex-col leading-tight`} style={{ background: DEEP }}>
                <span>Pedir cotización</span>
                <span className="text-[12px] font-semibold opacity-80">Formulario completo</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* 4 · Barra de secciones: queda fija al bajar */}
      <div className="sticky top-0 z-40 shadow-md" style={{ background: PALE }}>
        <nav aria-label="Principal" className={`${wrap} flex items-center gap-1`}>
          {bajo && (
            <a href="#inicio" className="mr-2 hidden shrink-0 items-center py-1 sm:flex" aria-label="Ir al inicio">
              <Image src="/logo.png" alt="" width={84} height={90} className="h-10 w-auto" />
            </a>
          )}
          <button
            type="button"
            aria-expanded={panel}
            aria-controls="panel-mas"
            onClick={() => setPanel((v) => !v)}
            className="flex shrink-0 items-center gap-2 px-2 py-3 text-sm font-bold uppercase transition-colors hover:text-[#199cb5] md:px-4"
            style={{ color: DEEP }}
          >
            {panel ? <IcoCerrar /> : <IcoMenu />}
            Más
          </button>

          <ul className="flex min-w-0 flex-1 items-center overflow-x-auto [scrollbar-width:none] lg:justify-between [&::-webkit-scrollbar]:hidden">
            {SECCIONES.map(([etiqueta, href]) => (
              <li key={href} className="shrink-0">
                <a
                  href={href}
                  className="block px-3 py-2.5 text-center text-[13px] font-bold uppercase leading-tight transition-colors hover:bg-white/70 hover:text-[#199cb5] lg:max-w-[9.5rem] lg:px-4"
                  style={{ color: DEEP }}
                >
                  {etiqueta}
                </a>
              </li>
            ))}
          </ul>

          {bajo && (
            <a
              href="#contacto"
              className="ml-2 hidden shrink-0 rounded-full px-5 py-2 text-sm font-bold text-white shadow-md transition-transform hover:scale-105 sm:block"
              style={{ background: TEAL }}
            >
              Cotizar
            </a>
          )}
        </nav>

        {/* panel "Más": todos los accesos y datos de contacto (útil sobre todo en celular) */}
        {panel && (
          <div id="panel-mas" className="border-t border-white bg-white shadow-xl">
            <div className={`${wrap} grid gap-6 py-5 text-[15px] sm:grid-cols-2`} style={{ color: INK }}>
              <ul className="space-y-1">
                {SECCIONES.map(([etiqueta, href]) => (
                  <li key={href}>
                    <a href={href} onClick={() => setPanel(false)} className="block rounded-lg px-3 py-2 font-semibold hover:bg-[#e3f1f5]">
                      {etiqueta}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="space-y-1">
                {CONTACT.whatsapp && (
                  <li>
                    <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[#e3f1f5]">
                      <IcoWhatsApp className="h-5 w-5 text-[#1fae5a]" /> {telefono}
                    </a>
                  </li>
                )}
                {CONTACT.email && (
                  <li>
                    <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[#e3f1f5]">
                      <IcoCorreo /> {CONTACT.email}
                    </a>
                  </li>
                )}
                {CONTACT.instagram && (
                  <li>
                    <a href={`https://www.instagram.com/${CONTACT.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[#e3f1f5]">
                      <IcoInstagram /> @{CONTACT.instagram}
                    </a>
                  </li>
                )}
                {CONTACT.address && (
                  <li className="flex items-start gap-3 px-3 py-2 text-slate-600">
                    <IcoPin className="mt-0.5 h-5 w-5 shrink-0" /> {CONTACT.address}, Panamá
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
