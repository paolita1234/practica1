import React, { useState } from 'react';
import { Trophy, Award, Medal, Layers, Filter } from 'lucide-react';
import { PuntajeSeccion, MaterialId } from '../types/recycling';
import { MATERIALES } from '../data/initialData';

interface LeaderboardTableProps {
  puntajes: PuntajeSeccion[];
  seccionSeleccionada?: string;
  onSeleccionarSeccion?: (seccion: string) => void;
}

/**
 * Componente: Tabla de Posiciones entre Secciones
 * 
 * Cumple con el Requerimiento 2 y el Criterio de Aceptación:
 * "Tabla de posiciones entre secciones"
 * "abro la app, hago click en un boton llamado resultados y veo una tabla con lo que te pedi sin ningún error en la consola."
 */
export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  puntajes,
  seccionSeleccionada,
  onSeleccionarSeccion,
}) => {
  // Permite al usuario alternar entre vista general y la tabla de kilos según material
  const [mostrarDesglose, setMostrarDesglose] = useState(false);

  // Cálculo de totales acumulados de todo el instituto por material para el pie de tabla
  const totalesGeneralesPorMaterial = puntajes.reduce(
    (acc, p) => ({
      plastico: Number((acc.plastico + p.desgloseKilos.plastico).toFixed(1)),
      papel: Number((acc.papel + p.desgloseKilos.papel).toFixed(1)),
      vidrio: Number((acc.vidrio + p.desgloseKilos.vidrio).toFixed(1)),
      aluminio: Number((acc.aluminio + p.desgloseKilos.aluminio).toFixed(1)),
      kilos: Number((acc.kilos + p.kilosTotales).toFixed(1)),
      puntos: Number((acc.puntos + p.puntosTotales).toFixed(1)),
    }),
    { plastico: 0, papel: 0, vidrio: 0, aluminio: 0, kilos: 0, puntos: 0 }
  );

  /**
   * Helper para obtener el badge visual de las 3 primeras posiciones
   */
  const renderInsigniaPosicion = (index: number) => {
    const posicion = index + 1;
    if (posicion === 1) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold text-xs ring-2 ring-amber-300">
          <Trophy className="w-3.5 h-3.5 mr-0.5 text-amber-600" />
          1°
        </span>
      );
    }
    if (posicion === 2) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-800 font-bold text-xs ring-1 ring-slate-300">
          <Award className="w-3.5 h-3.5 mr-0.5 text-slate-600" />
          2°
        </span>
      );
    }
    if (posicion === 3) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 text-amber-900 font-bold text-xs border border-amber-300">
          <Medal className="w-3.5 h-3.5 mr-0.5 text-amber-700" />
          3°
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-semibold text-xs font-mono">
        {posicion}°
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Cabecera del Leaderboard */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">
              Tabla de Posiciones
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Clasificación oficial por puntos acumulados y kilos reciclados
          </p>
        </div>

        {/* Botón selector de vista para pantallas de celular */}
        <div className="flex items-center gap-1 self-start sm:self-auto bg-slate-200/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMostrarDesglose(false)}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap min-h-[32px] ${
              !mostrarDesglose
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            General
          </button>
          <button
            type="button"
            id="btn-tabla"
            onClick={() => setMostrarDesglose(true)}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap min-h-[32px] ${
              mostrarDesglose
                ? 'bg-emerald-700 text-white shadow-xs font-bold'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Tabla
          </button>
        </div>
      </div>

      {/* Contenedor con scroll horizontal para celulares garantizando que no se corte nada */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-600 text-[11px] uppercase tracking-wider font-semibold">
              <th scope="col" className="py-3 px-3 sm:px-4 text-center w-12 sm:w-16">
                Pos.
              </th>
              <th scope="col" className="py-3 px-3 sm:px-4">
                Sección
              </th>
              <th scope="col" className="py-3 px-3 sm:px-4 text-right">
                Kilos Totales
              </th>
              <th scope="col" className="py-3 px-3 sm:px-4 text-right">
                Puntos
              </th>
              {mostrarDesglose && (
                <>
                  <th scope="col" className="py-3 px-2 text-right text-amber-700">
                    Plástico
                  </th>
                  <th scope="col" className="py-3 px-2 text-right text-blue-700">
                    Papel
                  </th>
                  <th scope="col" className="py-3 px-2 text-right text-emerald-700">
                    Vidrio
                  </th>
                  <th scope="col" className="py-3 px-2 text-right text-purple-700">
                    Aluminio
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {puntajes.length === 0 ? (
              <tr>
                <td
                  colSpan={mostrarDesglose ? 8 : 4}
                  className="py-8 text-center text-slate-400 text-xs"
                >
                  No hay secciones registradas aún.
                </td>
              </tr>
            ) : (
              puntajes.map((fila, index) => {
                const esSeleccionada = seccionSeleccionada === fila.seccion;

                return (
                  <tr
                    key={fila.seccion}
                    onClick={() => onSeleccionarSeccion?.(fila.seccion)}
                    className={`transition-colors cursor-pointer ${
                      index === 0
                        ? 'bg-amber-50/30 hover:bg-amber-50/60'
                        : index % 2 === 0
                        ? 'bg-white hover:bg-slate-50'
                        : 'bg-slate-50/40 hover:bg-slate-100/60'
                    } ${esSeleccionada ? 'ring-2 ring-emerald-500 ring-inset' : ''}`}
                  >
                    {/* Posición */}
                    <td className="py-3 px-3 sm:px-4 text-center">
                      {renderInsigniaPosicion(index)}
                    </td>

                    {/* Nombre de la Sección */}
                    <td className="py-3 px-3 sm:px-4">
                      <div className="font-bold text-slate-900 text-sm">
                        {fila.seccion}
                      </div>
                      <span className="text-[11px] text-slate-600 block sm:inline">
                        {fila.totalAportes} {fila.totalAportes === 1 ? 'aporte' : 'aportes'}
                      </span>
                    </td>

                    {/* Kilos Totales con Tabular Nums para alineación vertical limpia */}
                    <td className="py-3 px-3 sm:px-4 text-right font-mono tabular-nums font-bold text-slate-800">
                      {fila.kilosTotales}{' '}
                      <span className="text-[10px] text-slate-600 font-sans font-normal">kg</span>
                    </td>

                    {/* Puntos Totales */}
                    <td className="py-3 px-3 sm:px-4 text-right">
                      <span className="font-mono tabular-nums font-bold text-emerald-800 text-sm sm:text-base">
                        {fila.puntosTotales}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold block leading-none">
                        pts
                      </span>
                    </td>

                    {/* Columnas de Desglose por Material (si se activa) */}
                    {mostrarDesglose && (
                      <>
                        <td className="py-3 px-2 text-right font-mono tabular-nums text-slate-600 text-xs">
                          {fila.desgloseKilos.plastico} kg
                        </td>
                        <td className="py-3 px-2 text-right font-mono tabular-nums text-slate-600 text-xs">
                          {fila.desgloseKilos.papel} kg
                        </td>
                        <td className="py-3 px-2 text-right font-mono tabular-nums text-slate-600 text-xs">
                          {fila.desgloseKilos.vidrio} kg
                        </td>
                        <td className="py-3 px-2 text-right font-mono tabular-nums text-slate-600 text-xs">
                          {fila.desgloseKilos.aluminio} kg
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
          {mostrarDesglose && puntajes.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-slate-300 bg-slate-100 font-bold text-slate-900 text-xs">
                <td colSpan={2} className="py-2.5 px-3 sm:px-4 text-left">
                  Total Instituto:
                </td>
                <td className="py-2.5 px-3 sm:px-4 text-right font-mono tabular-nums text-slate-900">
                  {totalesGeneralesPorMaterial.kilos}{' '}
                  <span className="text-[10px] text-slate-500 font-normal">kg</span>
                </td>
                <td className="py-2.5 px-3 sm:px-4 text-right font-mono tabular-nums text-emerald-800">
                  {totalesGeneralesPorMaterial.puntos}{' '}
                  <span className="text-[10px] text-emerald-600 font-normal">pts</span>
                </td>
                <td className="py-2.5 px-2 text-right font-mono tabular-nums text-amber-800">
                  {totalesGeneralesPorMaterial.plastico} kg
                </td>
                <td className="py-2.5 px-2 text-right font-mono tabular-nums text-blue-800">
                  {totalesGeneralesPorMaterial.papel} kg
                </td>
                <td className="py-2.5 px-2 text-right font-mono tabular-nums text-emerald-800">
                  {totalesGeneralesPorMaterial.vidrio} kg
                </td>
                <td className="py-2.5 px-2 text-right font-mono tabular-nums text-purple-800">
                  {totalesGeneralesPorMaterial.aluminio} kg
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Pie de tabla explicativo de puntos */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <Filter className="w-3 h-3 text-slate-400" />
          Reglas de puntaje:
        </span>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>Plástico: <strong>10 pts/kg</strong></span>
          <span>Papel/Cartón: <strong>5 pts/kg</strong></span>
          <span>Vidrio: <strong>8 pts/kg</strong></span>
          <span>Aluminio: <strong>15 pts/kg</strong></span>
        </div>
      </div>
    </div>
  );
};
