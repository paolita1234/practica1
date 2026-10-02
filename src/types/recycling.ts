/**
 * Tipos de datos para el sistema de competencia de reciclaje por secciones.
 */

export type MaterialId = 'plastico' | 'papel' | 'vidrio' | 'aluminio';

export interface MaterialInfo {
  id: MaterialId;
  nombre: string;
  puntosPorKilo: number; // Factor de conversión de kg a puntos de competencia
  descripcion: string;
  colorTema: string;     // Color para identificación visual rápida
  icono: string;
}

export interface RegistroReciclaje {
  id: string;
  seccion: string;        // Ej: "1° A", "2° B", "3° Informática"
  materialId: MaterialId;
  kilos: number;          // Cantidad en kilogramos (admite decimales)
  puntos: number;         // Calculado: kilos * puntosPorKilo
  fecha: string;          // ISO string de registro
}

export interface PuntajeSeccion {
  seccion: string;
  kilosTotales: number;
  puntosTotales: number;
  desgloseKilos: Record<MaterialId, number>;
  totalAportes: number;
}
