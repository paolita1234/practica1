import React, { useState, useEffect } from 'react';
import { TreePine, Droplets, Zap, ShieldCheck, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export interface EquivalenteItem {
  metrica: string;
  valor: number;
  unidad: string;
  icono: string;
  factorUsado: string;
  fuente: string;
}

export interface EquivalenteData {
  kilos: number;
  material: string;
  equivalentes: EquivalenteItem[];
}

interface EquivalenteEcologicoCardProps {
  kilosTotales: number;
}

export const EquivalenteEcologicoCard: React.FC<EquivalenteEcologicoCardProps> = ({ kilosTotales }) => {
  const [data, setData] = useState<EquivalenteData | null>(null);
  const [origen, setOrigen] = useState<string>('cargando');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const consultarEquivalencia = async () => {
    if (kilosTotales <= 0) return;
    setCargando(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/equivalente-ecologico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kilos: kilosTotales,
          materialId: 'plastico',
          materialNombre: 'materiales reciclables combinados del instituto',
        }),
      });

      if (!response.ok) {
        throw new Error('El servidor respondió con error.');
      }

      const resJson = await response.json();
      if (resJson.datos && Array.isArray(resJson.datos.equivalentes)) {
        setData(resJson.datos);
        setOrigen(resJson.origen || 'gemini_ai');
      } else {
        throw new Error('El formato recibido no coincide con el esquema requerido.');
      }
    } catch (err: unknown) {
      console.warn('Error al consultar equivalente ecológico:', err);
      setError('No se pudo contactar a la IA en este momento.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    consultarEquivalencia();
  }, [kilosTotales]);

  const getIcono = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'arbol':
      case 'arboles':
        return <TreePine className="w-6 h-6 text-emerald-800" />;
      case 'agua':
        return <Droplets className="w-6 h-6 text-blue-800" />;
      case 'energia':
        return <Zap className="w-6 h-6 text-amber-800" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-purple-800" />;
    }
  };

  if (kilosTotales <= 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-sm p-4 sm:p-5">
      {/* Encabezado con estado del origen de datos */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-800" />
            <h3 className="text-xl font-black text-black">
              Impacto Ecológico Real
            </h3>
          </div>
          <p className="text-base text-slate-800 font-medium mt-0.5">
            Conversión de los <strong className="text-black font-black">{kilosTotales} kg</strong> reciclados a recursos concretos.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {origen === 'gemini_ai' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-black text-base border border-emerald-500">
              <Sparkles className="w-4 h-4 text-emerald-800" />
              Gemini AI
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-900 font-bold text-base border border-slate-400">
              Factor EPA
            </span>
          )}

          <button
            type="button"
            onClick={consultarEquivalencia}
            disabled={cargando}
            title="Recalcular con la IA"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-800 hover:text-black rounded-xl border border-slate-300 hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${cargando ? 'animate-spin text-emerald-800' : ''}`} />
          </button>
        </div>
      </div>

      {cargando && !data && (
        <div className="p-6 text-center bg-slate-50 rounded-xl border-2 border-slate-200">
          <RefreshCw className="w-7 h-7 text-emerald-800 animate-spin mx-auto mb-2" />
          <p className="text-base font-bold text-slate-900">
            Calculando equivalencias ecológicas con IA...
          </p>
        </div>
      )}

      {error && !data && (
        <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-600 text-black flex items-start gap-2.5">
          <AlertCircle className="w-6 h-6 text-rose-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-base font-extrabold text-black">Aviso de servicio</p>
            <p className="text-base text-slate-800">{error}</p>
          </div>
        </div>
      )}

      {/* 
        Requisito 2: Se muestra como DATOS NUMÉRICOS Y TARJETAS concretas, NO como párrafo de texto
      */}
      {data && data.equivalentes && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
          {data.equivalentes.map((item, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-xl p-3.5 border-2 border-slate-300 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-base font-extrabold text-slate-900 leading-tight">
                  {item.metrica}
                </span>
                <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0 shadow-2xs">
                  {getIcono(item.icono)}
                </div>
              </div>

              {/* Valor numérico destacado */}
              <div className="my-1">
                <span className="text-3xl font-black font-mono tabular-nums text-black block leading-none">
                  {item.valor}
                </span>
                <span className="text-base font-bold text-slate-800 mt-1 block">
                  {item.unidad}
                </span>
              </div>

              {/* Cita de fuente y factor */}
              <div className="mt-2 pt-2 border-t border-slate-200">
                <p className="text-base text-slate-800 font-semibold leading-tight">
                  <strong className="text-black">Factor:</strong> {item.factorUsado}
                </p>
                <p className="text-base text-slate-700 font-medium mt-1 leading-tight">
                  <strong className="text-black">Fuente:</strong> {item.fuente}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
