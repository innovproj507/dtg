import { CONTACT } from "@/lib/contact";

export const SITE = {
  url: "https://bordadosdtg.com",
  host: "bordadosdtg.com",
  name: "DTG Bordados",
  legalName: "Bordados DTG, S. A.",
  title: "Bordados e Impresión DTF en Panamá | DTG Bordados",
  description:
    "Bordados profesionales e impresión digital DTF en Panamá: logos, uniformes, gorras y nombres personalizados. Producción por lotes y una historia familiar desde 1946. Cotiza por WhatsApp.",
  founded: "2001",
  ogImage: "/og.jpg",
};

const SERVICES = [
  ["Bordado de logos", "Relieve real con hilo de poliéster y rayón de brillo duradero."],
  ["Personalización", "Nombres, cargos y detalles individuales en cada prenda."],
  ["Producción por lotes", "Control de color y calidad pieza por pieza, con entregas programadas."],
  ["Digitalización de arte", "Conversión de logos en mapas de puntadas optimizados para bordado."],
  ["Impresión digital DTF", "Impresión a todo color, con degradados y detalles finos, sobre textiles de algodón y poliéster."],
];

/** Datos estructurados (JSON-LD) para Google: negocio local + sitio web. */
export function jsonLd() {
  const address = CONTACT.address
    ? {
        "@type": "PostalAddress",
        streetAddress: CONTACT.address,
        addressLocality: "Panamá",
        addressCountry: "PA",
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        inLanguage: "es",
        publisher: { "@id": `${SITE.url}/#negocio` },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${SITE.url}/#negocio`,
        name: SITE.legalName,
        alternateName: SITE.name,
        url: SITE.url,
        description: SITE.description,
        logo: { "@type": "ImageObject", url: `${SITE.url}/logo.png`, width: 384, height: 411 },
        image: [`${SITE.url}${SITE.ogImage}`, `${SITE.url}/media/banner-historia.jpg`],
        foundingDate: SITE.founded,
        slogan: "El arte del bordado, una historia de familia",
        areaServed: { "@type": "Country", name: "Panamá" },
        ...(CONTACT.email && { email: CONTACT.email }),
        ...(CONTACT.phone && { telephone: `+${CONTACT.phone.replace(/\D/g, "")}` }),
        ...(address && { address }),
        ...(CONTACT.mapsUrl && { hasMap: CONTACT.mapsUrl }),
        ...(CONTACT.instagram && { sameAs: [`https://www.instagram.com/${CONTACT.instagram}`] }),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Servicios de bordado",
          itemListElement: SERVICES.map(([name, description]) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name, description, areaServed: "Panamá" },
          })),
        },
      },
    ],
  };
}
