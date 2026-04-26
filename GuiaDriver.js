// ── Guía interactiva con Driver.js ────────────────────────────────────────────
function iniciarTour() {
  const driver = window.driver.js.driver;
  const steps = t("tour");

  const tour = driver({
    showProgress: true,
    nextBtnText: t("tourNext"),
    prevBtnText: t("tourPrev"),
    doneBtnText: t("tourDone"),
    progressText: t("tourProgress"),
    steps: [
      {
        element: "header",
        popover: { ...steps[0], side: "bottom", align: "start" },
      },
      {
        element: "#card-url",
        popover: { ...steps[1], side: "right", align: "start" },
      },
      {
        element: "#card-filtro",
        popover: { ...steps[2], side: "right", align: "start" },
      },
      {
        element: "#etiquetaInput",
        popover: { ...steps[3], side: "right", align: "start" },
      },
      {
        element: "#claseInput",
        popover: { ...steps[4], side: "right", align: "start" },
      },
      {
        element: "#selectorInput",
        popover: { ...steps[5], side: "right", align: "start" },
      },
      {
        element: "#card-paginacion",
        popover: { ...steps[6], side: "right", align: "start" },
      },
      {
        element: "#numPaginasInput",
        popover: { ...steps[7], side: "right", align: "start" },
      },
      {
        element: "#siguienteSelector",
        popover: { ...steps[8], side: "right", align: "start" },
      },
      {
        element: "#btnExtraer",
        popover: { ...steps[9], side: "top", align: "start" },
      },
      {
        element: "#panel-resultado",
        popover: { ...steps[10], side: "left", align: "start" },
      },
      {
        element: "#btnCopiar",
        popover: { ...steps[11], side: "bottom", align: "start" },
      },
      {
        element: "#btnDescargar",
        popover: { ...steps[12], side: "bottom", align: "start" },
      },
    ],
  });

  tour.drive();
}
