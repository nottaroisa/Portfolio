// Motor de los modelos 3D en ASCII. Se carga solo cuando un modelo llega a la
// vista (import dinámico desde Modelo3DAscii), con three.js dentro.
//
// Un único WebGLRenderer, fuera de la página, pinta cada modelo en una imagen
// diminuta (dos píxeles por carácter en cada eje) con una luz blanca sobre fondo
// negro; la luminosidad de cada celda elige su carácter, como en el campo de la
// portada. Así el modelo se imprime con la tinta del tema, sin colores propios.
import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const RAMPA = " .·:;-=+*#%@";
// Proporción de una celda de Space Mono: 0,612 de ancho por 1 de alto (con interlineado 1).
const CELDA = 0.612;
const SUPERMUESTREO = 2;

let renderer: THREE.WebGLRenderer | null = null;
let cargador: GLTFLoader | null = null;

function motor() {
  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: false });
    renderer.setPixelRatio(1);
    const draco = new DRACOLoader().setDecoderPath("/draco/");
    cargador = new GLTFLoader().setDRACOLoader(draco);
  }
  return { renderer, cargador: cargador! };
}

export type Escena = {
  dibujar: (giro: number, inclinacion: number) => string;
  liberar: () => void;
};

// Prepara la escena de uno o varios modelos (colocados de izquierda a derecha y
// de atrás adelante en el orden dado) para una rejilla de `columnas` × `filas`.
export async function crearEscena(modelos: string[], columnas: number, filas: number): Promise<Escena> {
  const { renderer, cargador } = motor();
  const escena = new THREE.Scene();
  const grupo = new THREE.Group();
  escena.add(grupo);

  // Material gris claro con luz principal y un relleno suave: las caras se
  // distinguen por su sombreado, que es lo que se ve con caracteres.
  const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
  escena.add(new THREE.AmbientLight(0xffffff, 0.25));
  const luz = new THREE.DirectionalLight(0xffffff, 1.7);
  luz.position.set(2, 3, 4);
  escena.add(luz);
  const relleno = new THREE.DirectionalLight(0xffffff, 0.45);
  relleno.position.set(-3, 1, -2);
  escena.add(relleno);

  const gltfs = await Promise.all(modelos.map((m) => cargador.loadAsync(`/modelos/${m}.glb`)));
  gltfs.forEach((gltf, i) => {
    const objeto = gltf.scene;
    objeto.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).material = material;
    });
    // El segundo modelo (el teclado delante del monitor) va delante y abajo.
    if (i > 0) {
      const anterior = new THREE.Box3().setFromObject(grupo);
      const propio = new THREE.Box3().setFromObject(objeto);
      objeto.position.set(
        (anterior.min.x + anterior.max.x) / 2 - (propio.min.x + propio.max.x) / 2,
        anterior.min.y - propio.min.y,
        anterior.max.z - propio.min.z + (anterior.max.z - anterior.min.z) * 0.15,
      );
    }
    grupo.add(objeto);
  });

  // Centrado en el eje de giro.
  grupo.updateMatrixWorld(true);
  const caja = new THREE.Box3().setFromObject(grupo);
  const centro = caja.getCenter(new THREE.Vector3());
  const tamano = caja.getSize(new THREE.Vector3());
  grupo.children.forEach((c) => c.position.sub(centro));
  const pivote = new THREE.Group();
  pivote.add(grupo);
  escena.add(pivote);

  const ancho = columnas * SUPERMUESTREO;
  const alto = filas * SUPERMUESTREO;
  // Cada píxel de la imagen es medio carácter, que no es cuadrado: la cámara
  // compensa la proporción para que el modelo no salga estirado.
  const proporcion = (columnas * CELDA) / filas;
  const vertical = THREE.MathUtils.degToRad(30);
  const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * proporcion);
  // Encuadre ajustado al girar: a lo ancho cabe el círculo que barre el
  // modelo (su radio en planta) y a lo alto, su altura vista desde un poco arriba.
  const enPlanta = Math.hypot(tamano.x, tamano.z) / 2;
  const mitadAlta = (tamano.y / 2) * 0.95 + enPlanta * 0.3;
  const distancia = enPlanta + Math.max(enPlanta / Math.tan(horizontal / 2), mitadAlta / Math.tan(vertical / 2));
  const camara = new THREE.PerspectiveCamera(30, proporcion, distancia * 0.05, distancia * 4);
  camara.position.set(0, distancia * 0.28, distancia);
  camara.lookAt(0, 0, 0);

  const destino = new THREE.WebGLRenderTarget(ancho, alto);
  const pixeles = new Uint8Array(ancho * alto * 4);

  return {
    dibujar(giro, inclinacion) {
      pivote.rotation.set(inclinacion, giro, 0);
      renderer.setRenderTarget(destino);
      renderer.setClearColor(0x000000, 1);
      renderer.clear();
      renderer.render(escena, camara);
      renderer.readRenderTargetPixels(destino, 0, 0, ancho, alto, pixeles);
      renderer.setRenderTarget(null);

      const lineas: string[] = [];
      // readPixels empieza por abajo: se recorre de la última fila a la primera.
      for (let f = filas - 1; f >= 0; f--) {
        let linea = "";
        for (let c = 0; c < columnas; c++) {
          let suma = 0;
          for (let j = 0; j < SUPERMUESTREO; j++) {
            for (let i = 0; i < SUPERMUESTREO; i++) {
              const p = ((f * SUPERMUESTREO + j) * ancho + c * SUPERMUESTREO + i) * 4;
              suma += pixeles[p] * 0.2126 + pixeles[p + 1] * 0.7152 + pixeles[p + 2] * 0.0722;
            }
          }
          const luz = suma / (SUPERMUESTREO * SUPERMUESTREO * 255);
          linea += RAMPA[Math.min(RAMPA.length - 1, Math.round(Math.pow(luz, 0.85) * (RAMPA.length - 1)))];
        }
        lineas.push(linea.trimEnd());
      }
      return lineas.join("\n");
    },
    liberar() {
      destino.dispose();
    },
  };
}
