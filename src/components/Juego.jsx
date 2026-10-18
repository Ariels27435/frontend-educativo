import { useState } from 'react';
import { claveActividad } from '../juegos/generadores';
import Cuestionario from './Cuestionario';
import Memoria from './Memoria';

function Juego({ actividad, estudiante }) {
  const [ronda, setRonda] = useState(0);
  const [tabla, setTabla] = useState(0);
  const clave = claveActividad(actividad.titulo);
  const reiniciar = () => setRonda((actual) => actual + 1);

  if (!clave) {
    return (
      <section className="panel">
        <h2>{actividad.titulo}</h2>
        <p>Esta actividad todavía no está disponible.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>{actividad.titulo}</h2>
      {clave === 'tablas' && (
        <label className="selector-tabla">
          Tabla del
          <select value={tabla} onChange={(e) => setTabla(Number(e.target.value))}>
            <option value={0}>Todas</option>
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((numero) => (
              <option key={numero} value={numero}>{numero}</option>
            ))}
          </select>
        </label>
      )}
      {clave === 'memoria' ? (
        <Memoria
          key={ronda}
          actividad={actividad}
          estudiante={estudiante}
          onReiniciar={reiniciar}
        />
      ) : (
        <Cuestionario
          key={`${ronda}-${tabla}`}
          clave={clave}
          tabla={tabla}
          actividad={actividad}
          estudiante={estudiante}
          onReiniciar={reiniciar}
        />
      )}
    </section>
  );
}

export default Juego;
