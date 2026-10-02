import { PuntajeSeccion, RegistroReciclaje, MaterialId } from '../types/recycling';
import { MATERIALES, META_MENSUAL_KILOS, REGISTROS_INICIALES, SECCIONES_PREDETERMINADAS } from '../data/initialData';

const STORAGE_KEY = 'reciclar_puntos_registros_v1';
const GOAL_STORAGE_KEY = 'reciclar_puntos_meta_v1';

/**
 * Carga los registros guardados en el almacenamiento local del teléfono o navegador.
 * 
 * ⚠️ PUNTO CRÍTICO DONDE ALGUIEN PODRÍA EQUIVOCARSE:
 * Si el usuario borra datos o si el JSON quedó corrupto por una mala manipulación,
 * un JSON.parse() sin envolver en try/catch rompería toda la app con pantalla blanca.
 * Siempre devolvemos los REGISTROS_INICIALES como respaldo seguro.
 */
export function obtenerRegistros(): RegistroReciclaje[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Primera vez que se abre la app: sembramos los datos iniciales
      localStorage.setItem(STORAGE_KEY, JSON.stringify(REGISTROS_INICIALES));
      return REGISTROS_INICIALES;
    }
    const parseados = JSON.parse(raw);
    if (!Array.isArray(parseados)) {
      return REGISTROS_INICIALES;
    }
    return parseados;
  } catch (error) {
    console.error('Error al recuperar registros desde localStorage:', error);
    return REGISTROS_INICIALES;
  }
}

/**
 * Guarda la lista completa de registros en localStorage.
 */
export function guardarRegistros(registros: RegistroReciclaje[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
  } catch (error) {
    console.error('Error al guardar registros en localStorage (almacenamiento lleno o bloqueado):', error);
  }
}

/**
 * Obtiene la meta mensual configurada (en kilos).
 * Si no existe o no es válida, devuelve META_MENSUAL_KILOS (500 kg).
 */
export function obtenerMetaMensual(): number {
  try {
    const raw = localStorage.getItem(GOAL_STORAGE_KEY);
    if (!raw) return META_MENSUAL_KILOS;
    const valor = parseFloat(raw);
    // ⚠️ PUNTO CRÍTICO: Prevenir que la meta sea NaN o negativa
    return !isNaN(valor) && valor > 0 ? valor : META_MENSUAL_KILOS;
  } catch {
    return META_MENSUAL_KILOS;
  }
}

/**
 * Guarda una nueva meta mensual.
 */
export function guardarMetaMensual(meta: number): void {
  try {
    if (meta > 0) {
      localStorage.setItem(GOAL_STORAGE_KEY, meta.toString());
    }
  } catch (error) {
    console.error('Error al guardar meta mensual:', error);
  }
}

/**
 * Procesa todos los registros y genera la tabla de posiciones consolidada por sección.
 * 
 * ⚠️ PUNTOS CRÍTICOS DONDE ALGUIEN PODRÍA EQUIVOCARSE:
 * 1. JavaScript tiene problemas de precisión de coma flotante (ej. 0.1 + 0.2 = 0.30000000000000004).
 *    Por eso cada acumulación de kilos se redondea explícitamente a 1 decimal.
 * 2. .sort() muta el arreglo sobre el que opera en JavaScript. Para respetar la inmutabilidad
 *    de React, SIEMPRE se debe ordenar una copia del arreglo ([...array].sort).
 * 3. Si una sección del instituto aún no tiene aportes, debe aparecer en la tabla con 0 kg
 *    para que los alumnos de esa sección vean su posición y se motiven a participar.
 */
export function calcularPuntajesPorSeccion(registros: RegistroReciclaje[]): PuntajeSeccion[] {
  // Mapa base con todas las secciones conocidas para garantizar que todas aparezcan
  const mapa = new Map<string, PuntajeSeccion>();

  // 1. Inicializar todas las secciones predeterminadas con 0
  for (const seccion of SECCIONES_PREDETERMINADAS) {
    mapa.set(seccion, {
      seccion,
      kilosTotales: 0,
      puntosTotales: 0,
      desgloseKilos: {
        plastico: 0,
        papel: 0,
        vidrio: 0,
        aluminio: 0,
      },
      totalAportes: 0,
    });
  }

  // 2. Acumular aportes de los registros
  for (const reg of registros) {
    if (!reg.seccion) continue;

    let entrada = mapa.get(reg.seccion);
    if (!entrada) {
      // Soporte para secciones personalizadas no predefinidas
      entrada = {
        seccion: reg.seccion,
        kilosTotales: 0,
        puntosTotales: 0,
        desgloseKilos: {
          plastico: 0,
          papel: 0,
          vidrio: 0,
          aluminio: 0,
        },
        totalAportes: 0,
      };
      mapa.set(reg.seccion, entrada);
    }

    const kilos = typeof reg.kilos === 'number' && !isNaN(reg.kilos) ? reg.kilos : 0;
    const puntos = typeof reg.puntos === 'number' && !isNaN(reg.puntos) ? reg.puntos : 0;

    // Corrección de coma flotante a 1 decimal
    entrada.kilosTotales = Number((entrada.kilosTotales + kilos).toFixed(1));
    entrada.puntosTotales = Number((entrada.puntosTotales + puntos).toFixed(1));
    entrada.totalAportes += 1;

    const materialKey = reg.materialId as MaterialId;
    if (entrada.desgloseKilos[materialKey] !== undefined) {
      entrada.desgloseKilos[materialKey] = Number((entrada.desgloseKilos[materialKey] + kilos).toFixed(1));
    }
  }

  // 3. Convertir a array y ordenar de mayor a menor según puntos totales (y desempate por kilos)
  const lista = Array.from(mapa.values());

  return lista.sort((a, b) => {
    // Criterio 1: Mayor cantidad de puntos
    if (b.puntosTotales !== a.puntosTotales) {
      return b.puntosTotales - a.puntosTotales;
    }
    // Criterio 2: Desempate por mayor cantidad de kilos reciclados
    return b.kilosTotales - a.kilosTotales;
  });
}

/**
 * Calcula el total de kilos recolectados por todo el instituto.
 */
export function calcularKilosTotalesInstituto(registros: RegistroReciclaje[]): number {
  const total = registros.reduce((acc, reg) => {
    const kilos = typeof reg.kilos === 'number' && !isNaN(reg.kilos) ? reg.kilos : 0;
    return acc + kilos;
  }, 0);
  return Number(total.toFixed(1));
}

/**
 * Calcula el avance respecto a la meta mensual.
 * 
 * ⚠️ PUNTO CRÍTICO DONDE ALGUIEN PODRÍA EQUIVOCARSE:
 * 1. División por cero: Si metaKilos es 0 o negativa, provocaría Infinity o NaN.
 * 2. Si se superó la meta (ej. 110%), para la barra gráfica de CSS width se debe topar en 100%,
 *    pero el valor numérico mostrado al usuario debe reflejar el porcentaje real alcanzado.
 */
export function calcularAvanceMeta(kilosActuales: number, metaKilos: number): {
  porcentajeReal: number;
  porcentajeBarra: number;
  kilosFaltantes: number;
  metaAlcanzada: boolean;
} {
  if (!metaKilos || metaKilos <= 0) {
    return {
      porcentajeReal: 0,
      porcentajeBarra: 0,
      kilosFaltantes: 0,
      metaAlcanzada: false,
    };
  }

  const porcentaje = (kilosActuales / metaKilos) * 100;
  const porcentajeReal = Number(porcentaje.toFixed(1));
  const porcentajeBarra = Math.min(Math.max(porcentajeReal, 0), 100);
  const faltantes = Math.max(0, Number((metaKilos - kilosActuales).toFixed(1)));
  const metaAlcanzada = kilosActuales >= metaKilos;

  return {
    porcentajeReal,
    porcentajeBarra,
    kilosFaltantes: faltantes,
    metaAlcanzada,
  };
}
