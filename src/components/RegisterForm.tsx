import React, { useState } from 'react';
import { Package, FileText, Sparkles, Flame, PlusCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { MaterialId, RegistroReciclaje } from '../types/recycling';
import { MATERIALES, SECCIONES_PREDETERMINADAS } from '../data/initialData';

interface RegisterFormProps {
  onGuardarRegistro: (nuevoRegistro: Omit<RegistroReciclaje, 'id' | 'fecha'>) => void;
  onIrAResultados: () => void;
}

/**
 * Componente: Formulario de Registro de Kilos
 * 
 * Cumple con el Requerimiento 1:
 * "registrar kilos por material y por seccion."
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({
  onGuardarRegistro,
  onIrAResultados,
}) => {
  const [seccionSeleccionada, setSeccionSeleccionada] = useState<string>(SECCIONES_PREDETERMINADAS[0]);
  const [seccionPersonalizada, setSeccionPersonalizada] = useState('');
  const [usarPersonalizada, setUsarPersonalizada] = useState(false);
  const [materialSeleccionado, setMaterialSeleccionado] = useState<MaterialId>('plastico');
  const [kilosInput, setKilosInput] = useState<string>('');
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const materialActual = MATERIALES[materialSeleccionado];

  // Cálculo preventivo de puntos para previsualización inmediata
  const kilosNumericos = parseFloat(kilosInput.replace(',', '.'));
  const puntosCalculados =
    !isNaN(kilosNumericos) && kilosNumericos > 0
      ? Number((kilosNumericos * materialActual.puntosPorKilo).toFixed(1))
      : 0;

  /**
   * ⚠️ PUNTOS CRÍTICOS DONDE ALGUIEN PODRÍA EQUIVOCARSE:
   * 1. Teclados en celulares: En países hispanohablantes el teclado numérico de Android/iOS
   *    suele colocar la coma ',' en lugar de punto '.'. Si se usa parseFloat('2,5') directo,
   *    JavaScript devuelve 2 en lugar de 2.5. Reemplazamos ',' por '.' antes de parsear.
   * 2. Validación de números negativos o cero: No se debe permitir registrar 0 kg ni valores negativos.
   * 3. Redondeo: Para evitar números infinitos en base 2 (ej. 3.333333333335), redondeamos a 2 decimales.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);
    setMensajeExito(null);

    // 1. Determinar y validar la sección elegida
    const seccionFinal = (
      usarPersonalizada ? seccionPersonalizada.trim() : seccionSeleccionada
    ).trim();

    if (!seccionFinal) {
      setErrorValidacion('Por favor indica la sección o grado del instituto.');
      return;
    }

    // 2. Normalizar y parsear los kilos
    const textoLimpio = kilosInput.replace(',', '.').trim();
    const kilos = parseFloat(textoLimpio);

    if (isNaN(kilos) || kilos <= 0) {
      setErrorValidacion('Ingresa una cantidad de kilos válida y mayor a 0 (ej: 2.5).');
      return;
    }

    // Redondear a un decimal para consistencia en balanzas de reciclaje
    const kilosRedondeados = Number(kilos.toFixed(2));
    const puntos = Number((kilosRedondeados * materialActual.puntosPorKilo).toFixed(1));

    // 3. Ejecutar guardado
    onGuardarRegistro({
      seccion: seccionFinal,
      materialId: materialSeleccionado,
      kilos: kilosRedondeados,
      puntos,
    });

    // 4. Feedback al usuario y reseteo del campo de kilos
    setMensajeExito(`¡Registrados ${kilosRedondeados} kg de ${materialActual.nombre} para ${seccionFinal}! (+${puntos} pts)`);
    setKilosInput('');

    // Ocultar mensaje después de 4 segundos
    setTimeout(() => {
      setMensajeExito(null);
    }, 4500);
  };

  /**
   * Atajos rápidos para sumar kilos comunes en el pesaje
   */
  const sumarKilosRapidos = (cantidad: number) => {
    const actual = parseFloat(kilosInput.replace(',', '.')) || 0;
    const nuevo = Number((actual + cantidad).toFixed(1));
    setKilosInput(nuevo.toString());
    setErrorValidacion(null);
  };

  const getIconoMaterial = (id: MaterialId) => {
    switch (id) {
      case 'plastico':
        return <Package className="w-5 h-5" />;
      case 'papel':
        return <FileText className="w-5 h-5" />;
      case 'vidrio':
        return <Sparkles className="w-5 h-5" />;
      case 'aluminio':
        return <Flame className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-900 leading-tight">
          Registrar Kilos Reciclados
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Añade el pesaje por sección y material para sumar a la competencia
        </p>
      </div>

      {/* Mensaje de Éxito */}
      {mensajeExito && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start justify-between gap-2 text-xs">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-950">Aporte guardado con éxito</p>
              <p className="text-emerald-800 mt-0.5">{mensajeExito}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onIrAResultados}
            className="shrink-0 font-medium text-emerald-800 underline hover:text-emerald-950 ml-1 flex items-center gap-0.5"
          >
            Ver tabla <ArrowRight className="w-3 h-3 inline" />
          </button>
        </div>
      )}

      {/* Mensaje de Error de Validación */}
      {errorValidacion && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {errorValidacion}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Paso 1: Selección de Sección */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            1. Sección o Grado del Instituto
          </label>

          {!usarPersonalizada ? (
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-1.5">
                {SECCIONES_PREDETERMINADAS.map((sec) => {
                  const seleccionada = seccionSeleccionada === sec;
                  return (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setSeccionSeleccionada(sec)}
                      className={`h-11 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center min-h-[44px] ${
                        seleccionada
                          ? 'bg-emerald-700 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {sec}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setUsarPersonalizada(true)}
                className="text-[11px] text-slate-500 hover:text-emerald-700 underline block text-right pt-0.5"
              >
                + Escribir otra sección diferente
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              <input
                type="text"
                value={seccionPersonalizada}
                onChange={(e) => setSeccionPersonalizada(e.target.value)}
                placeholder="Ej: 5° Informática, 3° Ciencias..."
                className="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              <button
                type="button"
                onClick={() => setUsarPersonalizada(false)}
                className="text-[11px] text-slate-500 hover:text-slate-800 underline block"
              >
                ← Volver a secciones predeterminadas
              </button>
            </div>
          )}
        </div>

        {/* Paso 2: Selección de Material */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            2. Tipo de Material Reciclable
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(MATERIALES) as MaterialId[]).map((matKey) => {
              const mat = MATERIALES[matKey];
              const activo = materialSeleccionado === matKey;

              return (
                <button
                  key={matKey}
                  type="button"
                  onClick={() => setMaterialSeleccionado(matKey)}
                  className={`p-3 rounded-xl border text-left transition-all min-h-[58px] flex items-center gap-2.5 ${
                    activo
                      ? 'border-emerald-600 bg-emerald-50/80 ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      activo
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {getIconoMaterial(matKey)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {mat.nombre}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-semibold font-mono">
                      +{mat.puntosPorKilo} pts / kg
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Paso 3: Entrada de Kilos */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">
              3. Cantidad de Kilos (Balanza)
            </label>
            {puntosCalculados > 0 && (
              <span className="text-xs font-semibold text-emerald-800 font-mono">
                = +{puntosCalculados} puntos
              </span>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              placeholder="0.0"
              value={kilosInput}
              onChange={(e) => {
                setKilosInput(e.target.value);
                setErrorValidacion(null);
              }}
              className="w-full h-13 px-4 pr-12 rounded-xl border border-slate-300 text-lg font-bold font-mono tabular-nums text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-600">
              kg
            </span>
          </div>

          {/* Atajos de incremento rápido para celular */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[11px] text-slate-600 font-medium">Sumar:</span>
            {[0.5, 1, 2, 5, 10].map((inc) => (
              <button
                key={inc}
                type="button"
                onClick={() => sumarKilosRapidos(inc)}
                className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors min-h-[36px]"
              >
                +{inc}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setKilosInput('')}
              className="text-[11px] text-slate-600 hover:text-rose-600 ml-auto px-1 py-1"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Botón Principal de Envío */}
        <div className="pt-2 space-y-2">
          <button
            type="submit"
            className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Registrar Kilos en la Competencia
          </button>

          {/* Botón secundario para ir a Resultados */}
          <button
            type="button"
            onClick={onIrAResultados}
            className="w-full h-10 bg-slate-100 hover:bg-slate-200 active:scale-[0.99] text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            Ver Tabla de Resultados y Posiciones
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
