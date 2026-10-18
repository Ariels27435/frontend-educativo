import { entero, elegir, mezclar, normalizar } from './utilidades';

const COLORES = ['#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ec4899'];

const CLAVES = {
  'adentro / afuera': 'adentro',
  'arriba / abajo': 'arriba',
  'cerca / lejos': 'cerca',
  'encima / debajo': 'encima',
  'figuras geometricas': 'figuras',
  'juego de memoria': 'memoria',
  'tablas de multiplicar': 'tablas',
  'suma de quebrados': 'quebrados',
  'multiplicacion con decimales': 'decimales'
};

export const claveActividad = (titulo) => CLAVES[normalizar(titulo)] || null;

const ESPACIALES = {
  adentro: {
    valores: ['adentro', 'afuera'],
    texto: '¿La pelota está adentro o afuera de la caja?'
  },
  arriba: {
    valores: ['arriba', 'abajo'],
    texto: '¿La estrella está arriba o abajo de la línea?'
  },
  cerca: {
    valores: ['cerca', 'lejos'],
    texto: '¿El árbol está cerca o lejos de la casa?'
  },
  encima: {
    valores: ['encima', 'debajo'],
    texto: '¿La pelota está encima o debajo de la mesa?'
  }
};

const etiqueta = (valor) => valor.charAt(0).toUpperCase() + valor.slice(1);

const preguntasEspaciales = (clave, total) => {
  const { valores, texto } = ESPACIALES[clave];
  return Array.from({ length: total }, () => {
    const correcta = elegir(valores);
    return {
      texto,
      escena: {
        tipo: clave,
        valor: correcta,
        variante: entero(0, 1),
        color: elegir(COLORES)
      },
      opciones: mezclar(valores).map((valor) => ({ id: valor, texto: etiqueta(valor) })),
      correcta
    };
  });
};

const FIGURAS = [
  { id: 'circulo', nombre: 'Círculo' },
  { id: 'cuadrado', nombre: 'Cuadrado' },
  { id: 'triangulo', nombre: 'Triángulo' },
  { id: 'rectangulo', nombre: 'Rectángulo' }
];

const preguntasFiguras = (total) =>
  Array.from({ length: total }, (_, indice) => {
    const objetivo = elegir(FIGURAS);
    if (indice % 2 === 0) {
      return {
        texto: '¿Qué figura es esta?',
        figura: { tipo: objetivo.id, color: elegir(COLORES) },
        opciones: mezclar(FIGURAS).map((f) => ({ id: f.id, texto: f.nombre })),
        correcta: objetivo.id
      };
    }
    return {
      texto: `Toca el ${objetivo.nombre.toLowerCase()}`,
      opciones: mezclar(FIGURAS).map((f) => ({ id: f.id, figura: f.id, color: elegir(COLORES) })),
      correcta: objetivo.id
    };
  });

const armarOpciones = (correcta, candidatas, relleno) => {
  const distractores = [...new Set(candidatas)].filter((valor) => valor !== correcta);
  let paso = 1;
  while (distractores.length < 3) {
    const extra = relleno(paso++);
    if (extra !== correcta && !distractores.includes(extra)) distractores.push(extra);
  }
  return mezclar([correcta, ...mezclar(distractores).slice(0, 3)]).map((valor) => ({
    id: valor,
    texto: valor
  }));
};

const preguntasTablas = (total, tabla) =>
  Array.from({ length: total }, () => {
    const a = tabla || entero(2, 10);
    const b = entero(1, 10);
    const resultado = a * b;
    const candidatas = [
      a * (b + 1),
      a * (b - 1),
      (a + 1) * b,
      (a - 1) * b,
      resultado + 10,
      resultado - 10,
      resultado + 1
    ]
      .filter((valor) => valor > 0)
      .map(String);
    return {
      texto: '¿Cuál es el resultado?',
      expresion: `${a} × ${b} = ?`,
      opciones: armarOpciones(String(resultado), candidatas, (paso) => String(resultado + paso * 3)),
      correcta: String(resultado)
    };
  });

const mcd = (a, b) => (b === 0 ? a : mcd(b, a % b));

const fraccion = (numerador, denominador) => {
  const divisor = mcd(numerador, denominador);
  const n = numerador / divisor;
  const d = denominador / divisor;
  return d === 1 ? String(n) : `${n}/${d}`;
};

const DENOMINADORES = [
  [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [8, 8],
  [2, 4], [3, 6], [4, 8], [5, 10], [2, 6], [3, 9]
];

const preguntasQuebrados = (total) =>
  Array.from({ length: total }, () => {
    const [d1, d2] = mezclar(elegir(DENOMINADORES));
    const n1 = entero(1, d1 - 1);
    const n2 = entero(1, d2 - 1);
    const numerador = n1 * d2 + n2 * d1;
    const denominador = d1 * d2;
    const correcta = fraccion(numerador, denominador);
    const candidatas = [
      fraccion(n1 + n2, d1 + d2),
      fraccion(n1 + n2, d1),
      fraccion(n1 + n2, d2),
      fraccion(n1 * n2, d1 * d2),
      fraccion(numerador + 1, denominador),
      ...(numerador > 1 ? [fraccion(numerador - 1, denominador)] : [])
    ];
    return {
      texto: 'Resuelve la suma de quebrados',
      expresion: `${n1}/${d1} + ${n2}/${d2} = ?`,
      opciones: armarOpciones(correcta, candidatas, (paso) =>
        fraccion(numerador + paso * 2, denominador + paso)
      ),
      correcta
    };
  });

const formatear = (centesimas) => Number((centesimas / 100).toFixed(2)).toString();

const preguntasDecimales = (total) =>
  Array.from({ length: total }, () => {
    const a = entero(2, 49);
    const segundoDecimal = Math.random() < 0.5;
    const b = segundoDecimal ? entero(2, 9) : entero(2, 9) * 10;
    const producto = a * b;
    const correcta = formatear(producto);
    const candidatas = [
      producto * 10,
      producto + 10,
      producto - 10,
      producto + 100,
      producto - 100,
      ...(producto % 10 === 0 ? [producto / 10] : [])
    ]
      .filter((valor) => valor > 0)
      .map(formatear);
    return {
      texto: 'Multiplica los números decimales',
      expresion: `${a / 10} × ${b / 10} = ?`,
      opciones: armarOpciones(correcta, candidatas, (paso) => formatear(producto + paso * 30)),
      correcta
    };
  });

export const crearPreguntas = (clave, total, opciones = {}) => {
  if (ESPACIALES[clave]) return preguntasEspaciales(clave, total);
  if (clave === 'figuras') return preguntasFiguras(total);
  if (clave === 'tablas') return preguntasTablas(total, opciones.tabla);
  if (clave === 'quebrados') return preguntasQuebrados(total);
  if (clave === 'decimales') return preguntasDecimales(total);
  return [];
};
