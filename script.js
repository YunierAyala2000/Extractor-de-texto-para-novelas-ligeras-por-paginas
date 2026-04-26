// ── Proxies CORS ──────────────────────────────────────────────────────────────
const PROXIES = [
  {
    name: "allorigins-get",
    buildUrl: (url) =>
      `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    getHtml: async (response) => {
      const data = await response.json();
      return data.contents;
    },
  },
  {
    name: "allorigins-raw",
    buildUrl: (url) =>
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    getHtml: async (response) => await response.text(),
  },
  {
    name: "corsproxy-org",
    buildUrl: (url) => `https://corsproxy.org/?url=${encodeURIComponent(url)}`,
    getHtml: async (response) => await response.text(),
  },
  {
    name: "codetabs",
    buildUrl: (url) =>
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    getHtml: async (response) => await response.text(),
  },
  {
    name: "thingproxy",
    buildUrl: (url) => `https://thingproxy.freeboard.io/fetch/${url}`,
    getHtml: async (response) => await response.text(),
  },
  {
    name: "whateverorigin",
    buildUrl: (url) =>
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    getHtml: async (response) => await response.text(),
  },
];

// Patrones de respuesta que indican acceso denegado por el servidor destino.
// Si el HTML coincide, se descarta y se prueba el siguiente proxy.
const PATRONES_ACCESO_DENEGADO = [
  /access to this resource on the server is denied/i,
  /403 forbidden/i,
  /access denied/i,
  /cloudflare.*please wait/i,
  /just a moment/i, // Cloudflare challenge
  /enable javascript and cookies/i,
];

function esRespuestaValida(html) {
  if (!html || html.length < 100) return false;
  return !PATRONES_ACCESO_DENEGADO.some((re) => re.test(html));
}

// ── Fetch con fallback entre proxies ─────────────────────────────────────────
async function fetchConProxy(url) {
  for (const proxy of PROXIES) {
    try {
      const proxyUrl = proxy.buildUrl(url);
      const response = await fetch(proxyUrl, {
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) {
        console.warn(
          `[${proxy.name}] HTTP ${response.status}, probando siguiente…`,
        );
        continue;
      }
      const html = await proxy.getHtml(response);
      if (esRespuestaValida(html)) return html;
      console.warn(
        `[${proxy.name}] Respuesta bloqueada o vacía, probando siguiente…`,
      );
    } catch (e) {
      const esSsl =
        e instanceof TypeError &&
        (e.message.includes("ERR_CERT") ||
          e.message.includes("Failed to fetch") ||
          e.message.includes("SSL") ||
          e.message.includes("certificate"));
      console.warn(
        `[${proxy.name}] ${esSsl ? "Error SSL/red" : "Falló"}, probando siguiente…`,
        e.message,
      );
    }
  }
  throw new Error("Todos los proxies fallaron para: " + url);
}

// ── Jina AI Reader — renderiza con navegador real, bypassa Cloudflare ─────────
// Devuelve el texto limpio de la página o null si falla.
async function fetchConJina(url) {
  try {
    const jinaUrl = `https://r.jina.ai/${url}`;
    const response = await fetch(jinaUrl, {
      signal: AbortSignal.timeout(25000),
      headers: {
        Accept: "text/plain",
        "X-Return-Format": "text",
      },
    });
    if (!response.ok) {
      console.warn(`[jina] HTTP ${response.status}`);
      return null;
    }
    const text = await response.text();
    if (!text || text.length < 100) return null;
    // Descartar si Jina mismo reportó un error
    if (
      /error fetching|unable to access|failed to (retrieve|fetch)/i.test(text)
    ) {
      console.warn("[jina] Respuesta de error:", text.substring(0, 200));
      return null;
    }
    return text;
  } catch (e) {
    console.warn("[jina] Falló:", e.message);
    return null;
  }
}

// ── Jina en formato markdown — preserva los enlaces de navegación ────────────
// A diferencia de fetchConJina (que usa text plano), devuelve markdown con
// enlaces en formato [texto](url), necesario para detectar "Siguiente".
async function fetchJinaLinks(url) {
  try {
    const jinaUrl = `https://r.jina.ai/${url}`;
    const response = await fetch(jinaUrl, {
      signal: AbortSignal.timeout(15000),
      headers: { Accept: "text/plain" }, // sin X-Return-Format → markdown con links
    });
    if (!response.ok) return null;
    const text = await response.text();
    return text && text.length > 50 ? text : null;
  } catch (e) {
    console.warn("[jina-links] Falló:", e.message);
    return null;
  }
}

// ── Extracción de texto de un documento ya parseado ──────────────────────────
function extraerTextoDePagina(doc, etiqueta, clase, selector) {
  try {
    if (etiqueta) {
      const elementos = doc.querySelectorAll(etiqueta);
      if (elementos.length === 0) return null;
      return Array.from(elementos)
        .map((el) => (el.textContent || "").replace(/\s+/g, " ").trim())
        .filter((t) => t.length > 0)
        .join("\n\n");
    }

    if (clase) {
      // Escapar caracteres especiales en el nombre de clase
      const claseEscapada = CSS.escape(clase);
      const elementos = doc.querySelectorAll(`.${claseEscapada}`);
      if (elementos.length === 0) return null;
      return Array.from(elementos)
        .map((el) => (el.textContent || "").replace(/\s+/g, " ").trim())
        .filter((t) => t.length > 0)
        .join("\n\n");
    }

    if (selector) {
      const elemento = doc.querySelector(selector);
      if (!elemento) return null;
      return (elemento.textContent || "").replace(/\s+/g, " ").trim();
    }

    // Sin filtros: todo el body
    return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
  } catch (e) {
    console.warn("Error aplicando filtro:", e);
    return null;
  }
}

// ── Normalizar entrada del campo de paginación ───────────────────────────────
// Convierte una clase CSS simple (sin punto ni espacios) en selector válido.
// Si ya parece un selector CSS lo devuelve tal cual.
function normalizarSelectorPaginacion(valor) {
  if (!valor) return "";
  const v = valor.trim();
  // Si ya empieza por . # [ o contiene espacios/> es un selector completo
  if (/^[.#\[\*]/.test(v) || /[\s>+~]/.test(v)) return v;
  // Si no contiene ningún carácter especial de selector, tratar como clase CSS
  if (/^[a-zA-Z0-9_-]+$/.test(v)) return `.${CSS.escape(v)}`;
  // En cualquier otro caso devolverlo sin modificar
  return v;
}

// ── Detección del enlace "Siguiente página" ───────────────────────────────────
function encontrarSiguientePagina(doc, urlActual, selectorPersonalizado) {
  // Si el usuario especificó un selector o clase, usarlo exclusivamente
  if (selectorPersonalizado) {
    // Soporte para búsqueda por texto: "text:Siguiente"
    if (/^text:/i.test(selectorPersonalizado)) {
      const busqueda = selectorPersonalizado.slice(5).trim().toLowerCase();
      const enlaces = Array.from(doc.querySelectorAll("a"));
      for (const link of enlaces) {
        const textoEnlace = (link.textContent || "").trim().toLowerCase();
        if (textoEnlace.includes(busqueda)) {
          const href = link.getAttribute("href");
          if (href && !href.startsWith("#")) {
            const resolved = resolverUrl(href, urlActual);
            if (resolved && resolved !== urlActual) return resolved;
          }
        }
      }
      return null;
    }

    const selector = normalizarSelectorPaginacion(selectorPersonalizado);
    try {
      const elementos = Array.from(doc.querySelectorAll(selector));
      // Si hay varios (ej: "Anterior" y "Siguiente"), preferir el que diga next/siguiente
      let el = elementos.find((e) =>
        /siguiente|next/i.test((e.textContent || "").trim()),
      );
      // Si ninguno tiene texto de "siguiente", tomar el último (suele ser el de avanzar)
      if (!el) el = elementos[elementos.length - 1];
      if (el) {
        const href =
          el.tagName === "A"
            ? el.getAttribute("href")
            : el.querySelector("a")?.getAttribute("href");
        if (href) return resolverUrl(href, urlActual);
      }
    } catch (e) {
      console.warn("Selector/clase personalizado inválido:", e);
    }
    return null; // No continuar si no se encontró con el valor indicado
  }

  // Selectores estándar de paginación (orden de prioridad)
  const selectoresEstandar = [
    'a[rel="next"]',
    "link[rel='next']",
    // Patrón devilnovels.com y sitios similares con nav de capítulos
    ".dv-chapter-nav a.dv-nav-btn:last-child",
    "[class*='chapter-nav'] a:last-child",
    "[class*='chapter-nav'] a[class*='next']",
    "a.next",
    ".next > a",
    ".next-page > a",
    ".pagination .next a",
    ".pagination a.next",
    ".pager .next a",
    'nav[aria-label*="pagination" i] a[aria-label*="next" i]',
    'a[aria-label*="next" i]',
    'a[aria-label*="siguiente" i]',
    '[class*="pagination"] a[class*="next"]',
    '[class*="next-page"] a',
  ];

  for (const sel of selectoresEstandar) {
    try {
      const el = doc.querySelector(sel);
      if (el) {
        const href = el.getAttribute("href");
        if (href && !href.startsWith("#")) {
          const resolved = resolverUrl(href, urlActual);
          if (resolved && resolved !== urlActual) return resolved;
        }
      }
    } catch (_) {}
  }

  // Búsqueda por texto del enlace como último recurso
  // Se limpian símbolos decorativos (›, », →, etc.) antes de comparar
  // para cubrir casos como "Siguiente ›" o "Next »"
  const textosNext = [
    "siguiente",
    "next",
    "›",
    "»",
    "→",
    "▶",
    "próxima",
    "próximo",
    ">",
  ];
  const enlaces = Array.from(doc.querySelectorAll("a"));
  for (const link of enlaces) {
    const textoRaw = (link.textContent || "").trim().toLowerCase();
    // Quitar símbolos decorativos y espacios extra para comparar
    const texto = textoRaw.replace(/[\s‹›«»→←▶◀<>]+/g, " ").trim();
    if (textosNext.some((t) => texto === t || textoRaw === t)) {
      const href = link.getAttribute("href");
      if (href && !href.startsWith("#")) {
        const resolved = resolverUrl(href, urlActual);
        if (resolved && resolved !== urlActual) return resolved;
      }
    }
  }

  return null;
}

// ── Encontrar siguiente página en el texto markdown que devuelve Jina ─────────
// Jina devuelve los enlaces como [texto](url). Busca el enlace "siguiente/next".
function encontrarSiguienteEnMarkdown(
  markdown,
  urlActual,
  selectorPersonalizado,
) {
  let textosNext = ["siguiente", "next", "próximo", "próxima"];
  // Si el usuario especificó text:Algo, buscarlo primero
  if (selectorPersonalizado && /^text:/i.test(selectorPersonalizado)) {
    const busqueda = selectorPersonalizado.slice(5).trim().toLowerCase();
    if (busqueda) textosNext = [busqueda, ...textosNext];
  }
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(markdown)) !== null) {
    const textoLimpio = match[1]
      .trim()
      .toLowerCase()
      .replace(/[\s‹›«»→←▶◀<>]+/g, " ")
      .trim();
    const href = match[2];
    if (
      href !== urlActual &&
      textosNext.some(
        (t) =>
          textoLimpio === t ||
          textoLimpio.startsWith(t + " ") ||
          textoLimpio.includes(t),
      )
    ) {
      return href;
    }
  }
  return null;
}

// ── Resolver URL relativa a absoluta ─────────────────────────────────────────
function resolverUrl(href, base) {
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

// ── Actualizar barra de progreso ──────────────────────────────────────────────
function actualizarProgreso(paginaActual, total) {
  const fill = document.getElementById("progresoFill");
  const texto = document.getElementById("progresoTexto");
  const pct = total > 0 ? (paginaActual / total) * 100 : 0;
  fill.style.width = `${pct}%`;
  texto.textContent =
    paginaActual === 0
      ? t("progresoIniciando")
      : t("progresoTexto", paginaActual, total);
}

// ── Función principal ─────────────────────────────────────────────────────────
async function extraerTexto() {
  const url = document.getElementById("urlInput").value.trim();
  const etiqueta = document.getElementById("etiquetaInput").value.trim();
  const clase = document.getElementById("claseInput").value.trim();
  const selector = document.getElementById("selectorInput").value.trim();
  const numPaginas = Math.max(
    1,
    Math.min(
      100,
      parseInt(document.getElementById("numPaginasInput").value) || 1,
    ),
  );
  const siguienteSelector = document
    .getElementById("siguienteSelector")
    .value.trim();

  if (!url) {
    alert(t("alertUrlVacia"));
    return;
  }

  try {
    new URL(url);
  } catch {
    alert(t("alertUrlInvalida"));
    return;
  }

  const btnExtraer = document.getElementById("btnExtraer");
  const btnCopiar = document.getElementById("btnCopiar");
  const btnDescargar = document.getElementById("btnDescargar");
  const progresoEl = document.getElementById("progreso");
  const resultadoEl = document.getElementById("resultado");

  // Preparar UI
  btnExtraer.textContent = t("btnExtrayendo");
  btnExtraer.disabled = true;
  btnCopiar.disabled = true;
  btnDescargar.disabled = true;
  progresoEl.classList.remove("hidden");
  resultadoEl.value = "";
  actualizarProgreso(0, numPaginas);

  const bloques = [];
  let urlActual = url;

  try {
    for (let pagina = 1; pagina <= numPaginas; pagina++) {
      actualizarProgreso(pagina, numPaginas);

      let textoJina = null;
      let doc = null;
      let texto = "";
      const hayFiltro = etiqueta || clase || selector;

      if (hayFiltro) {
        // Con filtro: proxy HTML → extracción filtrada
        try {
          const html = await fetchConProxy(urlActual);
          const parser = new DOMParser();
          doc = parser.parseFromString(html, "text/html");
          texto = extraerTextoDePagina(doc, etiqueta, clase, selector) || "";
          if (texto)
            console.info(`[proxy] Página ${pagina} obtenida con filtro.`);
        } catch (e) {
          console.warn("[proxy] Falló, intentando Jina…", e.message);
        }
        // Fallback: Jina (sin filtro CSS, incluye nav — último recurso)
        if (!texto) {
          textoJina = await fetchConJina(urlActual);
          if (textoJina) {
            texto = textoJina;
            console.info(`[jina] Página ${pagina} obtenida (sin filtro CSS).`);
          }
        }
        if (!texto) {
          alert(t("alertProxyFallo", pagina));
          break;
        }
      } else {
        // Sin filtro: Jina primero
        textoJina = await fetchConJina(urlActual);
        if (textoJina) {
          texto = textoJina;
          console.info(`[jina] Página ${pagina} obtenida correctamente.`);
        } else {
          // ── Proxies CORS + parseo HTML ──
          console.info(`[jina] Falló, intentando proxies CORS...`);
          try {
            const html = await fetchConProxy(urlActual);
            const parser = new DOMParser();
            doc = parser.parseFromString(html, "text/html");
            texto = extraerTextoDePagina(doc, etiqueta, clase, selector) || "";
          } catch (err) {
            alert(t("alertProxyFalloDetalle", pagina, err.message));
            break;
          }
        }
      }

      if (texto && texto.length > 0) {
        bloques.push(texto);
      } else {
        const tipoFiltro = etiqueta
          ? `${t("tipoEtiqueta")} <${etiqueta}>`
          : clase
            ? `${t("tipoClase")} .${clase}`
            : selector
              ? `${t("tipoSelector")} "${selector}"`
              : "<body>";
        bloques.push(t("errorFiltro", pagina, tipoFiltro, urlActual));
      }

      // Actualizar textarea en tiempo real
      resultadoEl.value = bloques.join("\n\n");

      // Buscar enlace a la siguiente página (si quedan páginas)
      if (pagina < numPaginas) {
        let nextUrl = null;

        if (textoJina) {
          // Jina devuelve texto plano (sin enlaces), no sirve para buscar links.
          // Estrategia 1: obtener el HTML vía proxy para detectar la navegación.
          try {
            const htmlPag = await fetchConProxy(urlActual);
            const docPag = new DOMParser().parseFromString(
              htmlPag,
              "text/html",
            );
            nextUrl = encontrarSiguientePagina(
              docPag,
              urlActual,
              siguienteSelector,
            );
            if (nextUrl)
              console.info(`[paginación] Siguiente via HTML proxy: ${nextUrl}`);
          } catch (e) {
            console.warn("[paginación] Proxy falló:", e.message);
          }
          // Estrategia 2: pedir a Jina el markdown (preserva enlaces) si el proxy falló.
          if (!nextUrl) {
            const markdownLinks = await fetchJinaLinks(urlActual);
            if (markdownLinks) {
              nextUrl = encontrarSiguienteEnMarkdown(
                markdownLinks,
                urlActual,
                siguienteSelector,
              );
              if (nextUrl)
                console.info(
                  `[paginación] Siguiente via Jina markdown: ${nextUrl}`,
                );
            }
          }
        }

        // Si el contenido llegó vía proxy HTML (doc != null), buscar directamente.
        if (!nextUrl && doc) {
          nextUrl = encontrarSiguientePagina(doc, urlActual, siguienteSelector);
        }
        if (!nextUrl) {
          alert(t("alertSiguienteNoEncontrado", pagina));
          break;
        }
        urlActual = nextUrl;
      }
    }

    // Habilitar acciones si hay resultado
    if (resultadoEl.value.trim()) {
      btnCopiar.disabled = false;
      btnDescargar.disabled = false;
    }
  } finally {
    btnExtraer.textContent = t("btnExtraer");
    btnExtraer.disabled = false;
    actualizarProgreso(numPaginas, numPaginas);
  }
}

// ── Copiar al portapapeles ────────────────────────────────────────────────────
async function copiarTexto() {
  const texto = document.getElementById("resultado").value;
  if (!texto) return;

  try {
    await navigator.clipboard.writeText(texto);
    const btn = document.getElementById("btnCopiar");
    btn.textContent = t("btnCopiado");
    btn.classList.add("copiado");
    setTimeout(() => {
      btn.textContent = t("btnCopiar");
      btn.classList.remove("copiado");
    }, 2000);
  } catch {
    alert(t("alertCopiarFallo"));
  }
}

// ── Descargar como .txt ───────────────────────────────────────────────────────
function descargarTexto() {
  const texto = document.getElementById("resultado").value;
  if (!texto) {
    alert(t("alertDescargaSinTexto"));
    return;
  }
  const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "texto_extraido.txt";
  a.click();
  URL.revokeObjectURL(a.href);
}
