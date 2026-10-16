import type { Rol } from "../types/Usuario";

export const ETIQUETA_ROL: Record<Rol, string> = {
  administrador: "Administrador",
  vendedor: "Vendedor",
  cliente: "Cliente",
};

export const CLASE_ROL: Record<Rol, string> = {
  administrador: "bg-danger text-white",
  vendedor: "bg-warning text-dark",
  cliente: "bg-success text-white",
};

export const TODOS_LOS_ROLES: Rol[] = ["administrador", "vendedor", "cliente"];

type RolOpcional = Rol | undefined | null;

// Matriz de permisos: única fuente de verdad para la interfaz y los contextos.
export const permisos = {
  accederAdministracion: (rol: RolOpcional) => rol === "administrador" || rol === "vendedor",
  gestionarUsuarios: (rol: RolOpcional) => rol === "administrador",
  rolesAsignables: (rol: RolOpcional): Rol[] =>
    rol === "administrador" ? TODOS_LOS_ROLES : rol === "vendedor" ? ["cliente"] : [],
  gestionarProductos: (rol: RolOpcional) => rol === "administrador",
  editarStock: (rol: RolOpcional) => rol === "administrador" || rol === "vendedor",
  gestionarCategorias: (rol: RolOpcional) => rol === "administrador",
};

export const SIN_PERMISO = "No tienes permiso para realizar esta acción.";
