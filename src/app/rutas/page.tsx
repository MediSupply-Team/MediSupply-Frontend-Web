'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RouteConfig from '@/components/RouteConfig';
import OrdersTable from '@/components/OrdersTable';

interface Order {
  id: string;
  cliente: string;
  direccion: string;
  fecha: string;
  cajas: number;
  urgencia: 'Alta' | 'Media' | 'Baja';
  ventana: string;
  zona: string;
  selected: boolean;
}

interface RouteConfiguration {
  bodega_origen: string;
  hora_inicio: string;
  camion_capacidad_kg: number;
  camion_capacidad_m3: number;
  retornar_bodega: boolean;
  max_paradas: number;
}

export default function RutasPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const routeConfig: RouteConfiguration = {
    bodega_origen: 'Calle 100 #15-20, Bogotá',
    hora_inicio: '07:30 AM',
    camion_capacidad_kg: 500,
    camion_capacidad_m3: 12,
    retornar_bodega: true,
    max_paradas: 10,
  };
  
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '#ORD-001',
      cliente: 'Hospital San José',
      direccion: 'Calle 45 #12-34, Bogotá',
      fecha: '2024-01-15',
      cajas: 12,
      urgencia: 'Alta',
      ventana: '08:00–12:00',
      zona: 'Norte',
      selected: true,
    },
    {
      id: '#ORD-002',
      cliente: 'Clínica del Norte',
      direccion: 'Carrera 15 #78-90, Bogotá',
      fecha: '2024-01-14',
      cajas: 8,
      urgencia: 'Media',
      ventana: '14:00–17:00',
      zona: 'Norte',
      selected: true,
    },
    {
      id: '#ORD-003',
      cliente: 'Farmacia Central',
      direccion: 'Avenida 68 #25-10, Bogotá',
      fecha: '2024-01-13',
      cajas: 5,
      urgencia: 'Media',
      ventana: '09:00–18:00',
      zona: 'Centro',
      selected: true,
    },
    {
      id: '#ORD-004',
      cliente: 'Hospital El Tunal',
      direccion: 'Calle 48B Sur #20-31, Bogotá',
      fecha: '2024-01-12',
      cajas: 15,
      urgencia: 'Baja',
      ventana: '10:00–16:00',
      zona: 'Sur',
      selected: false,
    },
    {
      id: '#ORD-005',
      cliente: 'Centro Médico Chapinero',
      direccion: 'Carrera 13 #63-15, Bogotá',
      fecha: '2024-01-11',
      cajas: 7,
      urgencia: 'Alta',
      ventana: '08:00–11:00',
      zona: 'Centro',
      selected: false,
    },
  ]);

  const handleOrderToggle = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, selected: !order.selected } : order
      )
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setOrders(prevOrders =>
      prevOrders.map(order => ({ ...order, selected }))
    );
  };

  const handleGenerateRoute = async () => {
    const selectedOrders = orders.filter(order => order.selected);
    if (selectedOrders.length === 0) {
      alert('Por favor selecciona al menos un pedido para generar la ruta.');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Preparar el payload según la estructura del backend
      const payload = {
        configuracion: routeConfig,
        pedidos: selectedOrders.map(order => ({
          id_pedido: order.id,
          cliente: order.cliente,
          direccion: order.direccion,
          fecha: order.fecha,
          cajas: order.cajas,
          urgencia: order.urgencia.toLowerCase(),
          zona: order.zona.toLowerCase(),
          peso_kg: order.cajas * 2.5, // Estimación de 2.5kg por caja
          volumen_m3: order.cajas * 0.04, // Estimación de 0.04m³ por caja
        })),
        costo_km: 2000,
        costo_hora: 15000,
      };
      
      // Enviar POST al backend
      const response = await fetch(
        'https://medisupply-backend.duckdns.org/venta/api/v1/routes/optimize',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
      
      if (!response.ok) {
        throw new Error('Error al generar la ruta');
      }
      
      const routeData = await response.json();
      
      // Guardar los datos en sessionStorage para acceder desde la página de resultados
      sessionStorage.setItem('routeOptimizationResult', JSON.stringify(routeData));
      sessionStorage.setItem('routeConfiguration', JSON.stringify(routeConfig));
      
      // Navegar a la página de resultados
      router.push('/rutas/resultado');
      
    } catch (error) {
      console.error('Error al generar la ruta:', error);
      alert('Error al generar la ruta. Por favor, intenta nuevamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const allSelected = orders.length > 0 && orders.every(order => order.selected);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Generación de Rutas de Entrega</h1>
            <p className="text-[var(--text-secondary)] mt-1">
              Configure los parámetros para generar la ruta óptima de entrega
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--border-color)]/50 transition-colors">
              <span className="material-symbols-outlined text-base">history</span>
              <span>Rutas Anteriores</span>
            </button>
            <button 
              onClick={handleGenerateRoute}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">refresh</span>
                  <span>Generando...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">route</span>
                  <span>Generar Ruta Óptima</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Panel de Configuración */}
      <RouteConfig onGenerateRoute={handleGenerateRoute} />

      {/* Tabla de Pedidos */}
      <OrdersTable 
        orders={orders}
        onOrderToggle={handleOrderToggle}
        onSelectAll={handleSelectAll}
        allSelected={allSelected}
      />
    </div>
  );
}