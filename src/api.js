const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getActividades = async () => {
  const res = await fetch(`${API_URL}/api/actividades`);
  return res.json();
};

export const getEstudiantes = async () => {
  const res = await fetch(`${API_URL}/api/estudiantes`);
  return res.json();
};

export const registrarProgreso = async (datos) => {
  const res = await fetch(`${API_URL}/api/progresos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  return res.json();
};

export const getProgresos = async () => {
  const res = await fetch(`${API_URL}/api/progresos`);
  return res.json();
};