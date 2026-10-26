// Motor de los modelos 3D. Se carga solo cuando un modelo llega a la vista
// (import dinámico desde Modelo3D), con three.js dentro.
//
// Un único WebGLRenderer, fuera de la página, pinta cada modelo y la imagen se
// copia en el canvas de su sección. El modelo pierde sus colores y se tiñe con
// la tinta azul del tema, como una capa de fusión «Color»: las sombras van en
// un azul hondo y las luces en el azul de la tinta.
import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

let renderer: THREE.WebGLRenderer | null = null;
let cargador: GLTFLoader | null = null;

function motor() {
  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    const draco = new DRACOLoader().setDecoderPath("/draco/");
    cargador = new GLTFLoader().setDRACOLoader(draco);
  }
  return { renderer, cargador: cargador! };
}

export type Escena = {
  // Pinta el modelo girado en el canvas, teñido con `tinta` (un color CSS).
  dibujar: (lienzo: HTMLCanvasElement, giro: number, inclinacion: number, tinta: string) => void;
  liberar: () => void;
};

// Prepara la escena de uno o varios modelos (el primero detrás, el resto delante).
export async function crearEscena(modelos: string[]): Promise<Escena> {
  const { renderer, cargador } = motor();
  const escena = new THREE.Scene();
  const grupo = new THREE.Group();

  // Un solo material para todo: el color de la luz es la tinta y el emisivo, la
  // misma tinta más oscura, así ninguna cara se pierde en el fondo.
  const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
  escena.add(new THREE.AmbientLight(0xffffff, 0.35));
  const luz = new THREE.DirectionalLight(0xffffff, 0.8);
  luz.position.set(2, 3, 4);
  escena.add(luz);
  const relleno = new THREE.DirectionalLight(0xffffff, 0.25);
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
      grupo.updateMatrixWorld(true);
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

  const camara = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
  const tinta = new THREE.Color();
  let ultimaTinta = "";

  return {
    dibujar(lienzo, giro, inclinacion, color) {
      const ancho = lienzo.width;
      const alto = lienzo.height;
      if (color !== ultimaTinta) {
        ultimaTinta = color;
        tinta.setStyle(color);
        // Con toda la luz sumada, las caras más iluminadas quedan en la tinta sin quemarse a blanco.
        material.color.copy(tinta).multiplyScalar(0.68);
        material.emissive.copy(tinta).multiplyScalar(0.28);
      }

      // Encuadre ajustado al girar: a lo ancho cabe el círculo que barre el
      // modelo (su radio en planta) y a lo alto, su altura vista desde un poco arriba.
      const proporcion = ancho / alto;
      const vertical = THREE.MathUtils.degToRad(30);
      const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * proporcion);
      const enPlanta = Math.hypot(tamano.x, tamano.z) / 2;
      const mitadAlta = (tamano.y / 2) * 0.95 + enPlanta * 0.3;
      const distancia = enPlanta + Math.max(enPlanta / Math.tan(horizontal / 2), mitadAlta / Math.tan(vertical / 2));
      camara.aspect = proporcion;
      camara.near = distancia * 0.05;
      camara.far = distancia * 4;
      camara.position.set(0, distancia * 0.28, distancia);
      camara.lookAt(0, 0, 0);
      camara.updateProjectionMatrix();

      pivote.rotation.set(inclinacion, giro, 0);
      renderer.setSize(ancho, alto, false);
      renderer.render(escena, camara);

      const ctx = lienzo.getContext("2d")!;
      ctx.clearRect(0, 0, ancho, alto);
      ctx.drawImage(renderer.domElement, 0, 0);
    },
    liberar() {},
  };
}
