const ESTRELLA = '0,-22 6,-8 22,-7 10,3 14,19 0,11 -14,19 -10,3 -22,-7 -6,-8';

function Adentro({ valor, color }) {
  const x = valor === 'adentro' ? 160 : 45;
  const y = valor === 'adentro' ? 135 : 140;
  return (
    <>
      <rect x="100" y="80" width="120" height="90" rx="6" fill="#fef3c7" stroke="#92400e" strokeWidth="6" />
      <circle cx={x} cy={y} r="22" fill={color} />
    </>
  );
}

function Arriba({ valor, color }) {
  const y = valor === 'arriba' ? 55 : 150;
  return (
    <>
      <line x1="40" y1="105" x2="280" y2="105" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
      <polygon points={ESTRELLA} transform={`translate(160 ${y})`} fill={color} />
    </>
  );
}

function Cerca({ valor, color }) {
  const x = valor === 'cerca' ? 150 : 275;
  return (
    <>
      <rect x="30" y="110" width="70" height="60" fill="#fde68a" />
      <polygon points="20,110 65,70 110,110" fill={color} />
      <rect x="55" y="135" width="20" height="35" fill="#92400e" />
      <g transform={`translate(${x} 0)`}>
        <rect x="-6" y="130" width="12" height="40" fill="#92400e" />
        <circle cx="0" cy="115" r="26" fill="#16a34a" />
      </g>
    </>
  );
}

function Encima({ valor, color }) {
  const y = valor === 'encima' ? 88 : 148;
  return (
    <>
      <rect x="90" y="110" width="140" height="14" fill="#92400e" />
      <rect x="100" y="124" width="10" height="46" fill="#92400e" />
      <rect x="210" y="124" width="10" height="46" fill="#92400e" />
      <circle cx="160" cy={y} r="22" fill={color} />
    </>
  );
}

function Escena({ tipo, valor, variante, color }) {
  const espejo = variante === 1;
  return (
    <svg viewBox="0 0 320 200" className="escena" role="img" aria-label="Ilustración de la pregunta">
      <rect x="0" y="170" width="320" height="30" fill="#bbf7d0" />
      <g transform={espejo ? 'translate(320 0) scale(-1 1)' : undefined}>
        {tipo === 'adentro' && <Adentro valor={valor} color={color} />}
        {tipo === 'arriba' && <Arriba valor={valor} color={color} />}
        {tipo === 'cerca' && <Cerca valor={valor} color={color} />}
        {tipo === 'encima' && <Encima valor={valor} color={color} />}
      </g>
    </svg>
  );
}

export default Escena;
