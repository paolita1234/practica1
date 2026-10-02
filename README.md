# ♻️ Reciclar Puntos · Competencia Escolar de Reciclaje

> **Aplicación web accesible y full-stack diseñada para institutos educativos:** transforma el pesaje físico de residuos reciclables por secciones en una competencia gamificada en vivo, con cálculo automático de puntos, metas mensuales colectivas, reportes oficiales en PDF y análisis de impacto ecológico en tiempo real mediante **Gemini AI** con fuentes científicas citadas.

---

## 📌 Índice de Contenidos
1. [Acceso Rápido y Despliegue](#1-acceso-rápido-y-despliegue)
2. [Estructura del Proyecto y Archivos](#2-estructura-del-proyecto-y-archivos)
3. [Módulos y Funcionalidades de la App](#3-módulos-y-funcionalidades-de-la-app)
4. [Arquitectura Técnica y Stack Tecnológico](#4-arquitectura-técnica-y-stack-tecnológico)
5. [Integración con Gemini AI (Backend Seguro)](#5-integración-con-gemini-ai-backend-seguro)
6. [Manejo de Errores y Blindaje de Datos (QA)](#6-manejo-de-errores-y-blindaje-de-datos-qa)
7. [Diseño Accesible para Celular y Patio Escolar](#7-diseño-accesible-para-celular-y-patio-escolar)
8. [Cómo Correr la Aplicación en Local](#8-cómo-correr-la-aplicación-en-local)
9. [Historial de Mejoras y Commits (P0 a M5)](#9-historial-de-mejoras-y-commits-p0-a-m5)
10. [Bitácora de Prompts con Evidencias](#10-bitácora-de-prompts-con-evidencias)
11. [Tarjeta Anti-Alucinación](#11-tarjeta-anti-alucinación)
12. [Autor y Licencia](#12-autor-y-licencia)

---

## 1. Acceso Rápido y Despliegue
- 🌐 **App publicada en vivo:** [https://ais-pre-l6fwl2fivewl6u63l4czoa-510459053585.us-east1.run.app](https://ais-pre-l6fwl2fivewl6u63l4czoa-510459053585.us-east1.run.app)
- 📱 **Código QR de acceso:** `evidencias/qr.png`
- 🔑 **Autenticación:** No requiere credenciales ni inicio de sesión. Diseñada para operar sin demoras en la balanza del patio escolar.

---

## 2. Estructura del Proyecto y Archivos

```text
├── server.ts                       # Backend Express + Vite middleware + API Gemini segura
├── package.json                    # Dependencias y scripts ("dev": "tsx server.ts")
├── metadata.json                   # Capacidades del servidor en Google AI Studio
├── .env.example                    # Ejemplo de variables requeridas (GEMINI_API_KEY)
├── index.html                      # Punto de entrada HTML con meta viewport optimizado
├── evidencias/                     # Carpeta de capturas y comprobantes del desarrollo
└── src/
    ├── main.tsx                    # Inicialización de React 19
    ├── App.tsx                     # Coordinador de estado global, pestañas y alertas
    ├── index.css                   # Tailwind CSS v4 con variables de alto contraste
    ├── types/
    │   └── recycling.ts            # Interfaces TypeScript (pesajes, puntos, materiales)
    ├── data/
    │   └── initialData.ts          # Factores de puntos por material y secciones base
    ├── utils/
    │   ├── recyclingStorage.ts     # Persistencia LocalStorage, serialización JSON y backup
    │   └── pdfGenerator.ts         # Generación del reporte formal con jsPDF y AutoTable
    └── components/
        ├── RegisterForm.tsx        # Formulario táctil, botones rápidos y validaciones
        ├── LeaderboardTable.tsx    # Tabla de posiciones, podio y desglose por material
        ├── MonthlyGoalCard.tsx     # Barra de progreso mensual y ajuste de meta en kilos
        ├── EquivalenteEcologicoCard.tsx # Métricas de IA (árboles, agua, CO2) y fuentes EPA
        └── RecentEntriesList.tsx   # Historial cronológico con eliminación individual
```

---

## 3. Módulos y Funcionalidades de la App

### 📝 Módulo 1: Registro Táctil de Pesajes (`RegisterForm.tsx`)
- **Selección de Sección:** Botones de un toque para secciones estándar (`1° A`, `1° B`, `2° A`, etc.) u opción de campo libre para secciones especiales (con tope de 30 caracteres).
- **Materiales y Ponderación:**
  - 🧴 **Plástico:** 10 puntos por kg.
  - 📄 **Papel y Cartón:** 5 puntos por kg.
  - 🍾 **Vidrio:** 8 puntos por kg.
  - 🥫 **Aluminio:** 15 puntos por kg.
- **Botones de adición rápida:** Sumadores de `+0.5 kg`, `+1.0 kg` y `+5.0 kg` para agilizar la carga manual en balanza.
- **Previsualización en vivo:** Muestra los puntos calculados antes de presionar el botón de guardado.

### 🏆 Módulo 2: Tabla de Posiciones y Desglose (`LeaderboardTable.tsx`)
- **Podio Gamificado:** Reconocimiento visual con medallas de oro 🥇, plata 🥈 y bronce 🥉 para los primeros 3 puestos.
- **Desglose Exhaustivo por Material:** Botón desplegable que abre una matriz detallada con los kilos exactos de plástico, papel, vidrio y aluminio entregados por cada división.
- **Fila de Totales del Instituto:** Sumatoria global consolidada en la base de la tabla.

### 🎯 Módulo 3: Meta Mensual Colectiva (`MonthlyGoalCard.tsx`)
- **Barra de Progreso Dinámica:** Cálculo porcentual automático del avance del instituto frente al objetivo fijado (ej. 500 kg).
- **Edición en Caliente:** Permite al cuerpo directivo o docente ajustar la meta en kilos del mes con validación de rango (de 1 a 10.000 kg).

### 🤖 Módulo 4: Impacto Ecológico con IA (`EquivalenteEcologicoCard.tsx`)
- **Conversión de Residuos a Recursos Tangibles:** Traduce los kilos del instituto a árboles adultos salvados, litros de agua potable ahorrados, energía eléctrica conservada y emisiones de CO2 evitadas.
- **Citas Técnicas Formales:** Cada métrica exhibe la entidad oficial de donde surge la equivalencia (EPA, WWF, WARM Model, DOE).

### 📄 Módulo 5: Generación y Respaldo de Datos (`pdfGenerator.ts` & `recyclingStorage.ts`)
- **Reporte en PDF Imprimible:** Genera un documento PDF oficial con membrete del concurso, fecha de expedición, tabla de clasificación con puntajes y firmas de las autoridades.
- **Respaldo en JSON:** Descarga directa de la base de datos local en archivo `.json` para salvaguardar la información o migrarla a otra computadora.

---

## 4. Arquitectura Técnica y Stack Tecnológico

| Capa | Herramienta | Función en la App |
|---|---|---|
| **Frontend UI** | React 19 + TypeScript | Componentes modulares, estado reactivo y tipado estricto. |
| **Estilos** | Tailwind CSS v4 | Diseño responsive adaptado a pantallas pequeñas (320 px) y luz solar. |
| **Backend** | Node.js + Express (`server.ts`) | Manejo de middleware Vite en desarrollo y proxy seguro de la API de IA. |
| **Inteligencia Artificial** | SDK `@google/genai` (Gemini 3.8 Flash) | Generación estructurada de equivalencias ecológicas con `responseSchema`. |
| **Generación de PDF** | jsPDF + jsPDF-AutoTable | Creación del reporte formal directamente en memoria del navegador. |
| **Iconografía** | Lucide React | Iconos vectoriales limpios y de alto contraste. |
| **Almacenamiento** | LocalStorage API | Persistencia de datos en el cliente sin requerir configuración de servidor. |

---

## 5. Integración con Gemini AI (Backend Seguro)

La app no expone claves en el navegador; todas las consultas viajan por el endpoint local `POST /api/gemini/equivalente-ecologico`.

### Esquema JSON Estricto (`responseSchema`)
Se exige al modelo `gemini-3.8-flash` una estructura inmutable de objetos tipados:

```typescript
const conversionSchema = {
  type: Type.OBJECT,
  properties: {
    kilos: { type: Type.NUMBER },
    material: { type: Type.STRING },
    equivalentes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          metrica: { type: Type.STRING },
          valor: { type: Type.NUMBER },
          unidad: { type: Type.STRING },
          icono: { type: Type.STRING },
          factorUsado: { type: Type.STRING },
          fuente: { type: Type.STRING }
        },
        required: ['metrica', 'valor', 'unidad', 'icono', 'factorUsado', 'fuente']
      }
    }
  },
  required: ['kilos', 'material', 'equivalentes']
};
```

### Tolerancia a Fallos y Modo Offline EPA
Si la clave `GEMINI_API_KEY` no está configurada, si se corta la conexión o si la llamada demora más de 9 segundos (`AbortController`), el servidor responde con una **tabla de conversión técnica determinística basada en el modelo WARM de la EPA**:
- **Plástico:** 1.5 kg CO2 evitados y 24 L agua/kg (EPA).
- **Papel:** 17 árboles por tonelada y 26 L agua/kg (EPA / Water Footprint Network).
- **Vidrio:** 0.42 kWh/kg y 1.2 kg arena virgen preservada (FEVE / GPI).
- **Aluminio:** 14 kWh/kg y 9.2 kg CO2 evitados (The Aluminum Association).

---

## 6. Manejo de Errores y Blindaje de Datos (QA)

Se solucionaron 4 vulnerabilidades críticas de uso real en la interfaz:

1. **Bloqueo de Doble Clic:** El botón de registro se desactiva durante 1.2 segundos tras ser presionado, evitando duplicar registros por toques repetidos en pantallas táctiles.
2. **Validación Numérica Estricta:** Expresión regular `/^\d+([.,]\d{1,2})?$/` que rechaza letras pegadas (como `"12kg"` o `"10cajas"`), notación científica o múltiples puntos/comas.
3. **Tope de Balanza Escolar:** Límite máximo de 500 kg por pesaje individual para evitar números desproporcionados accidentales.
4. **Límite de Longitud y Espacios Vacíos:** Restricción a 30 caracteres máximos en nombres de sección y validación contra cadenas de espacios en blanco.

---

## 7. Diseño Accesible para Celular y Patio Escolar

- **Ancho mínimo verificado:** Operatividad fluida en pantallas desde **320 px** sin desplazamiento horizontal.
- **Uso con una sola mano:** Controles principales situados en la mitad inferior de la pantalla para fácil alcance del pulgar.
- **Alto Contraste para Uso al Sol:** Colores oscuros profundos (`#000000`, `#064e3b`) sobre fondos blancos y grises claros (`#f8fafc`), cumpliendo con la pauta WCAG AAA.
- **Tipografía legible:** Ningún texto informativo posee un tamaño menor a **16 px** (`text-base`), garantizando lectura sin necesidad de zoom.
- **Jerarquía:** Un solo botón primario destacado por pantalla, con botones secundarios claramente diferenciados con bordes neutros.

---

## 8. Cómo Correr la Aplicación en Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/usuario/reciclar-puntos.git
cd reciclar-puntos

# 2. Instalar los paquetes npm
npm install

# 3. Configurar la clave de API (Opcional, cuenta con fallback EPA automático)
cp .env.example .env
# Editar .env y definir: GEMINI_API_KEY="tu_clave_de_google_ai_studio"

# 4. Iniciar el servidor local
npm run dev
# Abrir en el navegador: http://localhost:3000
```

---

## 9. Historial de Mejoras y Commits (P0 a M5)

| Hito | Nombre del Peldaño | Qué se implementó | Hash de Commit |
|---|---|---|---|
| **P0** | Prototipo Inicial | Formulario de pesaje básico, cálculo de puntos y meta mensual | `bcf2d48` |
| **M1** | Funcionalidad y Reportes | Botón de desglose detallado por material + exportación de reporte formal en PDF | `31c3e98` / `af4be34` |
| **M2** | Datos y Persistencia | Almacenamiento seguro en LocalStorage y exportación a archivo JSON descargable | `f455378` |
| **M3** | Experiencia Móvil | Optimización táctil 320 px, alto contraste solar, textos >= 16 px y estado vacío | `6e36bbd` / `841ef54` |
| **M4** | Blindaje y Robustez | Corrección de los 4 errores de QA (letras en números, doble toque, 500 chars, tope balanza) | `d36286d` |
| **M5** | Inteligencia Ambiental | Conexión con Gemini 3.8 Flash, `responseSchema` fijo y fallback con fuentes EPA | `2b615e0` |

---

## 10. Bitácora de Prompts con Evidencias

### P0 · Prototipo Inicial
- **Prompt:** *"Crea una aplicación web para una competencia de reciclaje entre secciones de un instituto educativo. Debe permitir registrar pesajes en kilos de plástico, papel, vidrio y aluminio asignando puntos por material, mostrar una tabla de posiciones ordenada y una meta mensual con porcentaje de avance."*
- **Captura del Prompt:** ![Captura P0](evidencias/P0-prompt.png)
- **Evidencia del Resultado:** `evidencias/E0-inicial.png` | **Commit:** `bcf2d48`

### M1 · Función y Reporte PDF
- **Prompt:** *"Agrega un botón en la tabla de posiciones para ver el desglose exacto de kilos de cada material por sección y una fila de totales generales. Además, permite descargar un reporte oficial en PDF con la tabla completa."*
- **Captura del Prompt:** ![Captura M1](evidencias/M1-prompt.png)
- **Evidencia del Resultado:** `evidencias/E1-antes.png` y `evidencias/E1-despues.png` | **Commit:** `31c3e98` / `af4be34`

### M2 · Persistencia LocalStorage y Respaldo
- **Prompt:** *"Asegura que los datos no se pierdan al cerrar el navegador usando localStorage y añade una opción para exportar una copia de seguridad en archivo JSON descargable."*
- **Captura del Prompt:** ![Captura M2](evidencias/M2-prompt.png)
- **Evidencia del Resultado:** `evidencias/E2-antes.png` y `evidencias/E2-despues.png` | **Commit:** `f455378`

### M3 · Experiencia Móvil y Accesibilidad Solar
- **Prompt:** *"Adapta la interfaz para que se use perfecto desde 320 px de ancho, con una sola mano, sin hacer zoom, contraste alto para leer al sol, texto nunca menor a 16 px, etiquetas visibles en todos los campos, un solo botón principal por pantalla y estado vacío con invitación a la primera acción."*
- **Captura del Prompt:** ![Captura M3](evidencias/M3-prompt.png)
- **Evidencia del Resultado:** `evidencias/E3-celular.png` y `evidencias/E3-vacio.png` | **Commit:** `6e36bbd` / `841ef54`

### M4 · Robustez y Corrección de Fallos
- **Prompt:** *"Actúa como tester de software: dame diez formas de romper la app desde la interfaz (campos vacíos, letras en números, ráfaga de doble clic, 500 caracteres, números astronómicos) y resuelve los 4 errores críticos."*
- **Captura del Prompt:** ![Captura M4](evidencias/M4-prompt.png)
- **Evidencia del Resultado:** `evidencias/E4-error.png` | **Commit:** `d36286d`

### M5 · Inteligencia Estructurada con IA
- **Prompt:** *"Integra una llamada a la API de Gemini dentro de la app para convertir los kilos en equivalentes ecológicos comprensibles (árboles, agua, CO2) citando fuentes con responseSchema fijo en JSON, mostrándolo como datos numéricos en tarjetas, con lectura de API key en variable de entorno, manejo de timeout/fallo con tabla EPA y ejemplo mock."*
- **Captura del Prompt:** ![Captura M5](evidencias/M5-prompt.png)
- **Evidencia del Resultado:** `evidencias/E5-json.png`, `evidencias/E5-app.png` y `evidencias/E5-falla.png` | **Commit:** `2b615e0`

---

## 11. Tarjeta Anti-Alucinación

| Afirmación de la IA | Verificación Realizada | Conclusión y Corrección |
|---|---|---|
| *"Usa `import { GoogleGenerativeAI } from '@google/genai'`"* | Consulta al SDK oficial v2.4 | **Falso.** El nombre correcto en el SDK moderno es `GoogleGenAI`. Corregido en `server.ts`. |
| *"La propiedad `.text()` de la respuesta se invoca como función"* | Revisión de los tipos `.d.ts` de `@google/genai` | **Falso.** `.text` es un *getter* de propiedad. Se corrigió a `response.text`. |
| *"Con hacer `parseFloat('12kg')` ya validas que sea número"* | Testeo en consola de JavaScript | **Falso.** `parseFloat` trunca el texto y devuelve `12`. Se implementó la regex estricta `/^\d+([.,]\d{1,2})?$/`. |

---

## 12. Autor y Licencia

- **Desarrolladora:** **Paola Michelle Ramírez**
- **Programa:** 3.er año · Tecnicatura en Desarrollo de Software
- **Institución:** INDEL (Instituto Nacional de Educación Laboral)
- **Fecha:** Octubre de 2026
- **Licencia:** Distribuido bajo licencia libre **MIT**. Consulta el archivo `LICENSE` para términos y condiciones.
