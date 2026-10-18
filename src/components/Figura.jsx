function Figura({ tipo, color = '#3b82f6', tamano = 120 }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 100 100" role="img" aria-label={tipo}>
      {tipo === 'circulo' && <circle cx="50" cy="50" r="40" fill={color} />}
      {tipo === 'cuadrado' && <rect x="12" y="12" width="76" height="76" fill={color} />}
      {tipo === 'triangulo' && <polygon points="50,10 92,88 8,88" fill={color} />}
      {tipo === 'rectangulo' && <rect x="5" y="28" width="90" height="44" fill={color} />}
    </svg>
  );
}

export default Figura;
