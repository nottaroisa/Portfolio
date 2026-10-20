// Tema claro (impresión) u oscuro (cianotipia). Sin elección guardada, la web
// entra en oscuro; la elección se guarda en localStorage.
export type Tema = "claro" | "oscuro";

export function temaActual(): Tema {
  return document.documentElement.dataset.tema === "claro" ? "claro" : "oscuro";
}

export function fijarTema(tema: Tema) {
  document.documentElement.dataset.tema = tema;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", tema === "claro" ? "#f4f4f0" : "#0d1347");
  try {
    localStorage.setItem("tema", tema);
  } catch {
    // Navegación privada o almacenamiento bloqueado: el cambio dura esta visita.
  }
}

// Avisa cuando cambia el tema con el botón.
export function alCambiarTema(avisar: () => void) {
  const observador = new MutationObserver(avisar);
  observador.observe(document.documentElement, { attributes: true, attributeFilter: ["data-tema"] });
  return () => observador.disconnect();
}

// Se ejecuta en el <head> antes de pintar, para que no parpadee el tema equivocado.
export const scriptTema = `(function(){try{var t=localStorage.getItem("tema");if(t==="claro"||t==="oscuro")document.documentElement.dataset.tema=t}catch(e){}})()`;
