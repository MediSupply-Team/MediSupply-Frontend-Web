import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const format = searchParams.get('format');
    const vendor_id = searchParams.get('vendor_id');
    const product_id = searchParams.get('product_id');

    if (!from || !to || !format) {
      return NextResponse.json(
        { error: 'Parámetros requeridos: from, to, format' },
        { status: 400 }
      );
    }

    // Construir URL del backend usando variable de entorno
    const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://medisupply-backend.duckdns.org';
    const backendUrl = new URL(`${backendBaseUrl}/venta/api/reports/sales-performance/export`);
    backendUrl.searchParams.set('from', from);
    backendUrl.searchParams.set('to', to);
    backendUrl.searchParams.set('format', format);
    
    if (vendor_id) {
      backendUrl.searchParams.set('vendor_id', vendor_id);
    }
    
    if (product_id) {
      backendUrl.searchParams.set('product_id', product_id);
    }

    console.log('Export proxy request to:', backendUrl.toString());

    // Realizar petición al backend
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'MediSupply-Frontend/1.0',
        'Origin': 'https://medi-supply-frontend-olm5buqze-julianrvillamils-projects.vercel.app',
      },
    });

    if (!response.ok) {
      console.error('Backend export response error:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Error del backend: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Backend export response successful');

    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('Error in export proxy:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}