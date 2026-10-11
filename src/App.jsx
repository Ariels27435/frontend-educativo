import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://backend-educativo.onrender.com/api';

function App() {
  const [actividades, setActividades] = useState([]);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [progresos, setProgresos] = useState([]);
  
  
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [vistaActual, setVistaActual] = useState('juegos'); 

 
  const [filtroEstudiante, setFiltroEstudiante] = useState('');

  
  useEffect(() => {
    fetchActividades();
    fetchProgresos();
  }, []);

  const fetchActividades = async () => {
    try {
      const res = await fetch(`${API_URL}/actividades`);
      const data = await res.json();
      setActividades(data);
      if (data.length > 0) setActividadSeleccionada(data[0]);
    } catch (err) {
      console.error('Error al obtener actividades:', err);
    }
  };

  const fetchProgresos = async (estudianteId = '') => {
    try {
      const url = estudianteId 
        ? `${API_URL}/progresos?id_estudiante=${estudianteId}`
        : `${API_URL}/progresos`;
      const res = await fetch(url);
      const data = await res.json();
      setProgresos(data);
    } catch (err) {
      console.error('Error al obtener progresos:', err);
    }
  };

  
  const handleSubmitRespuesta = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !edad || !respuesta.trim()) {
      setMensaje('⚠️ Por favor completa tu nombre, edad y respuesta.');
      return;
    }

    
    const esCorrecto = respuesta.trim().length > 0;
    const puntajeObtenido = esCorrecto ? 100 : 0;

    try {
      
      let estudianteId = 1; 
      try {
        const resEstudiante = await fetch(`${API_URL}/estudiantes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: nombre.trim(),
            edad: parseInt(edad),
            nivel: actividadSeleccionada?.nivel || 'Pri'
          })
        });
        if (resEstudiante.ok) {
          const dataEst = await resEstudiante.json();
          estudianteId = dataEst.id_estudiante;
        }
      } catch (err) {
        console.warn('Usando estudiante por defecto (ID 1)');
      }

      
      const resProgreso = await fetch(`${API_URL}/progresos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_estudiante: estudianteId,
          id_actividad: actividadSeleccionada.id_actividad,
          puntaje: puntajeObtenido,
          completado: true
        })
      });

      if (resProgreso.ok) {
        setMensaje('🎉 ¡Excelente trabajo! Respuesta registrada con éxito.');
        setRespuesta('');
        fetchProgresos(); 
      } else {
        setMensaje('❌ Error al guardar el progreso.');
      }
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error de conexión con el servidor.');
    }
  };

  
  const progresosFiltrados = progresos.filter((p) => {
    if (!filtroEstudiante) return true;
    const busqueda = filtroEstudiante.toLowerCase();
    return (
      (p.estudiante && p.estudiante.toLowerCase().includes(busqueda)) ||
      (p.id_estudiante && p.id_estudiante.toString() === busqueda)
    );
  });

  return (
    <div className="container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>🎮 Plataforma Educativa Infantil</h1>
        <div>
          <button 
            onClick={() => setVistaActual('juegos')} 
            style={{ padding: '10px 20px', marginRight: '10px', cursor: 'pointer', backgroundColor: vistaActual === 'juegos' ? '#4F46E5' : '#E5E7EB', color: vistaActual === 'juegos' ? '#fff' : '#000', border: 'none', borderRadius: '5px' }}>
            Zone de Juegos
          </button>
          <button 
            onClick={() => setVistaActual('reporte')} 
            style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: vistaActual === 'reporte' ? '#4F46E5' : '#E5E7EB', color: vistaActual === 'reporte' ? '#fff' : '#000', border: 'none', borderRadius: '5px' }}>
             Reporte Docente
          </button>
        </div>
      </header>

      {vistaActual === 'juegos' ? (
        <main>
          <h2>Selecciona una Actividad</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
            {actividades.map((act) => (
              <div 
                key={act.id_actividad}
                onClick={() => { setActividadSeleccionada(act); setMensaje(''); }}
                style={{
                  border: actividadSeleccionada?.id_actividad === act.id_actividad ? '3px solid #4F46E5' : '1px solid #E5E7EB',
                  padding: '15px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                }}>
                <span style={{ fontSize: '12px', background: '#EEF2FF', color: '#4F46E5', padding: '3px 8px', borderRadius: '12px' }}>
                  {act.nivel}
                </span>
                <h3 style={{ margin: '10px 0 5px' }}>{act.titulo}</h3>
                <p style={{ color: '#6B7280', margin: 0, fontSize: '14px' }}>{act.categoria}</p>
              </div>
            ))}
          </div>

          {actividadSeleccionada && (
            <div style={{ background: '#F9FAFB', padding: '25px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
              <h2>Actividad: {actividadSeleccionada.titulo}</h2>
              <form onSubmit={handleSubmitRespuesta}>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <input
                    type="text"
                    placeholder="Tu Nombre (Ej. Juan)"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    style={{ flex: 2, padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                  />
                  <input
                    type="number"
                    placeholder="Edad (Ej. 7)"
                    value={edad}
                    onChange={(e) => setEdad(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <input
                    type="text"
                    placeholder="Escribe tu respuesta aquí..."
                    value={respuesta}
                    onChange={(e) => setRespuesta(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }}
                  />
                </div>
                <button 
                  type="submit" 
                  style={{ width: '100%', padding: '12px', backgroundColor: '#10B981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Enviar Respuesta
                </button>
              </form>
              {mensaje && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{mensaje}</p>}
            </div>
          )}
        </main>
      ) : (
        <section>
          <h2> Reporte de Progresos (Docentes)</h2>
          
          {/* RF-08: Filtrado de Reportes */}
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="filtro" style={{ fontWeight: 'bold' }}>Filtrar por Estudiante (ID o Nombre):</label>
            <input
              id="filtro"
              type="text"
              placeholder="Ej. Juan o ID 1..."
              value={filtroEstudiante}
              onChange={(e) => setFiltroEstudiante(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', width: '250px' }}
            />
            {filtroEstudiante && (
              <button 
                onClick={() => setFiltroEstudiante('')}
                style={{ padding: '8px 12px', backgroundColor: '#EF4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Limpiar Filtro
              </button>
            )}
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ backgroundColor: '#F3F4F6', textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>
                <th style={{ padding: '12px' }}>ID Progreso</th>
                <th style={{ padding: '12px' }}>Estudiante</th>
                <th style={{ padding: '12px' }}>Actividad</th>
                <th style={{ padding: '12px' }}>Puntaje</th>
                <th style={{ padding: '12px' }}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {progresosFiltrados.length > 0 ? (
                progresosFiltrados.map((p) => (
                  <tr key={p.id_progreso} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '12px' }}>{p.id_progreso}</td>
                    <td style={{ padding: '12px' }}>{p.estudiante || `Estudiante #${p.id_estudiante}`}</td>
                    <td style={{ padding: '12px' }}>{p.actividad || `Actividad #${p.id_actividad}`}</td>
                    <td style={{ padding: '12px' }}>{p.puntuacion || p.puntaje || 0} pts</td>
                    <td style={{ padding: '12px' }}>
                      {p.fecha_completado ? new Date(p.fecha_completado).toLocaleDateString() : 'Reciente'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#6B7280' }}>
                    No se encontraron registros de progreso.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

export default App;