/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, PlusCircle, Sparkles, RefreshCw, BarChart3, HelpCircle } from 'lucide-react';
import { RegistroReciclaje } from './types/recycling';
import {
  obtenerRegistros,
  guardarRegistros,
  obtenerMetaMensual,
  guardarMetaMensual,
  calcularPuntajesPorSeccion,
  calcularKilosTotalesInstituto,
} from './utils/recyclingStorage';
import { RegisterForm } from './components/RegisterForm';
import { LeaderboardTable } from './components/LeaderboardTable';
import { MonthlyGoalCard } from './components/MonthlyGoalCard';
import { RecentEntriesList } from './components/RecentEntriesList';

export default function App() {
  // Estado principal de navegación: 'registrar' o 'resultados'
  // Al abrir la app, el usuario puede dar click directamente en el botón 'Resultados'
  const [pestanaActiva, setPestanaActiva] = useState<'registrar' | 'resultados'>('registrar');

  // Estado con la lista de registros (cargados desde localStorage o datos iniciales)
  const [registros, setRegistros] = useState<RegistroReciclaje[]>(() => obtenerRegistros());

  // Meta mensual de kilos para todo el instituto
  const [metaKilos, setMetaKilos] = useState<number>(() => obtenerMetaMensual());

  // Sección opcional seleccionada para resaltar en la tabla
  const [seccionSeleccionada, setSeccionSeleccionada] = useState<string | undefined>(undefined);

  /**
   * ⚠️ PUNTO CRÍTICO DONDE ALGUIEN PODRÍA EQUIVOCARSE:
   * Guardar en localStorage dentro de un useEffect asegura que cada nuevo pesaje
   * quede persistido en la memoria del celular sin llamadas innecesarias o desincronizadas.
   */
  useEffect(() => {
    guardarRegistros(registros);
  }, [registros]);

  useEffect(() => {
    guardarMetaMensual(metaKilos);
  }, [metaKilos]);

  /**
   * Cálculos memorizados para rendimiento óptimo en dispositivos móviles.
   * Evita recalcular ordenamientos de tabla en cada render si los registros no cambiaron.
   */
  const puntajesPorSeccion = useMemo(() => {
    return calcularPuntajesPorSeccion(registros);
  }, [registros]);

  const kilosTotalesInstituto = useMemo(() => {
    return calcularKilosTotalesInstituto(registros);
  }, [registros]);

  /**
   * Manejador para registrar un nuevo pesaje
   */
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

  /**
   * Manejador para revertir/eliminar un aporte si hubo error de balanza
   */
  const handleEliminarRegistro = (id: string) => {
    setRegistros((prev) => prev.filter((r) => r.id !== id));
  };

  /**
   * Reiniciar a datos de ejemplo si se desea limpiar o probar desde cero
   */
  const handleRestablecerDatos = () => {
    if (window.confirm('¿Deseas restaurar los registros de ejemplo para la competencia?')) {
      localStorage.removeItem('reciclar_puntos_registros_v1');
      const iniciales = obtenerRegistros();
      setRegistros(iniciales);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center">
      {/* 
        Contenedor central con proporción móvil (Mobile-First):
        En teléfonos ocupa el 100% del ancho con padding táctil.
        En pantallas grandes se muestra como una interfaz de dispositivo elegante y centrada.
      */}
      <div className="w-full max-w-lg bg-slate-50 min-h-screen flex flex-col border-x border-slate-200/80 shadow-md pb-24">
        
        {/* Barra Superior de la Aplicación (Top App Bar Android) */}
        <header className="sticky top-0 z-30 bg-emerald-800 text-white px-4 py-3 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700/80 border border-emerald-600 flex items-center justify-center text-emerald-200 shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight leading-tight">
                RECICLAR PUNTOS
              </h1>
              <p className="text-[11px] text-emerald-200 leading-tight">
                Competencia Intersecciones de Instituto
              </p>
            </div>
          </div>

          {/* Botón para reiniciar datos de prueba si se requiere */}
          <button
            type="button"
            onClick={handleRestablecerDatos}
            title="Restablecer datos de prueba"
            className="p-1.5 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-700/60 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </header>

        {/* 
          Selector de Vista Principal:
          Botón 'Resultados' cumple directamente con el criterio de aceptación:
          "abro la app, hago click en un boton llamado resultados y veo una tabla con lo que te pedi sin ningún error en la consola."
        */}
        <div className="p-3 bg-white border-b border-slate-200">
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setPestanaActiva('registrar')}
              className={`h-11 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[44px] ${
                pestanaActiva === 'registrar'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar Kilos</span>
            </button>

            <button
              type="button"
              id="btn-resultados"
              onClick={() => setPestanaActiva('resultados')}
              className={`h-11 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[44px] ${
                pestanaActiva === 'resultados'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 shadow-2xs'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Resultados</span>
            </button>
          </div>
        </div>

        {/* Contenido Principal según la pestaña activa */}
        <main className="p-3 sm:p-4 space-y-4 flex-1">
          
          {/* VISTA 1: REGISTRAR KILOS */}
          {pestanaActiva === 'registrar' && (
            <div className="space-y-4">
              {/* Banner rápido para ir directamente a Resultados si el usuario lo desea */}
              <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
                    Competencia en Vivo
                  </p>
                  <p className="text-sm font-bold mt-0.5">
                    ¿Quieres ver cómo van las secciones?
                  </p>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    Total reciclado: <span className="font-mono font-bold text-white">{kilosTotalesInstituto} kg</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPestanaActiva('resultados')}
                  className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <Trophy className="w-3.5 h-3.5 text-slate-900" />
                  Resultados
                </button>
              </div>

              {/* Formulario de registro (Requerimiento 1) */}
              <RegisterForm
                onGuardarRegistro={handleGuardarRegistro}
                onIrAResultados={() => setPestanaActiva('resultados')}
              />

              {/* Historial reciente para control */}
              <RecentEntriesList
                registros={registros}
                onEliminarRegistro={handleEliminarRegistro}
              />
            </div>
          )}

          {/* VISTA 2: RESULTADOS (Cumple con Requerimientos 2 y 3, y Criterio de Aceptación) */}
          {pestanaActiva === 'resultados' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Requerimiento 3: Meta mensual con porcentaje de avance */}
              <MonthlyGoalCard
                kilosActuales={kilosTotalesInstituto}
                metaKilos={metaKilos}
                onActualizarMeta={setMetaKilos}
              />

              {/* Requerimiento 2: Tabla de posiciones entre secciones */}
              <LeaderboardTable
                puntajes={puntajesPorSeccion}
                seccionSeleccionada={seccionSeleccionada}
                onSeleccionarSeccion={setSeccionSeleccionada}
              />

              {/* Historial reciente visible en resultados */}
              <RecentEntriesList
                registros={registros}
                onEliminarRegistro={handleEliminarRegistro}
              />

              {/* Botón para volver a registrar pesaje */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setPestanaActiva('registrar')}
                  className="w-full h-11 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-700" />
                  Registrar otro pesaje de reciclaje
                </button>
              </div>
            </div>
          )}
        </main>

        {/* 
          Barra de Navegación Inferior (Estilo Android Bottom Navigation Bar)
          Diseñada para alcance natural con el pulgar en celulares
        */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-6 max-w-lg mx-auto flex items-center justify-around shadow-lg">
          <button
            type="button"
            onClick={() => setPestanaActiva('registrar')}
            className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-colors min-h-[48px] ${
              pestanaActiva === 'registrar'
                ? 'text-emerald-800 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <PlusCircle className={`w-5 h-5 ${pestanaActiva === 'registrar' ? 'text-emerald-700' : 'text-slate-400'}`} />
            <span className="text-[11px] mt-0.5 tracking-tight">Registrar</span>
          </button>

          <button
            type="button"
            onClick={() => setPestanaActiva('resultados')}
            className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-colors min-h-[48px] ${
              pestanaActiva === 'resultados'
                ? 'text-emerald-800 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Trophy className={`w-5 h-5 ${pestanaActiva === 'resultados' ? 'text-amber-500' : 'text-slate-400'}`} />
            <span className="text-[11px] mt-0.5 tracking-tight">Resultados</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
