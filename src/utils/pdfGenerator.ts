import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PuntajeSeccion } from '../types/recycling';
import { calcularAvanceMeta } from './recyclingStorage';

interface GenerarPdfParams {
  puntajes: PuntajeSeccion[];
  kilosTotales: number;
  metaKilos: number;
}

/**
 * Genera y descarga un informe oficial en formato PDF de la competencia
 * con la tabla de posiciones, desglose por material y avance de la meta mensual.
 */
export function descargarReportePDF({
  puntajes,
  kilosTotales,
  metaKilos,
}: GenerarPdfParams): void {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const fechaHoy = new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date());

    const { porcentajeReal, kilosFaltantes, metaAlcanzada } = calcularAvanceMeta(
      kilosTotales,
      metaKilos
    );

    // --- ENCABEZADO INSTITUCIONAL ---
    // Franja verde superior
    doc.setFillColor(22, 101, 52); // Tailwind emerald-800
    doc.rect(0, 0, 210, 24, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('RECICLAR PUNTOS - REPORTE OFICIAL', 14, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Competencia Intersecciones de Instituto', 14, 18);

    doc.setFontSize(8);
    doc.text(`Fecha de emisión: ${fechaHoy}`, 196, 18, { align: 'right' });

    // --- BLOQUE DE RESUMEN DE LA META MENSUAL ---
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('1. Estado de la Meta Mensual', 14, 32);

    // Recuadro contenedor del resumen
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.roundedRect(14, 35, 182, 22, 2, 2, 'FD');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Total recolectado:', 18, 43);
    doc.setFont('helvetica', 'bold');
    doc.text(`${kilosTotales} kg`, 48, 43);

    doc.setFont('helvetica', 'normal');
    doc.text('Meta mensual:', 80, 43);
    doc.setFont('helvetica', 'bold');
    doc.text(`${metaKilos} kg`, 108, 43);

    doc.setFont('helvetica', 'normal');
    doc.text('Avance:', 140, 43);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 101, 52);
    doc.text(`${porcentajeReal}%`, 155, 43);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const mensajeEstado = metaAlcanzada
      ? '¡Objetivo mensual superado con éxito por el instituto!'
      : `Restan ${kilosFaltantes} kg para cumplir el objetivo del mes.`;
    doc.text(`Estado: ${mensajeEstado}`, 18, 51);

    // --- TABLA DE POSICIONES Y DESGLOSE POR MATERIAL ---
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('2. Tabla de Posiciones por Sección y Tipo de Material', 14, 65);

    // Mapeo de filas
    const cuerpoTabla = puntajes.map((p, index) => [
      `${index + 1}°`,
      p.seccion,
      `${p.kilosTotales} kg`,
      `${p.puntosTotales} pts`,
      `${p.desgloseKilos.plastico} kg`,
      `${p.desgloseKilos.papel} kg`,
      `${p.desgloseKilos.vidrio} kg`,
      `${p.desgloseKilos.aluminio} kg`,
    ]);

    // Fila de totales generales
    const totalPlastico = puntajes.reduce((acc, p) => acc + p.desgloseKilos.plastico, 0);
    const totalPapel = puntajes.reduce((acc, p) => acc + p.desgloseKilos.papel, 0);
    const totalVidrio = puntajes.reduce((acc, p) => acc + p.desgloseKilos.vidrio, 0);
    const totalAluminio = puntajes.reduce((acc, p) => acc + p.desgloseKilos.aluminio, 0);
    const totalPuntos = puntajes.reduce((acc, p) => acc + p.puntosTotales, 0);

    const filaTotales = [
      'TOTAL',
      'Instituto',
      `${kilosTotales} kg`,
      `${Number(totalPuntos.toFixed(1))} pts`,
      `${Number(totalPlastico.toFixed(1))} kg`,
      `${Number(totalPapel.toFixed(1))} kg`,
      `${Number(totalVidrio.toFixed(1))} kg`,
      `${Number(totalAluminio.toFixed(1))} kg`,
    ];

    autoTable(doc, {
      startY: 68,
      head: [
        [
          'Pos.',
          'Sección',
          'Kilos Tot.',
          'Puntos',
          'Plástico',
          'Papel/Cartón',
          'Vidrio',
          'Aluminio',
        ],
      ],
      body: cuerpoTabla,
      foot: [filaTotales],
      theme: 'grid',
      headStyles: {
        fillColor: [22, 101, 52],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
        halign: 'center',
      },
      footStyles: {
        fillColor: [241, 245, 249],
        textColor: [15, 23, 42],
        fontStyle: 'bold',
        fontSize: 8,
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [30, 41, 59],
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 12 },
        1: { halign: 'left', fontStyle: 'bold', cellWidth: 28 },
        2: { halign: 'right', fontStyle: 'bold', cellWidth: 24 },
        3: { halign: 'right', fontStyle: 'bold', textColor: [22, 101, 52], cellWidth: 24 },
        4: { halign: 'right', cellWidth: 23 },
        5: { halign: 'right', cellWidth: 24 },
        6: { halign: 'right', cellWidth: 23 },
        7: { halign: 'right', cellWidth: 24 },
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      margin: { left: 14, right: 14 },
    });

    // --- REGLAS DE PUNTUACIÓN Y PIE DE PÁGINA ---
    const finalY = ((doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 180) + 8;

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(
      'Reglas de puntuación aplicadas: Plástico = 10 pts/kg · Aluminio = 15 pts/kg · Vidrio = 8 pts/kg · Papel/Cartón = 5 pts/kg.',
      14,
      finalY
    );
    doc.text(
      'Documento oficial emitido para control y motivación de las secciones. "Reciclar no se sostiene si nadie ve el resultado."',
      14,
      finalY + 5
    );

    // Guardar y descargar archivo en el cliente
    const nombreArchivo = `reciclar_puntos_reporte_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(nombreArchivo);
  } catch (error) {
    console.error('Error al generar el reporte en PDF:', error);
  }
}
