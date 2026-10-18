import { useEffect, useRef, useState } from 'react';
import './App.css';
import { obtenerActividades } from './services/api';
import Encabezado from './components/Encabezado';
import RegistroEstudiante from './components/RegistroEstudiante';
import ListaActividades from './components/ListaActividades';
import Juego from './components/Juego';
import ReporteDocente from './components/ReporteDocente';

function App() {
  const [vista, setVista] = useState('juegos');
  const [actividades, setActividades] = useState([]);
  const [actividad, setActividad] = useState(null);
  const [estudiante, setEstudiante] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);
  const zonaJuego = useRef(null);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError('');
    obtenerActividades()
      .then((datos) => {
        if (activo) setActividades(datos);
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
  }, [intento]);

  useEffect(() => {
    if (actividad && zonaJuego.current) {
      zonaJuego.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [actividad]);

  const cambiarEstudiante = () => {
    setEstudiante(null);
    setActividad(null);
  };

  return (
    <div className="app">
      <Encabezado vista={vista} onCambiar={setVista} />

      {vista === 'reporte' ? (
        <ReporteDocente />
      ) : (
        <main>
          {!estudiante ? (
            <RegistroEstudiante onRegistrado={setEstudiante} />
          ) : (
            <>
              <div className="saludo">
                <p>
                  Jugando como <strong>{estudiante.nombre}</strong>, {estudiante.edad} años
                </p>
                <button className="boton-secundario" onClick={cambiarEstudiante}>
                  Cambiar estudiante
                </button>
              </div>

              {cargando && (
                <p className="estado">
                  Cargando actividades. La primera vez puede tardar unos segundos.
                </p>
              )}
              {error && (
                <div className="estado mal">
                  <p>{error}</p>
                  <button className="boton-secundario" onClick={() => setIntento((n) => n + 1)}>
                    Reintentar
                  </button>
                </div>
              )}

              <ListaActividades
                actividades={actividades}
                seleccionada={actividad}
                onSeleccionar={setActividad}
              />

              <div ref={zonaJuego}>
                {actividad && (
                  <Juego
                    key={actividad.id_actividad}
                    actividad={actividad}
                    estudiante={estudiante}
                  />
                )}
              </div>
            </>
          )}
        </main>
      )}
    </div>
  );
}

export default App;
