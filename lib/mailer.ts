import nodemailer, { type Transporter } from "nodemailer";
import { CONTACT } from "@/lib/contact";

/**
 * Envío de correo por SMTP. Las credenciales viven en variables de entorno
 * (ver .env.example); nunca en el repositorio.
 *
 * El transporte se crea una sola vez y se reutiliza: nodemailer mantiene
 * viva la conexión entre envíos, y crear uno por petición abriría una
 * conexión SMTP nueva cada vez.
 */

const env = {
  host: process.env.SMTP_HOST ?? "",
  port: Number(process.env.SMTP_PORT ?? 465),
  user: process.env.SMTP_USER ?? "",
  pass: process.env.SMTP_PASS ?? "",
  from: process.env.SMTP_FROM ?? "",
  to: process.env.CONTACT_TO ?? CONTACT.email,
};

/** Sin estos cuatro datos no se puede enviar nada; la ruta responde 503 y lo registra. */
export const mailerListo = Boolean(env.host && env.user && env.pass && env.to);

export const destinoContacto = env.to;

let transporte: Transporter | null = null;

function obtenerTransporte() {
  if (!transporte) {
    transporte = nodemailer.createTransport({
      host: env.host,
      port: env.port,
      // 465 va cifrado desde el saludo; 587 arranca en claro y sube a TLS con STARTTLS.
      secure: env.port === 465,
      auth: { user: env.user, pass: env.pass },
    });
  }
  return transporte;
}

type Correo = {
  asunto: string;
  texto: string;
  html: string;
  /** Al responder en el gestor de correo, la respuesta va al visitante. */
  responderA?: string;
};

export async function enviarCorreo({ asunto, texto, html, responderA }: Correo) {
  await obtenerTransporte().sendMail({
    // El remitente debe ser una dirección del propio dominio o el servidor la rechaza;
    // por eso nunca se pone aquí el correo del visitante, que va en replyTo.
    from: env.from || `"DTG Bordados" <${env.user}>`,
    to: env.to,
    subject: asunto,
    text: texto,
    html,
    ...(responderA && { replyTo: responderA }),
  });
}
