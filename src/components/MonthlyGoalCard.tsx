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
 * Cumple con los requisitos de accesibilidad:
 * 1. Funciona desde 320px de ancho sin zoom.
 * 2. Contraste alto para lectura bajo luz solar; texto nunca menor a 16px.
 * 3. Etiquetas visibles en todos los campos (incluyendo el ajuste de meta).
 * 4. Botón secundario para ajustar la meta.
 * 6. Español cotidiano sin tecnicismos.
 */
export const MonthlyGoalCard: React.FC<MonthlyGoalCardProps> = ({
  kilosActuales,
  metaKilos,
  onActualizarMeta,
}) => {
  const [editando, setEditando] = useState(false);
  const [inputMeta, setInputMeta] = useState(metaKilos.toString());
  const [errorMeta, setErrorMeta] = useState<string | null>(null);

  const { porcentajeReal, porcentajeBarra, kilosFaltantes, metaAlcanzada } = calcularAvanceMeta(
    kilosActuales,
    metaKilos
  );

  const handleGuardarMeta = () => {
    setErrorMeta(null);
    const valorLimpio = inputMeta.replace(',', '.').trim();

    if (!/^\d+(\.\d{1,2})?$/.test(valorLimpio)) {
      setErrorMeta('Escribe un número válido (ej: 400).');
      return;
    }

    const numero = parseFloat(valorLimpio);

    if (numero <= 0 || numero > 10000) {
      setErrorMeta('Debe ser entre 1 y 10.000 kg.');
      return;
    }

    onActualizarMeta(numero);
    setEditando(false);
  };

  const nombreMes = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date());
  const mesCapitalizado = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-sm p-4 sm:p-5">
      
      {/* Encabezado con alto contraste */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 border-2 border-emerald-700 text-emerald-900 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6 text-emerald-900" />
          </div>
          <div>
            <h2 className="text-xl font-black text-black leading-tight">
              Meta del mes de {mesCapitalizado}
            </h2>
            <p className="text-base text-slate-800 font-medium">
              Objetivo común de todo el instituto
            </p>
          </div>
        </div>

        {/* Botón secundario para ajustar meta */}
        {!editando ? (
          <button
            type="button"
            onClick={() => {
              setInputMeta(metaKilos.toString());
              setEditando(true);
            }}
            className="text-base text-black font-bold flex items-center gap-1.5 px-3 min-h-[44px] rounded-xl border border-slate-400 bg-slate-100 hover:bg-slate-200 transition-colors self-start sm:self-auto"
            title="Cambiar la meta en kilos del mes"
          >
            <Edit2 className="w-4 h-4 text-slate-800" />
            <span>Ajustar meta</span>
          </button>
        ) : (
          <div className="flex flex-col gap-1.5 bg-slate-100 p-2.5 rounded-xl border-2 border-slate-400">
            <label
              htmlFor="input-ajustar-meta-kilos"
              className="text-base font-bold text-black"
            >
              Nueva meta en kilos:
            </label>
            <div className="flex items-center gap-2">
              <input
                id="input-ajustar-meta-kilos"
                type="text"
                inputMode="decimal"
                value={inputMeta}
                onChange={(e) => setInputMeta(e.target.value)}
                className="w-24 min-h-[44px] px-2.5 border-2 border-black rounded-lg text-base font-bold text-black bg-white focus:outline-none"
                placeholder="Ej: 500"
                autoFocus
              />
              <button
                type="button"
                onClick={handleGuardarMeta}
                className="min-h-[44px] px-3 rounded-lg bg-emerald-900 text-white font-bold text-base hover:bg-black flex items-center gap-1"
              >
                <Check className="w-5 h-5" />
                <span>Listo</span>
              </button>
            </div>
            {errorMeta && (
              <p className="text-base font-bold text-rose-700 mt-1">
                {errorMeta}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Cifras Principales con texto grande y alto contraste */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
        <div className="bg-slate-100 rounded-xl p-3.5 border-2 border-slate-300">
          <span className="text-base font-bold text-slate-800 block">
            Kilos juntados hasta hoy
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-3xl font-black text-black font-mono tabular-nums">
              {kilosActuales}
            </span>
            <span className="text-lg font-bold text-slate-900">kilos</span>
          </div>
        </div>

        <div className="bg-slate-100 rounded-xl p-3.5 border-2 border-slate-300">
          <span className="text-base font-bold text-slate-800 block">
            Objetivo fijado para el mes
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-3xl font-black text-black font-mono tabular-nums">
              {metaKilos}
            </span>
            <span className="text-lg font-bold text-slate-900">kilos</span>
          </div>
        </div>
      </div>

      {/* Barra y Porcentaje de Avance */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-base mb-2">
          <span className="font-extrabold text-black flex items-center gap-1.5">
            <TrendingUp className="w-5 h-5 text-emerald-900" />
            Porcentaje alcanzado:
          </span>
          <span className="font-black text-black font-mono tabular-nums text-xl">
            {porcentajeReal}%
          </span>
        </div>

        <div className="w-full h-5 bg-slate-200 rounded-full overflow-hidden p-0.5 border-2 border-slate-400">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              metaAlcanzada ? 'bg-emerald-600' : 'bg-emerald-800'
            }`}
            style={{ width: `${porcentajeBarra}%` }}
          />
        </div>

        {/* Mensaje de Estado / Kilos Restantes sin tecnicismos */}
        <div className="mt-3 text-base text-slate-900 font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          {metaAlcanzada ? (
            <span className="text-emerald-950 font-black flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0" />
              ¡Meta mensual superada con éxito por todo el instituto!
            </span>
          ) : (
            <span>
              Faltan <strong className="text-black font-mono font-black">{kilosFaltantes} kilos</strong> para cumplir la meta.
            </span>
          )}
          <span className="text-base text-slate-800 font-bold">
            {Math.round(kilosActuales)} de {metaKilos} kilos
          </span>
        </div>
      </div>
    </div>
  );
};
