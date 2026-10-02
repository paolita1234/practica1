import React, { useState } from 'react';
import { Target, TrendingUp, CheckCircle2, Edit2, Check } from 'lucide-react';
import { calcularAvanceMeta } from '../utils/recyclingStorage';

interface MonthlyGoalCardProps {
  kilosActuales: number;
  metaKilos: number;
  onActualizarMeta: (nuevaMeta: number) => void;
}

/**
 * Componente: Meta Mensual con Porcentaje de Avance
 * 
 * Cumple con el Requerimiento 3:
 * "meta mensual con porcentaje de avance"
 */
export const MonthlyGoalCard: React.FC<MonthlyGoalCardProps> = ({
  kilosActuales,
  metaKilos,
  onActualizarMeta,
}) => {
  const [editando, setEditando] = useState(false);
  const [inputMeta, setInputMeta] = useState(metaKilos.toString());

  const { porcentajeReal, porcentajeBarra, kilosFaltantes, metaAlcanzada } = calcularAvanceMeta(
    kilosActuales,
    metaKilos
  );

  /**
   * ⚠️ PUNTO CRÍTICO DONDE ALGUIEN PODRÍA EQUIVOCARSE:
   * Al guardar la meta editada, si el usuario escribe texto vacío, caracteres no numéricos
   * o números negativos, debe validarse estrictamente para no provocar errores de división.
   */
  const handleGuardarMeta = () => {
    // Normalizar coma por punto para teclados móviles hispanos
    const valorLimpio = inputMeta.replace(',', '.').trim();
    const numero = parseFloat(valorLimpio);

    if (!isNaN(numero) && numero > 0) {
      onActualizarMeta(numero);
      setEditando(false);
    } else {
      // Revertir a la meta anterior si el valor ingresado es inválido
      setInputMeta(metaKilos.toString());
      setEditando(false);
    }
  };

  const nombreMes = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date());
  const mesCapitalizado = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5">
      {/* Encabezado de la Meta */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 leading-tight">
              Meta Mensual de Reciclaje
            </h2>
            <p className="text-xs text-slate-500">
              {mesCapitalizado} · Todo el Instituto
            </p>
          </div>
        </div>

        {/* Botón para ajustar la meta si el instituto cambia su objetivo */}
        {!editando ? (
          <button
            type="button"
            onClick={() => {
              setInputMeta(metaKilos.toString());
              setEditando(true);
            }}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
            title="Cambiar meta mensual"
          >
            <Edit2 className="w-3 h-3" />
            <span className="hidden sm:inline">Ajustar meta</span>
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <input
              type="text"
              inputMode="decimal"
              value={inputMeta}
              onChange={(e) => setInputMeta(e.target.value)}
              className="w-16 px-1.5 py-0.5 text-xs border border-emerald-400 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              placeholder="kg"
              autoFocus
            />
            <button
              type="button"
              onClick={handleGuardarMeta}
              className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
              title="Guardar"
            >
              <Check className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Cifras Principales */}
      <div className="grid grid-cols-2 gap-3 my-3">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-500 block">Kilos Recolectados</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {kilosActuales}
            </span>
            <span className="text-xs font-semibold text-slate-600">kg</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-500 block">Objetivo del Mes</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {metaKilos}
            </span>
            <span className="text-xs font-semibold text-slate-600">kg</span>
          </div>
        </div>
      </div>

      {/* Barra y Porcentaje de Avance */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-medium text-slate-700 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            Porcentaje de avance
          </span>
          <span className="font-bold text-slate-900 font-mono tabular-nums text-sm">
            {porcentajeReal}%
          </span>
        </div>

        {/* 
          ⚠️ PUNTO CRÍTICO CSS:
          style={{ width: `${porcentajeBarra}%` }} usa porcentajeBarra que está topado a 100%.
          Si se usara porcentajeReal directamente (ej: 130%), la barra se desbordaría
          rompiendo el contenedor en pantallas móviles.
        */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              metaAlcanzada ? 'bg-emerald-500' : 'bg-emerald-600'
            }`}
            style={{ width: `${porcentajeBarra}%` }}
          />
        </div>

        {/* Mensaje de Estado / Kilos Restantes */}
        <div className="mt-2.5 text-xs text-slate-600 flex items-center justify-between">
          {metaAlcanzada ? (
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              ¡Meta mensual superada con éxito!
            </span>
          ) : (
            <span>
              Faltan <strong className="text-slate-900 font-mono tabular-nums">{kilosFaltantes} kg</strong> para alcanzar la meta.
            </span>
          )}
          <span className="text-[11px] text-slate-600">
            {Math.round(kilosActuales)} / {metaKilos} kg
          </span>
        </div>
      </div>
    </div>
  );
};
