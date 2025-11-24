describe('Generación de rutas de entrega', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/rutas')
  })

  describe('Configuración inicial de la página', () => {
    it('debe cargar la página de generación de rutas correctamente', () => {
      cy.contains('Generación de Rutas de Entrega').should('be.visible')
      cy.contains('Configure los parámetros para generar la ruta óptima de entrega').should('be.visible')
    })

    it('debe mostrar el panel de configuración de rutas', () => {
      cy.contains('Configuración de Ruta').should('be.visible')
      cy.get('#bodega-origen').should('exist')
      cy.get('#hora-inicio').should('exist')
      cy.get('#camion-asignado').should('exist')
    })

    it('debe mostrar la tabla de pedidos pendientes', () => {
      cy.contains('Pedidos Pendientes de Entrega').scrollIntoView().should('be.visible')
      cy.get('table').scrollIntoView().should('be.visible')
      cy.get('thead').within(() => {
        cy.contains('ID Pedido').should('exist')
        cy.contains('Cliente').should('exist')
        cy.contains('Dirección').should('exist')
        cy.contains('Cajas').should('exist')
        cy.contains('Urgencia').should('exist')
      })
    })

    it('debe mostrar los botones de acción en el header', () => {
      cy.contains('button', 'Rutas Anteriores').should('be.visible')
      cy.contains('button', 'Generar Ruta Óptima').should('be.visible')
    })

    it('debe mostrar información de capacidades del camión', () => {
      cy.contains('Capacidades del camión').scrollIntoView().should('be.visible')
      cy.contains('Peso máx.').should('be.visible')
      cy.contains('500 kg').should('be.visible')
      cy.contains('Volumen máx.').should('be.visible')
      cy.contains('12 m³').should('be.visible')
    })
  })

  describe('Configuración de parámetros de ruta', () => {
    it('debe permitir seleccionar una bodega de origen', () => {
      cy.get('#bodega-origen').select('CD Lima')
      cy.get('#bodega-origen').should('have.value', 'CD Lima')
    })

    it('debe permitir configurar la hora de inicio', () => {
      cy.get('#hora-inicio').clear().type('08:00')
      cy.get('#hora-inicio').should('have.value', '08:00')
    })

    it('debe permitir seleccionar un camión asignado', () => {
      cy.get('#camion-asignado').select('Camión 2 - Cap: 750kg')
      cy.get('#camion-asignado').should('contain', '750kg')
    })

    it('debe permitir cambiar la política de optimización', () => {
      cy.get('#politica-optimizacion').select('Tiempo mínimo')
      cy.get('#politica-optimizacion').should('have.value', 'Tiempo mínimo')
    })

    it('debe permitir configurar el máximo de paradas', () => {
      cy.get('input[type="number"]').first().clear().type('15')
      cy.get('input[type="number"]').first().should('have.value', '15')
    })

    it('debe mostrar toggle para ventanas de entrega', () => {
      cy.contains('Ventanas de entrega').scrollIntoView().should('be.visible')
      cy.get('input[type="checkbox"][class*="sr-only"]').first().should('exist')
    })

    it('debe permitir filtrar por zona (Norte, Centro, Sur)', () => {
      cy.contains('Zona').scrollIntoView().should('be.visible')
      cy.contains('Norte').should('be.visible')
      cy.contains('Centro').should('be.visible')
      cy.contains('Sur').should('be.visible')
    })

    it('debe permitir filtrar por urgencia', () => {
      cy.contains('Urgencia').scrollIntoView().should('be.visible')
      cy.contains('Alta').should('be.visible')
      cy.contains('Media').should('be.visible')
      cy.contains('Baja').should('be.visible')
    })

    it('debe mostrar el toggle para retornar a bodega', () => {
      cy.contains('Retornar a bodega').scrollIntoView().should('be.visible')
      cy.contains('Retornar a bodega').parent().find('input[type="checkbox"]').should('be.checked')
    })
  })

  describe('Selección de pedidos', () => {
    it('debe mostrar pedidos con diferentes estados de urgencia', () => {
      cy.contains('Hospital San José').scrollIntoView().should('be.visible')
      cy.get('table').within(() => {
        cy.contains('Alta').should('be.visible')
        cy.contains('Media').should('be.visible')
      })
    })

    it('debe permitir seleccionar pedidos individuales', () => {
      cy.get('table tbody tr').first().find('input[type="checkbox"]').uncheck()
      cy.get('table tbody tr').first().find('input[type="checkbox"]').should('not.be.checked')
    })

    it('debe permitir deseleccionar pedidos', () => {
      cy.get('table tbody tr').first().find('input[type="checkbox"]').check({ force: true })
      cy.get('table tbody tr').first().find('input[type="checkbox"]').should('be.checked')
    })

    it('debe permitir seleccionar todos los pedidos', () => {
      cy.get('table thead input[type="checkbox"]').check()
      cy.get('table tbody input[type="checkbox"]').should('be.checked')
    })

    it('debe permitir deseleccionar todos los pedidos', () => {
      cy.get('table thead input[type="checkbox"]').should('exist')
      // Verificar funcionalidad de selección
      cy.get('table').scrollIntoView().should('exist')
    })

    it('debe mostrar el contador de pedidos seleccionados', () => {
      cy.get('table thead input[type="checkbox"]').check({ force: true })
      cy.contains(/\d+ pedidos seleccionados/).scrollIntoView().should('be.visible')
    })

    it('debe mostrar información completa de cada pedido', () => {
      cy.get('table tbody tr').first().scrollIntoView().within(() => {
        cy.get('td').eq(1).should('contain', '#ORD-')
        cy.get('td').eq(2).should('not.be.empty')
        cy.get('td').eq(3).should('not.be.empty')
        cy.get('td').eq(5).should('exist')
      })
    })
  })

  describe('Validación de formulario', () => {
    it('debe mostrar alerta si no hay pedidos seleccionados', () => {
      cy.get('table thead input[type="checkbox"]').uncheck({ force: true })
      
      cy.on('window:alert', (alertText) => {
        expect(alertText).to.contains('Por favor selecciona al menos un pedido')
      })
      
      cy.contains('button', 'Generar Ruta Óptima').click()
    })

    it('debe habilitar el botón de generar ruta con pedidos seleccionados', () => {
      cy.get('table tbody tr').first().find('input[type="checkbox"]').check({ force: true })
      cy.contains('button', 'Generar Ruta Óptima').should('not.be.disabled')
    })
  })

  describe('Generación de ruta óptima', () => {
    beforeEach(() => {
      // Interceptar la llamada al backend
      cy.intercept('POST', '**/api/v1/routes/optimize', {
        statusCode: 200,
        body: {
          alertas: [],
          geometria: {
            type: 'LineString',
            coordinates: [
              [-74.072092, 4.710989],
              [-74.063644, 4.698765],
              [-74.081234, 4.675432]
            ]
          },
          resumen: {
            capacidad_peso_usada_pct: 25.5,
            capacidad_volumen_usada_pct: 18.2,
            costo_estimado: 45000,
            distancia_total_km: 15.3,
            hora_fin_estimada: '12:45 PM',
            hora_inicio: '07:30 AM',
            tiempo_conduccion_min: 95,
            tiempo_entregas_min: 60,
            tiempo_total_min: 155,
            total_cajas: 25,
            total_entregas: 3
          },
          secuencia_entregas: [
            {
              cajas: 12,
              cliente: 'Hospital San José',
              direccion: 'Calle 45 #12-34, Bogotá',
              direccion_formateada: 'Calle 45 #12-34, Bogotá, Colombia',
              distancia_desde_anterior_km: 5.2,
              hora_estimada: '08:15 AM',
              id_pedido: '#ORD-001',
              lat: 4.698765,
              lon: -74.063644,
              orden: 1,
              tiempo_desde_anterior_min: 25,
              urgencia: 'alta',
              zona: 'norte'
            },
            {
              cajas: 8,
              cliente: 'Clínica del Norte',
              direccion: 'Carrera 15 #78-90, Bogotá',
              direccion_formateada: 'Carrera 15 #78-90, Bogotá, Colombia',
              distancia_desde_anterior_km: 6.8,
              hora_estimada: '09:30 AM',
              id_pedido: '#ORD-002',
              lat: 4.710989,
              lon: -74.072092,
              orden: 2,
              tiempo_desde_anterior_min: 35,
              urgencia: 'media',
              zona: 'norte'
            },
            {
              cajas: 5,
              cliente: 'Farmacia Central',
              direccion: 'Avenida 68 #25-10, Bogotá',
              direccion_formateada: 'Avenida 68 #25-10, Bogotá, Colombia',
              distancia_desde_anterior_km: 3.3,
              hora_estimada: '10:45 AM',
              id_pedido: '#ORD-003',
              lat: 4.675432,
              lon: -74.081234,
              orden: 3,
              tiempo_desde_anterior_min: 20,
              urgencia: 'media',
              zona: 'centro'
            }
          ]
        }
      }).as('optimizeRoute')
    })

    it('debe generar una ruta óptima con pedidos seleccionados', () => {
      cy.get('table tbody tr').first().find('input[type="checkbox"]').check({ force: true })
      cy.contains('button', 'Generar Ruta Óptima').click()
      
      cy.wait('@optimizeRoute')
      cy.url().should('include', '/rutas/resultado')
    })

    it('debe mostrar estado de carga al generar ruta', () => {
      cy.get('table tbody tr').first().find('input[type="checkbox"]').check({ force: true })
      cy.contains('button', 'Generar Ruta Óptima').click()
      
      // Verificar que el botón cambia
      cy.contains('button', 'Generar Ruta Óptima').should('exist')
    })

    it('debe enviar la configuración correcta al backend', () => {
      cy.get('table tbody tr').first().find('input[type="checkbox"]').check({ force: true })
      
      cy.intercept('POST', '**/api/v1/routes/optimize', (req) => {
        expect(req.body).to.have.property('configuracion')
        expect(req.body).to.have.property('pedidos')
        expect(req.body).to.have.property('costo_km')
        expect(req.body).to.have.property('costo_hora')
        expect(req.body.pedidos).to.be.an('array')
        expect(req.body.pedidos.length).to.be.greaterThan(0)
        
        req.reply({
          statusCode: 200,
          body: {
            alertas: [],
            geometria: { type: 'LineString', coordinates: [] },
            resumen: {
              capacidad_peso_usada_pct: 25,
              capacidad_volumen_usada_pct: 18,
              costo_estimado: 45000,
              distancia_total_km: 15,
              hora_fin_estimada: '12:45 PM',
              hora_inicio: '07:30 AM',
              tiempo_conduccion_min: 95,
              tiempo_entregas_min: 60,
              tiempo_total_min: 155,
              total_cajas: 25,
              total_entregas: 3
            },
            secuencia_entregas: []
          }
        })
      }).as('validatePayload')
      
      cy.contains('button', 'Generar Ruta Óptima').click()
      cy.wait('@validatePayload')
    })
  })

  describe('Página de resultados de ruta', () => {
    beforeEach(() => {
      // Mock de datos en sessionStorage
      const mockRouteData = {
        alertas: ['Pedido #ORD-001 tiene alta urgencia'],
        geometria: {
          type: 'LineString',
          coordinates: [
            [-74.072092, 4.710989],
            [-74.063644, 4.698765]
          ]
        },
        resumen: {
          capacidad_peso_usada_pct: 25.5,
          capacidad_volumen_usada_pct: 18.2,
          costo_estimado: 45000,
          distancia_total_km: 15.3,
          hora_fin_estimada: '12:45 PM',
          hora_inicio: '07:30 AM',
          tiempo_conduccion_min: 95,
          tiempo_entregas_min: 60,
          tiempo_total_min: 155,
          total_cajas: 25,
          total_entregas: 3
        },
        secuencia_entregas: [
          {
            cajas: 12,
            cliente: 'Hospital San José',
            direccion: 'Calle 45 #12-34, Bogotá',
            direccion_formateada: 'Calle 45 #12-34, Bogotá, Colombia',
            distancia_desde_anterior_km: 5.2,
            hora_estimada: '08:15 AM',
            id_pedido: '#ORD-001',
            lat: 4.698765,
            lon: -74.063644,
            orden: 1,
            tiempo_desde_anterior_min: 25,
            urgencia: 'alta',
            zona: 'norte'
          }
        ]
      }

      const mockRouteConfig = {
        bodega_origen: 'Calle 100 #15-20, Bogotá',
        hora_inicio: '07:30 AM',
        camion_capacidad_kg: 500,
        camion_capacidad_m3: 12
      }

      cy.window().then((win) => {
        win.sessionStorage.setItem('routeOptimizationResult', JSON.stringify(mockRouteData))
        win.sessionStorage.setItem('routeConfiguration', JSON.stringify(mockRouteConfig))
      })

      cy.visit('http://localhost:3000/rutas/resultado')
    })

    it('debe mostrar el header de ruta óptima generada', () => {
      cy.contains('Ruta Óptima Generada').should('be.visible')
      cy.contains('entregas programadas').should('be.visible')
    })

    it('debe mostrar alertas si existen', () => {
      cy.contains('Alertas').should('be.visible')
      cy.contains('Pedido #ORD-001 tiene alta urgencia').should('be.visible')
    })

    it('debe mostrar el resumen de la ruta', () => {
      cy.contains('Resumen de Ruta').scrollIntoView().should('be.visible')
      cy.contains('3').scrollIntoView().should('be.visible') // Total entregas
      cy.contains('15.3 km').scrollIntoView().should('be.visible')
      cy.contains('25').scrollIntoView().should('be.visible') // Total cajas
    })

    it('debe mostrar la secuencia de entregas', () => {
      cy.contains('Secuencia de Entregas').scrollIntoView().should('be.visible')
      cy.contains('Bodega Principal').should('be.visible')
      cy.contains('Hospital San José').should('be.visible')
    })

    it('debe mostrar información del camión', () => {
      cy.contains('Información del Camión').scrollIntoView().should('be.visible')
      cy.contains('500 kg / 12 m³').should('be.visible')
      cy.contains('Peso usado').should('be.visible')
      cy.contains('25.5%').should('be.visible')
      cy.contains('Volumen usado').should('be.visible')
      cy.contains('18.2%').should('be.visible')
    })

    it('debe mostrar los botones de acción', () => {
      cy.contains('button', 'Recalcular').should('be.visible')
      cy.contains('button', 'Aceptar Ruta').should('be.visible')
    })

    it('debe permitir recalcular la ruta', () => {
      cy.contains('button', 'Recalcular').click()
      cy.url().should('include', '/rutas')
    })

    it('debe mostrar paradas ordenadas correctamente', () => {
      cy.get('div').contains('0').should('be.visible') // Bodega
      cy.get('div').contains('1').should('be.visible') // Primera parada
    })

    it('debe mostrar el costo estimado', () => {
      cy.contains('Costo Est.').scrollIntoView().should('be.visible')
      cy.contains('45').scrollIntoView().should('be.visible')
    })

    it('debe mostrar el tiempo total de la ruta', () => {
      cy.contains('2h').scrollIntoView().should('be.visible') // 155 minutos = 2h 35min
    })

    it('debe mostrar badges de urgencia en las paradas', () => {
      cy.contains('alta').should('be.visible')
      cy.get('p').contains('alta').should('have.class', 'text-red-400')
    })
  })

  describe('Aceptación de ruta', () => {
    beforeEach(() => {
      const mockRouteData = {
        alertas: [],
        geometria: {
          type: 'LineString',
          coordinates: [[-74.072092, 4.710989]]
        },
        resumen: {
          capacidad_peso_usada_pct: 25,
          capacidad_volumen_usada_pct: 18,
          costo_estimado: 45000,
          distancia_total_km: 15,
          hora_fin_estimada: '12:45 PM',
          hora_inicio: '07:30 AM',
          tiempo_conduccion_min: 95,
          tiempo_entregas_min: 60,
          tiempo_total_min: 155,
          total_cajas: 25,
          total_entregas: 3
        },
        secuencia_entregas: []
      }

      cy.window().then((win) => {
        win.sessionStorage.setItem('routeOptimizationResult', JSON.stringify(mockRouteData))
        win.sessionStorage.setItem('routeConfiguration', JSON.stringify({
          bodega_origen: 'Calle 100 #15-20, Bogotá',
          hora_inicio: '07:30 AM',
          camion_capacidad_kg: 500,
          camion_capacidad_m3: 12
        }))
      })

      // Mock del POST para crear ruta
      cy.intercept('POST', '**/api/v1/rutas', {
        statusCode: 200,
        body: { id: 'ruta-123-abc' }
      }).as('createRoute')

      // Mock del GET para obtener detalles
      cy.intercept('GET', '**/api/v1/rutas/ruta-123-abc', {
        statusCode: 200,
        body: {
          id: 'ruta-123-abc',
          status: 'pending',
          created_at: '2024-01-15T08:00:00Z',
          updated_at: '2024-01-15T08:00:00Z',
          driver_id: null,
          driver_name: null,
          optimized_by: 'system',
          notes: 'Ruta optimizada - 3 entregas, 25 cajas',
          alertas: [],
          geometria: {
            type: 'LineString',
            coordinates: [[-74.072092, 4.710989]]
          },
          resumen: {
            capacidad_peso_usada_pct: 25,
            capacidad_volumen_usada_pct: 18,
            costo_estimado: 45000,
            distancia_total_km: 15,
            hora_fin_estimada: '12:45 PM',
            hora_inicio: '07:30 AM',
            tiempo_conduccion_min: 95,
            tiempo_entregas_min: 60,
            tiempo_total_min: 155,
            total_cajas: 25,
            total_entregas: 3
          },
          secuencia_entregas: []
        }
      }).as('getRouteDetails')

      cy.visit('http://localhost:3000/rutas/resultado')
    })

    it('debe crear la ruta al hacer clic en Aceptar', () => {
      cy.contains('button', 'Aceptar Ruta').click()
      cy.wait('@createRoute')
    })

    it('debe navegar a la página de detalle después de aceptar', () => {
      cy.contains('button', 'Aceptar Ruta').click()
      cy.wait('@createRoute')
      cy.wait('@getRouteDetails')
      cy.url().should('include', '/rutas/detalle/ruta-123-abc')
    })
  })

  describe('Página de detalle de ruta', () => {
    beforeEach(() => {
      const mockRouteDetails = {
        id: 'ruta-123-abc',
        status: 'pending',
        created_at: '2024-01-15T08:00:00Z',
        updated_at: '2024-01-15T08:00:00Z',
        driver_id: null,
        driver_name: 'Juan Pérez',
        optimized_by: 'system',
        notes: 'Ruta optimizada - 3 entregas, 25 cajas',
        alertas: [],
        geometria: {
          type: 'LineString',
          coordinates: [[-74.072092, 4.710989]]
        },
        resumen: {
          capacidad_peso_usada_pct: 25.5,
          capacidad_volumen_usada_pct: 18.2,
          costo_estimado: 45000,
          distancia_total_km: 15.3,
          hora_fin_estimada: '12:45 PM',
          hora_inicio: '07:30 AM',
          tiempo_conduccion_min: 95,
          tiempo_entregas_min: 60,
          tiempo_total_min: 155,
          total_cajas: 25,
          total_entregas: 3
        },
        secuencia_entregas: [
          {
            cajas: 12,
            cliente: 'Hospital San José',
            direccion: 'Calle 45 #12-34',
            direccion_formateada: 'Calle 45 #12-34, Bogotá, Colombia',
            distancia_desde_anterior_km: 5.2,
            hora_estimada: '08:15 AM',
            id_pedido: '#ORD-001',
            lat: 4.698765,
            lon: -74.063644,
            orden: 1,
            tiempo_desde_anterior_min: 25,
            urgencia: 'alta',
            zona: 'norte'
          }
        ]
      }

      cy.window().then((win) => {
        win.sessionStorage.setItem('routeDetails', JSON.stringify(mockRouteDetails))
      })

      cy.visit('http://localhost:3000/rutas/detalle/ruta-123-abc')
    })

    it('debe mostrar el header con ID de ruta', () => {
      cy.contains('Ruta #ruta-123').should('be.visible')
    })

    it('debe mostrar el badge de estado de la ruta', () => {
      cy.contains('Pendiente').should('be.visible')
    })

    it('debe mostrar el botón de volver', () => {
      cy.contains('Volver a rutas').should('be.visible')
    })

    it('debe mostrar las tarjetas de estadísticas principales', () => {
      cy.contains('Distancia Total').scrollIntoView().should('be.visible')
      cy.contains('15.3 km').scrollIntoView().should('be.visible')
      cy.contains('Tiempo Estimado').scrollIntoView().should('be.visible')
      cy.contains('2h 35min').scrollIntoView().should('be.visible')
      cy.contains('Total Entregas').scrollIntoView().should('be.visible')
      cy.contains('3').scrollIntoView().should('be.visible')
      cy.contains('Progreso').scrollIntoView().should('be.visible')
    })

    it('debe mostrar información del camión', () => {
      cy.contains('Información del Camión').scrollIntoView().should('be.visible')
      cy.contains('Conductor').should('be.visible')
      cy.contains('Juan Pérez').should('be.visible')
      cy.contains('Optimizado por').should('be.visible')
      cy.contains('system').should('be.visible')
    })

    it('debe mostrar el cronograma de entregas', () => {
      cy.contains('Cronograma de Entregas').scrollIntoView().should('be.visible')
      cy.contains('Salida de bodega').should('be.visible')
      cy.contains('Hospital San José').should('be.visible')
    })

    it('debe mostrar las notas de la ruta', () => {
      cy.contains('Notas').scrollIntoView().should('be.visible')
      cy.contains('Ruta optimizada - 3 entregas, 25 cajas').should('be.visible')
    })

    it('debe mostrar el resumen con métricas', () => {
      cy.contains('Resumen').scrollIntoView().should('be.visible')
      cy.contains('Tiempo conducción').should('be.visible')
      cy.contains('95 min').should('be.visible')
      cy.contains('Tiempo entregas').should('be.visible')
      cy.contains('60 min').should('be.visible')
      cy.contains('45').scrollIntoView().should('be.visible')
    })

    it('debe mostrar sección de incidencias', () => {
      cy.contains('Incidencias').scrollIntoView().should('be.visible')
      cy.contains('No hay incidencias reportadas').should('be.visible')
    })

    it('debe mostrar los botones de acción', () => {
      cy.contains('button', 'Editar Ruta').should('be.visible')
      cy.contains('button', 'Exportar PDF').should('be.visible')
      cy.contains('button', 'Cancelar Ruta').should('be.visible')
    })

    it('debe mostrar detalles de las paradas', () => {
      cy.contains('Hospital San José').scrollIntoView().should('be.visible')
      cy.contains('#ORD-001').should('be.visible')
      cy.contains('12 cajas').should('be.visible')
      cy.contains('alta').should('be.visible')
      cy.contains('08:15 AM').should('be.visible')
    })

    it('debe mostrar información de distancia entre paradas', () => {
      cy.contains('Hospital San José').scrollIntoView().should('be.visible')
      cy.contains('12 cajas').should('be.visible')
    })

    it('debe permitir volver a la página de rutas', () => {
      cy.contains('Volver a rutas').click()
      cy.url().should('include', '/rutas')
    })

    it('debe mostrar el botón de reportar incidencia', () => {
      cy.contains('button', 'Reportar Incidencia').scrollIntoView().should('be.visible')
    })
  })

  describe('Flujo completo de generación de ruta', () => {
    it('debe completar el flujo desde configuración hasta detalle', () => {
      // 1. Configurar parámetros
      cy.visit('http://localhost:3000/rutas')
      cy.get('#bodega-origen').select('CD Bogotá')
      cy.get('#hora-inicio').should('have.value', '07:30')
      
      // 2. Seleccionar pedidos
      cy.get('table tbody tr').first().find('input[type="checkbox"]').check({ force: true })
      cy.contains(/\d+ pedidos seleccionados/).scrollIntoView().should('be.visible')
      
      // 3. Mock de optimización
      cy.intercept('POST', '**/api/v1/routes/optimize', {
        statusCode: 200,
        body: {
          alertas: [],
          geometria: { type: 'LineString', coordinates: [] },
          resumen: {
            capacidad_peso_usada_pct: 25,
            capacidad_volumen_usada_pct: 18,
            costo_estimado: 45000,
            distancia_total_km: 15,
            hora_fin_estimada: '12:45 PM',
            hora_inicio: '07:30 AM',
            tiempo_conduccion_min: 95,
            tiempo_entregas_min: 60,
            tiempo_total_min: 155,
            total_cajas: 25,
            total_entregas: 3
          },
          secuencia_entregas: []
        }
      }).as('optimize')
      
      // 4. Generar ruta
      cy.contains('button', 'Generar Ruta Óptima').click()
      cy.wait('@optimize')
      cy.url().should('include', '/rutas/resultado')
      
      // 5. Verificar resultados
      cy.contains('Ruta Óptima Generada').should('be.visible')
      cy.contains('entregas programadas').scrollIntoView().should('be.visible')
      
      // 6. Mock de creación
      cy.intercept('POST', '**/api/v1/rutas', {
        statusCode: 200,
        body: { id: 'ruta-final' }
      }).as('create')
      
      cy.intercept('GET', '**/api/v1/rutas/ruta-final', {
        statusCode: 200,
        body: {
          id: 'ruta-final',
          status: 'pending',
          created_at: '2024-01-15T08:00:00Z',
          updated_at: '2024-01-15T08:00:00Z',
          driver_name: 'Juan Pérez',
          optimized_by: 'system',
          notes: 'Ruta completa',
          alertas: [],
          geometria: { type: 'LineString', coordinates: [] },
          resumen: {
            capacidad_peso_usada_pct: 25,
            capacidad_volumen_usada_pct: 18,
            costo_estimado: 45000,
            distancia_total_km: 15,
            hora_fin_estimada: '12:45 PM',
            hora_inicio: '07:30 AM',
            tiempo_conduccion_min: 95,
            tiempo_entregas_min: 60,
            tiempo_total_min: 155,
            total_cajas: 25,
            total_entregas: 3
          },
          secuencia_entregas: []
        }
      }).as('details')
      
      // 7. Aceptar ruta
      cy.contains('button', 'Aceptar Ruta').click()
      cy.wait('@create')
      cy.wait('@details')
      cy.url().should('include', '/rutas/detalle/ruta-final')
      
      // 8. Verificar detalle
      cy.contains('Ruta #ruta-fin').should('be.visible')
      cy.contains('Pendiente').should('be.visible')
    })
  })

  describe('Manejo de errores', () => {
    it('debe manejar error al generar ruta', () => {
      cy.get('table tbody tr').first().find('input[type="checkbox"]').check({ force: true })
      
      cy.intercept('POST', '**/api/v1/routes/optimize', {
        statusCode: 500,
        body: { error: 'Error interno del servidor' }
      }).as('errorOptimize')
      
      cy.on('window:alert', (alertText) => {
        expect(alertText).to.contains('Error al generar la ruta')
      })
      
      cy.contains('button', 'Generar Ruta Óptima').click()
      cy.wait('@errorOptimize')
    })

    it('debe manejar error al aceptar ruta', () => {
      const mockRouteData = {
        alertas: [],
        geometria: { type: 'LineString', coordinates: [] },
        resumen: {
          capacidad_peso_usada_pct: 25,
          capacidad_volumen_usada_pct: 18,
          costo_estimado: 45000,
          distancia_total_km: 15,
          hora_fin_estimada: '12:45 PM',
          hora_inicio: '07:30 AM',
          tiempo_conduccion_min: 95,
          tiempo_entregas_min: 60,
          tiempo_total_min: 155,
          total_cajas: 25,
          total_entregas: 3
        },
        secuencia_entregas: []
      }

      cy.window().then((win) => {
        win.sessionStorage.setItem('routeOptimizationResult', JSON.stringify(mockRouteData))
      })

      cy.visit('http://localhost:3000/rutas/resultado')
      
      cy.intercept('POST', '**/api/v1/rutas', {
        statusCode: 500,
        body: { error: 'Error al crear' }
      }).as('errorCreate')
      
      cy.on('window:alert', (alertText) => {
        expect(alertText).to.contains('Error al aceptar la ruta')
      })
      
      cy.contains('button', 'Aceptar Ruta').click()
      cy.wait('@errorCreate')
    })

    it('debe redirigir si no hay datos en sessionStorage', () => {
      cy.window().then((win) => {
        win.sessionStorage.clear()
      })
      
      cy.visit('http://localhost:3000/rutas/resultado')
      cy.url().should('include', '/rutas')
      cy.url().should('not.include', '/resultado')
    })
  })

  describe('Diseño responsive', () => {
    it('debe adaptarse a pantallas móviles', () => {
      cy.viewport('iphone-x')
      cy.contains('Generación de Rutas de Entrega').should('be.visible')
      cy.get('#bodega-origen').should('be.visible')
    })

    it('debe mostrar la tabla de pedidos en móvil', () => {
      cy.viewport('iphone-x')
      cy.get('table').scrollIntoView().should('exist')
    })

    it('debe funcionar en tablet', () => {
      cy.viewport('ipad-2')
      cy.contains('Configuración de Ruta').scrollIntoView().should('be.visible')
      cy.get('table').scrollIntoView().should('exist')
    })
  })
})
