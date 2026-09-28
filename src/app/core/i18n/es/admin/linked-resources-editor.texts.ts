export const LINKED_RESOURCES_EDITOR_TEXTS = {
  add:          'Agregar',
  pickerTitle:  'Seleccionar recurso',
  moveUp:       'Subir',
  moveDown:     'Bajar',
  viewResource: 'Ver recurso',
  unlink:       'Quitar',
  empty:        'Sin recursos vinculados',
  addFirst:     'Agregar primer recurso',
  resourceCount: (n: number) =>
    n === 0 ? 'Sin recursos' : n === 1 ? '1 recurso' : `${n} recursos`,
} as const;
