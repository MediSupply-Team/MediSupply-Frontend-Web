'use client';

import React from 'react';
import { exportToCSV, exportToPDF, calculateSummary } from '@/utils/export';

const ExportDemo = () => {
  const datosDemo = [
    {
      id: 'V-001',
      producto: 'Paracetamol 500mg',
      proveedor: 'Farmacia Central',
      fecha: '2025-11-01',
      cantidad: 100,
      precioUnitario: 500,
      total: 50000,
      estado: 'completado'
    },
    {
      id: 'V-002',
      producto: 'Ibuprofeno 400mg',
      proveedor: 'MediSupply',
      fecha: '2025-11-02',
      cantidad: 50,
      precioUnitario: 800,
      total: 40000,
      estado: 'pendiente'
    },
    {
      id: 'V-003',
      producto: 'Amoxicilina 250mg',
      proveedor: 'Laboratorios ABC',
      fecha: '2025-11-03',
      cantidad: 200,
      precioUnitario: 1200,
      total: 240000,
      estado: 'completado'
    }
  ];

  const filtrosDemo = {
    fechaInicio: '2025-11-01',
    fechaFin: '2025-11-03',
    estado: '',
    busqueda: ''
  };

  const handleExportCSV = () => {
    exportToCSV(datosDemo, filtrosDemo);
  };

  const handleExportPDF = () => {
    const summary = calculateSummary(datosDemo);
    exportToPDF(datosDemo, summary, filtrosDemo);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Demo de Exportación</h1>
      <p>Este es un demo para probar las funciones de exportación</p>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Datos de ejemplo:</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Producto</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Proveedor</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Fecha</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Cantidad</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Precio Unit.</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Total</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {datosDemo.map((item) => (
              <tr key={item.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.id}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.producto}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.proveedor}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.fecha}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.cantidad}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>${item.precioUnitario.toLocaleString()}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>${item.total.toLocaleString()}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={handleExportCSV}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Exportar CSV
        </button>
        
        <button 
          onClick={handleExportPDF}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Exportar PDF
        </button>
      </div>
    </div>
  );
};

export default ExportDemo;