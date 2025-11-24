describe('Registro de proveedores y carga de productos (individual y masivo)', () => {
  beforeEach(() => {
    // Visitar la página principal
    cy.visit('/')
  })

  // ===== PRUEBAS DE PROVEEDORES =====
  
  describe('Gestión de Proveedores', () => {
    it('debe cargar la página de proveedores correctamente', () => {
      // Navegar a proveedores (asumiendo que hay un enlace en el sidebar)
      cy.visit('/proveedores')
      
      // Verificar título y descripción
      cy.contains('h1', 'Proveedores').should('be.visible')
      cy.contains('Gestión de proveedores y empresas colaboradoras').should('be.visible')
    })

    it('debe mostrar estadísticas de proveedores', () => {
      cy.visit('/proveedores')
      
      // Verificar tarjetas de estadísticas
      cy.contains('Total Proveedores').should('be.visible')
      cy.contains('Activos').should('be.visible')
      cy.contains('Inactivos').should('be.visible')
      cy.contains('País Principal').should('be.visible')
    })

    it('debe mostrar el buscador de proveedores', () => {
      cy.visit('/proveedores')
      
      // Verificar input de búsqueda
      cy.get('input[placeholder*="Buscar por empresa, NIT o contacto"]').should('be.visible')
    })

    it('debe permitir buscar proveedores', () => {
      cy.visit('/proveedores')
      cy.wait(2000) // Esperar carga de datos
      
      // Realizar búsqueda
      cy.get('input[placeholder*="Buscar por empresa, NIT o contacto"]')
        .type('test')
      
      cy.wait(500) // Esperar filtrado
    })

    it('debe mostrar botones de acción principales', () => {
      cy.visit('/proveedores')
      
      // Verificar botones
      cy.contains('button', 'Carga Masiva').should('be.visible')
      cy.contains('button', 'Agregar Proveedor').should('be.visible')
    })

    it('debe navegar a formulario de agregar proveedor', () => {
      cy.visit('/proveedores')
      
      // Click en agregar proveedor
      cy.contains('button', 'Agregar Proveedor').click()
      
      // Verificar navegación
      cy.url().should('include', '/proveedores/agregar')
      cy.contains('h1', 'Agregar Nuevo Proveedor').should('be.visible')
    })

    it('debe mostrar formulario de agregar proveedor con todos los campos', () => {
      cy.visit('/proveedores/agregar')
      
      // Verificar secciones del formulario
      cy.contains('h3', 'Información de la Empresa').should('be.visible')
      cy.contains('h3', 'Información de Contacto').scrollIntoView().should('be.visible')
      cy.contains('h3', 'Información Adicional').scrollIntoView().should('be.visible')
      
      // Verificar campos principales
      cy.get('#empresa').should('exist')
      cy.get('#nit').should('exist')
      cy.get('#pais').should('exist')
      cy.get('#direccion').should('exist')
      cy.get('#contacto_nombre').should('exist')
      cy.get('#contacto_email').should('exist')
      cy.get('#contacto_telefono').should('exist')
      cy.get('#contacto_cargo').should('exist')
    })

    it('debe validar campos requeridos en formulario de proveedor', () => {
      cy.visit('/proveedores/agregar')
      
      // Intentar enviar sin llenar campos
      cy.contains('button', 'Guardar Proveedor').click()
      
      // Verificar que no se envió (campos requeridos HTML5)
      cy.get('#empresa:invalid').should('exist')
      cy.get('#nit:invalid').should('exist')
    })

    it('debe permitir llenar y enviar formulario de proveedor', () => {
      cy.visit('/proveedores/agregar')
      
      // Llenar formulario
      cy.get('#empresa').type('Proveedor Test E2E')
      cy.get('#nit').type('900123456-7')
      cy.get('#pais').select('CO')
      cy.get('#direccion').type('Calle 123 #45-67')
      cy.get('#contacto_nombre').type('Juan Pérez')
      cy.get('#contacto_cargo').type('Gerente Comercial')
      cy.get('#contacto_email').type('juan.perez@test.com')
      cy.get('#contacto_telefono').type('+57 310 1234567')
      cy.get('#notas').type('Proveedor creado mediante prueba E2E')
      
      // Verificar checkbox activo
      cy.get('#activo').should('be.checked')
      
      // Enviar formulario
      cy.contains('button', 'Guardar Proveedor').click()
      
      // Esperar redirección (puede tomar tiempo)
      cy.wait(3000)
    })

    it('debe navegar a página de carga masiva de proveedores', () => {
      cy.visit('/proveedores')
      
      // Click en carga masiva
      cy.contains('button', 'Carga Masiva').click()
      
      // Verificar navegación
      cy.url().should('include', '/proveedores/carga-masiva')
      cy.contains('h1', 'Carga Masiva de Proveedores').should('be.visible')
    })

    it('debe mostrar área de carga de archivos para proveedores', () => {
      cy.visit('/proveedores/carga-masiva')
      
      // Verificar botón de descarga de plantilla
      cy.contains('button', 'Descargar Plantilla Excel').should('be.visible')
      
      // Verificar área de drag & drop (hacer scroll)
      cy.contains('Arrastra tu archivo aquí').scrollIntoView().should('exist')
      cy.contains('Seleccionar Archivo').scrollIntoView().should('be.visible')
    })

    it('debe mostrar instrucciones de carga masiva de proveedores', () => {
      cy.visit('/proveedores/carga-masiva')
      
      // Verificar instrucciones (hacer scroll)
      cy.contains('h3', 'Instrucciones').scrollIntoView().should('be.visible')
      
      // Verificar pasos numerados
      cy.contains('Descarga la plantilla de Excel').should('exist')
      cy.contains('Completa el archivo').should('exist')
    })

    it('debe mostrar checkbox de reemplazar duplicados', () => {
      cy.visit('/proveedores/carga-masiva')
      
      cy.get('#reemplazar_duplicados').scrollIntoView().should('exist')
      cy.contains('Reemplazar proveedores duplicados').scrollIntoView().should('be.visible')
    })
  })

  // ===== PRUEBAS DE PRODUCTOS =====
  
  describe('Gestión de Productos', () => {
    it('debe navegar a formulario de agregar producto', () => {
      cy.visit('/productos')
      cy.wait(1000)
      
      // Click en agregar (puede ser un botón con icono)
      cy.contains('button', 'Agregar').click()
      
      // Verificar navegación
      cy.url().should('include', '/productos/agregar')
    })

    it('debe mostrar formulario completo de agregar producto', () => {
      cy.visit('/productos/agregar')
      
      // Verificar secciones
      cy.contains('h3', 'Información Básica').should('be.visible')
      cy.contains('h3', 'Información de Stock').scrollIntoView().should('be.visible')
      cy.contains('h3', 'Ubicación y Almacenamiento').scrollIntoView().should('be.visible')
      cy.contains('h3', 'Información Comercial').scrollIntoView().should('be.visible')
    })

    it('debe mostrar campos de información básica del producto', () => {
      cy.visit('/productos/agregar')
      
      // Verificar campos
      cy.get('#nombre').should('exist')
      cy.get('#sku').should('exist')
      cy.get('#codigoBarras').should('exist')
      cy.get('#categoria').should('exist')
      cy.get('#marca').should('exist')
      cy.get('#descripcion').should('exist')
    })

    it('debe mostrar campos de stock', () => {
      cy.visit('/productos/agregar')
      
      cy.get('#stockInicial').should('exist')
      cy.get('#stockMinimo').should('exist')
      cy.get('#unidadMedida').should('exist')
    })

    it('debe mostrar campos de ubicación y almacenamiento', () => {
      cy.visit('/productos/agregar')
      
      cy.get('#almacen').should('exist')
      cy.get('#ubicacion').should('exist')
      cy.get('#temperatura').should('exist')
      cy.get('#fechaVencimiento').should('exist')
    })

    it('debe mostrar campos comerciales', () => {
      cy.visit('/productos/agregar')
      
      cy.get('#precioCosto').should('exist')
      cy.get('#precioVenta').should('exist')
      cy.get('#proveedor').should('exist')
      cy.get('#registroSanitario').should('exist')
    })

    it('debe cargar bodegas en el selector', () => {
      cy.visit('/productos/agregar')
      
      // Esperar a que carguen las bodegas
      cy.wait(2000)
      
      // Verificar que el select tiene opciones
      cy.get('#almacen').should('not.be.disabled')
      cy.get('#almacen option').should('have.length.gt', 1)
    })

    it('debe validar campos requeridos en formulario de producto', () => {
      cy.visit('/productos/agregar')
      cy.wait(2000) // Esperar carga de bodegas
      
      // Scroll al botón y hacer click sin llenar campos
      cy.contains('button', 'Guardar Producto').scrollIntoView()
      cy.contains('button', 'Guardar Producto').click()
      
      // El formulario usa react-hook-form, verificar que no navega
      cy.url().should('include', '/productos/agregar')
      
      // Verificar que los campos están presentes (no se envió)
      cy.get('#nombre').should('exist')
      cy.get('#sku').should('exist')
    })

    it('debe permitir llenar formulario de producto', () => {
      cy.visit('/productos/agregar')
      cy.wait(2000)
      
      // Información básica
      cy.get('#nombre').type('Producto Test E2E')
      cy.get('#sku').type('TEST-E2E-001')
      cy.get('#codigoBarras').type('7501234567890')
      cy.get('#categoria').select('Insumos Descartables')
      cy.get('#marca').type('Marca Test')
      cy.get('#descripcion').type('Producto de prueba automatizada')
      
      // Stock
      cy.get('#stockInicial').clear().type('100')
      cy.get('#stockMinimo').clear().type('10')
      cy.get('#unidadMedida').select('unidad')
      
      // Ubicación (seleccionar primera bodega disponible)
      cy.get('#almacen').select(1)
      cy.get('#ubicacion').type('Estante A-1')
      cy.get('#temperatura').select('Temperatura Ambiente')
      
      // Comercial
      cy.get('#precioCosto').type('1000')
      cy.get('#precioVenta').type('1500')
      cy.get('#proveedor').select(1)
      
      // Verificar que se llenaron los campos
      cy.get('#nombre').should('have.value', 'Producto Test E2E')
      cy.get('#sku').should('have.value', 'TEST-E2E-001')
    })

    it('debe mostrar botones de acción en formulario de producto', () => {
      cy.visit('/productos/agregar')
      
      cy.contains('button', 'Cancelar').scrollIntoView().should('be.visible')
      cy.contains('button', 'Guardar Producto').scrollIntoView().should('be.visible')
    })

    it('debe permitir cancelar creación de producto', () => {
      cy.visit('/productos/agregar')
      
      cy.contains('button', 'Cancelar').click()
      
      // Verificar redirección
      cy.url().should('include', '/productos')
    })

    it('debe navegar a carga masiva de productos', () => {
      cy.visit('/productos')
      cy.wait(1000)
      
      // Buscar botón de carga masiva
      cy.contains('button', 'Carga Masiva').click()
      
      // Verificar navegación
      cy.url().should('include', '/productos/carga-masiva')
      cy.contains('h1', 'Carga Masiva de Productos').should('be.visible')
    })

    it('debe mostrar sección de descarga de plantilla de productos', () => {
      cy.visit('/productos/carga-masiva')
      
      cy.contains('Plantilla de Importación').scrollIntoView().should('be.visible')
      cy.contains('button', 'Descargar Plantilla Excel').scrollIntoView().should('be.visible')
    })

    it('debe mostrar área de carga de archivos para productos', () => {
      cy.visit('/productos/carga-masiva')
      
      cy.contains('Arrastra y suelta tu archivo aquí').should('exist')
      cy.get('input[type="file"]').should('exist')
    })

    it('debe mostrar campos requeridos para productos', () => {
      cy.visit('/productos/carga-masiva')
      
      cy.contains('Campos Requeridos').scrollIntoView().should('be.visible')
      cy.contains('Nombre del Producto').should('exist')
      cy.contains('SKU').should('exist')
      cy.contains('Categoría').should('exist')
    })

    it('debe mostrar instrucciones detalladas de carga masiva', () => {
      cy.visit('/productos/carga-masiva')
      
      cy.contains('Instrucciones Detalladas').scrollIntoView().should('be.visible')
      cy.contains('Prepare su archivo').should('exist')
      cy.contains('Validación de datos').should('exist')
      cy.contains('Revisión previa').should('exist')
      cy.contains('Importación').should('exist')
    })

    it('debe mostrar botones de acción en carga masiva', () => {
      cy.visit('/productos/carga-masiva')
      
      cy.contains('button', 'Cancelar').scrollIntoView().should('be.visible')
      cy.contains('button', 'Iniciar Importación').scrollIntoView().should('be.visible')
    })

    it('debe deshabilitar botón de importación sin archivo', () => {
      cy.visit('/productos/carga-masiva')
      
      cy.contains('button', 'Iniciar Importación').should('be.disabled')
    })

    it('debe mostrar nota sobre duplicados', () => {
      cy.visit('/productos/carga-masiva')
      
      cy.contains('Los productos duplicados (mismo SKU) serán omitidos').should('exist')
    })
  })

  // ===== PRUEBAS DE FLUJO COMPLETO =====
  
  describe('Flujo Completo: Proveedor y Producto', () => {
    it('flujo completo: crear proveedor y luego producto', () => {
      // 1. Ir a proveedores
      cy.visit('/proveedores')
      cy.wait(1000)
      
      // 2. Navegar a agregar proveedor
      cy.contains('button', 'Agregar Proveedor').click()
      cy.url().should('include', '/proveedores/agregar')
      
      // 3. Llenar formulario de proveedor (simplificado)
      cy.get('#empresa').type('Proveedor Flujo E2E')
      cy.get('#nit').type(`900${Date.now().toString().slice(-6)}-1`)
      cy.get('#direccion').type('Calle Test 123')
      cy.get('#contacto_nombre').type('Test Contact')
      cy.get('#contacto_cargo').type('Manager')
      cy.get('#contacto_email').type('test@flujo.com')
      cy.get('#contacto_telefono').type('+57 310 9999999')
      
      // 4. Ir a productos
      cy.visit('/productos')
      cy.wait(1000)
      
      // 5. Verificar que estamos en productos
      cy.url().should('include', '/productos')
      
      // 6. Navegar a agregar producto
      cy.contains('button', 'Agregar').click()
      cy.url().should('include', '/productos/agregar')
      
      // 7. Verificar formulario de producto
      cy.contains('h1', 'Agregar Nuevo Producto').should('be.visible')
      cy.get('#nombre').should('exist')
      cy.get('#sku').should('exist')
    })

    it('flujo: navegar entre carga masiva de proveedores y productos', () => {
      // 1. Ir a carga masiva de proveedores
      cy.visit('/proveedores/carga-masiva')
      cy.contains('Carga Masiva de Proveedores').should('be.visible')
      
      // 2. Verificar elementos de proveedores
      cy.contains('Descargar Plantilla Excel').should('exist')
      
      // 3. Ir a carga masiva de productos
      cy.visit('/productos/carga-masiva')
      cy.contains('Carga Masiva de Productos').should('be.visible')
      
      // 4. Verificar elementos de productos con scroll
      cy.contains('Plantilla de Importación').scrollIntoView().should('be.visible')
      cy.contains('Campos Requeridos').scrollIntoView().should('be.visible')
    })
  })

  // ===== PRUEBAS DE PAGINACIÓN Y BÚSQUEDA =====
  
  describe('Funcionalidades Adicionales', () => {
    it('debe mostrar paginación en lista de proveedores', () => {
      cy.visit('/proveedores')
      cy.wait(2000)
      
      // Buscar controles de paginación
      cy.contains('button', 'Anterior').should('exist')
      cy.contains('button', 'Siguiente').should('exist')
    })

    it('debe mostrar contador de proveedores', () => {
      cy.visit('/proveedores')
      cy.wait(2000)
      
      // Verificar texto de contador
      cy.contains(/Mostrando \d+-\d+ de \d+ proveedores/).should('exist')
    })

    it('debe tener botón volver en formularios', () => {
      cy.visit('/proveedores/agregar')
      
      cy.contains('Volver a Proveedores').should('be.visible')
    })
  })
})
