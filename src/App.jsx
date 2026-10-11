import React, { useState, useEffect } from 'react';
import { getActividades, registrarProgreso, getProgresos } from './api';
import confetti from 'canvas-confetti';

export default function App() {
  const [actividades, setActividades] = useState([]);
  const [progresos, setProgresos] = useState([]);
  const [actividadActual, setActividadActual] = useState(null);
  const [estudiante, setEstudiante] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [vista, setVista] = useState('juego');

  useEffect(() => {
    cargarActividades();
  }, []);

  const cargarActividades = async () => {
    try {
      const data = await getActividades();
      setActividades(data);
      if (data && data.length > 0) setActividadActual(data[0]);
    } catch (err) {
      console.error("Error al cargar actividades:", err);
    }
  };

  const cargarProgresos = async () => {
    try {
      const data = await getProgresos();
      setProgresos(data);
    } catch (err) {
      console.error("Error al cargar progresos:", err);
    }
  };

  const cambiarVista = (nuevaVista) => {
    setVista(nuevaVista);
    if (nuevaVista === 'reporte') cargarProgresos();
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!estudiante.trim() || !respuesta.trim() || !actividadActual) return;

    const esCorrecto = Math.random() > 0.3;
    const puntaje = esCorrecto ? 100 : 50;

    if (esCorrecto) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setMensaje({ tipo: 'exito', texto: '¡Excelente trabajo! Respuesta correcta 🎉' });
    } else {
      setMensaje({ tipo: 'error', texto: '¡Casi! Inténtalo de nuevo 💪' });
    }

    try {
      await registrarProgreso({
        id_estudiante: 1,
        id_actividad: actividadActual.id_actividad,
        completado: esCorrecto ? 1 : 0,
        puntaje: puntaje
      });

      
      cargarProgresos();
    } catch (err) {
      console.error("Error al guardar progreso:", err);
    }

    setRespuesta('');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>📚 Plataforma Educativa Infantil</h1>
        <nav style={styles.nav}>
          <button 
            style={{...styles.navBtn, backgroundColor: vista === 'juego' ? '#4f46e5' : '#6b7280'}} 
            onClick={() => cambiarVista('juego')}
          >
            🎮 Zona de Juegos
          </button>
          <button 
            style={{...styles.navBtn, backgroundColor: vista === 'reporte' ? '#4f46e5' : '#6b7280'}} 
            onClick={() => cambiarVista('reporte')}
          >
            📊 Reporte Docente
          </button>
        </nav>
      </header>

      {vista === 'juego' ? (
        <main style={styles.main}>
          <div style={styles.card}>
            <h2>Selecciona una Actividad</h2>
            <div style={styles.grid}>
              {actividades.map((act) => (
                <button
                  key={act.id_actividad}
                  style={{
                    ...styles.actividadCard,
                    borderColor: actividadActual?.id_actividad === act.id_actividad ? '#4f46e5' : '#e5e7eb'
                  }}
                  onClick={() => { setActividadActual(act); setMensaje(null); }}
                >
                  <span style={styles.badge}>{act.nivel}</span>
                  <h3>{act.titulo}</h3>
                  <p>{act.categoria}</p>
                </button>
              ))}
            </div>
          </div>

          {actividadActual && (
            <div style={styles.card}>
              <h2>Actividad: {actividadActual.titulo}</h2>
              <form onSubmit={manejarEnvio} style={styles.form}>
                <input
                  type="text"
                  placeholder="Tu Nombre"
                  value={estudiante}
                  onChange={(e) => setEstudiante(e.target.value)}
                  style={styles.input}
                  required
                />
                <input
                  type="text"
                  placeholder="Escribe tu respuesta aquí"
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                  style={styles.input}
                  required
                />
                <button type="submit" style={styles.submitBtn}>
                  Enviar Respuesta
                </button>
              </form>

              {mensaje && (
                <div style={{
                  ...styles.alert,
                  backgroundColor: mensaje.tipo === 'exito' ? '#dcfce7' : '#fee2e2',
                  color: mensaje.tipo === 'exito' ? '#15803d' : '#b91c1c'
                }}>
                  {mensaje.texto}
                </div>
              )}
            </div>
          )}
        </main>
      ) : (
        <main style={styles.main}>
          <div style={styles.card}>
            <h2>📊 Reporte de Progresos (Docentes)</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>ID Progreso</th>
                  <th>ID Estudiante</th>
                  <th>ID Actividad</th>
                  <th>Completado</th>
                  <th>Puntaje</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {progresos.map((p) => (
                  <tr key={p.id_progreso}>
                    <td>{p.id_progreso}</td>
                    <td>{p.id_estudiante}</td>
                    <td>{p.id_actividad}</td>
                    <td>{p.completado ? '✅ Sí' : '❌ No'}</td>
                    <td>{p.puntaje} pts</td>
                    <td>{new Date(p.fecha_completado).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      )}
    </div>
  );
}

const styles = {
  container: { fontFamily: 'system-ui, sans-serif', padding: '20px', maxWidth: '1000px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' },
  nav: { display: 'flex', gap: '10px' },
  navBtn: { padding: '10px 16px', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  main: { display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '10px' },
  actividadCard: { padding: '15px', borderRadius: '8px', border: '2px solid #e5e7eb', backgroundColor: '#f9fafb', cursor: 'pointer', textAlign: 'left' },
  badge: { fontSize: '11px', backgroundColor: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px' },
  submitBtn: { padding: '12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  alert: { marginTop: '15px', padding: '12px', borderRadius: '6px', fontWeight: 'bold', textAlign: 'center' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px' }
};