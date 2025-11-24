// Ignorar errores de hidratación de React durante las pruebas
Cypress.on('uncaught:exception', (err) => {
  // Ignorar errores de hidratación de React
  if (err.message.includes('Hydration failed')) {
    return false
  }
  // Permitir que otros errores fallen las pruebas
  return true
})