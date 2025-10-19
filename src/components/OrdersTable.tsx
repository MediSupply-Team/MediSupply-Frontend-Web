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

interface OrdersTableProps {
  orders: Order[];
  onOrderToggle: (orderId: string) => void;
  onSelectAll: (selected: boolean) => void;
  allSelected: boolean;
}

export default function OrdersTable({ orders, onOrderToggle, onSelectAll, allSelected }: OrdersTableProps) {
  const getUrgencyColor = (urgencia: string) => {
    switch (urgencia) {
      case 'Alta': return 'bg-red-100 text-red-800';
      case 'Media': return 'bg-yellow-100 text-yellow-800';
      case 'Baja': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedCount = orders.filter(order => order.selected).length;

  return (
    <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl">
      <div className="px-6 py-4 border-b border-[var(--border-color)]">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Pedidos Pendientes de Entrega</h3>
          <span className="text-sm text-[var(--text-secondary)]">{selectedCount} pedidos seleccionados</span>
        </div>
      </div>
      
      <div className="max-h-400 overflow-y-auto">
        <table className="w-full text-left">
          <thead className="bg-[var(--background-color)]">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">
                <input 
                  type="checkbox" 
                  className="rounded border-[var(--border-color)] text-[var(--primary-color)] focus:ring-[var(--primary-color)]" 
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">ID Pedido</th>
              <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">Cliente</th>
              <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">Dirección</th>
              <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">Fecha</th>
              <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)] text-right">Cajas</th>
              <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)] text-center">Urgencia</th>
              <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">Ventana</th>
              <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">Zona</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-[var(--border-color)]/30 transition-colors">
                <td className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    className="rounded border-[var(--border-color)] text-[var(--primary-color)] focus:ring-[var(--primary-color)]" 
                    checked={order.selected}
                    onChange={() => onOrderToggle(order.id)}
                  />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{order.id}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{order.cliente}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{order.direccion}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{order.fecha}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)] text-right font-semibold">{order.cajas}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(order.urgencia)}`}>
                    {order.urgencia}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {order.ventana}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{order.zona}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}