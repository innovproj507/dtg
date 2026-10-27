import { destinoContacto, enviarCorreo, mailerListo } from "@/lib/mailer";

// Sin `export const runtime`: con cacheComponents activo Next no lo admite,
// y los manejadores de ruta ya corren en Node por defecto.

/** Lo que acepta cada campo. Los topes son los mismos que los del formulario. */
const CAMPOS = [
  { id: "nombre", etiqueta: "Nombre", max: 80, obligatorio: true },
  { id: "empresa", etiqueta: "Empresa u organización", max: 100, obligatorio: false },
  { id: "correo", etiqueta: "Correo electrónico", max: 120, obligatorio: true },
  { id: "telefono", etiqueta: "Teléfono", max: 30, obligatorio: false },
  { id: "cantidad", etiqueta: "Cantidad aproximada", max: 40, obligatorio: false },
  { id: "mensaje", etiqueta: "Qué necesita", max: 800, obligatorio: true },
] as const;

/**
 * Freno por IP: 5 envíos cada 10 minutos. Vive en memoria del proceso, que
 * basta porque la web corre en un solo servicio de systemd. Si algún día se
 * reparte en varias instancias, esto habría que sacarlo a un almacén común.
 */
const VENTANA = 10 * 60 * 1000;
const MAX_ENVIOS = 5;
const envios = new Map<string, number[]>();

function demasiadosEnvios(ip: string) {
  const ahora = Date.now();
  const recientes = (envios.get(ip) ?? []).filter((t) => ahora - t < VENTANA);
  if (recientes.length >= MAX_ENVIOS) return true;
  recientes.push(ahora);
  envios.set(ip, recientes);
  // Limpieza perezosa: sin esto el mapa crecería sin tope.
  if (envios.size > 500) {
    for (const [clave, marcas] of envios) {
      if (marcas.every((t) => ahora - t >= VENTANA)) envios.delete(clave);
    }
  }
  return false;
}

/** Detrás de Cloudflare y Apache la IP real llega en cabeceras. */
function ipVisitante(req: Request) {
  const cf = req.headers.get("cf-connecting-ip");
  const xff = req.headers.get("x-forwarded-for")?.split(",")[0].trim();
  return cf || xff || "desconocida";
}

const escapar = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Las cabeceras de correo se separan por saltos de línea: un valor con \r o \n
 * podría colar cabeceras extra. Asunto y replyTo se limpian antes de usarse.
 */
const unaLinea = (t: string) => t.replace(/[\r\n]+/g, " ").trim();

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  if (!mailerListo) {
    console.error("[contacto] faltan las variables SMTP; revisa .env");
    return Response.json(
      { ok: false, error: "El envío por correo no está configurado todavía." },
      { status: 503 },
    );
  }

  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Solicitud mal formada." }, { status: 400 });
  }

  // Campo trampa: está oculto, así que una persona lo deja vacío y muchos
  // robots lo rellenan. Se responde ok para no darles pistas.
  if (String(cuerpo.web ?? "").trim() !== "") {
    return Response.json({ ok: true });
  }

  if (demasiadosEnvios(ipVisitante(req))) {
    return Response.json(
      { ok: false, error: "Has enviado varias solicitudes seguidas. Inténtalo de nuevo en unos minutos." },
      { status: 429 },
    );
  }

  const datos: Record<string, string> = {};
  for (const campo of CAMPOS) {
    const valor = String(cuerpo[campo.id] ?? "").trim();
    if (campo.obligatorio && !valor) {
      return Response.json({ ok: false, error: `Falta ${campo.etiqueta.toLowerCase()}.` }, { status: 400 });
    }
    datos[campo.id] = valor.slice(0, campo.max);
  }

  if (!CORREO_VALIDO.test(datos.correo)) {
    return Response.json({ ok: false, error: "Revisa el correo electrónico." }, { status: 400 });
  }

  const filas = CAMPOS.filter((c) => datos[c.id]).map((c) => [c.etiqueta, datos[c.id]] as const);

  const texto = filas.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html =
    `<h2 style="font-family:system-ui,sans-serif">Nueva solicitud desde bordadosdtg.com</h2>` +
    `<table style="font-family:system-ui,sans-serif;border-collapse:collapse">` +
    filas
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 14px 6px 0;vertical-align:top;color:#64748b"><b>${escapar(k)}</b></td>` +
          `<td style="padding:6px 0;white-space:pre-wrap">${escapar(v)}</td></tr>`,
      )
      .join("") +
    `</table>`;

  try {
    await enviarCorreo({
      asunto: unaLinea(`Solicitud de cotización — ${datos.nombre}${datos.empresa ? ` (${datos.empresa})` : ""}`),
      texto,
      html,
      responderA: unaLinea(datos.correo),
    });
  } catch (error) {
    // El detalle se queda en el registro del servidor; al visitante no le sirve.
    console.error("[contacto] no se pudo enviar a", destinoContacto, error);
    return Response.json(
      { ok: false, error: "No pudimos enviar tu solicitud. Escríbenos por WhatsApp mientras lo revisamos." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
