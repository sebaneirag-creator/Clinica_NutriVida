import type { Servicio } from "../types/Servicio";
import type { DatosPersonales } from "../types/Usuario";

export const DOMINIO = "@duocuc.cl";
export const EDAD_MINIMA = 14;

export function calcularEdad(fechaNacimiento: string, hoy: Date = new Date()): number {
  const nacimiento = new Date(fechaNacimiento + "T00:00:00");
  if (Number.isNaN(nacimiento.getTime())) return 0;
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const meses = hoy.getMonth() - nacimiento.getMonth();
  if (meses < 0 || (meses === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
}

export const contrasenaValida = (c: string): boolean =>
  /.{8,}/.test(c) && /[A-Z]/.test(c) && /[a-z]/.test(c) && /[0-9]/.test(c);

/** Devuelve el primer error encontrado, o null si los datos son válidos. */
export function validarDatosPersonales(d: DatosPersonales): string | null {
  if (
    !d.nombre.trim() || !d.apellido.trim() || !d.correo.trim() ||
    !d.fechaNacimiento || !d.genero || !d.region || !d.direccion.trim()
  ) {
    return "Todos los campos son obligatorios";
  }
  if (d.nombre.trim().length < 2) return "El nombre debe tener al menos 2 caracteres";
  if (!d.correo.trim().toLowerCase().endsWith(DOMINIO)) {
    return "El dominio del correo debe ser @duocuc.cl";
  }
  if (new Date(d.fechaNacimiento + "T00:00:00") > new Date()) {
    return "La fecha de nacimiento no puede ser futura";
  }
  if (calcularEdad(d.fechaNacimiento) < EDAD_MINIMA) {
    return "El registro es solo para personas mayores a 14 años";
  }
  return null;
}

export function validarContrasenas(contrasena: string, confirmacion: string): string | null {
  if (!contrasena || !confirmacion) return "Debes ingresar y confirmar la contraseña";
  if (contrasena !== confirmacion) return "Contraseñas no coinciden";
  if (!contrasenaValida(contrasena)) {
    return "La contraseña debe contener 8 carácteres, una mayúscula, una minúscula y un número";
  }
  return null;
}

export function validarStock(stock: number): string | null {
  if (!Number.isInteger(stock) || stock < 0 || stock > 999) {
    return "El stock debe ser un número entero entre 0 y 999";
  }
  return null;
}

export function validarServicio(s: Servicio): string | null {
  if (!/^[A-Z0-9]{3,10}$/.test(s.codigo)) {
    return "El código debe tener entre 3 y 10 letras o números (ej: CN006)";
  }
  if (s.nombre.length < 3) return "El nombre debe tener al menos 3 caracteres";
  if (s.categoria.length < 3) return "La categoría debe tener al menos 3 caracteres";
  if (!s.modalidad.trim()) return "Indica la modalidad";
  if (!s.duracion.trim()) return "Indica la duración (usa — si no aplica)";
  if (!Number.isInteger(s.precio) || s.precio <= 0) {
    return "El precio debe ser un número entero mayor a 0";
  }
  const errorStock = validarStock(s.stock);
  if (errorStock) return errorStock;
  if (s.descripcion.length < 10) return "La descripción debe tener al menos 10 caracteres";
  return null;
}
