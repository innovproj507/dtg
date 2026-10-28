import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// CSP: Next inyecta scripts en línea para hidratar, por eso 'unsafe-inline'.
// En desarrollo se permite 'unsafe-eval' (lo necesita el recargador de Next).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"} https://static.cloudflareinsights.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self' data:",
  "connect-src 'self' https://cloudflareinsights.com",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isProd ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  ...(isProd ? [{ key: "Strict-Transport-Security", value: "max-age=31536000" }] : []),
];

/**
 * Caché pensada para que nadie vea una versión vieja del sitio:
 *  - Páginas: el navegador y Cloudflare siempre preguntan al servidor (ETag: si no cambió, responde 304 sin descargar).
 *  - Imágenes y video: 1 hora y luego revalidan. Sin "stale-while-revalidate": una foto reemplazada no se sigue mostrando días.
 *  - /_next/static: archivos con hash en el nombre; Next ya los marca como inmutables.
 * Si reemplazas una foto, ponle un nombre nuevo: así ninguna caché tiene la anterior.
 */
const noCachePaginas = { key: "Cache-Control", value: "public, max-age=0, must-revalidate" };
const cacheMedios = { key: "Cache-Control", value: "public, max-age=3600, must-revalidate" };

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false, // no anunciar "X-Powered-By: Next.js"
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // páginas (todo lo que no sea estático, medios ni API)
      { source: "/((?!_next/|media/|video/|api/|.*\\..*).*)", headers: [noCachePaginas] },
      { source: "/media/:file*", headers: [cacheMedios] },
      { source: "/video/:file*", headers: [cacheMedios] },
      { source: "/(logo.png|og.jpg|icon.png|apple-icon.png)", headers: [cacheMedios] },
    ];
  },
};

export default nextConfig;
