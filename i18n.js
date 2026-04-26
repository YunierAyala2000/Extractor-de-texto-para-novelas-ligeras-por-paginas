const LANG = {
  es: {
    // Página
    appTitle: "Extractor de texto web por páginas",
    h1: "Extractor de texto web",
    subtitle: "Extrae texto de múltiples páginas automáticamente",
    // Header
    btnTourLabel: "✦ Guía",
    btnTourTitle: "Ver guía de uso",
    btnTemaTitle: "Cambiar tema",
    btnLangTitle: "Switch to English",
    // Cards
    cardUrl: "URL de inicio",
    cardFiltro: "Filtro de contenido",
    labelEtiqueta: "Etiqueta HTML",
    labelClase: "Clase CSS",
    labelSelector: "Selector avanzado",
    hintFiltro:
      "Solo se aplica el primero que esté relleno. Si todos están vacíos se extrae todo el <code>&lt;body&gt;</code>.",
    cardPaginacion: "Paginación",
    labelNumPaginas: "Número de páginas a extraer",
    labelSiguiente: 'Clase CSS o del enlace "Siguiente"',
    badgeOpcional: "opcional",
    hintPaginacion:
      "Acepta una <strong>clase CSS</strong> simple (ej: <code>next-page</code>), un <strong>selector CSS</strong> completo (ej: <code>.pagination a.next</code>) o búsqueda por <strong>texto visible</strong> con el prefijo <code>text:</code> (ej: <code>text:Siguiente</code>). Déjalo vacío para detección automática.",
    // Botón extraer
    btnExtraer: "Extraer",
    btnExtrayendo: "Extrayendo…",
    // Resultado
    labelResultado: "Resultado",
    btnCopiar: "Copiar",
    btnCopiado: "¡Copiado!",
    btnDescargar: "Descargar .txt",
    placeholderResultado: "El texto extraído de cada página aparecerá aquí…",
    // Progreso
    progresoIniciando: "Iniciando…",
    progresoTexto: (cur, tot) => `Página ${cur} de ${tot}`,
    // Encabezado en el resultado
    paginaEncabezado: (n) => `PÁGINA ${n}`,
    // Tipos de filtro (para mensajes de error en el resultado)
    tipoEtiqueta: "etiqueta",
    tipoClase: "clase",
    tipoSelector: "selector",
    // Alertas
    alertUrlVacia: "Ingresa una URL válida.",
    alertUrlInvalida:
      "La URL ingresada no es válida. Asegúrate de incluir http:// o https://",
    alertProxyFallo: (p) =>
      `No se pudo obtener la página ${p}.\nTodos los proxies y Jina fallaron.`,
    alertProxyFalloDetalle: (p, msg) =>
      `No se pudo obtener la página ${p}.\nJina y todos los proxies fallaron.\n\n${msg}`,
    alertSiguienteNoEncontrado: (p) =>
      `No se encontró el enlace a la siguiente página al terminar la página ${p}.\n` +
      `Se detiene la extracción con ${p} página(s) obtenida(s).\n\n` +
      `Consejo: usa el campo "Clase CSS o selector del enlace Siguiente" para indicar el selector CSS exacto del botón de paginación.`,
    alertCopiarFallo: "No se pudo copiar al portapapeles.",
    alertDescargaSinTexto:
      "No hay texto para descargar. Extrae primero el contenido.",
    errorFiltro: (p, tipo, url) =>
      `[Página ${p}: no se encontró contenido con el filtro ${tipo}]\nURL: ${url}`,
    // Tour
    tourNext: "Siguiente →",
    tourPrev: "← Anterior",
    tourDone: "¡Listo!",
    tourProgress: "Paso {{current}} de {{total}}",
    tour: [
      {
        title: "👋 Bienvenido al Scraper",
        description:
          "Esta app te permite extraer el texto de novelas ligeras u otras páginas web de forma automática, página por página.",
      },
      {
        title: "1. URL de inicio",
        description:
          "Pega aquí la URL de la primera página que quieres extraer. Debe empezar por <code>https://</code>.",
      },
      {
        title: "2. Filtro de contenido",
        description:
          "Elige cómo aislar el texto del capítulo y descartar menús o publicidad. Solo se usa el primero que esté relleno.",
      },
      {
        title: "Etiqueta HTML",
        description:
          "Extrae todos los elementos de esa etiqueta. Por ejemplo <code>p</code> obtiene todos los párrafos de la página.",
      },
      {
        title: "Clase CSS",
        description:
          "Extrae todos los elementos que tengan esa clase. Por ejemplo <code>dv-post-article</code> apunta al contenedor del capítulo en devilnovels.com.",
      },
      {
        title: "Selector CSS avanzado",
        description:
          "Para casos complejos: usa cualquier selector CSS válido como <code>#contenido > p</code> o <code>article.entry-content</code>.",
      },
      {
        title: "3. Paginación",
        description:
          "Controla cuántas páginas consecutivas extraer y cómo navegar entre ellas.",
      },
      {
        title: "Número de páginas",
        description:
          "Cuántos capítulos o páginas quieres extraer en una sola pasada. Máximo 100.",
      },
      {
        title: 'Selector del botón "Siguiente"',
        description:
          "Si la detección automática falla, indica cómo encontrar el enlace de siguiente página:<br>" +
          "• <code>next-page</code> → clase CSS<br>" +
          "• <code>.pagination a.next</code> → selector CSS<br>" +
          "• <code>text:Siguiente</code> → búsqueda por texto visible",
      },
      {
        title: "4. Extraer",
        description:
          "Pulsa este botón para iniciar la extracción. La barra de progreso te mostrará en qué página va el proceso.",
      },
      {
        title: "5. Resultado",
        description:
          "El texto aparece aquí en tiempo real, separado por encabezados de página. Cuando termine puedes copiarlo o descargarlo como <code>.txt</code>.",
      },
      {
        title: "Copiar",
        description:
          "Copia todo el texto extraído al portapapeles con un clic.",
      },
      {
        title: "Descargar .txt",
        description:
          "Guarda el resultado como un archivo de texto plano en tu dispositivo.",
      },
    ],
  },

  en: {
    // Page
    appTitle: "Text Extractor by Pages",
    h1: "Text Extractor",
    subtitle: "Automatically extract text from multiple pages",
    // Header
    btnTourLabel: "✦ Guide",
    btnTourTitle: "View usage guide",
    btnTemaTitle: "Toggle theme",
    btnLangTitle: "Cambiar a Español",
    // Cards
    cardUrl: "Start URL",
    cardFiltro: "Content filter",
    labelEtiqueta: "HTML tag",
    labelClase: "CSS class",
    labelSelector: "Advanced selector",
    hintFiltro:
      "Only the first filled field is applied. If all are empty, the entire <code>&lt;body&gt;</code> is extracted.",
    cardPaginacion: "Pagination",
    labelNumPaginas: "Number of pages to extract",
    labelSiguiente: 'CSS class or "Next" link selector',
    badgeOpcional: "optional",
    hintPaginacion:
      "Accepts a simple <strong>CSS class</strong> (e.g. <code>next-page</code>), a full <strong>CSS selector</strong> (e.g. <code>.pagination a.next</code>), or a <strong>visible text</strong> search with the prefix <code>text:</code> (e.g. <code>text:Next</code>). Leave empty for automatic detection.",
    // Extract button
    btnExtraer: "Extract",
    btnExtrayendo: "Extracting…",
    // Result
    labelResultado: "Result",
    btnCopiar: "Copy",
    btnCopiado: "Copied!",
    btnDescargar: "Download .txt",
    placeholderResultado: "Extracted text from each page will appear here…",
    // Progress
    progresoIniciando: "Starting…",
    progresoTexto: (cur, tot) => `Page ${cur} of ${tot}`,
    // Header in result
    paginaEncabezado: (n) => `PAGE ${n}`,
    // Filter types (for error messages in result)
    tipoEtiqueta: "tag",
    tipoClase: "class",
    tipoSelector: "selector",
    // Alerts
    alertUrlVacia: "Please enter a valid URL.",
    alertUrlInvalida:
      "The entered URL is not valid. Make sure to include http:// or https://",
    alertProxyFallo: (p) =>
      `Could not fetch page ${p}.\nAll proxies and Jina failed.`,
    alertProxyFalloDetalle: (p, msg) =>
      `Could not fetch page ${p}.\nJina and all proxies failed.\n\n${msg}`,
    alertSiguienteNoEncontrado: (p) =>
      `Could not find the "Next page" link after finishing page ${p}.\n` +
      `Extraction stopped with ${p} page(s) obtained.\n\n` +
      `Tip: use the "CSS class or Next link selector" field to specify the exact CSS selector of the pagination button.`,
    alertCopiarFallo: "Could not copy to clipboard.",
    alertDescargaSinTexto: "No text to download. Extract content first.",
    errorFiltro: (p, tipo, url) =>
      `[Page ${p}: no content found with filter ${tipo}]\nURL: ${url}`,
    // Tour
    tourNext: "Next →",
    tourPrev: "← Back",
    tourDone: "Done!",
    tourProgress: "Step {{current}} of {{total}}",
    tour: [
      {
        title: "👋 Welcome to the Scraper",
        description:
          "This app lets you extract text from light novels or other web pages automatically, page by page.",
      },
      {
        title: "1. Start URL",
        description:
          "Paste the URL of the first page you want to extract. It must start with <code>https://</code>.",
      },
      {
        title: "2. Content filter",
        description:
          "Choose how to isolate the chapter text and discard menus or ads. Only the first filled field is used.",
      },
      {
        title: "HTML tag",
        description:
          "Extracts all elements with that tag. For example <code>p</code> gets all paragraphs on the page.",
      },
      {
        title: "CSS class",
        description:
          "Extracts all elements with that class. For example <code>dv-post-article</code> targets the chapter container on devilnovels.com.",
      },
      {
        title: "Advanced CSS selector",
        description:
          "For complex cases: use any valid CSS selector like <code>#content > p</code> or <code>article.entry-content</code>.",
      },
      {
        title: "3. Pagination",
        description:
          "Control how many consecutive pages to extract and how to navigate between them.",
      },
      {
        title: "Number of pages",
        description:
          "How many chapters or pages to extract in one run. Maximum 100.",
      },
      {
        title: '"Next" button selector',
        description:
          "If auto-detection fails, specify how to find the next page link:<br>" +
          "• <code>next-page</code> → CSS class<br>" +
          "• <code>.pagination a.next</code> → CSS selector<br>" +
          "• <code>text:Next</code> → search by visible text",
      },
      {
        title: "4. Extract",
        description:
          "Click this button to start extraction. The progress bar will show which page is being processed.",
      },
      {
        title: "5. Result",
        description:
          "Text appears here in real time, separated by page headers. When done you can copy it or download it as <code>.txt</code>.",
      },
      {
        title: "Copy",
        description: "Copy all extracted text to the clipboard with one click.",
      },
      {
        title: "Download .txt",
        description: "Save the result as a plain text file on your device.",
      },
    ],
  },
};

let _lang = localStorage.getItem("idioma") || "es";

function t(key, ...args) {
  const val = LANG[_lang][key];
  if (typeof val === "function") return val(...args);
  return val !== undefined ? val : key;
}

function getLang() {
  return _lang;
}

function setLang(lang) {
  _lang = lang;
  localStorage.setItem("idioma", lang);
  document.documentElement.setAttribute("lang", lang);
  applyLang();
}

function toggleLang() {
  setLang(_lang === "es" ? "en" : "es");
}

function applyLang() {
  const l = LANG[_lang];

  // <title>
  document.title = l.appTitle;

  // data-i18n → textContent
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (l[key] !== undefined) el.textContent = l[key];
  });

  // data-i18n-html → innerHTML (para hints con etiquetas HTML)
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    if (l[key] !== undefined) el.innerHTML = l[key];
  });

  // data-i18n-placeholder → placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (l[key] !== undefined) el.placeholder = l[key];
  });

  // data-i18n-title → atributo title
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    if (l[key] !== undefined) el.title = l[key];
  });

  // Botón de idioma
  const btnLang = document.getElementById("btnLang");
  if (btnLang) {
    btnLang.textContent = _lang === "es" ? "EN" : "ES";
    btnLang.title = l.btnLangTitle;
  }

  // Botón extraer (solo si no está extrayendo)
  const btnExtraer = document.getElementById("btnExtraer");
  if (btnExtraer && !btnExtraer.disabled) {
    btnExtraer.textContent = l.btnExtraer;
  }
}

// Aplicar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.setAttribute("lang", _lang);
  applyLang();
});
