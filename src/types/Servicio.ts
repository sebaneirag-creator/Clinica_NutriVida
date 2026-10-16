/** "Producto" de la tienda: cada servicio nutricional. `stock` = cupos disponibles. */
export interface Servicio {
  codigo: string;
  /** Nombre de la categoría: las categorías existentes se obtienen de los propios servicios. */
  categoria: string;
  nombre: string;
  duracion: string;
  modalidad: string;
  precio: number;
  stock: number;
  descripcion: string;
}

export interface LineaCarrito {
  servicio: Servicio;
  cantidad: number;
}
