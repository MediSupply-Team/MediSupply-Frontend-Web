import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Obtener parámetros de la URL
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from') || '2025-09-01';
  const to = searchParams.get('to') || '2025-09-30';
  const vendorId = searchParams.get('vendor_id');
  const productId = searchParams.get('product_id');

  try {
    // Construir URL del backend usando variable de entorno
    const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://medisupply-backend.duckdns.org';
    const backendUrl = new URL(`${backendBaseUrl}/venta/api/reports/sales-performance`);
    
    backendUrl.searchParams.set('from', from);
    backendUrl.searchParams.set('to', to);
    if (vendorId) backendUrl.searchParams.set('vendor_id', vendorId);
    if (productId) backendUrl.searchParams.set('product_id', productId);

    console.log('Proxy request to:', backendUrl.toString());

    // Hacer petición al backend
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Agregar headers de CORS si el backend los necesita
        'User-Agent': 'MediSupply-Frontend/1.0',
      },
    });

    if (!response.ok) {
      console.error('Backend error:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Backend error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Backend response successful');

    // Devolver datos con headers CORS apropiados
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('Proxy error:', error);
    
    // Si es un error de red, devolver datos mock para desarrollo
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.log('Network error detected, returning mock data for development');
      
      return NextResponse.json({
        filters_applied: {
          period: {
            from_: from,
            to: to
          },
          vendor_id: vendorId,
          product_id: productId
        },
        summary: {
          total_sales: 89306.1,
          pending_orders: 4,
          products_in_stock: 2500,
          sales_change_pct_vs_prev_period: 0.0
        },
        charts: {
          trend: [
            { date: '2025-09-01', total: 36999.5 },
            { date: '2025-09-02', total: 23714.0 },
            { date: '2025-09-03', total: 28592.6 }
          ],
          top_products: [
            { product_name: 'Jeringas Desechables', amount: 26000.0 },
            { product_name: 'Mascarillas N95', amount: 21000.0 },
            { product_name: 'Guantes de Látex', amount: 18750.0 },
            { product_name: 'Alcohol en Gel', amount: 13556.1 },
            { product_name: 'Batas Quirúrgicas', amount: 10000.0 }
          ],
          others_amount: 0.0
        },
        table: {
          rows: [
            {
              vendor_name: 'Ana López',
              product_name: 'Batas Quirúrgicas',
              quantity: 50,
              revenue: 10000.0,
              status: 'pendiente'
            },
            {
              vendor_name: 'Carlos Martínez',
              product_name: 'Alcohol en Gel',
              quantity: 73,
              revenue: 13556.1,
              status: 'completado'
            },
            {
              vendor_name: 'Juan Pérez',
              product_name: 'Jeringas Desechables',
              quantity: 130,
              revenue: 26000.0,
              status: 'completado'
            },
            {
              vendor_name: 'María García',
              product_name: 'Guantes de Látex',
              quantity: 75,
              revenue: 18750.0,
              status: 'pendiente'
            },
            {
              vendor_name: 'Pedro Rodríguez',
              product_name: 'Mascarillas N95',
              quantity: 105,
              revenue: 21000.0,
              status: 'completado'
            }
          ]
        },
        currency: 'USD',
        export: {
          available_formats: ['csv', 'pdf']
        }
      });
    }

    return NextResponse.json(
      { error: 'Failed to fetch data from backend' },
      { status: 500 }
    );
  }
}

// Manejar preflight requests de CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}