// Completa estos datos y las páginas /enlaces y /mantenimiento los usan automáticamente.
// Los que queden vacíos se ocultan.
export const CONTACT = {
  whatsapp: "50760256779", // solo dígitos con código de país, ej. "50761234567"
  instagram: "bordadosdtg", // usuario sin @, ej. "bordadosdtg"
  phone: "50760256779", // ej. "+50761234567"
  mapsUrl: "", // enlace de Google Maps
  address: "El Dorado, Villa de las Fuentes No. 2", // ej. "Ciudad de Panamá"
  hours: "", // ej. "Lun–Vie 8:00am–5:00pm"
};

export const waLink = (text = "Hola, quiero cotizar un bordado") =>
  CONTACT.whatsapp
    ? `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`
    : "/#contacto";
