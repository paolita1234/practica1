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
 * Permite auditar las últimas cargas realizadas y eliminar un registro
 * en caso de que alguien se haya equivocado al pesar.
 */
export const RecentEntriesList: React.FC<RecentEntriesListProps> = ({
  registros,
  onEliminarRegistro,
}) => {
  // Mostramos los 5 registros más recientes (orden descendente por fecha)
  const ultimos = [...registros]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 6);

  if (ultimos.length === 0) {
    return null;
  }

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
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-slate-500" />
        <h3 className="text-sm font-bold text-slate-900">
          Últimos Aportes Registrados
        </h3>
      </div>

      <div className="divide-y divide-slate-100">
        {ultimos.map((reg) => {
          const mat = MATERIALES[reg.materialId] || {
            nombre: reg.materialId,
            puntosPorKilo: 10,
          };

          return (
            <div
              key={reg.id}
              className="py-2.5 flex items-center justify-between gap-3 text-xs"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-slate-900">{reg.seccion}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600 truncate">{mat.nombre}</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  {formatearFechaHora(reg.fecha)}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 block tabular-nums">
                    {reg.kilos} kg
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold font-mono block">
                    +{reg.puntos} pts
                  </span>
                </div>

                {/* Botón para corregir errores de pesaje */}
                <button
                  type="button"
                  onClick={() => onEliminarRegistro(reg.id)}
                  title="Eliminar este registro si hubo equivocación"
                  className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
