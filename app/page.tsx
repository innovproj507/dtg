"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

const TEAL = "#199cb5";
const GOLD = "#d4a03c";
const INK = "#0f1e2b";

const SHIRTS = [
  { name: "Azul noche", hex: "#14283f" },
  { name: "Blanco", hex: "#f1efe9" },
  { name: "Carbón", hex: "#25272c" },
  { name: "Verde bosque", hex: "#1f4a3a" },
  { name: "Vino", hex: "#6b1f2f" },
  { name: "Arena", hex: "#c9b48f" },
];
const THREADS = [
  { name: "Oro", hex: GOLD },
  { name: "Turquesa", hex: TEAL },
  { name: "Blanco", hex: "#f5f5f5" },
  { name: "Rojo", hex: "#d7263d" },
  { name: "Naranja", hex: "#ff7a2f" },
  { name: "Violeta", hex: "#8b5cf6" },
];

const SERVICES = [
  ["Bordado de logos", "Relieve real con hilo de poliéster y rayón de brillo duradero. Ideal para uniformes y merchandising."],
  ["Personalización", "Nombres, cargos y detalles individuales en cada prenda, con tipografías nítidas."],
  ["Producción por lotes", "Control de color y calidad pieza por pieza, con entregas programadas."],
  ["Digitalización de arte", "Convertimos tu logo en un mapa de puntadas optimizado para el mejor resultado."],
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

export default function Home() {
  const [shirt, setShirt] = useState(SHIRTS[0].hex);
  const [thread, setThread] = useState(THREADS[0].hex);

  return (
    <main className="bg-[#f7f6f2] text-[#0f1e2b]">
      {/* NAV */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-lg">
        <div className={`${wrap} flex items-center justify-between py-2`}>
          <a href="#inicio" className="flex items-center gap-4">
            <Image src="/logo.png" alt="DTG Bordados" width={84} height={90} priority className="h-[72px] w-auto md:h-[88px]" />
            <span className="hidden text-base font-black uppercase tracking-[0.3em] lg:block">
              DTG <span style={{ color: GOLD }}>Bordados</span>
            </span>
          </a>
          <nav className="hidden gap-9 text-sm font-semibold text-slate-600 md:flex">
            {[
              ["Historia", "#nosotros"],
              ["Servicios", "#servicios"],
              ["Proceso", "#proceso"],
              ["Personaliza", "#personaliza"],
              ["Contacto", "#contacto"],
            ].map(([l, h]) => (
              <a key={h} href={h} className="transition-colors hover:text-[#199cb5]">
                {l}
              </a>
            ))}
          </nav>
          <a
            href="#contacto"
            className="rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-105"
            style={{ background: TEAL }}
          >
            Cotizar
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="inicio" className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 80% 30%, rgba(25,156,181,.20), transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(212,160,60,.18), transparent 50%)",
          }}
        />
        <div className={`${wrap} relative grid items-center gap-8 py-12 md:grid-cols-2 md:py-20`}>
          <motion.div {...reveal}>
            <span
              className="inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em]"
              style={{ background: `${TEAL}1a`, color: TEAL }}
            >
              Bordado profesional
            </span>
            <h1 className="mt-6 text-5xl font-black leading-[0.98] tracking-tight md:text-7xl">
              Tu marca,
              <br />
              <span style={{ color: TEAL }}>puntada</span> a <span style={{ color: GOLD }}>puntada.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-slate-600">
              Bordados de alta densidad sobre prendas premium para empresas, equipos y marcas que quieren verse
              impecables. Desde una pieza hasta producción por lotes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#personaliza"
                className="rounded-full px-8 py-4 font-bold text-white shadow-lg transition-transform hover:scale-105"
                style={{ background: TEAL }}
              >
                Diseña tu prenda
              </a>
              <a
                href="#contacto"
                className="rounded-full border-2 px-8 py-4 font-bold transition-colors hover:bg-[#0f1e2b] hover:text-white"
                style={{ borderColor: INK }}
              >
                Pedir cotización
              </a>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm font-semibold text-slate-600">
              {["Desde 1946 en el bordado", "25 años de Bordados DTG", "Hecho en Panamá"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: GOLD }} />
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...reveal} className="relative h-[420px] md:h-[600px]">
            <Scene shirtColor={shirt} threadColor={thread} />
            <p className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-xs text-slate-400">
              Arrastra para girar
            </p>
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
      <section id="nosotros" className="py-20 md:py-28">
        <div className={wrap}>
          <motion.div {...reveal} className="max-w-3xl">
            <p className={eyebrow} style={{ color: GOLD }}>Nuestra historia</p>
            <h2 className={h2}>El arte del bordado, un legado de familia</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              En Bordados DTG, el bordado también cuenta una historia de familia: con raíces en Nicaragua y
              Panamá, reúne el oficio de nuestros antepasados, las enseñanzas de nuestros padres y el deseo de
              seguir creciendo.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              ["1946", "Don Silvestre Tenorio Ruiz, de origen nicaragüense, inicia su trayectoria en el bordado en el istmo de Panamá. Según nuestra memoria familiar, fundó la primera empresa formal de bordados del país y vistió con uniformes bordados a miles de empleados de cientos de empresas, y a personal vinculado al Comando Sur."],
              ["2001", "Diego Antonio Tenorio Gómez, nieto de don Silvestre y doña Alicia, funda Bordados DTG, S. A. Las iniciales DTG recogen su nombre y también el reconocimiento a quienes formaron al hombre detrás de la empresa."],
              ["2026", "Celebramos 25 años de Bordados DTG, dentro de una historia familiar vinculada al bordado desde hace ocho décadas, y abrimos una nueva etapa con nuestra web y nuestra presencia en Instagram."],
            ].map(([y, d], i) => (
              <motion.div
                key={y}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.1 }}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <span className="text-5xl font-black" style={{ color: i === 1 ? GOLD : TEAL }}>{y}</span>
                <div className="mt-4 h-1 w-12 rounded-full" style={{ background: i === 1 ? GOLD : TEAL }} />
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{d}</p>
              </motion.div>
            ))}
          </div>

          <motion.details {...reveal} className="group mt-8 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6">
            <summary className="cursor-pointer list-none font-bold" style={{ color: TEAL }}>
              Leer la historia completa <span className="inline-block transition-transform group-open:rotate-90">→</span>
            </summary>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-600">
              <p>El bordado es un arte que ha acompañado a distintas culturas durante miles de años. Desde los delicados bordados en seda de China hasta las elaboradas vestimentas ceremoniales de Europa y los trabajos con hilos metálicos de la India, sus puntadas han expresado creatividad, identidad y tradición.</p>
              <p>Don Silvestre contrajo matrimonio con doña Alicia de Tenorio Magallón, abuela de nuestro fundador. Ambos, hoy recordados con amor y gratitud, ocupan un lugar entrañable en nuestra historia. Honrar su memoria es reconocer las raíces de una familia cuyo vínculo con el bordado ha trascendido generaciones.</p>
              <p>Con el paso de los años, esa herencia encontraría un nuevo capítulo en su nieto, Diego Antonio Tenorio Gómez. Su camino estuvo marcado por el ejemplo de su abuelo y por la formación que recibió de sus padres, doña Josefa Lydia Gómez y don Diego Tenorio Magallón.</p>
              <p>Desde su niñez, sus padres sembraron en él la compasión, los valores fundamentales de la vida y la fortaleza para levantarse después de cada caída. Esas enseñanzas se convirtieron en pilares de su carácter: perseverar ante las dificultades, tratar a los demás con respeto y reconocer el valor del esfuerzo.</p>
              <p>Para nosotros, cada bordado lleva una identidad. Detrás de un nombre o un emblema hay personas, equipos y empresas que desean representar con orgullo lo que hacen. Dar forma a esa identidad sobre una prenda es una responsabilidad que asumimos con dedicación y respeto por nuestro oficio.</p>
              <p>Con cada nuevo proyecto, seguimos escribiendo el capítulo que comenzó en nuestra familia en 1946 y que tomó una nueva forma con la fundación de Bordados DTG en 2001.</p>
            </div>
          </motion.details>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {[
              ["Nuestra misión", "Dar vida a la identidad de empresas, organizaciones y personas mediante bordados de calidad, con atención personalizada y compromiso en cada entrega. Honramos nuestra tradición familiar a través de un servicio basado en el respeto, la honestidad y la dedicación a cada trabajo.", TEAL],
              ["Nuestra visión", "Ser una empresa referente del bordado en Panamá, reconocida por la calidad de nuestro trabajo, la confianza de nuestros clientes y nuestra capacidad de innovar. Aspiramos a ampliar nuestra presencia en nuevos mercados, uniendo el legado familiar con la tecnología y formando nuevas generaciones que mantengan vivo el arte del bordado.", GOLD],
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

      {/* SERVICIOS */}
      <section id="servicios" className="py-20 md:py-28">
        <div className={wrap}>
          <motion.div {...reveal} className="max-w-2xl">
            <p className={eyebrow} style={{ color: GOLD }}>Servicios</p>
            <h2 className={h2}>Acabado que habla de tu empresa</h2>
          </motion.div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map(([t, d], i) => (
              <motion.div
                key={t}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.08 }}
                className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <span
                  className="grid h-12 w-12 place-items-center rounded-xl font-mono text-lg font-bold text-white"
                  style={{ background: i % 2 ? GOLD : TEAL }}
                >
                  0{i + 1}
                </span>
                <h3 className="mt-5 text-lg font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section id="proceso" className="py-20 md:py-28" style={{ background: INK }}>
        <div className={wrap}>
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

      {/* CONFIGURADOR */}
      <section id="personaliza" className="py-20 md:py-28">
        <div className={`${wrap} grid items-center gap-10 md:grid-cols-2`}>
          <motion.div {...reveal} className="relative h-[420px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:h-[560px]">
            <Scene shirtColor={shirt} threadColor={thread} needle />
          </motion.div>

          <motion.div {...reveal}>
            <p className={eyebrow} style={{ color: GOLD }}>Configurador</p>
            <h2 className={h2}>Pruébalo en vivo</h2>
            <p className="mt-3 max-w-md text-slate-600">
              Elige el color de la prenda y del hilo y mira cómo queda el bordado en 3D.
            </p>

            <p className="mb-3 mt-8 text-xs font-bold uppercase tracking-widest text-slate-500">Color de prenda</p>
            <div className="flex flex-wrap gap-3">
              {SHIRTS.map((c) => (
                <button
                  key={c.hex}
                  title={c.name}
                  aria-label={c.name}
                  onClick={() => setShirt(c.hex)}
                  className="h-11 w-11 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    background: c.hex,
                    borderColor: shirt === c.hex ? TEAL : "rgba(15,30,43,.15)",
                    boxShadow: shirt === c.hex ? `0 0 0 3px ${TEAL}40` : undefined,
                  }}
                />
              ))}
            </div>

            <p className="mb-3 mt-7 text-xs font-bold uppercase tracking-widest text-slate-500">Color de hilo</p>
            <div className="flex flex-wrap gap-3">
              {THREADS.map((c) => (
                <button
                  key={c.hex}
                  title={c.name}
                  aria-label={c.name}
                  onClick={() => setThread(c.hex)}
                  className="h-11 w-11 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    background: c.hex,
                    borderColor: thread === c.hex ? TEAL : "rgba(15,30,43,.15)",
                    boxShadow: thread === c.hex ? `0 0 0 3px ${TEAL}40` : undefined,
                  }}
                />
              ))}
            </div>

            <a
              href="#contacto"
              className="mt-10 inline-block rounded-full px-8 py-4 font-bold text-white shadow-lg transition-transform hover:scale-105"
              style={{ background: TEAL }}
            >
              Cotizar este diseño
            </a>
          </motion.div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-20 md:py-28" style={{ background: `linear-gradient(135deg, ${TEAL}, #0e6f84)` }}>
        <div className={`${wrap} grid items-center gap-12 md:grid-cols-2`}>
          <motion.div {...reveal} className="text-white">
            <h2 className="text-4xl font-black tracking-tight md:text-6xl">Hagamos algo que se note</h2>
            <p className="mt-5 max-w-md text-lg text-white/85">
              Cuéntanos qué quieres bordar y te cotizamos en menos de 24 horas.
            </p>
          </motion.div>
          <motion.form
            {...reveal}
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const msg = `Hola, soy ${f.get("nombre")}. ${f.get("mensaje")}`;
              window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
            }}
            className="grid gap-3 rounded-3xl bg-white p-7 shadow-2xl"
          >
            <input
              name="nombre"
              required
              placeholder="Tu nombre"
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#199cb5]"
            />
            <textarea
              name="mensaje"
              required
              rows={4}
              placeholder="¿Qué prendas y cuántas piezas?"
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#199cb5]"
            />
            <button className="rounded-xl py-3.5 font-bold text-white" style={{ background: INK }}>
              Pedir cotización
            </button>
          </motion.form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-10">
        <div className={`${wrap} flex flex-col items-center justify-between gap-6 md:flex-row`}>
          <Image src="/logo.png" alt="DTG Bordados" width={110} height={118} className="h-[110px] w-auto" />
          <p className="text-sm text-slate-500">© Bordados DTG, S. A. · El arte del bordado, una historia de familia</p>
        </div>
      </footer>
    </main>
  );
}
