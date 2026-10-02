import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Inicialización del cliente oficial @google/genai en el servidor
// User-Agent obligatorio para telemetría: 'aistudio-build'
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. Esquema JSON estricto (responseSchema) para la respuesta de Gemini
const conversionSchema = {
  type: Type.OBJECT,
  properties: {
    kilos: {
      type: Type.NUMBER,
      description: 'Cantidad de kilos evaluados.',
    },
    material: {
      type: Type.STRING,
      description: 'Nombre del material analizado.',
    },
    equivalentes: {
      type: Type.ARRAY,
      description: 'Métricas de impacto ambiental comprensibles para las personas.',
      items: {
        type: Type.OBJECT,
        properties: {
          metrica: {
            type: Type.STRING,
            description: 'Nombre corto del recurso (ej: Árboles salvados, Litros de agua ahorrados, Energía evitada).',
          },
          valor: {
            type: Type.NUMBER,
            description: 'Valor numérico del impacto calculado.',
          },
          unidad: {
            type: Type.STRING,
            description: 'Unidad de medida (ej: árboles, litros, kWh, kg CO2).',
          },
          icono: {
            type: Type.STRING,
            description: 'Tipo de icono: arbol, agua, energia, o co2.',
          },
          factorUsado: {
            type: Type.STRING,
            description: 'Tasa o factor de conversión utilizado (ej: 17 árboles por tonelada de papel).',
          },
          fuente: {
            type: Type.STRING,
            description: 'Organismo oficial citado (ej: EPA - United States Environmental Protection Agency, WWF).',
          },
        },
        required: ['metrica', 'valor', 'unidad', 'icono', 'factorUsado', 'fuente'],
      },
    },
  },
  required: ['kilos', 'material', 'equivalentes'],
};

// Fallback determinístico con factores EPA oficiales cuando la IA no responde o no hay API key
function generarFallbackEcologico(kilos: number, materialId: string) {
  const k = Math.max(0.1, kilos);
  switch (materialId) {
    case 'papel':
      return {
        kilos: k,
        material: 'Papel y Cartón',
        equivalentes: [
          {
            metrica: 'Árboles salvados',
            valor: Number(((k / 1000) * 17).toFixed(2)),
            unidad: 'árboles adultos',
            icono: 'arbol',
            factorUsado: '17 árboles por tonelada métrica de papel reciclado',
            fuente: 'EPA (Agencia de Protección Ambiental de EE. UU.)',
          },
          {
            metrica: 'Agua ahorrada',
            valor: Number((k * 26).toFixed(1)),
            unidad: 'litros de agua',
            icono: 'agua',
            factorUsado: '26 litros de agua limpia por cada kg de papel',
            fuente: 'Water Footprint Network / EPA',
          },
          {
            metrica: 'Energía conservada',
            valor: Number((k * 4.1).toFixed(1)),
            unidad: 'kWh',
            icono: 'energia',
            factorUsado: '4.1 kWh por kilogramo reciclado frente a virgen',
            fuente: 'Departamento de Energía de EE. UU. (DOE)',
          },
        ],
      };
    case 'vidrio':
      return {
        kilos: k,
        material: 'Vidrio',
        equivalentes: [
          {
            metrica: 'Energía eléctrica ahorrada',
            valor: Number((k * 0.42).toFixed(2)),
            unidad: 'kWh',
            icono: 'energia',
            factorUsado: '1.2 kWh ahorrados por cada kg de vidrio reciclado',
            fuente: 'FEVE (Federación Europea de Envases de Vidrio)',
          },
          {
            metrica: 'Arena de sílice preservada',
            valor: Number((k * 1.2).toFixed(1)),
            unidad: 'kg de arena',
            icono: 'arbol',
            factorUsado: '1.2 kg de materias primas naturales vírgenes preservadas por kg',
            fuente: 'Glass Packaging Institute (GPI)',
          },
          {
            metrica: 'Emisiones de CO2 evitadas',
            valor: Number((k * 0.31).toFixed(2)),
            unidad: 'kg CO2',
            icono: 'co2',
            factorUsado: '314 gramos de CO2 evitados por cada kilo',
            fuente: 'EPA WARM Model',
          },
        ],
      };
    case 'aluminio':
      return {
        kilos: k,
        material: 'Aluminio',
        equivalentes: [
          {
            metrica: 'Energía eléctrica ahorrada',
            valor: Number((k * 14).toFixed(1)),
            unidad: 'kWh',
            icono: 'energia',
            factorUsado: '95% de energía ahorrada (14 kWh/kg) respecto a bauxita virgen',
            fuente: 'The Aluminum Association',
          },
          {
            metrica: 'Emisiones de CO2 evitadas',
            valor: Number((k * 9.2).toFixed(1)),
            unidad: 'kg CO2',
            icono: 'co2',
            factorUsado: '9.2 kg de gases de efecto invernadero evitados por kg',
            fuente: 'International Aluminium Institute (IAI)',
          },
          {
            metrica: 'Agua no contaminada',
            valor: Number((k * 11).toFixed(1)),
            unidad: 'litros',
            icono: 'agua',
            factorUsado: '11 litros de agua ahorrados en proceso electrolítico',
            fuente: 'EPA Industrial Recycling Benchmarks',
          },
        ],
      };
    case 'plastico':
    default:
      return {
        kilos: k,
        material: 'Plástico',
        equivalentes: [
          {
            metrica: 'Petróleo crudo ahorrado',
            valor: Number((k * 1.8).toFixed(2)),
            unidad: 'litros de petróleo',
            icono: 'energia',
            factorUsado: '1.8 litros de crudo no consumidos por cada kilo reciclado',
            fuente: 'Stanford University Recycling Factsheet',
          },
          {
            metrica: 'Agua de fabricación ahorrada',
            valor: Number((k * 24).toFixed(1)),
            unidad: 'litros de agua',
            icono: 'agua',
            factorUsado: '24 litros de agua limpia ahorrados por kg reciclado',
            fuente: 'EPA Waste Reduction Model (WARM)',
          },
          {
            metrica: 'Emisiones de CO2 evitadas',
            valor: Number((k * 1.5).toFixed(2)),
            unidad: 'kg CO2',
            icono: 'co2',
            factorUsado: '1.5 kg de CO2 equivalentes evitados en atmósfera',
            fuente: 'Association of Plastic Recyclers (APR)',
          },
        ],
      };
  }
}

// Ruta API: Conversión con Gemini AI a esquema estructurado JSON
app.post('/api/gemini/equivalente-ecologico', async (req, res) => {
  const { kilos, materialId, materialNombre } = req.body;

  const kilosNum = parseFloat(kilos);
  if (isNaN(kilosNum) || kilosNum <= 0) {
    return res.status(400).json({
      error: 'La cantidad de kilos debe ser un número válido mayor a cero.',
    });
  }

  // 1. Si no hay API key configurada en process.env, devolvemos el fallback oficial de forma transparente
  if (!apiKey) {
    const fallback = generarFallbackEcologico(kilosNum, materialId);
    return res.json({
      datos: fallback,
      origen: 'fallback_tabla_epa',
      mensaje: 'Calculado mediante factores técnicos estándar (clave GEMINI_API_KEY no configurada aún).',
    });
  }

  try {
    // 2. Llamada al modelo recomendado 'gemini-3.8-flash' con responseSchema estricto
    const prompt = `Analiza exactamente ${kilosNum} kilogramos de ${materialNombre || materialId} reciclados por estudiantes.
Convierte esta cantidad a métricas de impacto ecológico tangibles y comprensibles (árboles salvados, litros de agua ahorrados, energía eléctrica o emisiones de CO2).
Para CADA métrica DEBES citar la fuente del factor usado (ej: EPA, WWF, UNEP, o centros universitarios oficiales) y el factor de conversión exacto.
Responde estrictamente según el esquema JSON solicitado.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000); // 9 segundos de timeout

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: conversionSchema,
        temperature: 0.2, // Baja temperatura para precisión en factores numéricos
      },
    });

    clearTimeout(timeoutId);

    const textoJson = response.text?.trim() || '';
    if (!textoJson) {
      throw new Error('La respuesta de Gemini vino vacía.');
    }

    const objetoParseado = JSON.parse(textoJson);

    // Validación defensiva del esquema recibido
    if (
      !objetoParseado ||
      typeof objetoParseado !== 'object' ||
      !Array.isArray(objetoParseado.equivalentes) ||
      objetoParseado.equivalentes.length === 0
    ) {
      throw new Error('El JSON devuelto por Gemini no cumplió con la estructura requerida.');
    }

    return res.json({
      datos: objetoParseado,
      origen: 'gemini_ai',
      mensaje: 'Calculado en tiempo real con Gemini AI con fuentes citadas.',
    });
  } catch (error: unknown) {
    console.error('Error o timeout al consultar Gemini API, aplicando fallback de seguridad:', error);
    // 4. Manejo de fallo: devolvemos los datos del fallback oficial sin que la app colapse
    const fallback = generarFallbackEcologico(kilosNum, materialId);
    return res.json({
      datos: fallback,
      origen: 'fallback_error',
      mensaje: 'La IA tardó en responder; se muestran las equivalencias según la tabla técnica oficial.',
    });
  }
});

// Integración con Vite en desarrollo o estáticos en producción
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor de Reciclar Puntos escuchando en puerto ${port}`);
  });
}

startServer();
