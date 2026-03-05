/* ============================================================
   JOYAS KM — PRODUCTOS
   
   Para agregar fotos reemplaza null por el nombre del archivo:
   Ejemplo: null → "fotos/oro/argolla01_frente.jpg"
   
   Para cambiar precios ve a estilos.css
   ============================================================ */

const PRODUCTOS = {

  oro: [
    {
      id: "oro-01",
      nombre: "Argolla Clásica Lisa",
      material: "Oro 18K",
      descripcion: "Argolla circular lisa de acabado brillante, ideal para uso diario. Cierre mariposa seguro.",
      precioVar: "--precio-oro-01",
      badge: null,
      fotos: [
        null,   /* foto 1 — frontal        */
        null,   /* foto 2 — lateral        */
        null,   /* foto 3 — en oreja       */
        null,   /* foto 4 — detalle cierre */
        null    /* foto 5 — lifestyle      */
      ]
    },
    {
      id: "oro-02",
      nombre: "Argolla Triángulo Oro",
      material: "Oro 18K",
      descripcion: "Diseño geométrico triangular en oro amarillo. Acabado satinado en el cuerpo y bordes pulidos.",
      precioVar: "--precio-oro-02",
      badge: "Nuevo",
      fotos: [null, null, null, null, null]
    },
    {
      id: "oro-03",
      nombre: "Argolla Aro Delgado",
      material: "Oro 18K",
      descripcion: "Aro fino de perfil redondo, muy liviano y cómodo. Disponible en diámetro mediano.",
      precioVar: "--precio-oro-03",
      badge: null,
      fotos: [null, null, null, null, null]
    },
    {
      id: "oro-04",
      nombre: "Argolla Torzal",
      material: "Oro 18K",
      descripcion: "Argolla con textura torzal retorcida. Acabado brillante que potencia el efecto visual.",
      precioVar: "--precio-oro-04",
      badge: "Favorita",
      fotos: [null, null, null, null, null]
    },
    {
      id: "oro-05",
      nombre: "Argolla Mini Oval",
      material: "Oro 18K",
      descripcion: "Formato oval pequeño, elegante y discreto. Perfecta para uso profesional o formal.",
      precioVar: "--precio-oro-05",
      badge: null,
      fotos: [null, null, null, null, null]
    }
  ],

  plata: [
    {
      id: "plata-01",
      nombre: "Argolla Clásica Plata",
      material: "Plata 925",
      descripcion: "Argolla redonda en plata esterlina 925. Acabado espejo, cierre mariposa.",
      precioVar: "--precio-plata-01",
      badge: null,
      fotos: [null, null, null, null, null]
    },
    {
      id: "plata-02",
      nombre: "Argolla Martillada",
      material: "Plata 925",
      descripcion: "Textura martillada a mano que da un aspecto artesanal único. Cada pieza es irrepetible.",
      precioVar: "--precio-plata-02",
      badge: "Artesanal",
      fotos: [null, null, null, null, null]
    },
    {
      id: "plata-03",
      nombre: "Argolla Cuadrada Plata",
      material: "Plata 925",
      descripcion: "Formato cuadrado con esquinas redondeadas, moderno y versátil.",
      precioVar: "--precio-plata-03",
      badge: null,
      fotos: [null, null, null, null, null]
    },
    {
      id: "plata-04",
      nombre: "Argolla Rombo",
      material: "Plata 925",
      descripcion: "Silueta de rombo en plata pulida. Diseño contemporáneo con cierre a presión.",
      precioVar: "--precio-plata-04",
      badge: "Nuevo",
      fotos: [null, null, null, null, null]
    },
    {
      id: "plata-05",
      nombre: "Argolla Aro Fino Plata",
      material: "Plata 925",
      descripcion: "Aro muy delgado y liviano en plata. Ideal para usar en múltiples perforaciones.",
      precioVar: "--precio-plata-05",
      badge: null,
      fotos: [null, null, null, null, null]
    }
  ]

};