// Tema claro (impresión) u oscuro (cianotipia). Sin elección guardada, se
// sigue la preferencia del sistema; la elección se guarda en localStorage.
export type Tema = "claro" | "oscuro";

const consulta = "(prefers-color-scheme: dark)";

export function temaActual(): Tema {
  const elegido = document.documentElement.dataset.tema;
  if (elegido === "claro" || elegido === "oscuro") return elegido;
  return window.matchMedia(consulta).matches ? "oscuro" : "claro";
}

export function fijarTema(tema: Tema) {
  document.documentElement.dataset.tema = tema;
  try {
    localStorage.setItem("tema", tema);
  } catch {
    // Navegación privada o almacenamiento bloqueado: el cambio dura esta visita.
  }
}

// Avisa cuando cambia el tema, por el botón o por el sistema.
export function alCambiarTema(avisar: () => void) {
  const observador = new MutationObserver(avisar);
  observador.observe(document.documentElement, { attributes: true, attributeFilter: ["data-tema"] });
  const mq = window.matchMedia(consulta);
  mq.addEventListener("change", avisar);
  return () => {
    observador.disconnect();
    mq.removeEventListener("change", avisar);
  };
}

// Se ejecuta en el <head> antes de pintar, para que no parpadee el tema equivocado.
export const scriptTema = `(function(){try{var t=localStorage.getItem("tema");if(t==="claro"||t==="oscuro")document.documentElement.dataset.tema=t}catch(e){}})()`;
