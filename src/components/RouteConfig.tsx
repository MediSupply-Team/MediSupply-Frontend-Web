interface RouteConfigProps {
  onGenerateRoute: () => void;
}

export default function RouteConfig({ onGenerateRoute }: RouteConfigProps) {
  return (
    <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-8 mb-6">
      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-[var(--primary-color)]">tune</span>
        Configuración de Ruta
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Columna 1: Configuración básica */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">Configuración Básica</h4>
          
          {/* Bodega de origen */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="bodega-origen">
              Bodega de origen (depósito)
            </label>
            <select 
              className="form-select w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]" 
              id="bodega-origen"
            >
              <option>CD Bogotá</option>
              <option>CD Lima</option>
              <option>CD Quito</option>
              <option>CD CDMX</option>
            </select>
          </div>

          {/* Ventana de salida */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="hora-inicio">
              Ventana de salida / Hora de inicio
            </label>
            <input 
              type="time" 
              defaultValue="07:30" 
              className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]" 
              id="hora-inicio"
            />
          </div>

          {/* Camión asignado */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="camion-asignado">
              Camión Asignado
            </label>
            <select 
              className="form-select w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]" 
              id="camion-asignado"
            >
              <option>Camión 1 - Cap: 500kg</option>
              <option>Camión 2 - Cap: 750kg</option>
              <option>Camión 3 - Cap: 1000kg</option>
            </select>
          </div>

          {/* Capacidades del camión */}
          <div className="bg-[var(--background-color)] p-4 rounded-lg">
            <h5 className="text-sm font-medium text-[var(--text-primary)] mb-3">Capacidades del camión</h5>
            <div className="space-y-2 text-sm text-[var(--text-secondary)]">
              <div className="flex justify-between">
                <span>Peso máx.:</span>
                <span className="font-medium text-[var(--text-primary)]">500 kg</span>
              </div>
              <div className="flex justify-between">
                <span>Volumen máx.:</span>
                <span className="font-medium text-[var(--text-primary)]">12 m³</span>
              </div>
              <div className="flex justify-between">
                <span>Cadena de frío:</span>
                <span className="text-green-400 font-medium">Sí</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna 2: Filtros y optimización */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">Filtros y Optimización</h4>
          
          {/* Política de optimización */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="politica-optimizacion">
              Política de optimización
            </label>
            <select 
              className="form-select w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]" 
              id="politica-optimizacion"
            >
              <option>Distancia mínima</option>
              <option>Tiempo mínimo</option>
              <option>Costo estimado</option>
            </select>
          </div>

          {/* Ventanas de entrega */}
          <div className="bg-[var(--background-color)] p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-[var(--text-primary)]">Ventanas de entrega</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-9 h-5 bg-[var(--border-color)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
              </label>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">Respetar ventanas de atención de clientes</p>
          </div>

          {/* Zona */}
          <div>
            <label className="block mb-3 text-sm font-medium text-[var(--text-primary)]">Zona</label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-[var(--border-color)] text-[var(--primary-color)] focus:ring-[var(--primary-color)]" defaultChecked />
                <span className="ml-3 text-sm text-[var(--text-primary)]">Norte</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-[var(--border-color)] text-[var(--primary-color)] focus:ring-[var(--primary-color)]" defaultChecked />
                <span className="ml-3 text-sm text-[var(--text-primary)]">Centro</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-[var(--border-color)] text-[var(--primary-color)] focus:ring-[var(--primary-color)]" />
                <span className="ml-3 text-sm text-[var(--text-primary)]">Sur</span>
              </label>
            </div>
          </div>

          {/* Urgencia */}
          <div>
            <label className="block mb-3 text-sm font-medium text-[var(--text-primary)]">Urgencia</label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-[var(--border-color)] text-[var(--primary-color)] focus:ring-[var(--primary-color)]" defaultChecked />
                <span className="ml-3 text-sm text-red-400">Alta</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-[var(--border-color)] text-[var(--primary-color)] focus:ring-[var(--primary-color)]" defaultChecked />
                <span className="ml-3 text-sm text-yellow-400">Media</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-[var(--border-color)] text-[var(--primary-color)] focus:ring-[var(--primary-color)]" />
                <span className="ml-3 text-sm text-green-400">Baja</span>
              </label>
            </div>
          </div>
        </div>

        {/* Columna 3: Políticas y resumen */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">Políticas y Resumen</h4>
          
          {/* Políticas de ruta */}
          <div className="bg-[var(--background-color)] p-4 rounded-lg">
            <h5 className="text-sm font-medium text-[var(--text-primary)] mb-3">Políticas de ruta</h5>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-[var(--border-color)] text-[var(--primary-color)] focus:ring-[var(--primary-color)]" defaultChecked />
                <span className="ml-3 text-sm text-[var(--text-primary)]">Retornar a bodega</span>
              </label>
              
              <div>
                <label className="block mb-2 text-xs font-medium text-[var(--text-primary)]">Máx. paradas</label>
                <input 
                  type="number" 
                  defaultValue="10" 
                  min="1" 
                  max="20" 
                  className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-xs font-medium text-[var(--text-primary)]">Tiempo máximo de ruta</label>
                <input 
                  type="time" 
                  defaultValue="08:00" 
                  className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                />
              </div>
            </div>
          </div>

          {/* Resumen de carga */}
          <div className="bg-[var(--primary-color)]/10 p-4 rounded-lg">
            <h5 className="text-sm font-medium text-[var(--text-primary)] mb-3">Resumen de carga seleccionada</h5>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <span className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium bg-[var(--primary-color)]/20 text-[var(--primary-color)]">
                Pedidos: 3
              </span>
              <span className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium bg-[var(--primary-color)]/20 text-[var(--primary-color)]">
                Cajas: 25
              </span>
              <span className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium bg-[var(--primary-color)]/20 text-[var(--primary-color)]">
                Peso: 125 kg
              </span>
              <span className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium bg-[var(--primary-color)]/20 text-[var(--primary-color)]">
                Vol: 2.1 m³
              </span>
            </div>
            <div className="text-xs text-[var(--text-secondary)] space-y-1">
              <div className="flex justify-between">
                <span>Capacidad peso:</span>
                <span className="text-green-400 font-medium">25%</span>
              </div>
              <div className="flex justify-between">
                <span>Capacidad volumen:</span>
                <span className="text-green-400 font-medium">17.5%</span>
              </div>
            </div>
          </div>

          {/* Botón de generación */}
          <button 
            onClick={onGenerateRoute}
            className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors"
          >
            <span className="material-symbols-outlined text-base">route</span>
            <span>Generar Ruta Óptima</span>
          </button>
        </div>
      </div>
    </div>
  );
}