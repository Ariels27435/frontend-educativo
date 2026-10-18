function Expresion({ texto, clase = 'expresion' }) {
  return (
    <div className={clase}>
      {texto.split(' ').map((parte, indice) => {
        const termino = parte.split('/');
        if (termino.length === 2) {
          return (
            <span key={indice} className="fraccion">
              <span>{termino[0]}</span>
              <span>{termino[1]}</span>
            </span>
          );
        }
        return <span key={indice}>{parte}</span>;
      })}
    </div>
  );
}

export default Expresion;
