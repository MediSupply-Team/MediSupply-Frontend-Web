# Integración con Backend de Producción

## Resumen
Se ha implementado la integración con el backend de producción de MediSupply para la página de reportes, permitiendo alternar entre datos mock (para desarrollo) y datos reales del API de producción.

## API Endpoint Integrado
- **URL**: `https://medisupply-backend.duckdns.org/venta/api/reports/sales-performance`
- **Parámetros**: 
  - `from`: Fecha de inicio (YYYY-MM-DD)
  - `to`: Fecha de fin (YYYY-MM-DD)
  - `vendor_id`: ID del vendedor (opcional)
  - `product_id`: ID del producto (opcional)

## Archivos Creados/Modificados

### Nuevos Servicios
1. **`/src/services/backendService.ts`**
   - Cliente HTTP para el backend de producción
   - Funciones para obtener datos de performance de ventas
   - Transformación de datos del backend al formato de la UI

2. **`/src/hooks/useBackend.ts`**
   - Hooks de TanStack Query para el backend
   - `useSalesPerformance()`: Datos completos de performance
   - `useSalesSummary()`: Solo resumen estadístico
   - `useSalesCharts()`: Solo datos de gráficos
   - `useSalesTable()`: Solo datos de tabla

### Tipos Actualizados
3. **`/src/types/index.ts`**
   - Agregados tipos `SalesPerformanceFilters` y `SalesPerformanceResponse`
   - Tipos que mapean exactamente la respuesta del API

### Página Actualizada
4. **`/src/app/reportes/page.tsx`**
   - Toggle para alternar entre datos mock y backend
   - Controles de filtros de fecha para el backend
   - Indicadores de estado de conexión
   - Transformación automática de datos

## Características Implementadas

### ✅ Toggle de Fuente de Datos
- Botón switch para alternar entre "Datos Mock" y "Backend Producción"
- Indicador visual del estado de conexión
- Manejo de errores de conexión

### ✅ Filtros de Fecha
- Controles de fecha (desde/hasta) para el backend
- Botón "Últimos 30 días" para filtro rápido
- Filtros se aplican automáticamente al cambiar

### ✅ Transformación de Datos
- Los datos del backend se transforman automáticamente al formato esperado por la UI
- Compatibilidad total con los componentes existentes de gráficos y tablas
- Mapeo de campos:
  - `total_sales` → `ventasTotales`
  - `pending_orders` → `pedidosPendientes`
  - `products_in_stock` → `productosEnStock`
  - `sales_change_pct_vs_prev_period` → `rendimientoVentas.porcentaje`

### ✅ Visualización de Datos Reales
- **Estadísticas**: Ventas totales, pedidos pendientes, productos en stock, cambio porcentual
- **Gráfico de tendencia**: Datos de ventas por fecha del array `trend`
- **Top productos**: Lista de productos más vendidos del array `top_products`
- **Tabla de vendedores**: Datos de la tabla con vendedores, productos, cantidades y estados

### ✅ Manejo de Estados
- Loading states para cada sección
- Error handling con mensajes informativos
- Indicadores visuales de conexión exitosa/fallida

## Uso

1. **Navegar a Reportes**: Ir a `/reportes` en la aplicación
2. **Alternar Fuente**: Usar el toggle "Datos Mock / Backend Producción"
3. **Configurar Filtros**: Cuando esté en modo backend, ajustar las fechas desde/hasta
4. **Visualizar Datos**: Los gráficos y tablas se actualizan automáticamente

## Estructura de Respuesta del API

```json
{
  "filters_applied": {
    "period": { "from_": "2025-09-01", "to": "2025-09-30" },
    "vendor_id": null,
    "product_id": null
  },
  "summary": {
    "total_sales": 89306.1,
    "pending_orders": 4,
    "products_in_stock": 2500,
    "sales_change_pct_vs_prev_period": 0.0
  },
  "charts": {
    "trend": [
      { "date": "2025-09-01", "total": 36999.5 },
      { "date": "2025-09-02", "total": 23714.0 }
    ],
    "top_products": [
      { "product_name": "Jeringas Desechables", "amount": 26000.0 }
    ],
    "others_amount": 0.0
  },
  "table": {
    "rows": [
      {
        "vendor_name": "Ana López",
        "product_name": "Batas Quirúrgicas",
        "quantity": 50,
        "revenue": 10000.0,
        "status": "pendiente"
      }
    ]
  },
  "currency": "USD",
  "export": { "available_formats": ["csv", "pdf"] }
}
```

## Próximos Pasos Sugeridos

1. **Autenticación**: Implementar headers de autenticación si el API lo requiere
2. **Caché Inteligente**: Configurar invalidación automática del caché
3. **Filtros Adicionales**: Implementar filtros por vendedor y producto
4. **Exportación**: Conectar la funcionalidad de exportación con el backend
5. **WebSockets**: Implementar actualizaciones en tiempo real
6. **Paginación**: Manejar grandes volúmenes de datos de la tabla

## Configuración de Desarrollo

Para trabajar en modo desarrollo:
- Los datos mock están disponibles por defecto
- Cambiar a backend de producción usando el toggle
- Los filtros de fecha están preconfigurados para septiembre 2025
- Los errores de conexión se muestran visualmente

## Notas Técnicas

- **TanStack Query**: Cache de 5 minutos para datos del backend
- **Error Boundaries**: Manejo graceful de errores de red
- **Responsive**: Los controles se adaptan a móviles y desktop
- **Accessibility**: Controles accesibles con lectores de pantalla
- **Performance**: Transformación de datos optimizada