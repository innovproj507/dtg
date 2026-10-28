"use client";

import Image from "next/image";
import { useState } from "react";
import { CONTACT, waLink } from "@/lib/contact";
import SiteHeader from "@/components/SiteHeader";
import { motion } from "framer-motion";



const TEAL = "#199cb5";
const GOLD = "#d4a03c";
const INK = "#0f1e2b";

const SERVICES = [
  ["Bordado de logos", "Relieve real con hilo de poliéster y rayón de brillo duradero. Ideal para uniformes y merchandising.", "/media/servicio-gorra.jpg"],
  ["Personalización", "Nombres, cargos y detalles individuales en cada prenda, con tipografías nítidas.", "/media/foto8.jpg"],
  ["Producción por lotes", "Control de color y calidad pieza por pieza, con entregas programadas.", "/media/zsk.jpg"],
  ["Digitalización de arte", "Convertimos tu logo en un mapa de puntadas optimizado para el mejor resultado.", "/media/digitalizacion.jpg"],
];
const STEPS = [
  ["Digitalizamos", "Convertimos tu logo en un mapa de puntadas."],
  ["Prueba de hilo", "Ajustamos densidad, colores y ángulos de satín."],
  ["Bordado", "Miles de puntadas por minuto con tensión controlada."],
  ["Entrega", "Revisión pieza por pieza antes de empacar."],
];
const PRODUCTS = ["Uniformes", "Gorras", "Polos", "Chaquetas", "Batas", "Delantales", "Toallas", "Bolsos", "Logos corporativos"];

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const wrap = "mx-auto w-full max-w-7xl px-6 md:px-10";
const eyebrow = "text-xs font-bold uppercase tracking-[0.3em]";
const h2 = "mt-3 text-3xl font-black tracking-tight md:text-5xl";

/**
 * Campos del formulario de contacto. `ancho` ocupa las dos columnas: el correo
 * es largo y así las filas quedan sin huecos.
 */
const CAMPOS_CONTACTO = [
  { id: "nombre", label: "Nombre", type: "text", autoComplete: "name", max: 80, req: true, ancho: false },
  { id: "empresa", label: "Empresa u organización", type: "text", autoComplete: "organization", max: 100, req: false, ancho: false },
  { id: "correo", label: "Correo electrónico", type: "email", autoComplete: "email", max: 120, req: true, ancho: true },
  { id: "telefono", label: "Teléfono", type: "tel", autoComplete: "tel", max: 30, req: false, ancho: false },
  { id: "cantidad", label: "Cantidad aproximada", type: "text", autoComplete: "off", max: 40, req: false, ancho: false },
] as const;

export default function Home() {
  const [estado, setEstado] = useState<"listo" | "enviando" | "ok" | "error">("listo");
  const [errorEnvio, setErrorEnvio] = useState("");
  // Si el correo falla, el cliente puede mandar lo mismo por WhatsApp sin volver a escribirlo.
  const [mensajeWa, setMensajeWa] = useState("");

  async function enviarSolicitud(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Se guarda antes del await: React deja currentTarget en null al salir del manejador.
    const formulario = e.currentTarget;
    const datos = Object.fromEntries(new FormData(formulario));
    const v = (k: string) => String(datos[k] ?? "").trim();
    const resumenWa =
      `Hola, soy ${v("nombre")}${v("empresa") ? ` de ${v("empresa")}` : ""}. ${v("mensaje").replace(/[.!?]*$/, ".")}` +
      (v("cantidad") ? ` Cantidad aproximada: ${v("cantidad")}.` : "") +
      (v("telefono") ? ` Mi teléfono: ${v("telefono")}.` : "") +
      (v("correo") ? ` Mi correo: ${v("correo")}.` : "");

    setEstado("enviando");
    setErrorEnvio("");
    setMensajeWa("");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      const cuerpo = await res.json().catch(() => ({}));
      if (res.status === 503) throw new Error("El envío por correo no está disponible en este momento.");
      if (!res.ok || !cuerpo.ok) throw new Error(cuerpo.error || "No pudimos enviar tu solicitud.");
      formulario.reset();
      setEstado("ok");
    } catch (err) {
      setErrorEnvio(err instanceof Error ? err.message : "No pudimos enviar tu solicitud.");
      setMensajeWa(resumenWa);
      setEstado("error");
    }
  }

  return (
    <div className="bg-[#f7f6f2] text-[#0f1e2b]">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-bold focus:shadow-xl"
      >
        Saltar al contenido
      </a>
      <SiteHeader />

      <main id="contenido">
      {/* HERO */}
      <section id="inicio" className="relative overflow-hidden bg-[#0f1e2b]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/banner-historia.jpg"
          alt=""
          aria-hidden
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[75%_center] md:object-center"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, rgba(10,20,32,.92) 0%, rgba(10,20,32,.78) 38%, rgba(10,20,32,.15) 75%, transparent 100%)" }}
        />
        <div className="absolute inset-0 bg-[#0a1420]/55 md:hidden" />
        <div className={`${wrap} relative flex min-h-[560px] items-center py-16 md:min-h-[680px] md:py-24`}>
          <motion.div {...reveal} className="max-w-xl text-white">
            <span
              className="inline-block rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] backdrop-blur"
              style={{ color: "#7fd6e6" }}
            >
              Bordados profesionales en Panamá
            </span>
            <h1 className="mt-6 text-5xl font-black leading-[0.98] tracking-tight md:text-7xl">
              Tu marca,
              <br />
              <span style={{ color: "#4fc3d9" }}>puntada</span> a <span style={{ color: GOLD }}>puntada.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/85">
              Bordados de alta densidad e impresión digital DTF en Panamá, para empresas, equipos y marcas que quieren
              verse impecables. Logos, uniformes y gorras: desde una pieza hasta producción por lotes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#contacto"
                className="rounded-full px-8 py-4 font-bold text-white shadow-lg transition-transform hover:scale-105"
                style={{ background: TEAL }}
              >
                Pedir cotización
              </a>
              <a
                href="#servicios"
                className="rounded-full border-2 border-white/70 px-8 py-4 font-bold text-white transition-colors hover:bg-white hover:text-[#0f1e2b]"
              >
                Ver servicios
              </a>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm font-semibold text-white/80">
              {["Desde 1946 en el bordado", "25 años de Bordados DTG", "Hecho en Panamá"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: GOLD }} />
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* cinta */}
        <div className="overflow-hidden border-y border-slate-200 bg-white py-3">
          <div className="marquee flex w-max gap-10 whitespace-nowrap text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
            {[...PRODUCTS, ...PRODUCTS, ...PRODUCTS].map((p, i) => (
              <span key={i} className="flex items-center gap-10">
                {p}
                <span style={{ color: GOLD }}>✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className="py-16 md:py-20">
        <div className={wrap}>
          <div className="grid gap-10 md:grid-cols-[1.25fr_1fr] md:gap-14">
            <div className="flex flex-col">
              <motion.div {...reveal}>
                <p className={eyebrow} style={{ color: GOLD }}>Nuestra historia</p>
                <h2 className={h2}>El arte del bordado, un legado de familia</h2>
                <p className="mt-5 text-lg leading-relaxed text-slate-600">
                  En Bordados DTG, el bordado también cuenta una historia de familia: con raíces en Nicaragua y
                  Panamá, reúne el oficio de nuestros antepasados, las enseñanzas de nuestros padres y el deseo de
                  seguir creciendo.
                </p>
              </motion.div>

              {/* línea de tiempo */}
              <ol className="relative mt-8 space-y-4 border-l-2 border-dashed border-slate-300 pl-7">
                {[
                  ["1946", "Don Silvestre Tenorio Ruiz, de origen nicaragüense, inicia su trayectoria en el bordado en el istmo de Panamá. Según nuestra memoria familiar, fundó la primera empresa formal de bordados del país y vistió con uniformes bordados a miles de empleados de cientos de empresas, y a personal vinculado al Comando Sur."],
                  ["2001", "Diego Antonio Tenorio Gómez, nieto de Don Silvestre Tenorio Ruiz y Doña Alicia Magallón, funda Bordados DTG, S. A. Las iniciales DTG recogen su nombre y también el reconocimiento a quienes formaron al hombre detrás de la empresa."],
                  ["2026", "Celebramos 25 años de Bordados DTG, dentro de una historia familiar vinculada al bordado desde hace ocho décadas, y abrimos una nueva etapa con nuestra web y nuestra presencia en Instagram."],
                ].map(([y, d], i) => (
                  <motion.li
                    key={y}
                    {...reveal}
                    transition={{ ...reveal.transition, delay: i * 0.1 }}
                    className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <span
                      className="absolute -left-[39px] top-6 h-4 w-4 rounded-full border-4 border-[#f7f6f2]"
                      style={{ background: i === 1 ? GOLD : TEAL }}
                    />
                    <span className="text-3xl font-black" style={{ color: i === 1 ? GOLD : TEAL }}>{y}</span>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{d}</p>
                  </motion.li>
                ))}
              </ol>

              <motion.details {...reveal} className="group mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                <summary className="cursor-pointer list-none font-bold" style={{ color: TEAL }}>
                  Leer la historia completa <span className="inline-block transition-transform group-open:rotate-90">→</span>
                </summary>
                <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-600">
              <p>El bordado es un arte que ha acompañado a distintas culturas durante miles de años. Desde los delicados bordados en seda de China hasta las elaboradas vestimentas ceremoniales de Europa y los trabajos con hilos metálicos de la India, sus puntadas han expresado creatividad, identidad y tradición.</p>
              <p>Don Silvestre Tenorio Ruiz contrajo matrimonio con Doña Alicia Magallón, abuela de nuestro fundador Diego Tenorio Gómez. Hoy recordados con amor el inicio de esta gran historia, ocupan un lugar entrañable en nuestra historia. Honrar su memoria es reconocer las raíces de una familia cuyo vínculo con el bordado ha trascendido generaciones.</p>
              <p>Con el paso de los años, esa herencia encontraría un nuevo capítulo en su nieto, Diego Antonio Tenorio Gómez. Su camino ha estado marcado por el ejemplo de su abuelo y por la formación que recibió de sus padres, Doña Josefa Lydia Gómez y Don Diego Tenorio Magallón.</p>
              <p>Desde su niñez, sus padres sembraron en él la compasión, los valores fundamentales de la vida y la fortaleza para levantarse después de cada caída. Esas enseñanzas se convirtieron en pilares de su carácter: Perseverar ante las dificultades, tratar a los demás con respeto, reconocer el valor del esfuerzo y saber pedir perdón.</p>
              <p>Para nosotros, cada bordado lleva una identidad. Detrás de un nombre o un emblema hay personas, equipos y empresas que desean representar con orgullo lo que hacen. Dar forma a esa identidad sobre una prenda es una responsabilidad que asumimos con dedicación y deleite por nuestro oficio.</p>
              <p>Con cada nuevo proyecto, seguimos escribiendo el capítulo que comenzó en nuestra familia en 1946 y que tomó una nueva forma con la fundación de Bordados DTG en 2001.</p>
            </div>
              </motion.details>
            </div>

            <motion.div {...reveal} className="relative mx-auto w-full max-w-sm md:max-w-none">
              <div className="md:sticky md:top-28">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/media/panama.jpg"
                  alt="Mapa de Panamá bordado a máquina sobre tela dorada"
                  width={1200}
                  height={1500}
                  loading="lazy"
                  className="aspect-[4/5] w-full rounded-3xl object-cover shadow-2xl"
                />
                <span
                  className="absolute -bottom-4 -left-4 hidden rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-xl md:block"
                  style={{ background: TEAL }}
                >
                  Bordando desde Panamá
                </span>
              </div>
            </motion.div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              ["Nuestra misión", "Dar vida a la identidad de empresas, organizaciones y personas mediante bordados de calidad e impresiones digitales (DTF), con atención personalizada y compromiso en cada entrega. Honramos nuestra tradición familiar a través de un servicio basado en el respeto, la honestidad y la dedicación a cada trabajo y la entrega siempre justo a tiempo.", TEAL],
              ["Nuestra visión", "Ser una empresa referente del bordado en Panamá y los adelantos tecnológicos que nos van dando a través del tiempo que las impresiones digitales logran junto con los textiles de algodón y poliéster, reconocida por la calidad de nuestro trabajo, la confianza de nuestros clientes y nuestra capacidad de innovar. Aspiramos a ampliar nuestra presencia en nuevos mercados, uniendo el legado familiar con la tecnología y formando nuevas generaciones que mantengan vivo el arte del bordado.", GOLD],
            ].map(([t, d, c], i) => (
              <motion.div
                key={t}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.1 }}
                className="rounded-3xl p-8 text-white"
                style={{ background: INK }}
              >
                <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: c }}>{t}</p>
                <p className="mt-4 leading-relaxed text-white/85">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TALLER */}
      <section id="taller" className="pb-16 md:pb-20">
        <div className={wrap}>
          <motion.div {...reveal} className="max-w-2xl">
            <p className={eyebrow} style={{ color: GOLD }}>Nuestro taller</p>
            <h2 className={h2}>Donde cada puntada toma forma</h2>
          </motion.div>

          <div className="mt-10 grid grid-cols-2 gap-3 md:auto-rows-[230px] md:grid-cols-3 md:gap-4">
            {/* Guayabera: 4:5, el texto va dentro de la imagen, por eso no se recorta a los lados */}
            <motion.div
              {...reveal}
              className="group col-span-2 aspect-[4/5] overflow-hidden rounded-2xl shadow-lg md:col-span-1 md:row-span-2 md:aspect-auto"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/camisas-lino.jpg"
                alt="Camisa de lino blanca con bordado artesanal geométrico en el pecho"
                width={800}
                height={1000}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>

            <motion.div
              {...reveal}
              transition={{ ...reveal.transition, delay: 0.08 }}
              className="relative col-span-2 aspect-square overflow-hidden rounded-2xl bg-black shadow-lg md:col-span-1 md:row-span-2 md:aspect-auto"
            >
              <video
                src="/video/25-anos.mp4?v=3"
                poster="/video/25-anos.jpg?v=3"
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                controls
                preload="metadata"
              />
            </motion.div>

            {[
              ["/media/foto5.jpg", "aspect-[4/3] md:aspect-auto", "Conos de hilo en la máquina"],
              ["/media/foto6.jpg", "aspect-[4/3] md:aspect-auto", "Agujas y tensores de la bordadora"],
              [
                "/media/taller-vertical.jpg",
                "aspect-[3/5] md:row-span-2 md:aspect-auto",
                "Aguja de bordadora sobre un bordado en punto de cruz",
              ],
              [
                "/media/foto7.jpg",
                "aspect-[3/5] md:col-span-2 md:row-span-2 md:aspect-auto",
                "Paleta de hilos de colores en el taller",
              ],
            ].map(([src, cls, alt], i) => (
              <motion.div
                key={src}
                {...reveal}
                transition={{ ...reveal.transition, delay: 0.08 * (i + 2) }}
                className={`group overflow-hidden rounded-2xl shadow-md ${cls}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </motion.div>
            ))}
          </div>

          {/* Banners: 2:1 con el texto dentro de la imagen (no recortar) */}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              {
                src: "/media/detalles-bordado.jpg",
                alt: "Detalles de bordado floral en el cuello de una camisa y en el bolsillo de una camisa verde",
                href: "#contacto",
                external: false,
              },
              {
                src: "/media/polos-bordados.jpg",
                alt: "Polos bordados: detalles que marcan estilo. Cotizar por WhatsApp",
                href: waLink("Hola, quiero cotizar polos bordados"),
                external: true,
              },
            ].map((b, i) => (
              <motion.a
                key={b.src}
                {...reveal}
                transition={{ ...reveal.transition, delay: 0.1 * i }}
                href={b.href}
                {...(b.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group block overflow-hidden rounded-2xl shadow-md transition-shadow hover:shadow-xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.src}
                  alt={b.alt}
                  width={1600}
                  height={800}
                  loading="lazy"
                  className="aspect-[2/1] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="py-16 md:py-20">
        <div className={wrap}>
          <motion.div {...reveal} className="max-w-2xl">
            <p className={eyebrow} style={{ color: GOLD }}>Servicios</p>
            <h2 className={h2}>Bordado e impresión digital, con acabado que habla de tu empresa</h2>
          </motion.div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map(([t, d, img], i) => (
              <motion.div
                key={t}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.08 }}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${t}: ${d.split(".")[0]}`}
                    width={600}
                    height={375}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span
                    className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-xl font-mono text-sm font-bold text-white shadow-lg"
                    style={{ background: i % 2 ? GOLD : TEAL }}
                  >
                    0{i + 1}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold">{t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{d}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Impresión digital DTF */}
          <motion.div
            id="dtf"
            {...reveal}
            className="group mt-6 grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-xl md:grid-cols-[1fr_1.4fr]"
          >
            <div className="relative h-48 overflow-hidden md:h-auto md:min-h-[220px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/servicio-dtf.jpg"
                alt="Impresión digital DTF a todo color sobre textil"
                width={1200}
                height={800}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <span
                className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-xl font-mono text-sm font-bold text-white shadow-lg"
                style={{ background: TEAL }}
              >
                05
              </span>
            </div>
            <div className="flex flex-col justify-center p-7 md:p-9">
              <h3 className="text-xl font-bold md:text-2xl">Impresión digital DTF</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Diseños a todo color, con degradados y detalles finos, sobre textiles de algodón y poliéster. Complementa
                el bordado cuando tu diseño necesita más color o más detalle.
              </p>
              <a
                href={waLink("Hola, quiero cotizar una impresión digital DTF")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-md transition-transform hover:scale-105"
                style={{ background: TEAL }}
              >
                Cotizar impresión DTF →
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROCESO */}
      <section id="proceso" className="relative overflow-hidden py-20 md:py-28" style={{ background: INK }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/foto6.jpg" alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${INK} 25%, ${INK}99 100%)` }} />
        <div className={`${wrap} relative`}>
          <motion.div {...reveal} className="max-w-2xl text-white">
            <p className={eyebrow} style={{ color: GOLD }}>Proceso</p>
            <h2 className={h2}>Así nace cada bordado</h2>
          </motion.div>
          <div className="mt-14 grid gap-8 md:grid-cols-4">
            {STEPS.map(([t, d], i) => (
              <motion.div
                key={t}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.1 }}
                className="relative border-t-2 pt-6 text-white"
                style={{ borderColor: i % 2 ? GOLD : TEAL }}
              >
                <span className="font-mono text-5xl font-black" style={{ color: i % 2 ? GOLD : TEAL }}>
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-xl font-bold">{t}</h3>
                <p className="mt-2 text-sm text-white/70">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-16 md:py-24">
        <div className={`${wrap} grid gap-10 md:grid-cols-[1fr_1.5fr] md:gap-14`}>
          <motion.div {...reveal}>
            <p className={eyebrow} style={{ color: TEAL }}>Contacto</p>
            <h2 className={h2}>Cuéntanos qué quieres bordar o imprimir</h2>
            <p className="mt-4 text-lg text-slate-600">Te respondemos con una cotización a la medida de tu proyecto.</p>

            <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-slate-700">
              {CONTACT.whatsapp && (
                <>
                  <dt className="font-bold text-[#0f1e2b]">WhatsApp</dt>
                  <dd>
                    <a href={waLink()} target="_blank" rel="noopener noreferrer" className="hover:text-[#199cb5]">
                      +{CONTACT.whatsapp.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1 $2-$3")}
                    </a>
                  </dd>
                </>
              )}
              {CONTACT.email && (
                <>
                  <dt className="font-bold text-[#0f1e2b]">Correo</dt>
                  <dd>
                    <a href={`mailto:${CONTACT.email}`} className="break-all hover:text-[#199cb5]">
                      {CONTACT.email}
                    </a>
                  </dd>
                </>
              )}
              {CONTACT.address && (
                <>
                  <dt className="font-bold text-[#0f1e2b]">Taller</dt>
                  <dd>
                    {CONTACT.mapsUrl ? (
                      <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#199cb5]">
                        {CONTACT.address}, Panamá
                      </a>
                    ) : (
                      <>{CONTACT.address}, Panamá</>
                    )}
                  </dd>
                </>
              )}
              {CONTACT.instagram && (
                <>
                  <dt className="font-bold text-[#0f1e2b]">Instagram</dt>
                  <dd>
                    <a
                      href={`https://www.instagram.com/${CONTACT.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#199cb5]"
                    >
                      @{CONTACT.instagram}
                    </a>
                  </dd>
                </>
              )}
              {CONTACT.hours && (
                <>
                  <dt className="font-bold text-[#0f1e2b]">Horario</dt>
                  <dd>{CONTACT.hours}</dd>
                </>
              )}
            </dl>
          </motion.div>

          <motion.form
            {...reveal}
            onSubmit={enviarSolicitud}
            className="grid gap-5 rounded-3xl border-2 border-dashed border-[#199cb5]/40 bg-[#fcf9f2] p-6 md:grid-cols-2 md:p-8"
          >
            {/* Campo trampa: oculto para las personas, lo rellenan los robots. */}
            <div className="hidden" aria-hidden>
              <label htmlFor="web">No rellenar</label>
              <input id="web" name="web" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            {CAMPOS_CONTACTO.map((campo) => (
              <div key={campo.id} className={campo.ancho ? "md:col-span-2" : undefined}>
                <label htmlFor={campo.id} className="mb-1.5 block text-sm font-semibold text-[#0f1e2b]">
                  {campo.label}
                </label>
                <input
                  id={campo.id}
                  name={campo.id}
                  type={campo.type}
                  autoComplete={campo.autoComplete}
                  maxLength={campo.max}
                  required={campo.req}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition-colors focus:border-[#199cb5] focus:ring-2 focus:ring-[#199cb5]/20"
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <label htmlFor="mensaje" className="mb-1.5 block text-sm font-semibold text-[#0f1e2b]">
                ¿Qué necesitas bordar o imprimir?
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                required
                rows={4}
                maxLength={800}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition-colors focus:border-[#199cb5] focus:ring-2 focus:ring-[#199cb5]/20"
              />
            </div>
            <div className="md:col-span-2">
              <button
                disabled={estado === "enviando"}
                className="w-full rounded-full py-3.5 font-bold text-white shadow-md transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                style={{ background: "#12707f" }}
              >
                {estado === "enviando" ? "Enviando…" : "Enviar solicitud"}
              </button>

              {/* aria-live para que un lector de pantalla anuncie el resultado */}
              <div aria-live="polite" className="mt-3 text-center text-xs">
                {estado === "ok" && (
                  <p className="font-semibold text-[#12707f]">
                    ¡Gracias! Recibimos tu solicitud y te respondemos con una cotización.
                  </p>
                )}
                {estado === "error" && (
                  <p className="font-semibold text-red-600">
                    {errorEnvio}{" "}
                    <a href={waLink(mensajeWa || undefined)} target="_blank" rel="noopener noreferrer" className="underline">
                      Envíanos tu solicitud por WhatsApp
                    </a>
                    .
                  </p>
                )}
                {(estado === "listo" || estado === "enviando") && (
                  <p className="text-slate-500">Tu solicitud llega a nuestro correo de ventas. Te respondemos con una cotización.</p>
                )}
              </div>
            </div>
          </motion.form>
        </div>
      </section>

      </main>

      {/* FRANJAS DE CONTACTO (encima del pie de página) */}
      <div aria-label="Atención al cliente y redes">
        <div className="bg-[#199cb5] text-white">
          <div className={`${wrap} flex flex-wrap items-center justify-center gap-x-5 gap-y-2 py-3 text-center text-sm`}>
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h2.5v4.5H4zM17.5 14H20v4.5h-2.5zM20 18.5a3.5 3.5 0 0 1-3.5 3.5H13" />
              </svg>
              <span className="font-bold">Atención al cliente:</span>
              {CONTACT.whatsapp && (
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">
                  +{CONTACT.whatsapp.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1 $2-$3")}
                </a>
              )}
            </span>
            {CONTACT.email && (
              <>
                <span aria-hidden className="hidden text-white/60 sm:inline">|</span>
                <a href={`mailto:${CONTACT.email}`} className="hover:underline">
                  {CONTACT.email}
                </a>
              </>
            )}
            {CONTACT.hours && (
              <>
                <span aria-hidden className="hidden text-white/60 sm:inline">|</span>
                <span>
                  <span className="font-bold">Horario:</span> {CONTACT.hours}
                </span>
              </>
            )}
            <span aria-hidden className="hidden text-white/60 sm:inline">|</span>
            <a
              href={waLink("Hola, necesito atención")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:underline"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Escríbenos por <span className="font-bold">WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="bg-[#0f5f73] text-white">
          <div className={`${wrap} flex flex-col items-center justify-center gap-5 py-5 sm:flex-row sm:gap-12`}>
            {CONTACT.instagram && (
              <div className="flex items-center gap-4">
                <span className="font-bold">Conéctate con nosotros</span>
                <a
                  href={`https://www.instagram.com/${CONTACT.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Instagram @${CONTACT.instagram}`}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#0f5f73] transition-transform hover:scale-110"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.5-2.2h.01" />
                  </svg>
                </a>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="font-bold">¿Tienes un proyecto en mente?</span>
              <a
                href="#contacto"
                className="rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-105"
                style={{ background: "#d4a03c" }}
              >
                Pedir cotización
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-white pb-28 pt-10 md:pb-24">
        <div className={`${wrap} grid items-center gap-8 md:grid-cols-[auto_1fr_auto]`}>
          <Image src="/logo.png" alt="DTG Bordados" width={110} height={118} className="mx-auto h-[110px] w-auto md:mx-0" />
          <address className="text-center text-sm not-italic leading-relaxed text-slate-600 md:text-left">
            <strong className="block text-base text-[#0f1e2b]">Bordados DTG, S. A.</strong>
            {CONTACT.address && <span className="block">{CONTACT.address}, Panamá</span>}
            {CONTACT.phone && (
              <a href={`tel:+${CONTACT.phone.replace(/\D/g, "")}`} className="block hover:text-[#199cb5]">
                Tel. +{CONTACT.phone.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1 $2-$3")}
              </a>
            )}
            {CONTACT.email && (
              <a href={`mailto:${CONTACT.email}`} className="block hover:text-[#199cb5]">
                {CONTACT.email}
              </a>
            )}
            {CONTACT.instagram && (
              <a
                href={`https://www.instagram.com/${CONTACT.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-[#199cb5]"
              >
                Instagram @{CONTACT.instagram}
              </a>
            )}
          </address>
          <p className="text-center text-sm text-slate-500 md:text-right">
            © Bordados DTG, S. A.
            <br />
            El arte del bordado, una historia de familia
          </p>
        </div>
      </footer>

      {/* WhatsApp flotante */}
      <a
        href={waLink("Hola, quiero cotizar un bordado")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
        className="group fixed bottom-5 right-5 z-50 flex items-center gap-3"
      >
        <span className="hidden rounded-full bg-white px-4 py-2 text-sm font-bold text-[#0f1e2b] opacity-0 shadow-lg transition-opacity group-hover:opacity-100 md:block">
          Escríbenos por WhatsApp
        </span>
        <span className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform group-hover:scale-110 md:h-16 md:w-16">
          <span className="wa-pulse absolute inset-0 rounded-full bg-[#25D366]" />
          <svg viewBox="0 0 24 24" className="relative h-8 w-8 md:h-9 md:w-9" fill="currentColor" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </span>
      </a>
    </div>
  );
}
