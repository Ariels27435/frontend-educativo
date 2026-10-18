import { useEffect, useState } from 'react';
import { obtenerEstudiantes, obtenerProgresos } from '../services/api';

function ReporteDocente() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [progresos, setProgresos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    obtenerEstudiantes().then(setEstudiantes).catch(() => setEstudiantes([]));
  }, [version]);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    obtenerProgresos(filtro)
      .then((datos) => {
        if (!activo) return;
        setProgresos(datos);
        setError('');
      })
      .catch((err) => {
        if (activo) setError(err.message);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [filtro, version]);

  const total = progresos.length;
  const promedio = total
    ? Math.round(progresos.reduce((suma, p) => suma + p.puntuacion, 0) / total)
    : 0;

  return (
    <section className="panel">
      <h2>Reporte de progreso</h2>

      <div className="barra-filtro">
        <label htmlFor="filtro-estudiante">Estudiante</label>
        <select
          id="filtro-estudiante"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        >
          <option value="">Todos los estudiantes</option>
          {estudiantes.map((estudiante) => (
            <option key={estudiante.id_estudiante} value={estudiante.id_estudiante}>
              {estudiante.nombre} ({estudiante.edad} años)
            </option>
          ))}
        </select>
        <button className="boton-secundario" onClick={() => setVersion((v) => v + 1)}>
          Actualizar
        </button>
      </div>

      <div className="resumen">
        <div><strong>{total}</strong><span>Partidas</span></div>
        <div><strong>{promedio}</strong><span>Promedio</span></div>
      </div>

      {error && <p className="mensaje mal">{error}</p>}
      {cargando && <p className="estado">Cargando...</p>}

      <div className="contenedor-tabla">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Estudiante</th>
              <th>Edad</th>
              <th>Actividad</th>
              <th>Puntaje</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {progresos.length > 0 ? (
              progresos.map((p) => (
                <tr key={p.id_progreso}>
                  <td>{p.id_progreso}</td>
                  <td>{p.estudiante}</td>
                  <td>{p.edad}</td>
                  <td>{p.actividad}</td>
                  <td>{p.puntuacion} pts</td>
                  <td>{new Date(p.fecha_jugado).toLocaleString('es-GT')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="vacio">No hay registros de progreso</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ReporteDocente;
