import { useState } from 'react';
import { mezclar } from '../juegos/utilidades';
import Figura from './Figura';
import Resultado from './Resultado';

const PARES = [
  { id: 'circulo', figura: 'circulo', color: '#3b82f6', nombre: 'Círculo' },
  { id: 'cuadrado', figura: 'cuadrado', color: '#f59e0b', nombre: 'Cuadrado' },
  { id: 'triangulo', figura: 'triangulo', color: '#10b981', nombre: 'Triángulo' },
  { id: 'rectangulo', figura: 'rectangulo', color: '#8b5cf6', nombre: 'Rectángulo' },
  { id: 'rojo', figura: 'circulo', color: '#ef4444', nombre: 'Rojo' },
  { id: 'rosado', figura: 'circulo', color: '#ec4899', nombre: 'Rosado' }
];

const crearCartas = () =>
  mezclar(
    PARES.flatMap((par) => [
      { uid: `${par.id}-imagen`, parId: par.id, tipo: 'imagen' },
      { uid: `${par.id}-texto`, parId: par.id, tipo: 'texto' }
    ])
  );

function Memoria({ actividad, estudiante, onReiniciar }) {
  const [cartas] = useState(crearCartas);
  const [volteadas, setVolteadas] = useState([]);
  const [encontradas, setEncontradas] = useState([]);
  const [intentos, setIntentos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const [mensaje, setMensaje] = useState('Encuentra las parejas');

  const terminado = encontradas.length === PARES.length;
  const fallos = intentos - encontradas.length;
  const base = (encontradas.length * 100) / PARES.length;
  const puntaje = Math.max(terminado ? 10 : 0, Math.round(base - fallos * 5));

  const voltear = (carta) => {
    if (bloqueado) return;
    if (volteadas.includes(carta.uid) || encontradas.includes(carta.parId)) return;

    const nuevas = [...volteadas, carta.uid];
    setVolteadas(nuevas);
    if (nuevas.length < 2) return;

    setIntentos((actual) => actual + 1);
    const [a, b] = nuevas.map((uid) => cartas.find((c) => c.uid === uid));
    if (a.parId === b.parId) {
      setEncontradas((actual) => [...actual, a.parId]);
      setVolteadas([]);
      setMensaje('Muy bien, encontraste una pareja');
    } else {
      setBloqueado(true);
      setMensaje('Esas no son pareja, intenta de nuevo');
      setTimeout(() => {
        setVolteadas([]);
        setBloqueado(false);
      }, 900);
    }
  };

  if (terminado) {
    return (
      <Resultado
        puntaje={puntaje}
        estudiante={estudiante}
        actividad={actividad}
        onReiniciar={onReiniciar}
      />
    );
  }

  return (
    <div className="cuestionario">
      <div className="marcador">
        <span>Parejas: {encontradas.length} de {PARES.length}</span>
        <span className="puntaje-vivo">Puntaje: {puntaje}</span>
      </div>
      <p className="instruccion">Une cada figura con su nombre</p>
      <div className="tablero-memoria">
        {cartas.map((carta) => {
          const par = PARES.find((p) => p.id === carta.parId);
          const visible = volteadas.includes(carta.uid) || encontradas.includes(carta.parId);
          const acertada = encontradas.includes(carta.parId);
          return (
            <button
              key={carta.uid}
              className={`carta${visible ? ' visible' : ''}${acertada ? ' acertada' : ''}`}
              onClick={() => voltear(carta)}
            >
              {!visible && <span className="dorso">?</span>}
              {visible && carta.tipo === 'imagen' && (
                <Figura tipo={par.figura} color={par.color} tamano={70} />
              )}
              {visible && carta.tipo === 'texto' && <strong>{par.nombre}</strong>}
            </button>
          );
        })}
      </div>
      <p className="mensaje" role="status">{mensaje}</p>
    </div>
  );
}

export default Memoria;
