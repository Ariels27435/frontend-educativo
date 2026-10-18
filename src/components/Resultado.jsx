import { useCallback, useEffect, useRef, useState } from 'react';
import { registrarProgreso } from '../services/api';

function Resultado({ puntaje, estudiante, actividad, onReiniciar }) {
  const [estado, setEstado] = useState('guardando');
  const enviado = useRef(false);

  const guardar = useCallback(async () => {
    setEstado('guardando');
    try {
      await registrarProgreso({
        id_estudiante: estudiante.id_estudiante,
        id_actividad: actividad.id_actividad,
        puntuacion: puntaje
      });
      setEstado('guardado');
    } catch {
      setEstado('error');
    }
  }, [estudiante, actividad, puntaje]);

  useEffect(() => {
    if (enviado.current) return;
    enviado.current = true;
    guardar();
  }, [guardar]);

  const estrellas = puntaje >= 80 ? 3 : puntaje >= 50 ? 2 : 1;
  const mensaje =
    puntaje >= 80 ? 'Excelente trabajo' : puntaje >= 50 ? 'Muy bien' : 'Sigue practicando';

  return (
    <div className="resultado">
      <div className="estrellas">
        {[0, 1, 2].map((i) => (
          <svg key={i} viewBox="-25 -25 50 50" width="64" height="64">
            <polygon
              points="0,-22 6,-8 22,-7 10,3 14,19 0,11 -14,19 -10,3 -22,-7 -6,-8"
              fill={i < estrellas ? '#fbbf24' : '#e5e7eb'}
            />
          </svg>
        ))}
      </div>
      <h3>{mensaje}</h3>
      <p className="puntaje-final">{puntaje} puntos</p>
      {estado === 'guardando' && <p className="estado">Guardando tu resultado...</p>}
      {estado === 'guardado' && <p className="estado ok">Resultado guardado</p>}
      {estado === 'error' && (
        <div className="estado mal">
          <p>No se pudo guardar el resultado</p>
          <button className="boton-secundario" onClick={guardar}>Reintentar</button>
        </div>
      )}
      <button className="boton-principal" onClick={onReiniciar}>Jugar de nuevo</button>
    </div>
  );
}

export default Resultado;
