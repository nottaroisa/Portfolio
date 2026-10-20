import { enlaces } from "./data";

// Correo ya preparado para quien quiera contratarme: el asunto y el saludo
// vienen puestos y solo falta redactarlo.
const asunto = "¡Pongámonos en contacto!";
const cuerpo = "Hola, Isabella:\n\nHe visto tu portfolio y me gustaría hablar contigo sobre \n\nUn saludo,\n";

// Abre el programa de correo del sistema.
export const correoPreparado = `mailto:${enlaces.correo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

// Para quien no tiene programa de correo configurado y usa Gmail en el navegador.
export const gmailPreparado = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(enlaces.correo)}&su=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
