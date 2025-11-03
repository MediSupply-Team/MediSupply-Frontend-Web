import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as Papa from 'papaparse';

// Declaración de módulo para jsPDF con autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: Record<string, unknown>) => jsPDF;
    lastAutoTable?: { finalY: number };
  }
}

export interface ExportData {
  id: string;
  producto: string;
  proveedor: string;
  fecha: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  estado: string;
}

export interface SummaryData {
  ventasCompletadas: number;
  ventasPendientes: number;
  totalVentas: number;
  ingresosTotales: number;
}

export interface FilterData {
  fechaInicio?: string;
  fechaFin?: string;
  estado?: string;
  busqueda?: string;
}

// Función para exportar datos a CSV
export const exportToCSV = (data: ExportData[], filters?: FilterData) => {
  // Preparar los datos para CSV
  const csvData = data.map(item => ({
    'ID': item.id,
    'Producto': item.producto,
    'Proveedor': item.proveedor,
    'Fecha': item.fecha,
    'Cantidad': item.cantidad,
    'Precio Unitario': `$${item.precioUnitario.toLocaleString()}`,
    'Total': `$${item.total.toLocaleString()}`,
    'Estado': item.estado
  }));

  // Convertir a CSV
  const csv = Papa.unparse(csvData, {
    delimiter: ',',
    header: true
  });

  // Crear y descargar el archivo
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const fileName = generateFileName('csv', filters);
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Función para exportar datos a PDF
export const exportToPDF = (data: ExportData[], summary: SummaryData, filters?: FilterData) => {
  const doc = new jsPDF();
  
  // Configuración inicial
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPosition = margin;
  
  // Título principal
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Reporte de Ventas - MediSupply', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;
  
  // Fecha de generación
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;
  
  // Información de filtros aplicados
  if (filters) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Filtros Aplicados:', margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    if (filters.fechaInicio && filters.fechaFin) {
      doc.text(`• Período: ${filters.fechaInicio} - ${filters.fechaFin}`, margin + 5, yPosition);
      yPosition += 6;
    }
    
    if (filters.estado && filters.estado !== '') {
      doc.text(`• Estado: ${filters.estado}`, margin + 5, yPosition);
      yPosition += 6;
    }
    
    if (filters.busqueda && filters.busqueda.trim() !== '') {
      doc.text(`• Búsqueda: "${filters.busqueda}"`, margin + 5, yPosition);
      yPosition += 6;
    }
    
    yPosition += 5;
  }
  
  // Resumen ejecutivo
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumen Ejecutivo', margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const summaryData = [
    ['Ventas Completadas', summary.ventasCompletadas.toString()],
    ['Ventas Pendientes', summary.ventasPendientes.toString()],
    ['Total de Ventas', summary.totalVentas.toString()],
    ['Ingresos Totales', `$${summary.ingresosTotales.toLocaleString()}`]
  ];
  
  doc.autoTable({
    startY: yPosition,
    head: [['Métrica', 'Valor']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    margin: { left: margin, right: margin },
    styles: { fontSize: 10 }
  });
  
  yPosition = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 15 : yPosition + 15;
  
  // Tabla de datos detallados
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Detalle de Ventas', margin, yPosition);
  yPosition += 10;
  
  // Preparar datos para la tabla
  const tableData = data.map(item => [
    item.id,
    item.producto,
    item.proveedor,
    item.fecha,
    item.cantidad.toString(),
    `$${item.precioUnitario.toLocaleString()}`,
    `$${item.total.toLocaleString()}`,
    item.estado
  ]);
  
  doc.autoTable({
    startY: yPosition,
    head: [['ID', 'Producto', 'Proveedor', 'Fecha', 'Cant.', 'P. Unit.', 'Total', 'Estado']],
    body: tableData,
    theme: 'striped',
    headStyles: { 
      fillColor: [41, 128, 185], 
      textColor: 255,
      fontSize: 9
    },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 15 }, // ID
      1: { cellWidth: 25 }, // Producto
      2: { cellWidth: 25 }, // Proveedor
      3: { cellWidth: 20 }, // Fecha
      4: { cellWidth: 15 }, // Cantidad
      5: { cellWidth: 20 }, // Precio Unit.
      6: { cellWidth: 20 }, // Total
      7: { cellWidth: 20 }  // Estado
    },
    margin: { left: margin, right: margin },
    didDrawPage: (data: { pageNumber: number }) => {
      // Agregar número de página
      const str = `Página ${data.pageNumber}`;
      doc.setFontSize(8);
      doc.text(str, pageWidth - margin, doc.internal.pageSize.height - 10, { align: 'right' });
    }
  });
  
  // Descargar el PDF
  const fileName = generateFileName('pdf', filters);
  doc.save(fileName);
};

// Función auxiliar para generar nombres de archivo
const generateFileName = (type: 'csv' | 'pdf', filters?: FilterData): string => {
  const timestamp = new Date().toISOString().split('T')[0];
  let baseName = `reporte-ventas-${timestamp}`;
  
  if (filters) {
    if (filters.fechaInicio && filters.fechaFin) {
      baseName += `_${filters.fechaInicio}_${filters.fechaFin}`;
    }
    if (filters.estado && filters.estado !== '') {
      baseName += `_${filters.estado}`;
    }
  }
  
  return `${baseName}.${type}`;
};

// Función para formatear datos de venta para exportación
export const formatSalesDataForExport = (ventas: {
  id: string;
  producto: string;
  proveedor: string;
  fecha: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  estado: string;
}[]): ExportData[] => {
  return ventas.map(venta => ({
    id: venta.id,
    producto: venta.producto,
    proveedor: venta.proveedor,
    fecha: venta.fecha,
    cantidad: venta.cantidad,
    precioUnitario: venta.precioUnitario,
    total: venta.total,
    estado: venta.estado
  }));
};

// Función para calcular resumen de datos
export const calculateSummary = (data: ExportData[]): SummaryData => {
  const ventasCompletadas = data.filter(item => item.estado.toLowerCase() === 'completado').length;
  const ventasPendientes = data.filter(item => item.estado.toLowerCase() === 'pendiente').length;
  const totalVentas = data.length;
  const ingresosTotales = data
    .filter(item => item.estado.toLowerCase() === 'completado')
    .reduce((sum, item) => sum + item.total, 0);
  
  return {
    ventasCompletadas,
    ventasPendientes,
    totalVentas,
    ingresosTotales
  };
};

// Función para descargar archivos desde URL
export const downloadFileFromUrl = async (url: string, filename?: string) => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error al descargar archivo: ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    
    // Extraer nombre del archivo de la URL si no se proporciona
    if (!filename) {
      const urlParts = url.split('/');
      const urlFilename = urlParts[urlParts.length - 1];
      // Remover parámetros de query de AWS
      filename = urlFilename.split('?')[0];
    }
    
    link.download = filename;
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpiar URL objeto
    window.URL.revokeObjectURL(downloadUrl);
    
    return true;
  } catch (error) {
    console.error('Error al descargar archivo:', error);
    throw error;
  }
};