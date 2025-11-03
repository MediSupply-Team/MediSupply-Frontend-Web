import { NextRequest, NextResponse } from 'next/server';

// Datos mock para estadísticas
const mockEstadisticas = {
  ventasTotales: 1250,
  pedidosPendientes: 45,
  productosEnStock: 3240,
  rendimientoVentas: {
    porcentaje: 85.2,
    comparacionAnterior: 12.5
  }
};

// Datos mock para gráficos
const mockGraficos = {
  puntos: [
    { x: 1, y: 1200 },
    { x: 2, y: 1350 },
    { x: 3, y: 1100 },
    { x: 4, y: 1450 },
    { x: 5, y: 1600 },
    { x: 6, y: 1250 },
    { x: 7, y: 1750 }
  ],
  porcentajes: [
    { producto: 'Paracetamol', porcentaje: 35, color: '#3b82f6' },
    { producto: 'Ibuprofeno', porcentaje: 25, color: '#10b981' },
    { producto: 'Amoxicilina', porcentaje: 20, color: '#f59e0b' },
    { producto: 'Otros', porcentaje: 20, color: '#8b5cf6' }
  ]
};

// Datos mock para ventas de vendedores
const mockVentas = [
  {
    id: '1',
    vendedorId: 'v1',
    vendedor: 'Ana García',
    producto: 'Paracetamol 500mg',
    cantidad: 100,
    ingresos: 50000,
    estado: 'completado',
    fecha: '2025-11-01'
  },
  {
    id: '2',
    vendedorId: 'v2',
    vendedor: 'Carlos López',
    producto: 'Ibuprofeno 400mg',
    cantidad: 75,
    ingresos: 60000,
    estado: 'pendiente',
    fecha: '2025-11-02'
  },
  {
    id: '3',
    vendedorId: 'v3',
    vendedor: 'María Rodríguez',
    producto: 'Amoxicilina 250mg',
    cantidad: 200,
    ingresos: 240000,
    estado: 'completado',
    fecha: '2025-11-03'
  }
];

export async function GET(request: NextRequest) {
  const { pathname } = new URL(request.url);
  
  try {
    // Determinar qué endpoint mock devolver según la ruta
    if (pathname.includes('/estadisticas')) {
      return NextResponse.json({
        data: mockEstadisticas,
        success: true,
        message: 'Estadísticas obtenidas exitosamente'
      });
    }
    
    if (pathname.includes('/graficos')) {
      return NextResponse.json({
        data: mockGraficos,
        success: true,
        message: 'Datos de gráficos obtenidos exitosamente'
      });
    }
    
    if (pathname.includes('/ventas-vendedores')) {
      return NextResponse.json({
        data: mockVentas,
        success: true,
        message: 'Ventas de vendedores obtenidas exitosamente'
      });
    }
    
    // Endpoint por defecto
    return NextResponse.json({
      data: null,
      success: false,
      message: 'Endpoint no encontrado'
    }, { status: 404 });
    
  } catch (error) {
    console.error('Error en API mock:', error);
    return NextResponse.json({
      data: null,
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 });
  }
}