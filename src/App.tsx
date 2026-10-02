/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, PlusCircle, Sparkles, RefreshCw, Download, FileText, Trash2 } from 'lucide-react';
import { RegistroReciclaje } from './types/recycling';
import {
  obtenerRegistros,
  guardarRegistros,
  obtenerMetaMensual,
  guardarMetaMensual,
  calcularPuntajesPorSeccion,
  calcularKilosTotalesInstituto,
  exportarRegistrosAArchivoJSON,
} from './utils/recyclingStorage';
import { descargarReportePDF } from './utils/pdfGenerator';
import { RegisterForm } from './components/RegisterForm';
import { LeaderboardTable } from './components/LeaderboardTable';
import { MonthlyGoalCard } from './components/MonthlyGoalCard';
import { RecentEntriesList } from './components/RecentEntriesList';

export default function App() {
  const [pestanaActiva, setPestanaActiva] = useState<'registrar' | 'resultados'>('registrar');
  const [registros, setRegistros] = useState<RegistroReciclaje[]>(() => obtenerRegistros());
  const [metaKilos, setMetaKilos] = useState<number>(() => obtenerMetaMensual());
  const [seccionSeleccionada, setSeccionSeleccionada] = useState<string | undefined>(undefined);

  useEffect(() => {
    guardarRegistros(registros);
  }, [registros]);

  useEffect(() => {
    guardarMetaMensual(metaKilos);
  }, [metaKilos]);

  const puntajesPorSeccion = useMemo(() => {
    return calcularPuntajesPorSeccion(registros);
  }, [registros]);

  const kilosTotalesInstituto = useMemo(() => {
    return calcularKilosTotalesInstituto(registros);
  }, [registros]);

  const handleGuardarRegistro = (
    nuevoAporte: Omit<RegistroReciclaje, 'id' | 'fecha'>
  ) => {
    const nuevoRegistro: RegistroReciclaje = {
      ...nuevoAporte,
      id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fecha: new Date().toISOString(),
    };

    setRegistros((prev) => [nuevoRegistro, ...prev]);
    setSeccionSeleccionada(nuevoRegistro.seccion);
  };

  const handleEliminarRegistro = (id: string) => {
    setRegistros((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRestablecerDatos = () => {
    if (window.confirm('¿Quieres volver a cargar los datos de ejemplo del instituto?')) {
      localStorage.removeItem('reciclar_puntos_registros_v1');
      const iniciales = obtenerRegistros();
      setRegistros(iniciales);
    }
  };

  const handleVaciarTodo = () => {
    if (window.confirm('¿Quieres vaciar todos los registros para comprobar el mensaje de estado vacío?')) {
      localStorage.setItem('reciclar_puntos_registros_v1', JSON.stringify([]));
      setRegistros([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col items-center">
      {/* 
        Contenedor central adaptado desde 320px de ancho para uso con una sola mano.
        Sin desbordes horizontales ni necesidad de hacer zoom.
      */}
      <div className="w-full max-w-lg bg-slate-50 min-h-screen flex flex-col border-x-2 border-slate-300 shadow-lg pb-32">
        
        {/* Barra Superior de la Aplicación - Alto contraste para exteriores bajo sol */}
        <header className="sticky top-0 z-30 bg-emerald-950 text-white px-3 sm:px-4 py-3.5 shadow-md flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 border-2 border-emerald-400 flex items-center justify-center text-emerald-200 shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-tight text-white">
                RECICLAR PUNTOS
              </h1>
              <p className="text-base text-emerald-200 font-semibold leading-tight">
                Competencia del Instituto
              </p>
            </div>
          </div>

          {/* Botones secundarios de acción rápida (min-height 44px) */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                descargarReportePDF({
                  puntajes: puntajesPorSeccion,
                  kilosTotales: kilosTotalesInstituto,
                  metaKilos,
                })
              }
              title="Descargar reporte en PDF"
              className="min-h-[44px] px-2.5 rounded-xl border border-emerald-600 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-base flex items-center gap-1 transition-colors"
            >
              <FileText className="w-5 h-5 text-emerald-300" />
              <span>PDF</span>
            </button>

            <button
              type="button"
              onClick={() => exportarRegistrosAArchivoJSON(registros)}
              title="Guardar copia en archivo de texto"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-emerald-200 hover:text-white rounded-xl border border-emerald-700 bg-emerald-900 hover:bg-emerald-800 transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>

            {/* Botón para vaciar datos y probar estado vacío */}
            <button
              type="button"
              onClick={handleVaciarTodo}
              title="Vaciar datos para comprobar mensaje de estado vacío"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-amber-300 hover:text-white rounded-xl border border-emerald-700 bg-emerald-900 hover:bg-emerald-800 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleRestablecerDatos}
              title="Reiniciar datos de prueba"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-emerald-300 hover:text-white rounded-xl border border-emerald-700 bg-emerald-900 hover:bg-emerald-800 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* 
          Selector de Vista con Botones Secundarios:
          Ambos botones tienen etiquetas visibles y texto >= 16px.
        */}
        <div className="p-3 bg-white border-b-2 border-slate-300">
          <div className="grid grid-cols-2 gap-2 bg-slate-200 p-1.5 rounded-2xl border border-slate-300">
            <button
              type="button"
              onClick={() => setPestanaActiva('registrar')}
              className={`min-h-[48px] rounded-xl text-base font-extrabold transition-all flex items-center justify-center gap-2 ${
                pestanaActiva === 'registrar'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-slate-900 hover:text-black font-bold'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              <span>Anotar Kilos</span>
            </button>

            <button
              type="button"
              id="btn-resultados"
              onClick={() => setPestanaActiva('resultados')}
              className={`min-h-[48px] rounded-xl text-base font-extrabold transition-all flex items-center justify-center gap-2 ${
                pestanaActiva === 'resultados'
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'text-slate-900 hover:text-black font-bold'
              }`}
            >
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Resultados</span>
            </button>
          </div>
        </div>

        {/* Contenido Principal */}
        <main className="p-3 sm:p-4 space-y-4 flex-1">
          
          {/* PANTALLA 1: ANOTAR KILOS */}
          {pestanaActiva === 'registrar' && (
            <div className="space-y-4">
              
              {/* Tarjeta informativa de la competencia */}
              <div className="bg-emerald-900 text-white rounded-2xl p-4 border-2 border-black shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-base font-black text-emerald-300 uppercase tracking-wide">
                    Competencia en Vivo
                  </p>
                  <p className="text-base font-medium text-white mt-0.5">
                    Total acumulado por el instituto:{' '}
                    <strong className="text-xl font-black text-amber-300 font-mono">
                      {kilosTotalesInstituto} kilos
                    </strong>
                  </p>
                </div>
                
                {/* Botón secundario para ir a resultados */}
                <button
                  type="button"
                  onClick={() => setPestanaActiva('resultados')}
                  className="min-h-[48px] px-4 bg-white text-slate-900 font-extrabold text-base rounded-xl border-2 border-black hover:bg-slate-100 transition-colors shrink-0 flex items-center justify-center gap-2"
                >
                  <Trophy className="w-5 h-5 text-amber-600" />
                  <span>Ver posiciones</span>
                </button>
              </div>

              {/* Formulario de registro (con el ÚNICO botón principal de esta pantalla) */}
              <RegisterForm
                onGuardarRegistro={handleGuardarRegistro}
                onIrAResultados={() => setPestanaActiva('resultados')}
                totalRegistrosExistentes={registros.length}
              />

              {/* Historial reciente */}
              <RecentEntriesList
                registros={registros}
                onEliminarRegistro={handleEliminarRegistro}
              />
            </div>
          )}

          {/* PANTALLA 2: RESULTADOS */}
          {pestanaActiva === 'resultados' && (
            <div className="space-y-4">
              
              {/* Requerimiento 3: Meta mensual con porcentaje */}
              <MonthlyGoalCard
                kilosActuales={kilosTotalesInstituto}
                metaKilos={metaKilos}
                onActualizarMeta={setMetaKilos}
              />

              {/* Requerimiento 2: Tabla de posiciones */}
              <LeaderboardTable
                puntajes={puntajesPorSeccion}
                seccionSeleccionada={seccionSeleccionada}
                onSeleccionarSeccion={setSeccionSeleccionada}
                onIrARegistrar={() => setPestanaActiva('registrar')}
              />

              {/* Historial reciente */}
              <RecentEntriesList
                registros={registros}
                onEliminarRegistro={handleEliminarRegistro}
              />

              {/* 
                Requisito 4: UN SOLO BOTÓN PRINCIPAL POR PANTALLA
                En esta pantalla de resultados, el botón principal es la descarga oficial del PDF.
                El botón de volver a anotar es secundario (fondo blanco con borde gris).
              */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    descargarReportePDF({
                      puntajes: puntajesPorSeccion,
                      kilosTotales: kilosTotalesInstituto,
                      metaKilos,
                    })
                  }
                  className="w-full min-h-[54px] bg-emerald-900 hover:bg-black text-white font-black text-base rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 border-2 border-black"
                >
                  <FileText className="w-5 h-5 text-emerald-300" />
                  <span>Descargar Reporte Oficial en PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPestanaActiva('registrar')}
                  className="w-full min-h-[48px] bg-white border-2 border-slate-700 hover:bg-slate-100 text-slate-900 font-bold text-base rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-5 h-5 text-emerald-900" />
                  <span>Anotar otro pesaje de reciclaje</span>
                </button>
              </div>
            </div>
          )}
        </main>

        {/* 
          Barra de Navegación Inferior (Touch Thumb-Zone para manejo con una sola mano):
          Botones de mínimo 54px de alto, texto >= 16px, alto contraste
        */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-3 border-slate-300 px-4 py-2 max-w-lg mx-auto flex items-center justify-around shadow-2xl">
          <button
            type="button"
            onClick={() => setPestanaActiva('registrar')}
            className={`flex-1 min-h-[52px] flex items-center justify-center gap-2 rounded-xl transition-colors mx-1 ${
              pestanaActiva === 'registrar'
                ? 'bg-emerald-900 text-white font-black border-2 border-black'
                : 'text-slate-900 hover:bg-slate-100 font-bold border border-slate-300'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-base">Anotar</span>
          </button>

          <button
            type="button"
            onClick={() => setPestanaActiva('resultados')}
            className={`flex-1 min-h-[52px] flex items-center justify-center gap-2 rounded-xl transition-colors mx-1 ${
              pestanaActiva === 'resultados'
                ? 'bg-emerald-900 text-white font-black border-2 border-black'
                : 'text-slate-900 hover:bg-slate-100 font-bold border border-slate-300'
            }`}
          >
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-base">Resultados</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
