import { normalizar } from '../juegos/utilidades';

const NIVELES = { pre_primario: 'Pre-primario', primario: 'Primario' };

function ListaActividades({ actividades, seleccionada, onSeleccionar }) {
  return (
    <section>
      <h2 className="subtitulo">Elige una actividad</h2>
      <div className="rejilla-actividades">
        {actividades.map((actividad) => {
          const activa = seleccionada?.id_actividad === actividad.id_actividad;
          return (
            <button
              key={actividad.id_actividad}
              className={`tarjeta-actividad cat-${normalizar(actividad.categoria)}${activa ? ' activa' : ''}`}
              onClick={() => onSeleccionar(actividad)}
            >
              <span className="etiqueta">{NIVELES[actividad.nivel] || actividad.nivel}</span>
              <strong>{actividad.titulo}</strong>
              <span className="categoria">{actividad.categoria}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default ListaActividades;
