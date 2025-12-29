import { MedidasPlayeraHombre } from '../../types/medidas';

const ESCALA = 10; // 1cm = 10px

export const generarTrazoPlayera = (medidas: MedidasPlayeraHombre, estilo: any) => {
  // Convertimos todo a número para evitar errores de texto
  const pecho = Number(medidas.contornoPecho);
  const largo = Number(medidas.largoTotal);
  const anchoEsp = Number(medidas.anchoEspalda);
  const cSisaBase = Number(medidas.CSisa);
  
  // Reglas de Sastrería enviadas:
  const anchoCuartoPecho = (pecho / 4 + 2) * ESCALA; // Holgura de 2cm incluída
  const profundidadSisa = ((pecho / 6) + cSisaBase) * ESCALA;
  const mitadEspalda = (anchoEsp / 2) * ESCALA;
  const anchoCuello = (Number(medidas.contornoCuello) / 6) * ESCALA;

  const piezas = [
    generarFrente(medidas, anchoCuartoPecho, profundidadSisa, mitadEspalda, anchoCuello),
    generarEspalda(medidas, anchoCuartoPecho, profundidadSisa, mitadEspalda, anchoCuello),
    generarManga(medidas, profundidadSisa)
  ];

  return {
    tipoPrenda: 'playera_hombre',
    piezas: piezas,
    totalTela: parseFloat(((largo + Number(medidas.largoManga) + 15) / 100).toFixed(2)),
    dificultad: 'Media',
    instrucciones: [
      "Paso 1: Unir hombros (Frente y Espalda).",
      "Paso 2: Montar mangas coincidiendo el centro con la costura de hombro.",
      "Paso 3: Cerrar costados desde el puño hasta la cadera.",
      "Paso 4: Terminar escote con rib de 2cm."
    ]
  };
};

const generarFrente = (m: MedidasPlayeraHombre, cuartoPecho: number, sisaY: number, mEspalda: number, aCuello: number) => {
  const largoPX = Number(m.largoTotal) * ESCALA;
  const escotePX = Number(m.largoEscote) * ESCALA;
  const caidaHombro = 4 * ESCALA;

  // Dibujo mejorado:
  // Mueve al centro del escote (0, escote)
  // Crea curva hacia el punto lateral del cuello
  // Tira línea al hombro
  // Crea curva de sisa (el punto de control es la clave)
  const d = `
    M 0 ${escotePX} 
    Q 0 0, ${aCuello} 0
    L ${mEspalda} ${caidaHombro}
    Q ${mEspalda} ${sisaY * 0.6}, ${cuartoPecho} ${sisaY}
    L ${cuartoPecho} ${largoPX}
    L 0 ${largoPX}
    Z
  `.trim();

  return {
    id: 'frente',
    nombre: 'Frente (Mitad)',
    d,
    medidasInfo: `Pecho: ${m.contornoPecho}cm | Largo: ${m.largoTotal}cm`,
    instrucciones: ["Cortar 1 vez al doblez de tela."]
  };
};

const generarEspalda = (m: MedidasPlayeraHombre, cuartoPecho: number, sisaY: number, mEspalda: number, aCuello: number) => {
  const largoPX = Number(m.largoTotal) * ESCALA;
  const escoteEspPX = Number(m.espaldaEscote) * ESCALA;
  const caidaHombro = 4 * ESCALA;

  const d = `
    M 0 ${escoteEspPX}
    Q 0 0, ${aCuello} 0
    L ${mEspalda} ${caidaHombro}
    Q ${mEspalda} ${sisaY * 0.6}, ${cuartoPecho} ${sisaY}
    L ${cuartoPecho} ${largoPX}
    L 0 ${largoPX}
    Z
  `.trim();

  return {
    id: 'espalda',
    nombre: 'Espalda (Mitad)',
    d,
    instrucciones: ["Cortar 1 vez al doblez."]
  };
};

const generarManga = (m: MedidasPlayeraHombre, sisaY: number) => {
  const largoM = Number(m.largoManga) * ESCALA;
  const puño = Number(m.anchoPuño) * ESCALA;
  const anchoManga = Number(m.mitadTalleFrente) * 2 * ESCALA;
  const copaH = sisaY * 0.7; // Altura de la copa proporcional a la sisa

  const d = `
    M 0 ${copaH}
    Q ${anchoManga / 2} 0, ${anchoManga} ${copaH}
    L ${anchoManga - (anchoManga - puño)/2} ${largoM}
    L ${(anchoManga - puño)/2} ${largoM}
    Z
  `.trim();

  return {
    id: 'manga',
    nombre: 'Manga (Par)',
    d: d,
    medidasInfo: `Puño: ${m.anchoPuño}cm | Largo: ${m.largoManga}cm`,
    instrucciones: ["Cortar 2 piezas encontradas."]
  };
};