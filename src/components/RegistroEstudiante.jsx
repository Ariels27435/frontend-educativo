import { useState } from 'react';
import { registrarEstudiante } from '../services/api';

function RegistroEstudiante({ onRegistrado }) {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviar = async (evento) => {
    evento.preventDefault();
    const nombreLimpio = nombre.trim();
    const edadNumero = Number(edad);

    if (nombreLimpio.length < 2) {
      setError('Escribe tu nombre');
      return;
    }
    if (!Number.isInteger(edadNumero) || edadNumero < 3 || edadNumero > 12) {
      setError('La edad debe estar entre 3 y 12 años');
      return;
    }

    setError('');
    setEnviando(true);
    try {
      const estudiante = await registrarEstudiante({ nombre: nombreLimpio, edad: edadNumero });
      onRegistrado(estudiante);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="panel registro">
      <h2>Hola, vamos a jugar</h2>
      <form onSubmit={enviar}>
        <label>
          Tu nombre
          <input
            type="text"
            value={nombre}
            maxLength={100}
            placeholder="Escribe tu nombre"
            onChange={(e) => setNombre(e.target.value)}
          />
        </label>
        <label>
          Tu edad
          <input
            type="number"
            value={edad}
            min={3}
            max={12}
            placeholder="Escribe tu edad"
            onChange={(e) => setEdad(e.target.value)}
          />
        </label>
        {error && <p className="mensaje mal" role="alert">{error}</p>}
        <button type="submit" className="boton-principal" disabled={enviando}>
          {enviando ? 'Entrando...' : 'Comenzar'}
        </button>
      </form>
    </section>
  );
}

export default RegistroEstudiante;
