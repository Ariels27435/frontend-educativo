import { useState } from 'react';
import { crearPreguntas } from '../juegos/generadores';
import Escena from './Escena';
import Figura from './Figura';
import Expresion from './Expresion';
import Resultado from './Resultado';

const TOTAL_PREGUNTAS = 5;

function Cuestionario({ clave, tabla, actividad, estudiante, onReiniciar }) {
  const [preguntas] = useState(() => crearPreguntas(clave, TOTAL_PREGUNTAS, { tabla }));
  const [indice, setIndice] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [elegida, setElegida] = useState(null);

  if (indice >= preguntas.length) {
    return (
      <Resultado
        puntaje={puntaje}
        estudiante={estudiante}
        actividad={actividad}
        onReiniciar={onReiniciar}
      />
    );
  }

  const pregunta = preguntas[indice];
  const respondida = elegida !== null;
  const acierto = respondida && elegida === pregunta.correcta;
  const valorPregunta = Math.round(100 / preguntas.length);

  const responder = (id) => {
    if (respondida) return;
    setElegida(id);
    if (id === pregunta.correcta) setPuntaje((actual) => actual + valorPregunta);
  };

  const siguiente = () => {
    setElegida(null);
    setIndice((actual) => actual + 1);
  };

  const claseOpcion = (id) => {
    let clase = 'opcion';
    if (respondida && id === pregunta.correcta) clase += ' correcta';
    if (respondida && id === elegida && !acierto) clase += ' incorrecta';
    return clase;
  };

  return (
    <div className="cuestionario">
      <div className="marcador">
        <span>Pregunta {indice + 1} de {preguntas.length}</span>
        <span className="puntaje-vivo">Puntaje: {puntaje}</span>
      </div>
      <div className="barra">
        <div className="barra-relleno" style={{ width: `${(indice / preguntas.length) * 100}%` }} />
      </div>

      <h3 className="pregunta">{pregunta.texto}</h3>

      {pregunta.escena && <Escena {...pregunta.escena} />}
      {pregunta.figura && (
        <div className="figura-central">
          <Figura tipo={pregunta.figura.tipo} color={pregunta.figura.color} tamano={150} />
        </div>
      )}
      {pregunta.expresion && <Expresion texto={pregunta.expresion} />}

      <div className="opciones">
        {pregunta.opciones.map((opcion) => (
          <button
            key={opcion.id}
            className={claseOpcion(opcion.id)}
            disabled={respondida}
            onClick={() => responder(opcion.id)}
          >
            {opcion.figura ? (
              <Figura tipo={opcion.figura} color={opcion.color} tamano={80} />
            ) : (
              <Expresion texto={opcion.texto} clase="texto-opcion" />
            )}
          </button>
        ))}
      </div>

      {respondida && (
        <div className="retroalimentacion">
          <p className={acierto ? 'mensaje ok' : 'mensaje mal'} role="status">
            {acierto ? 'Muy bien, respuesta correcta' : 'Casi, la respuesta correcta está resaltada'}
          </p>
          <button className="boton-principal" onClick={siguiente}>
            {indice === preguntas.length - 1 ? 'Ver resultado' : 'Siguiente'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Cuestionario;
