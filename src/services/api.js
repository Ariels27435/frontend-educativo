const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000')
  .replace(/\/+$/, '')
  .replace(/\/api$/, '');
const API = `${BASE}/api`;

const solicitar = async (ruta, opciones) => {
  let respuesta;
  try {
    respuesta = await fetch(`${API}${ruta}`, opciones);
  } catch {
    throw new Error('No se pudo conectar con el servidor');
  }
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    throw new Error(datos.error || 'Error en la solicitud');
  }
  return datos;
};

const enviar = (ruta, cuerpo) =>
  solicitar(ruta, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo)
  });

export const obtenerActividades = () => solicitar('/actividades');

export const obtenerEstudiantes = () => solicitar('/estudiantes');

export const registrarEstudiante = (datos) => enviar('/estudiantes', datos);

export const obtenerProgresos = (idEstudiante) =>
  solicitar(idEstudiante ? `/progresos?id_estudiante=${idEstudiante}` : '/progresos');

export const registrarProgreso = (datos) => enviar('/progresos', datos);
