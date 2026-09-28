import type { LocationType, SalesModel } from '../../../../features/administration/models/location.model';

export const LOCATIONS_TEXTS = {
  title: 'Ubicaciones e inventario',
  description: 'Canales de venta y dónde está cada unidad física (derivado de las licencias).',
  newLocation: 'Nueva ubicación',
  kpis: {
    total: 'Total unidades',
    warehouse: 'En bodega',
    assigned: 'Asignadas',
    activated: 'Activadas',
  },
  inventory: {
    title: 'Inventario por ubicación',
    empty: 'Aún no hay unidades. Genera licencias en Licencias y asígnalas a una ubicación.',
    columns: {
      product: 'Producto',
      available: 'Disponible',
      assigned: 'Asignada',
      sold: 'Vendida',
      active: 'Activada',
      total: 'Total',
    },
  },
  channels: {
    title: 'Canales y puntos de venta',
    empty: 'No hay ubicaciones. Crea una para empezar a distribuir el inventario.',
    commission: (percent: number) => `${percent}% comisión`,
  },
  types: {
    ecommerce: 'Ecommerce',
    physical_point: 'Punto físico',
  } satisfies Record<LocationType, string>,
  salesModels: {
    consignment: 'Consignación',
    wholesale: 'Venta en firme',
  } satisfies Record<SalesModel, string>,
  form: {
    title: 'Nueva ubicación',
    subtitle: 'Registra un canal o punto físico para distribuir inventario.',
    name: 'Nombre',
    namePlaceholder: 'Ej: Gym Pilates Norte',
    nameRequired: 'Ingresa un nombre',
    type: 'Tipo',
    salesModel: 'Modelo',
    commission: 'Comisión (%)',
    commissionHint: 'Solo aplica en consignación: porcentaje que retiene el punto al liquidar.',
    contact: 'Contacto',
    contactPlaceholder: 'Responsable',
    phone: 'Teléfono',
  },
  allocate: {
    assignTitle: 'Asignar unidades',
    returnTitle: 'Devolver a bodega',
    assignTarget: 'a',
    returnTarget: 'desde',
    product: 'Producto',
    productPlaceholder: 'Selecciona un producto',
    quantity: 'Cantidad',
    noAssigned: 'Este punto no tiene unidades asignadas de este producto.',
    assignedHere: 'Asignadas en este punto:',
    noAvailable: 'Sin unidades disponibles en bodega. Genera o libera un lote primero.',
    availableInWarehouse: 'Disponibles en bodega:',
    units: 'unidad(es).',
    exceedsAssigned: (max: number) => `La cantidad supera las ${max} unidades asignadas en este punto.`,
    exceedsAvailable: (max: number) => `La cantidad supera las ${max} unidades disponibles en bodega.`,
    returnHint: 'Mueve unidades asignadas en este punto de vuelta a la bodega.',
    assignHint: 'Toma unidades disponibles en bodega y las mueve a este punto.',
    returned: (returned: number, available: number) =>
      `Se devolvieron ${returned} unidad(es) a la bodega. Disponibles: ${available}.`,
    nothingToReturn: 'No había unidades asignadas a este punto para devolver.',
    allocated: (allocated: number, remaining: number) =>
      `Se asignaron ${allocated} unidad(es). Disponibles en bodega: ${remaining}.`,
    partiallyAllocated: (allocated: number, requested: number, remaining: number) =>
      `Solo había ${allocated} de ${requested} disponibles. Disponibles: ${remaining}.`,
  },
} as const;
