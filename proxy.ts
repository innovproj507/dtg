import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SITE_HOST = "bordadosdtg.com";

// Modo mantenimiento: con MAINTENANCE_MODE=true toda la web muestra /mantenimiento.
// /enlaces sigue activa para la bio de Instagram.
const ALLOWED = ["/mantenimiento", "/enlaces"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Detrás de Cloudflare/Apache la app escucha en http; los datos reales del visitante llegan en cabeceras.
  const host = (request.headers.get("x-forwarded-host") ?? "").split(",")[0].trim().toLowerCase();
  const proto = (request.headers.get("x-forwarded-proto") ?? "").split(",")[0].trim().toLowerCase();

  // 1) Un solo dominio canónico: www -> sin www, y siempre https (evita contenido duplicado y tráfico sin cifrar)
  if (host === `www.${SITE_HOST}` || (host === SITE_HOST && proto === "http")) {
    return NextResponse.redirect(`https://${SITE_HOST}${pathname}${search}`, 308);
  }

  // 2) Modo mantenimiento
  if (process.env.MAINTENANCE_MODE !== "true") return NextResponse.next();

  if (ALLOWED.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // X-Forwarded-Proto hace que nextUrl sea https aunque la app escuche en http;
  // Next trataría la reescritura como externa. Se fuerza http para que sea una reescritura interna.
  const url = request.nextUrl.clone();
  url.pathname = "/mantenimiento";
  url.protocol = "http:";
  const res = NextResponse.rewrite(url, { status: 503 });
  res.headers.set("Retry-After", "3600");
  return res;
}

export const config = {
  // excluye recursos internos y archivos estáticos (logo, favicon, imágenes)
  matcher: ["/((?!_next/|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|avif|gif|ico|css|js|txt|xml|mp4|webm|woff|woff2)$).*)"],
};
