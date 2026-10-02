import { MaterialId, MaterialInfo, RegistroReciclaje } from '../types/recycling';

/**
 * Catálogo de materiales reciclables con su equivalencia en puntos por kilo.
 * NOTA DE SEGURIDAD: Los IDs deben coincidir exactamente con el tipo 'MaterialId'.
 */
export const MATERIALES: Record<MaterialId, MaterialInfo> = {
  plastico: {
    id: 'plastico',
    nombre: 'Plástico (PET / Envases)',
    puntosPorKilo: 10,
    descripcion: 'Botellas, tapas y envases limpios',
    colorTema: 'text-amber-700 bg-amber-50 border-amber-200',
    icono: 'Package',
  },
  papel: {
    id: 'papel',
    nombre: 'Papel y Cartón',
    puntosPorKilo: 5,
    descripcion: 'Cuadernos, hojas, cajas secas',
    colorTema: 'text-blue-700 bg-blue-50 border-blue-200',
    icono: 'FileText',
  },
  vidrio: {
    id: 'vidrio',
    nombre: 'Vidrio',
    puntosPorKilo: 8,
    descripcion: 'Botellas y frascos sin roturas',
    colorTema: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    icono: 'Sparkles',
  },
  aluminio: {
    id: 'aluminio',
    nombre: 'Aluminio y Latas',
    puntosPorKilo: 15,
    descripcion: 'Latas de bebidas y aerosoles vacíos',
    colorTema: 'text-purple-700 bg-purple-50 border-purple-200',
    icono: 'Flame',
  },
};

export const SECCIONES_PREDETERMINADAS = [
  '1° A',
  '1° B',
  '2° A',
  '2° B',
  '3° A',
  '3° B',
  '4° A',
  '4° B',
];

/**
 * Meta mensual predeterminada en kilogramos para el instituto completo.
 * OJO: Debe ser siempre un número mayor a 0 para prevenir división por cero al calcular %.
 */
export const META_MENSUAL_KILOS = 500;

/**
 * Registros iniciales para que la aplicación muestre datos inmediatos
 * sin obligar al usuario a cargar manualmente 10 registros antes de ver la tabla.
 */
export const REGISTROS_INICIALES: RegistroReciclaje[] = [
  {
    id: 'reg-01',
    seccion: '3° A',
    materialId: 'plastico',
    kilos: 34.5,
    puntos: 345,
    fecha: '2026-10-01T08:30:00Z',
  },
  {
    id: 'reg-02',
    seccion: '2° B',
    materialId: 'aluminio',
    kilos: 22.0,
    puntos: 330,
    fecha: '2026-10-01T09:15:00Z',
  },
  {
    id: 'reg-03',
    seccion: '1° A',
    materialId: 'papel',
    kilos: 58.0,
    puntos: 290,
    fecha: '2026-10-01T10:00:00Z',
  },
  {
    id: 'reg-04',
    seccion: '4° B',
    materialId: 'vidrio',
    kilos: 35.0,
    puntos: 280,
    fecha: '2026-10-01T11:45:00Z',
  },
  {
    id: 'reg-05',
    seccion: '3° A',
    materialId: 'papel',
    kilos: 42.5,
    puntos: 212.5,
    fecha: '2026-10-01T14:10:00Z',
  },
  {
    id: 'reg-06',
    seccion: '1° B',
    materialId: 'plastico',
    kilos: 26.0,
    puntos: 260,
    fecha: '2026-10-02T08:00:00Z',
  },
  {
    id: 'reg-07',
    seccion: '2° A',
    materialId: 'aluminio',
    kilos: 14.5,
    puntos: 217.5,
    fecha: '2026-10-02T09:30:00Z',
  },
  {
    id: 'reg-08',
    seccion: '3° B',
    materialId: 'vidrio',
    kilos: 25.0,
    puntos: 200,
    fecha: '2026-10-02T10:15:00Z',
  },
  {
    id: 'reg-09',
    seccion: '2° B',
    materialId: 'plastico',
    kilos: 18.5,
    puntos: 185,
    fecha: '2026-10-02T11:00:00Z',
  },
  {
    id: 'reg-10',
    seccion: '4° A',
    materialId: 'papel',
    kilos: 30.0,
    puntos: 150,
    fecha: '2026-10-02T12:00:00Z',
  },
];
