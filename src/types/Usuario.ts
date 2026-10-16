export type Rol = "administrador" | "vendedor" | "cliente";

export interface DatosPersonales {
  nombre: string;
  apellido: string;
  correo: string;
  fechaNacimiento: string;
  genero: string;
  region: string;
  direccion: string;
}

export interface Usuario extends DatosPersonales {
  id: string;
  contrasena: string;
  rol: Rol;
}

/** Usuario sin contraseña: es lo que se expone a la interfaz. */
export type UsuarioPublico = Omit<Usuario, "contrasena">;
