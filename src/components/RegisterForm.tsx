import React, { useState, useRef } from 'react';
import { Package, FileText, Sparkles, Flame, PlusCircle, CheckCircle, ArrowRight, AlertTriangle, X } from 'lucide-react';
import { MaterialId, RegistroReciclaje } from '../types/recycling';
import { MATERIALES, SECCIONES_PREDETERMINADAS } from '../data/initialData';

interface RegisterFormProps {
  onGuardarRegistro: (nuevoRegistro: Omit<RegistroReciclaje, 'id' | 'fecha'>) => void;
  onIrAResultados: () => void;
  totalRegistrosExistentes?: number;
}

/**
 * Componente: Formulario de Registro de Kilos
 * 
 * Cumple con los 6 requisitos de accesibilidad y ergonomía móvil:
 * 1. Ancho desde 320px, uso con una sola mano, sin zoom.
 * 2. Contraste alto para luz solar exterior; texto >= 16px (text-base).
 * 3. Etiquetas visibles en todos los campos (no solo placeholders).
 * 4. Un solo botón principal destacado; los demás en estilo secundario.
 * 5. Frase motivadora de primera acción si no hay datos.
 * 6. Mensajes en español cotidiano sin tecnicismos, visibles directamente donde está la vista del usuario.
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({
  onGuardarRegistro,
  onIrAResultados,
  totalRegistrosExistentes = 1,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);
    setMensajeExito(null);

    const seccionFinal = (
      usarPersonalizada ? seccionPersonalizada.trim() : seccionSeleccionada
    ).trim();

    if (!seccionFinal) {
      setErrorValidacion('Por favor indica qué sección o grado está entregando el material.');
      return;
    }

    const textoLimpio = kilosInput.replace(',', '.').trim();
    const kilos = parseFloat(textoLimpio);

    if (isNaN(kilos) || kilos <= 0) {
      setErrorValidacion('Por favor escribe un número mayor a cero en los kilos (ejemplo: 2.5).');
      return;
    }

    const kilosRedondeados = Number(kilos.toFixed(2));
    const puntos = Number((kilosRedondeados * materialActual.puntosPorKilo).toFixed(1));

    onGuardarRegistro({
      seccion: seccionFinal,
      materialId: materialSeleccionado,
      kilos: kilosRedondeados,
      puntos,
    });

    setMensajeExito(`¡Listo! Se guardaron con éxito ${kilosRedondeados} kilos de ${materialActual.nombre} para ${seccionFinal}.`);
    setKilosInput('');

    setTimeout(() => {
      setMensajeExito(null);
    }, 6000);
  };

  const sumarKilosRapidos = (cantidad: number) => {
    const actual = parseFloat(kilosInput.replace(',', '.')) || 0;
    const nuevo = Number((actual + cantidad).toFixed(1));
    setKilosInput(nuevo.toString());
    setErrorValidacion(null);
  };

  const getIconoMaterial = (id: MaterialId) => {
    switch (id) {
      case 'plastico':
        return <Package className="w-6 h-6 shrink-0" />;
      case 'papel':
        return <FileText className="w-6 h-6 shrink-0" />;
      case 'vidrio':
        return <Sparkles className="w-6 h-6 shrink-0" />;
      case 'aluminio':
        return <Flame className="w-6 h-6 shrink-0" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-sm p-4 sm:p-5 relative">
      
      {/* 
        NOTIFICACIÓN FLOTANTE FIJA SUPERIOR:
        Asegura que el mensaje de éxito o de error se vea SIEMPRE en cualquier parte de la pantalla.
      */}
      {mensajeExito && (
        <div
          role="alert"
          className="fixed top-18 left-3 right-3 max-w-md mx-auto z-50 p-4 rounded-2xl bg-emerald-900 border-3 border-black text-white shadow-2xl flex items-start justify-between gap-3 animate-bounce"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="w-7 h-7 text-emerald-300 shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-lg text-white">
                ¡Pesaje guardado con éxito!
              </p>
              <p className="text-base text-emerald-100 mt-1 font-semibold">
                {mensajeExito}
              </p>
              <button
                type="button"
                onClick={onIrAResultados}
                className="mt-2 text-base font-black text-amber-300 underline hover:text-white flex items-center gap-1"
              >
                Ver tabla de posiciones <ArrowRight className="w-5 h-5 inline" />
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMensajeExito(null)}
            className="p-1 text-white hover:text-emerald-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Cerrar aviso"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      {errorValidacion && (
        <div
          role="alert"
          className="fixed top-18 left-3 right-3 max-w-md mx-auto z-50 p-4 rounded-2xl bg-rose-900 border-3 border-black text-white shadow-2xl flex items-start justify-between gap-3"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-7 h-7 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-lg text-white">
                Atención
              </p>
              <p className="text-base text-rose-100 mt-1 font-semibold">
                {errorValidacion}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setErrorValidacion(null)}
            className="p-1 text-white hover:text-rose-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Cerrar aviso"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Título de sección */}
      <div className="mb-4">
        <h2 className="text-xl font-black text-black leading-tight">
          Anotar nuevo pesaje
        </h2>
        <p className="text-base text-slate-800 mt-1 font-medium">
          Registra los kilos entregados para sumar puntos a la sección.
        </p>
      </div>

      {/* Requisito 5: Mensaje de invitación si la lista está vacía */}
      {totalRegistrosExistentes === 0 && (
        <div className="mb-5 p-4 rounded-xl bg-amber-100 border-2 border-amber-800 text-black">
          <p className="text-base font-black text-amber-950">
            ¡Todavía no hay ningún pesaje registrado!
          </p>
          <p className="text-base text-slate-900 mt-1 font-medium">
            Sé la primera persona en anotar los kilos de tu sección para inaugurar la tabla.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Requisito 3: Etiqueta visible en Campo 1 */}
        <div>
          <label
            htmlFor="selector-seccion-predeterminada"
            className="block text-base font-extrabold text-black mb-2"
          >
            1. Sección o grado que entrega el material:
          </label>

          {!usarPersonalizada ? (
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2">
                {SECCIONES_PREDETERMINADAS.map((sec) => {
                  const seleccionada = seccionSeleccionada === sec;
                  return (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setSeccionSeleccionada(sec)}
                      className={`min-h-[48px] rounded-xl text-base font-bold transition-all flex items-center justify-center border-2 ${
                        seleccionada
                          ? 'bg-emerald-900 text-white border-black shadow-sm ring-2 ring-emerald-500'
                          : 'bg-slate-100 text-slate-900 border-slate-300 hover:bg-slate-200'
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
                className="text-base font-bold text-emerald-900 hover:text-black underline block pt-1 min-h-[44px] flex items-center"
              >
                + Escribir otra sección distinta
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <label
                htmlFor="input-seccion-personalizada"
                className="block text-base font-semibold text-slate-900"
              >
                Escribe el nombre de la sección:
              </label>
              <input
                id="input-seccion-personalizada"
                type="text"
                value={seccionPersonalizada}
                onChange={(e) => setSeccionPersonalizada(e.target.value)}
                placeholder="Ejemplo: 5° Informática"
                className="w-full min-h-[50px] px-3 rounded-xl border-2 border-slate-700 text-base font-bold text-black focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
              />
              <button
                type="button"
                onClick={() => setUsarPersonalizada(false)}
                className="text-base font-bold text-slate-800 hover:text-black underline block min-h-[44px] flex items-center"
              >
                ← Volver a la lista de secciones
              </button>
            </div>
          )}
        </div>

        {/* Requisito 3: Etiqueta visible en Campo 2 */}
        <div>
          <label className="block text-base font-extrabold text-black mb-2">
            2. Tipo de material reciclable:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(Object.keys(MATERIALES) as MaterialId[]).map((matKey) => {
              const mat = MATERIALES[matKey];
              const activo = materialSeleccionado === matKey;

              return (
                <button
                  key={matKey}
                  type="button"
                  onClick={() => setMaterialSeleccionado(matKey)}
                  className={`p-3 rounded-xl border-2 text-left transition-all min-h-[58px] flex items-center gap-3 ${
                    activo
                      ? 'border-black bg-emerald-100 text-black shadow-sm ring-2 ring-emerald-600'
                      : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-900'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border ${
                      activo
                        ? 'bg-emerald-900 text-white border-black'
                        : 'bg-slate-200 text-slate-900 border-slate-300'
                    }`}
                  >
                    {getIconoMaterial(matKey)}
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-black leading-tight">
                      {mat.nombre}
                    </p>
                    <p className="text-base text-emerald-950 font-bold mt-0.5">
                      +{mat.puntosPorKilo} puntos por kilo
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Requisito 3: Etiqueta visible en Campo 3 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="input-kilos-balanza"
              className="text-base font-extrabold text-black"
            >
              3. Cantidad de kilos en la balanza:
            </label>
            {puntosCalculados > 0 && (
              <span className="text-base font-black text-emerald-900">
                =+{puntosCalculados} pts
              </span>
            )}
          </div>

          <div className="relative">
            <input
              id="input-kilos-balanza"
              type="text"
              inputMode="decimal"
              placeholder="0.0"
              value={kilosInput}
              onChange={(e) => {
                setKilosInput(e.target.value);
                setErrorValidacion(null);
              }}
              className="w-full min-h-[54px] px-4 pr-14 rounded-xl border-2 border-slate-700 text-xl font-black font-mono tabular-nums text-black focus:outline-none focus:ring-3 focus:ring-emerald-700 bg-white"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base font-black text-black pointer-events-none">
              kilos
            </span>
          </div>

          {/* Atajos de incremento rápido (min-height 48px para uso con una sola mano) */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span className="text-base text-slate-900 font-bold mr-1">Sumar:</span>
            {[0.5, 1, 2, 5, 10].map((inc) => (
              <button
                key={inc}
                type="button"
                onClick={() => sumarKilosRapidos(inc)}
                className="px-3 min-h-[48px] text-base font-bold bg-slate-200 text-black rounded-xl hover:bg-slate-300 border border-slate-400 transition-colors flex items-center justify-center"
              >
                +{inc}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setKilosInput('')}
              className="text-base text-slate-800 hover:text-rose-800 font-bold ml-auto px-2 min-h-[48px] flex items-center"
            >
              Borrar
            </button>
          </div>
        </div>

        {/* 
          REQUISITO 6: MENSAJE DE ÉXITO O ERROR VISIBLE DIRECTAMENTE SOBRE EL BOTÓN
          De esta forma el usuario nunca se lo pierde al pulsar el botón.
        */}
        {mensajeExito && (
          <div className="p-4 rounded-xl bg-emerald-100 border-2 border-emerald-800 text-emerald-950 flex flex-col gap-1.5 animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-6 h-6 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-base text-emerald-950">
                  Pesaje guardado
                </p>
                <p className="text-base text-slate-900 font-medium">
                  {mensajeExito}
                </p>
              </div>
            </div>
          </div>
        )}

        {errorValidacion && (
          <div className="p-4 rounded-xl bg-rose-100 border-2 border-rose-800 text-black text-base font-bold flex items-start gap-2.5">
            <AlertTriangle className="w-6 h-6 text-rose-800 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-base text-rose-950">No se pudo guardar:</p>
              <p className="text-base text-slate-900 font-medium mt-0.5">{errorValidacion}</p>
            </div>
          </div>
        )}

        {/* 
          Requisito 4: UN SOLO BOTÓN PRINCIPAL POR PANTALLA
          El botón de guardar es el principal (verde oscuro de alto impacto).
          El botón de ver resultados es secundario (blanco con borde gris neutro).
        */}
        <div className="pt-2 space-y-3">
          <button
            type="submit"
            id="btn-guardar-pesaje"
            className="w-full min-h-[54px] bg-emerald-900 hover:bg-black active:scale-[0.99] text-white font-black text-lg rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border-2 border-black"
          >
            <PlusCircle className="w-6 h-6" />
            <span>Guardar este pesaje</span>
          </button>

          <button
            type="button"
            onClick={onIrAResultados}
            className="w-full min-h-[48px] bg-white hover:bg-slate-100 active:scale-[0.99] text-slate-900 font-bold text-base rounded-xl border-2 border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <span>Ver tabla de posiciones</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
