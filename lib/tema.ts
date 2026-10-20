// Tema claro (impresión) u oscuro (cianotipia). Sin elección guardada, la web
// entra en oscuro; la elección se guarda en localStorage.
export type Tema = "claro" | "oscuro";

// Color de la barra del navegador del móvil en cada tema: el fondo de la página.
export const colorBarra: Record<Tema, string> = { claro: "#f4f4f0", oscuro: "#0d1347" };
const metaBarra = 'meta[name="theme-color"]';

export function temaActual(): Tema {
  return document.documentElement.dataset.tema === "claro" ? "claro" : "oscuro";
}

export function fijarTema(tema: Tema) {
  document.documentElement.dataset.tema = tema;
  document.querySelector(metaBarra)?.setAttribute("content", colorBarra[tema]);
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
// También crea la meta de la barra del navegador con el color del tema: si la
// pusiera Next, React la duplicaría al hidratar cuando el color no coincide.
export const scriptTema = `(function(){var t=null;try{t=localStorage.getItem("tema")}catch(e){}if(t==="claro"||t==="oscuro")document.documentElement.dataset.tema=t;var m=document.createElement("meta");m.name="theme-color";m.content=t==="claro"?"${colorBarra.claro}":"${colorBarra.oscuro}";document.head.appendChild(m)})()`;
