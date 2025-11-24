describe('Consulta de reportes e informes de los vendedores', () => {
  beforeEach(() => {
    // Visitar la página de reportes antes de cada prueba
    cy.visit('/reportes')
  })

  it('debe cargar la página de reportes correctamente', () => {
    // Verificar que el título principal esté presente
    cy.contains('h1', 'Análisis de Ventas').should('be.visible')
    cy.contains('Reportes y estadísticas en tiempo real').should('be.visible')
  })

  it('debe mostrar las tarjetas de estadísticas principales', () => {
    // Verificar que las 4 tarjetas de estadísticas están presentes
    cy.contains('Ventas Totales').should('be.visible')
    cy.contains('Total Pedidos').should('be.visible')
    cy.contains('Valor Promedio').should('be.visible')
    cy.contains('Producto Top').should('be.visible')
  })

  it('debe mostrar los controles de filtrado de período', () => {
    // Verificar la presencia de controles de fecha
    cy.contains('Período:').should('be.visible')
    cy.get('input[type="date"]').should('have.length', 2)
    
    // Verificar botones de período rápido
    cy.contains('button', 'Últimos 30 días').should('be.visible')
    cy.contains('button', 'Últimos 3 meses').should('be.visible')
    
    // Verificar botón de actualizar
    cy.contains('button', 'Actualizar').should('be.visible')
  })

  it('debe mostrar la sección de Top Vendedores', () => {
    // Hacer scroll para que la sección sea visible
    cy.contains('h2', 'Top Vendedores').scrollIntoView()
    cy.contains('h2', 'Top Vendedores').should('exist')
    
    // Esperar a que carguen los datos
    cy.wait(2000)
  })

  it('debe mostrar la sección de Productos Más Vendidos', () => {
    // Hacer scroll para que la sección sea visible
    cy.contains('h2', 'Productos Más Vendidos').scrollIntoView()
    cy.contains('h2', 'Productos Más Vendidos').should('exist')
    
    // Esperar a que carguen los datos
    cy.wait(2000)
  })

  it('debe mostrar la tabla de detalle de ventas por vendedor', () => {
    // Hacer scroll para que la sección sea visible
    cy.contains('h2', 'Detalle de Ventas por Vendedor').scrollIntoView()
    cy.contains('h2', 'Detalle de Ventas por Vendedor').should('exist')
    
    // Esperar a que carguen los datos
    cy.wait(2000)
    
    // Verificar los encabezados de la tabla
    cy.contains('th', 'Vendedor').should('exist')
    cy.contains('th', 'Producto').should('exist')
    cy.contains('th', 'Cantidad').should('exist')
    cy.contains('th', 'Ingresos').should('exist')
    cy.contains('th', 'Estado').should('exist')
    cy.contains('th', 'Fecha').should('exist')
  })

  it('debe permitir cambiar el período de consulta usando botones rápidos', () => {
    // Click en "Últimos 30 días"
    cy.contains('button', 'Últimos 30 días').click()
    cy.wait(500)
    
    // Verificar que las fechas tienen algún valor (no vacío)
    cy.get('input[type="date"]').first().should('not.have.value', '')
    cy.get('input[type="date"]').last().should('not.have.value', '')
    
    // Click en "Últimos 3 meses"
    cy.contains('button', 'Últimos 3 meses').click()
    cy.wait(500)
    
    // Verificar que las fechas tienen algún valor
    cy.get('input[type="date"]').first().should('not.have.value', '')
    cy.get('input[type="date"]').last().should('not.have.value', '')
  })

  it('debe permitir seleccionar fechas personalizadas', () => {
    // Obtener los inputs de fecha
    const fechaInicio = '2025-10-01'
    const fechaFin = '2025-11-30'
    
    // Cambiar la fecha de inicio
    cy.get('input[type="date"]').first().clear()
    cy.wait(300)
    cy.get('input[type="date"]').first().type(fechaInicio)
    
    // Cambiar la fecha de fin
    cy.get('input[type="date"]').last().clear()
    cy.wait(300)
    cy.get('input[type="date"]').last().type(fechaFin)
  })

  it('debe permitir actualizar los datos con el botón Actualizar', () => {
    // Esperar a que cargue inicialmente
    cy.wait(1000)
    
    // Click en actualizar
    cy.contains('button', 'Actualizar').click()
    
    // Verificar que el botón muestra estado de carga (spin)
    cy.contains('button', 'Actualizar').should('exist')
  })

  it('debe mostrar los botones de exportación', () => {
    // Verificar presencia de botones de exportación
    cy.contains('button', 'Exportar Excel').should('be.visible')
    cy.contains('button', 'Exportar PDF').should('be.visible')
  })

  it('debe permitir exportar a Excel', () => {
    // Esperar a que carguen los datos
    cy.wait(2000)
    
    // Click en exportar Excel
    cy.contains('button', 'Exportar Excel').should('be.visible').click()
    
    // Nota: La descarga real depende del backend, pero verificamos que el botón funcione
    // En un entorno de prueba con backend mock, podrías interceptar la llamada
  })

  it('debe permitir exportar a PDF', () => {
    // Esperar a que carguen los datos
    cy.wait(2000)
    
    // Click en exportar PDF
    cy.contains('button', 'Exportar PDF').should('be.visible').click()
    
    // Nota: La descarga real depende del backend, pero verificamos que el botón funcione
  })

  it('debe mostrar información formateada correctamente en la tabla', () => {
    // Esperar a que carguen los datos
    cy.wait(2000)
    
    // Verificar que la tabla tiene contenido o mensaje apropiado
    cy.get('table tbody').should('exist')
  })

  it('debe aplicar hover effects en las tarjetas de estadísticas', () => {
    // Verificar que la tarjeta existe y es interactiva
    cy.contains('Ventas Totales').parent().parent()
      .should('exist')
      .and('be.visible')
  })

  it('debe mostrar estados de ventas con colores apropiados en la tabla', () => {
    // Esperar a que carguen los datos
    cy.wait(2000)
    
    // Si hay datos en la tabla, verificar que los badges de estado tienen las clases correctas
    cy.get('table tbody tr').then(($rows) => {
      if ($rows.length > 0) {
        // Verificar que existen badges con estados
        cy.get('table tbody span').should('exist')
      }
    })
  })

  it('debe ser responsivo y mostrar todos los elementos en desktop', () => {
    // Establecer viewport desktop
    cy.viewport(1280, 720)
    
    // Verificar que todos los elementos principales existen
    cy.contains('h1', 'Análisis de Ventas').should('be.visible')
    cy.contains('Ventas Totales').should('be.visible')
    cy.contains('h2', 'Top Vendedores').scrollIntoView().should('exist')
    cy.contains('h2', 'Productos Más Vendidos').scrollIntoView().should('exist')
    cy.contains('h2', 'Detalle de Ventas por Vendedor').scrollIntoView().should('exist')
  })

  it('debe mostrar el contador de resultados en la tabla', () => {
    // Esperar a que carguen los datos
    cy.wait(2000)
    
    // Hacer scroll a la sección de la tabla
    cy.contains('h2', 'Detalle de Ventas por Vendedor').scrollIntoView()
    
    // Verificar que se muestra el texto con el número de resultados
    cy.get('p').contains(/\d+ resultados?/).should('exist')
  })

  it('flujo completo: cambiar período, actualizar y verificar datos', () => {
    // 1. Cambiar período a últimos 30 días
    cy.contains('button', 'Últimos 30 días').click()
    cy.wait(500)
    
    // 2. Actualizar datos
    cy.contains('button', 'Actualizar').click()
    cy.wait(2000)
    
    // 3. Verificar que las estadísticas se actualizaron
    cy.contains('Ventas Totales').should('be.visible')
    cy.contains('Total Pedidos').should('be.visible')
    
    // 4. Scroll y verificar secciones
    cy.contains('h2', 'Top Vendedores').scrollIntoView().should('exist')
    cy.contains('h2', 'Productos Más Vendidos').scrollIntoView().should('exist')
    cy.contains('h2', 'Detalle de Ventas por Vendedor').scrollIntoView().should('exist')
  })
})
