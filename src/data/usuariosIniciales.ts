import type { Usuario } from "../types/Usuario";

// Cuentas de demostración (simulación académica, sin seguridad real).
export const usuariosIniciales: Usuario[] = [
  {
    id: "usr-admin",
    nombre: "Administrador",
    apellido: "NutriVida",
    correo: "admin@duocuc.cl",
    fechaNacimiento: "1990-01-15",
    contrasena: "Admin123",
    genero: "NoDice",
    region: "Araucania",
    direccion: "Milano 01591, Temuco",
    rol: "administrador",
  },
  {
    id: "usr-vendedor",
    nombre: "Vendedor",
    apellido: "NutriVida",
    correo: "vendedor@duocuc.cl",
    fechaNacimiento: "1992-05-20",
    contrasena: "Vendedor123",
    genero: "NoDice",
    region: "Araucania",
    direccion: "Milano 01591, Temuco",
    rol: "vendedor",
  },
  {
    id: "usr-cliente",
    nombre: "Cliente",
    apellido: "Demo",
    correo: "cliente@duocuc.cl",
    fechaNacimiento: "2000-09-10",
    contrasena: "Cliente123",
    genero: "NoDice",
    region: "Metropolitana",
    direccion: "Calle Falsa 123",
    rol: "cliente",
  },
];
