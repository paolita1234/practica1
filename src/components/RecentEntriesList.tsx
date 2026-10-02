import React from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { RegistroReciclaje } from '../types/recycling';
import { MATERIALES } from '../data/initialData';

interface RecentEntriesListProps {
  registros: RegistroReciclaje[];
  onEliminarRegistro: (id: string) => void;
}

/**
 * Componente: Historial Reciente de Aportes
 * 
 * Cumple con los requisitos de accesibilidad:
 * 1. Ancho desde 320px, sin zoom.
 * 2. Texto >= 16px (text-base) y alto contraste para luz solar.
 * 4. Botones secundarios táctiles (mínimo 44px-48px).
 * 5. Estado vacío claro si no hay datos.
 * 6. Español sencillo sin tecnicismos.
 */
export const RecentEntriesList: React.FC<RecentEntriesListProps> = ({
  registros,
  onEliminarRegistro,
}) => {
  const ultimos = [...registros]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5);

  const formatearFechaHora = (iso: string) => {
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short',
      }).format(d);
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-sm p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-slate-800" />
        <h3 className="text-lg font-black text-black">
          Últimos pesajes anotados
        </h3>
      </div>

      {ultimos.length === 0 ? (
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 text-center">
          <p className="text-base text-slate-800 font-medium">
            No hay ningún pesaje registrado en el historial.
          </p>
        </div>
      ) : (
        <div className="divide-y-2 divide-slate-200">
          {ultimos.map((reg) => {
            const mat = MATERIALES[reg.materialId] || {
              nombre: reg.materialId,
              puntosPorKilo: 10,
            };

            return (
              <div
                key={reg.id}
                className="py-3 flex items-center justify-between gap-3 text-base"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-black text-black text-base">
                      {reg.seccion}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-900 font-bold truncate text-base">
                      {mat.nombre}
                    </span>
                  </div>
                  <div className="text-base text-slate-700 font-medium mt-0.5">
                    {formatearFechaHora(reg.fecha)}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="font-mono font-black text-black block tabular-nums text-base">
                      {reg.kilos} kg
                    </span>
                    <span className="text-base text-emerald-900 font-extrabold font-mono block">
                      +{reg.puntos} pts
                    </span>
                  </div>

                  {/* Botón táctil para corregir equivocación de pesaje (min 44px) */}
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`¿Quieres borrar el pesaje de ${reg.kilos} kg de ${reg.seccion}?`)) {
                        onEliminarRegistro(reg.id);
                      }
                    }}
                    title="Borrar este pesaje si hubo una equivocación"
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-700 hover:text-rose-700 rounded-xl hover:bg-rose-50 border border-slate-300 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
