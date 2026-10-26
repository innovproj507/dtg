import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Fecha fija: actualízala cuando cambie el contenido de la página.
const LAST_UPDATE = "2026-10-25";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      lastModified: LAST_UPDATE,
      changeFrequency: "monthly",
      priority: 1,
      images: [`${SITE.url}/fotos/banner-historia.jpg`, `${SITE.url}/fotos/panama.jpg`, `${SITE.url}/fotos/foto1.jpg`],
    },
    { url: `${SITE.url}/enlaces`, lastModified: LAST_UPDATE, changeFrequency: "yearly", priority: 0.3 },
  ];
}
