# MediSupply-Frontend-Web
# MediSupply - Frontend Web

Sistema de gestión para el sector farmacéutico y médico construido con Next.js 15 y Tailwind CSS.

## 🚀 Características

- **Design System Completo**: Implementación del design system de MediSupply con tema claro/oscuro
- **Navegación Lateral**: Sidebar funcional con navegación entre páginas
- **Página de Rutas Funcional**: Sistema completo de generación de rutas de entrega
- **Material Symbols**: Iconografía consistente de Google Material Symbols
- **Responsive**: Diseño adaptable a diferentes tamaños de pantalla
- **TypeScript**: Tipado estático para mayor robustez del código

## 🗺️ Página de Rutas - Características Principales

### ✅ **Funcionalidades Implementadas**

- **Panel de Configuración Avanzado**: 
  - Selección de bodega de origen
  - Configuración de ventanas de salida
  - Asignación de camiones con capacidades
  - Políticas de optimización (distancia, tiempo, costo)
  - Filtros por zona y urgencia
  - Configuración de políticas de ruta

- **Gestión de Pedidos**:
  - Tabla interactiva con pedidos pendientes
  - Selección individual y masiva de pedidos
  - Información detallada: cliente, dirección, urgencia, ventanas de entrega
  - Estados de urgencia con código de colores
  - Resumen de carga en tiempo real

- **Componentes Reutilizables**:
  - `RouteConfig`: Panel de configuración de rutas
  - `OrdersTable`: Tabla de pedidos con funcionalidad completa
  - Estados y callbacks para interactividad

## 🏗️ Arquitectura

```
src/
├── app/                    # App Router de Next.js
│   ├── inventario/         # Página de gestión de inventario
│   ├── proveedores/        # Página de gestión de proveedores
│   ├── productos/          # Página de catálogo de productos
│   ├── vendedores/         # Página de gestión de vendedores
│   ├── reportes/           # Página de reportes y análisis
│   ├── rutas/              # 🆕 Página COMPLETA de generación de rutas
│   ├── mi-perfil/          # Página de perfil de usuario
│   ├── layout.tsx          # Layout principal con sidebar y fuentes
│   ├── page.tsx            # Dashboard principal
│   └── globals.css         # Estilos globales y variables CSS
└── components/             # Componentes reutilizables
    ├── Sidebar.tsx         # Barra de navegación lateral
    ├── Header.tsx          # Header superior con toggle de tema
    ├── ThemeToggle.tsx     # Componente para cambiar tema
    ├── PagePlaceholder.tsx # Placeholder para páginas en construcción
    ├── Card.tsx            # Componente de tarjeta
    ├── RouteConfig.tsx     # 🆕 Panel de configuración de rutas
    └── OrdersTable.tsx     # 🆕 Tabla de pedidos interactiva
```

## 🎨 Design System

El proyecto implementa el design system de MediSupply con:

### Variables CSS Personalizadas
- **Colores primarios**: Paleta teal/azul para el sector salud
- **Tema claro/oscuro**: Cambio dinámico de tema
- **Tipografía**: Fuente Manrope implementada correctamente
- **Espaciado**: Sistema consistente de espaciado

### Componentes
- **Navegación**: Sidebar con Material Symbols y estados activo/hover
- **Formularios**: Campos de texto, selectores, checkboxes y toggles
- **Tablas**: Tabla responsive con selección múltiple
- **Botones**: Primarios y secundarios con variantes
- **Badges**: Indicadores de estado con código de colores

## 🛠️ Tecnologías

- **Next.js 15**: Framework React con App Router
- **React 19**: Biblioteca de UI
- **TypeScript**: Tipado estático
- **Tailwind CSS 4**: Framework de utilidades CSS
- **Material Symbols**: Iconografía de Google
- **Next/Font**: Optimización de fuentes
- **PostCSS**: Procesamiento de CSS

## 🚀 Instalación y Uso

1. **Instalar dependencias**:
```bash
npm install
```

2. **Ejecutar en desarrollo**:
```bash
npm run dev
```

3. **Construir para producción**:
```bash
npm run build
```

4. **Iniciar servidor de producción**:
```bash
npm start
```

El proyecto estará disponible en [http://localhost:3000](http://localhost:3000)

## 📱 Páginas Disponibles

- **Dashboard** (`/`) - Resumen general del sistema
- **Inventario** (`/inventario`) - Gestión de medicamentos y suministros
- **Proveedores** (`/proveedores`) - Gestión de proveedores
- **Productos** (`/productos`) - Catálogo de productos médicos
- **Vendedores** (`/vendedores`) - Gestión del equipo de ventas
- **Reportes** (`/reportes`) - Análisis y reportes
- **🆕 Rutas** (`/rutas`) - **PÁGINA COMPLETA** de generación de rutas de entrega
- **Mi Perfil** (`/mi-perfil`) - Configuración de usuario

## 🎯 Estado del Proyecto

### ✅ **Completamente Funcional**
- **Página de Rutas**: Sistema completo de generación de rutas con:
  - Panel de configuración avanzado (3 columnas)
  - Tabla de pedidos interactiva
  - Selección múltiple de pedidos
  - Resumen de carga en tiempo real
  - Políticas de optimización configurables
  - Material Symbols integrados

### 🚧 **En Desarrollo** 
- Resto de páginas con placeholders profesionales y navegación funcional

## 🔧 Características Técnicas

### Fuentes y Tipografía
- **Next/Font**: Implementación correcta de Google Fonts
- **Manrope**: Fuente principal optimizada
- **Material Symbols**: Iconografía consistente

### Interactividad
- **Estado de React**: Manejo de selección de pedidos
- **Callbacks**: Comunicación entre componentes
- **TypeScript**: Interfaces tipadas para props y datos

### CSS Avanzado
- **Variables CSS**: Sistema de colores y espaciado
- **Toggle switches**: Componentes personalizados
- **Hover states**: Efectos de interacción
- **Responsive**: Grid system adaptable

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto es privado y está destinado al uso interno de MediSupply.

---

## 🎉 **Última Actualización**

**Página de Rutas completamente funcional** - Implementación completa basada en el mockup HTML con todas las características de generación de rutas de entrega, incluyendo configuración avanzada, gestión de pedidos y componentes reutilizables.
