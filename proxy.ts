import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Modo mantenimiento: con MAINTENANCE_MODE=true toda la web muestra /mantenimiento.
// /enlaces sigue activa para la bio de Instagram.
const ALLOWED = ["/mantenimiento", "/enlaces"];

export function proxy(request: NextRequest) {
  if (process.env.MAINTENANCE_MODE !== "true") return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (ALLOWED.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  const res = NextResponse.rewrite(new URL("/mantenimiento", request.url), { status: 503 });
  res.headers.set("Retry-After", "3600");
  return res;
}

export const config = {
  // excluye recursos internos y archivos estáticos (logo, favicon, imágenes)
  matcher: ["/((?!_next/|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|css|js|txt|xml)$).*)"],
};
