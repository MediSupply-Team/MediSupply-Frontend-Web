'use client'

import { useState } from 'react';
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

export default function RutasPage() {
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

  const handleGenerateRoute = () => {
    const selectedOrders = orders.filter(order => order.selected);
    if (selectedOrders.length === 0) {
      alert('Por favor selecciona al menos un pedido para generar la ruta.');
      return;
    }
    
    // Aquí se implementaría la lógica para generar la ruta
    alert(`Generando ruta óptima para ${selectedOrders.length} pedidos...`);
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
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors"
            >
              <span className="material-symbols-outlined text-base">route</span>
              <span>Generar Ruta Óptima</span>
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