// ── Guía interactiva con Driver.js ────────────────────────────────────────────
function iniciarTour() {
  const driver = window.driver.js.driver;

  const tour = driver({
    showProgress: true,
    nextBtnText: "Siguiente",
    prevBtnText: "Anterior",
    doneBtnText: "¡Listo!",
    progressText: "Paso {{current}} de {{total}}",
    steps: [
      {
        element: "header",
        popover: {
          title: "👋 Bienvenido al Scraper",
          description:
            "Esta app te permite extraer el texto de novelas ligeras u otras páginas web de forma automática, página por página.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#card-url",
        popover: {
          title: "1. URL de inicio",
          description:
            "Pega aquí la URL de la primera página que quieres extraer. Debe empezar por <code>https://</code>.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#card-filtro",
        popover: {
          title: "2. Filtro de contenido",
          description:
            "Elige cómo aislar el texto del capítulo y descartar menús o publicidad. Solo se usa el primero que esté relleno.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#etiquetaInput",
        popover: {
          title: "Etiqueta HTML",
          description:
            "Extrae todos los elementos de esa etiqueta. Por ejemplo <code>p</code> obtiene todos los párrafos de la página.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#claseInput",
        popover: {
          title: "Clase CSS",
          description:
            "Extrae todos los elementos que tengan esa clase. Por ejemplo <code>dv-post-article</code> apunta al contenedor del capítulo en devilnovels.com.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#selectorInput",
        popover: {
          title: "Selector CSS avanzado",
          description:
            "Para casos complejos: usa cualquier selector CSS válido como <code>#contenido > p</code> o <code>article.entry-content</code>.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#card-paginacion",
        popover: {
          title: "3. Paginación",
          description:
            "Controla cuántas páginas consecutivas extraer y cómo navegar entre ellas.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#numPaginasInput",
        popover: {
          title: "Número de páginas",
          description:
            "Cuántos capítulos o páginas quieres extraer en una sola pasada. Máximo 100.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#siguienteSelector",
        popover: {
          title: 'Selector del botón "Siguiente"',
          description:
            "Si la detección automática falla, indica cómo encontrar el enlace de siguiente página:<br>" +
            "• <code>next-page</code> → clase CSS<br>" +
            "• <code>.pagination a.next</code> → selector CSS<br>" +
            "• <code>text:Siguiente</code> → búsqueda por texto visible",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#btnExtraer",
        popover: {
          title: "4. Extraer",
          description:
            "Pulsa este botón para iniciar la extracción. La barra de progreso te mostrará en qué página va el proceso.",
          side: "top",
          align: "start",
        },
      },
      {
        element: "#panel-resultado",
        popover: {
          title: "5. Resultado",
          description:
            "El texto aparece aquí en tiempo real, separado por encabezados de página. Cuando termine puedes copiarlo o descargarlo como <code>.txt</code>.",
          side: "left",
          align: "start",
        },
      },
      {
        element: "#btnCopiar",
        popover: {
          title: "Copiar",
          description:
            "Copia todo el texto extraído al portapapeles con un clic.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#btnDescargar",
        popover: {
          title: "Descargar .txt",
          description:
            "Guarda el resultado como un archivo de texto plano en tu dispositivo.",
          side: "bottom",
          align: "start",
        },
      },
    ],
  });

  tour.drive();
}
