function Encabezado({ vista, onCambiar }) {
  const clase = (nombre) => (vista === nombre ? 'boton-nav activo' : 'boton-nav');

  return (
    <header className="encabezado">
      <div className="titulo-app">
        <span className="logo" aria-hidden="true">
          <i className="logo-circulo" />
          <i className="logo-cuadrado" />
          <i className="logo-triangulo" />
        </span>
        <h1>Plataforma Educativa Infantil</h1>
      </div>
      <nav className="navegacion">
        <button className={clase('juegos')} onClick={() => onCambiar('juegos')}>
          Zona de Juegos
        </button>
        <button className={clase('reporte')} onClick={() => onCambiar('reporte')}>
          Reporte Docente
        </button>
      </nav>
    </header>
  );
}

export default Encabezado;
