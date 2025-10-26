# MediSupply - Estructura de Librerías

Este documento describe la estructura y configuración de las librerías utilizadas para el manejo de estado global y llamados a APIs en el proyecto MediSupply.

## 📦 Librerías Instaladas

- **Zustand**: Para manejo de estado global
- **Axios**: Para llamados HTTP a APIs
- **TanStack Query**: Para cache, sincronización y manejo de estado del servidor
- **TanStack Query Devtools**: Herramientas de desarrollo (solo en dev)

## 🏗️ Estructura de Directorios

```
src/
├── lib/                    # Configuraciones base
│   ├── axios.ts           # Configuración de Axios con interceptors
│   └── react-query.ts     # Configuración de TanStack Query y query keys
├── store/                 # Estado global con Zustand
│   └── appStore.ts        # Store principal de la aplicación
├── services/              # Servicios para llamados a API
│   ├── medicamentosService.ts
│   └── proveedoresService.ts
├── hooks/                 # Custom hooks
│   └── useMedicamentos.ts # Hooks de TanStack Query para medicamentos
├── types/                 # Tipos TypeScript
│   └── index.ts          # Tipos globales y interfaces
└── components/
    └── providers/         # Providers de React
        └── QueryProvider.tsx
```

## 🔧 Configuración

### Axios (`/src/lib/axios.ts`)
- Base URL configurable via environment variables
- Interceptors para autenticación automática
- Manejo global de errores
- Timeout de 10 segundos

### TanStack Query (`/src/lib/react-query.ts`)
- Cache time: 10 minutos
- Stale time: 5 minutos
- Retry automático en fallos
- Query keys organizados por dominio

### Zustand (`/src/store/appStore.ts`)
- Persistencia en localStorage
- Estado reactivo
- Actions organizadas por dominio
- Hooks optimizados para componentes

## 🎯 Patrones de Uso

### 1. Servicios (Pattern: Service Layer)

```typescript
// /src/services/medicamentosService.ts
export const getMedicamentos = async (filtros?: FiltrosProductos) => {
  // Lógica mock en desarrollo
  // API real en producción
  return apiClient.get('/medicamentos', { params: filtros });
};
```

### 2. Custom Hooks (Pattern: React Query + Service)

```typescript
// /src/hooks/useMedicamentos.ts
export const useMedicamentos = (filtros?: FiltrosProductos) => {
  return useQuery({
    queryKey: [...queryKeys.medicamentos, filtros],
    queryFn: () => getMedicamentos(filtros),
  });
};
```

### 3. Estado Global (Pattern: Zustand Store)

```typescript
// En componentes
const { theme, toggleTheme } = useTheme();
const { addNotification } = useNotifications();
```

## 🚀 Ejemplo de Uso

Ver `/src/app/ejemplo/page.tsx` para un ejemplo completo que muestra:

- ✅ Filtros con estado local
- ✅ Llamados a API con cache
- ✅ Mutaciones con optimistic updates
- ✅ Estado global para theme y notificaciones
- ✅ Paginación
- ✅ Manejo de loading y errores

## 🔄 Flujo de Datos

```
Componente → Custom Hook → Service → API
    ↓           ↓          ↓        ↓
  Estado    TanStack    Axios   Backend
  Local      Query
    ↓
 Zustand (Estado Global)
```

## 📋 Próximos Pasos

Para agregar nuevas funcionalidades, replica esta estructura:

1. **Agregar tipos** en `/src/types/index.ts`
2. **Crear servicio** en `/src/services/[nombre]Service.ts`
3. **Crear custom hooks** en `/src/hooks/use[Nombre].ts`
4. **Usar en componentes** importando los hooks
5. **Agregar al store global** si es estado compartido

## 🧪 Datos Mock

Actualmente el sistema usa datos mock cuando `NODE_ENV === 'development'`. Para conectar con APIs reales:

1. Configurar `NEXT_PUBLIC_API_URL` en `.env.local`
2. Los servicios automáticamente usarán la API real en producción

## 🛠️ Herramientas de Desarrollo

- **React Query Devtools**: Disponible en desarrollo (botón inferior izquierdo)
- **Zustand**: Estado visible en React DevTools
- **TypeScript**: Tipado estricto en toda la aplicación

## ⚡ Performance

- **Cache inteligente**: TanStack Query maneja automáticamente el cache
- **Re-renders optimizados**: Hooks de Zustand con selectores específicos
- **Prefetch**: Disponible para cargar datos anticipadamente
- **Background refetch**: Actualización automática de datos obsoletos