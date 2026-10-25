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

  // Location relativa: detrás de un proxy inverso el origen interno (localhost:3100) no es público
  return new NextResponse(null, {
    status: 307,
    headers: { Location: "/mantenimiento", "Cache-Control": "no-store" },
  });
}

export const config = {
  // excluye recursos internos y archivos estáticos (logo, favicon, imágenes)
  matcher: ["/((?!_next/|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|css|js|txt|xml)$).*)"],
};
