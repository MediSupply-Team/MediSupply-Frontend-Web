import { z } from 'zod';

export const productoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder 100 caracteres'),
  sku: z.string().min(1, 'El SKU es requerido').max(50, 'El SKU no puede exceder 50 caracteres'),
  codigoBarras: z.string().optional(),
  categoria: z.string().min(1, 'La categoría es requerida'),
  marca: z.string().min(1, 'La marca es requerida').max(50, 'La marca no puede exceder 50 caracteres'),
  descripcion: z.string().min(1, 'La descripción es requerida').max(500, 'La descripción no puede exceder 500 caracteres'),
  stockInicial: z.number().min(0, 'El stock inicial no puede ser negativo').int('El stock inicial debe ser un número entero').optional(),
  stockMinimo: z.number().min(0, 'El stock mínimo no puede ser negativo').int('El stock mínimo debe ser un número entero').optional(),
  unidadMedida: z.string().min(1, 'La unidad de medida es requerida'),
  almacen: z.string().min(1, 'El almacén es requerido'),
  ubicacion: z.string().optional(),
  temperatura: z.string().min(1, 'La temperatura de almacenamiento es requerida'),
  fechaVencimiento: z.string().optional(),
  precioCosto: z.number().min(0, 'El precio de costo no puede ser negativo').optional(),
  precioVenta: z.number().min(0, 'El precio de venta no puede ser negativo').optional(),
  proveedor: z.string().min(1, 'El proveedor es requerido'),
  registroSanitario: z.string().optional(),
}).refine((data) => {
  // Validar que el precio de venta sea mayor al precio de costo (si ambos están definidos)
  const precioCosto = data.precioCosto || 0;
  const precioVenta = data.precioVenta || 0;
  
  if (precioCosto > 0 && precioVenta > 0) {
    return precioVenta >= precioCosto;
  }
  return true;
}, {
  message: 'El precio de venta debe ser mayor o igual al precio de costo',
  path: ['precioVenta'],
});

export type ProductoFormData = z.infer<typeof productoSchema>;