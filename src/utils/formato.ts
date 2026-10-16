export const formatPrecio = (precio: number): string =>
  "$" + precio.toLocaleString("es-CL");

// Estilos de las categorías originales (por nombre). Las nuevas usan el estilo por defecto.
const clasesBadge: Record<string, string> = {
  consulta: "bg-success text-white",
  "plan especializado": "bg-primary text-white",
  evaluación: "bg-warning text-dark",
  "taller grupal": "bg-info text-dark",
};

const iconos: Record<string, string> = {
  consulta: "bi-person-heart",
  "plan especializado": "bi-journal-medical",
  evaluación: "bi-clipboard2-pulse",
  "taller grupal": "bi-people",
};

const imagenes: Record<string, string> = {
  consulta: "/assets/img/consulta.png",
  "plan especializado": "/assets/img/plan.png",
  evaluación: "/assets/img/evaluacion.png",
  "taller grupal": "/assets/img/taller.png",
};

const clave = (categoria: string) => categoria.trim().toLowerCase();

export const getBadgeClass = (categoria: string): string =>
  clasesBadge[clave(categoria)] ?? "bg-secondary text-white";

export const getTipoIcon = (categoria: string): string => iconos[clave(categoria)] ?? "bi-tag";

export const imagenCategoria = (categoria: string): string | null => imagenes[clave(categoria)] ?? null;

export const formatFecha = (fechaISO: string): string => {
  const fecha = new Date(fechaISO + "T00:00:00");
  return Number.isNaN(fecha.getTime()) ? fechaISO : fecha.toLocaleDateString("es-CL");
};
