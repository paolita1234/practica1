import React, { useState } from 'react';
import { Trophy, Award, Medal, Layers, Filter, PlusCircle } from 'lucide-react';
import { PuntajeSeccion } from '../types/recycling';

interface LeaderboardTableProps {
  puntajes: PuntajeSeccion[];
  seccionSeleccionada?: string;
  onSeleccionarSeccion?: (seccion: string) => void;
  onIrARegistrar?: () => void;
}

/**
 * Componente: Tabla de Posiciones entre Secciones
 * 
 * Cumple con los requisitos:
 * 1. Ancho desde 320px, utilizable con una mano sin zoom.
 * 2. Contraste alto para lectura al sol; textos >= 16px (text-base).
 * 4. Botones secundarios para los filtros (un solo botón principal en la pantalla).
 * 5. Estado vacío claro si no hay ningún pesaje registrado, invitando a la primera acción.
 * 6. Sin tecnicismos.
 */
export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  puntajes,
  seccionSeleccionada,
  onSeleccionarSeccion,
  onIrARegistrar,
}) => {
  const [mostrarDesglose, setMostrarDesglose] = useState(false);

  // Verificamos si realmente hay datos cargados (o si todos están en 0)
  const hayDatosReales = puntajes.some((p) => p.kilosTotales > 0);

  // Cálculo de totales acumulados de todo el instituto por material
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

  const renderInsigniaPosicion = (index: number) => {
    const posicion = index + 1;
    if (posicion === 1) {
      return (
        <span className="inline-flex items-center justify-center min-w-[38px] h-9 px-1 rounded-full bg-amber-200 text-black font-black text-base border-2 border-amber-600 shadow-xs">
          <Trophy className="w-4 h-4 mr-0.5 text-amber-900" />
          1°
        </span>
      );
    }
    if (posicion === 2) {
      return (
        <span className="inline-flex items-center justify-center min-w-[38px] h-9 px-1 rounded-full bg-slate-200 text-black font-black text-base border-2 border-slate-500 shadow-xs">
          <Award className="w-4 h-4 mr-0.5 text-slate-800" />
          2°
        </span>
      );
    }
    if (posicion === 3) {
      return (
        <span className="inline-flex items-center justify-center min-w-[38px] h-9 px-1 rounded-full bg-amber-100 text-black font-black text-base border-2 border-amber-700 shadow-xs">
          <Medal className="w-4 h-4 mr-0.5 text-amber-900" />
          3°
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center min-w-[38px] h-9 px-1 rounded-full bg-slate-100 text-black font-extrabold text-base border border-slate-400">
        {posicion}°
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-sm overflow-hidden">
      {/* Cabecera del Leaderboard */}
      <div className="p-4 sm:p-5 border-b-2 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-black text-black">
              Posiciones de la competencia
            </h2>
          </div>
          <p className="text-base text-slate-800 font-medium mt-1">
            Secciones ordenadas por mayor cantidad de puntos
          </p>
        </div>

        {/* Botones secundarios de alternar vista (min-height 48px) */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-200 p-1.5 rounded-xl border border-slate-400">
          <button
            type="button"
            onClick={() => setMostrarDesglose(false)}
            className={`px-4 min-h-[44px] text-base rounded-lg transition-colors whitespace-nowrap flex items-center justify-center ${
              !mostrarDesglose
                ? 'bg-black text-white font-black shadow-xs'
                : 'text-slate-900 hover:text-black font-bold'
            }`}
          >
            General
          </button>
          <button
            type="button"
            id="btn-tabla"
            onClick={() => setMostrarDesglose(true)}
            className={`px-4 min-h-[44px] text-base rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap justify-center ${
              mostrarDesglose
                ? 'bg-emerald-900 text-white font-black shadow-xs'
                : 'text-slate-900 hover:text-black font-bold'
            }`}
          >
            <Layers className="w-5 h-5" />
            Tabla
          </button>
        </div>
      </div>

      {/* Requisito 5: Estado vacío cuando no hay datos */}
      {!hayDatosReales ? (
        <div className="p-6 sm:p-8 text-center bg-slate-50 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-500 text-amber-900 flex items-center justify-center mb-3">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-black mb-1">
            Aún no hay ningún dato cargado
          </h3>
          <p className="text-base text-slate-800 max-w-sm mb-4 font-medium">
            ¡Comienza anotando el primer pesaje para que las secciones empiecen a competir!
          </p>
          {onIrARegistrar && (
            <button
              type="button"
              onClick={onIrARegistrar}
              className="px-5 min-h-[48px] bg-emerald-900 hover:bg-black text-white font-extrabold text-base rounded-xl transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Anotar el primer pesaje ahora</span>
            </button>
          )}
        </div>
      ) : (
        /* Contenedor con scroll horizontal para pantallas pequeñas desde 320px */
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-base">
            <thead>
              <tr className="border-b-2 border-slate-300 bg-slate-200 text-black text-base uppercase tracking-wide font-black">
                <th scope="col" className="py-3 px-3 text-center w-14">
                  Lugar
                </th>
                <th scope="col" className="py-3 px-3 min-w-[120px]">
                  Sección
                </th>
                <th scope="col" className="py-3 px-3 text-right">
                  Kilos
                </th>
                <th scope="col" className="py-3 px-3 text-right">
                  Puntos
                </th>
                {mostrarDesglose && (
                  <>
                    <th scope="col" className="py-3 px-3 text-right text-amber-900">
                      Plástico
                    </th>
                    <th scope="col" className="py-3 px-3 text-right text-blue-900">
                      Papel
                    </th>
                    <th scope="col" className="py-3 px-3 text-right text-emerald-900">
                      Vidrio
                    </th>
                    <th scope="col" className="py-3 px-3 text-right text-purple-900">
                      Aluminio
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-200">
              {puntajes.map((fila, index) => {
                const esSeleccionada = seccionSeleccionada === fila.seccion;

                return (
                  <tr
                    key={fila.seccion}
                    onClick={() => onSeleccionarSeccion?.(fila.seccion)}
                    className={`transition-colors cursor-pointer ${
                      index === 0
                        ? 'bg-amber-100/50 hover:bg-amber-100'
                        : index % 2 === 0
                        ? 'bg-white hover:bg-slate-100'
                        : 'bg-slate-50 hover:bg-slate-100'
                    } ${esSeleccionada ? 'ring-3 ring-emerald-700 ring-inset bg-emerald-50' : ''}`}
                  >
                    {/* Posición */}
                    <td className="py-3 px-3 text-center">
                      {renderInsigniaPosicion(index)}
                    </td>

                    {/* Nombre de la Sección */}
                    <td className="py-3 px-3 font-black text-black text-base">
                      {fila.seccion}
                    </td>

                    {/* Kilos Totales */}
                    <td className="py-3 px-3 text-right font-black text-black font-mono tabular-nums text-base">
                      {fila.kilosTotales} kg
                    </td>

                    {/* Puntos Totales */}
                    <td className="py-3 px-3 text-right">
                      <span className="font-mono tabular-nums font-black text-emerald-950 text-lg">
                        {fila.puntosTotales}
                      </span>
                      <span className="text-base font-extrabold text-emerald-800 ml-1">
                        pts
                      </span>
                    </td>

                    {/* Columnas de Desglose por Material (si se activa) */}
                    {mostrarDesglose && (
                      <>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-black font-bold text-base">
                          {fila.desgloseKilos.plastico} kg
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-black font-bold text-base">
                          {fila.desgloseKilos.papel} kg
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-black font-bold text-base">
                          {fila.desgloseKilos.vidrio} kg
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-black font-bold text-base">
                          {fila.desgloseKilos.aluminio} kg
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>

            {/* Fila de Totales de todo el instituto */}
            {mostrarDesglose && puntajes.length > 0 && (
              <tfoot>
                <tr className="border-t-3 border-black bg-slate-200 font-black text-black text-base">
                  <td colSpan={2} className="py-3.5 px-3 text-left">
                    Total Instituto:
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                    {totalesGeneralesPorMaterial.kilos} kg
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono tabular-nums text-emerald-950">
                    {totalesGeneralesPorMaterial.puntos} pts
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono tabular-nums text-amber-950">
                    {totalesGeneralesPorMaterial.plastico} kg
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono tabular-nums text-blue-950">
                    {totalesGeneralesPorMaterial.papel} kg
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono tabular-nums text-emerald-950">
                    {totalesGeneralesPorMaterial.vidrio} kg
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono tabular-nums text-purple-950">
                    {totalesGeneralesPorMaterial.aluminio} kg
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}

      {/* Pie de tabla explicativo con alto contraste */}
      <div className="p-4 bg-slate-100 border-t-2 border-slate-200 flex flex-col gap-1 text-base text-slate-900 font-medium">
        <span className="font-extrabold text-black flex items-center gap-1.5">
          <Filter className="w-5 h-5 text-emerald-900" />
          Valor de los puntos por cada kilo:
        </span>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
          <span>Plástico: <strong className="text-black">10 pts/kg</strong></span>
          <span>Papel/Cartón: <strong className="text-black">5 pts/kg</strong></span>
          <span>Vidrio: <strong className="text-black">8 pts/kg</strong></span>
          <span>Aluminio: <strong className="text-black">15 pts/kg</strong></span>
        </div>
      </div>
    </div>
  );
};
