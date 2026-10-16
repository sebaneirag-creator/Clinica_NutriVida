import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usuariosIniciales } from "../data/usuariosIniciales";
import type { DatosPersonales, Rol, Usuario, UsuarioPublico } from "../types/Usuario";
import { permisos, SIN_PERMISO } from "../utils/roles";
import { borrar, cargar, guardar } from "../utils/storage";

const CLAVE_USUARIOS = "nutrivida_usuarios";
const CLAVE_SESION = "usuarioLogueado";
const CLAVE_INTENTOS = "nutrivida_intentos";
const MAX_INTENTOS = 3;

// Los administradores no se bloquean de forma permanente: si lo hicieran y fuera el único,
// nadie podría desbloquearlo. Su bloqueo es temporal y vence solo.
const BLOQUEO_ADMIN_MS = 5 * 60 * 1000;

interface RegistroIntentos {
  intentos: number;
  bloqueado: boolean;
  /** Solo en bloqueos temporales: instante (ms) en que vence. */
  hasta?: number;
}
type Intentos = Record<string, RegistroIntentos>;

const mensajeBloqueo = (r: RegistroIntentos): string =>
  r.hasta
    ? `Cuenta bloqueada temporalmente por intentos fallidos. Inténtalo de nuevo en ${Math.max(1, Math.ceil((r.hasta - Date.now()) / 60000))} minuto(s).`
    : "Cuenta bloqueada por múltiples intentos fallidos. Contacte al administrador.";

export interface DatosNuevoUsuario extends DatosPersonales {
  contrasena: string;
  rol: Rol;
}

export interface CambiosUsuario extends DatosPersonales {
  rol: Rol;
  /** Si viene vacía, se conserva la contraseña actual. */
  contrasena?: string;
}

interface AuthContextType {
  usuario: UsuarioPublico | null;
  rol: Rol | undefined;
  /** Lista completa de usuarios: solo se entrega al administrador. */
  usuarios: UsuarioPublico[];
  login: (correo: string, contrasena: string) => string | null;
  logout: () => void;
  /** Registro público: siempre crea cuentas de cliente. */
  registrar: (datos: DatosPersonales & { contrasena: string }) => string | null;
  crearUsuario: (datos: DatosNuevoUsuario) => string | null;
  actualizarUsuario: (id: string, cambios: CambiosUsuario) => string | null;
  eliminarUsuario: (id: string) => string | null;
  /** Edición del perfil propio: no permite cambiar el rol. */
  actualizarPerfil: (datos: DatosPersonales) => string | null;
  estaBloqueado: (correo: string) => boolean;
  desbloquear: (correo: string) => string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

const norm = (correo: string) => correo.trim().toLowerCase();

const sinContrasena = (u: Usuario): UsuarioPublico => {
  const { contrasena: _omitida, ...publico } = u;
  return publico;
};

function inicializarUsuarios(): Usuario[] {
  const guardados = cargar<Partial<Usuario>[]>(CLAVE_USUARIOS, []);
  if (guardados.length === 0) return usuariosIniciales;
  // Cuentas creadas en la evaluación 1 no tenían rol: pasan a ser clientes
  const usuarios = guardados.map((u) => ({ ...u, rol: u.rol ?? "cliente" }) as Usuario);
  if (!usuarios.some((u) => u.rol === "administrador")) {
    const admin = usuariosIniciales[0];
    if (!usuarios.some((u) => norm(u.correo) === norm(admin.correo))) usuarios.push(admin);
  }
  return usuarios;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>(inicializarUsuarios);
  const [intentos, setIntentos] = useState<Intentos>(() => cargar<Intentos>(CLAVE_INTENTOS, {}));
  const [sesionId, setSesionId] = useState<string | null>(
    () => cargar<{ id?: string } | null>(CLAVE_SESION, null)?.id ?? null,
  );

  useEffect(() => guardar(CLAVE_USUARIOS, usuarios), [usuarios]);
  useEffect(() => guardar(CLAVE_INTENTOS, intentos), [intentos]);

  // La sesión se resuelve contra la lista: si el usuario se elimina o edita, se refleja al instante
  const actual = usuarios.find((u) => u.id === sesionId) ?? null;
  const usuario = actual ? sinContrasena(actual) : null;
  const rol = usuario?.rol;

  const correoEnUso = (correo: string, exceptoId?: string) =>
    usuarios.some((u) => u.id !== exceptoId && norm(u.correo) === norm(correo));

  const login = (correo: string, contrasena: string): string | null => {
    const clave = norm(correo);
    const encontrado = usuarios.find((u) => norm(u.correo) === clave);

    // Un correo inexistente no entra al control de intentos: solo se cuentan (y bloquean)
    // los fallos sobre cuentas reales, así no se pueden "bloquear" correos ajenos o inventados.
    if (!encontrado) return "Correo o contraseña incorrectos";

    const registro = intentos[clave];
    const expirado = Boolean(registro?.hasta && registro.hasta <= Date.now());
    if (registro?.bloqueado && !expirado) return mensajeBloqueo(registro);

    if (encontrado.contrasena !== contrasena) {
      const previos = expirado ? 0 : (registro?.intentos ?? 0);
      const bloqueado = previos + 1 >= MAX_INTENTOS;
      const nuevo: RegistroIntentos = {
        intentos: previos + 1,
        bloqueado,
        hasta: bloqueado && encontrado.rol === "administrador" ? Date.now() + BLOQUEO_ADMIN_MS : undefined,
      };
      setIntentos((prev) => ({ ...prev, [clave]: nuevo }));
      if (bloqueado) return mensajeBloqueo(nuevo);
      return `Correo o contraseña incorrectos. Intentos restantes: ${MAX_INTENTOS - nuevo.intentos}`;
    }

    setIntentos((prev) => {
      const copia = { ...prev };
      delete copia[clave];
      return copia;
    });
    guardar(CLAVE_SESION, { id: encontrado.id });
    setSesionId(encontrado.id);
    return null;
  };

  const logout = () => {
    borrar(CLAVE_SESION);
    setSesionId(null);
  };

  const crearInterno = (datos: DatosNuevoUsuario): string | null => {
    if (correoEnUso(datos.correo)) return "El correo ya se encuentra registrado";
    const nuevo: Usuario = {
      ...datos,
      id: crypto.randomUUID(),
      nombre: datos.nombre.trim(),
      apellido: datos.apellido.trim(),
      correo: norm(datos.correo),
      direccion: datos.direccion.trim(),
    };
    setUsuarios((prev) => [...prev, nuevo]);
    return null;
  };

  const registrar: AuthContextType["registrar"] = (datos) =>
    crearInterno({ ...datos, rol: "cliente" });

  const crearUsuario: AuthContextType["crearUsuario"] = (datos) => {
    if (!permisos.rolesAsignables(rol).includes(datos.rol)) return SIN_PERMISO;
    return crearInterno(datos);
  };

  const cantidadAdmins = usuarios.filter((u) => u.rol === "administrador").length;

  const actualizarUsuario: AuthContextType["actualizarUsuario"] = (id, cambios) => {
    if (!permisos.gestionarUsuarios(rol)) return SIN_PERMISO;
    const objetivo = usuarios.find((u) => u.id === id);
    if (!objetivo) return "El usuario ya no existe.";
    if (correoEnUso(cambios.correo, id)) return "El correo ya se encuentra registrado";
    if (id === usuario?.id && cambios.rol !== objetivo.rol) {
      return "No puedes cambiar tu propio rol.";
    }
    if (objetivo.rol === "administrador" && cambios.rol !== "administrador" && cantidadAdmins <= 1) {
      return "Debe existir al menos un administrador.";
    }
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              ...cambios,
              nombre: cambios.nombre.trim(),
              apellido: cambios.apellido.trim(),
              correo: norm(cambios.correo),
              direccion: cambios.direccion.trim(),
              contrasena: cambios.contrasena ? cambios.contrasena : u.contrasena,
            }
          : u,
      ),
    );
    return null;
  };

  const eliminarUsuario: AuthContextType["eliminarUsuario"] = (id) => {
    if (!permisos.gestionarUsuarios(rol)) return SIN_PERMISO;
    const objetivo = usuarios.find((u) => u.id === id);
    if (!objetivo) return "El usuario ya no existe.";
    if (id === usuario?.id) return "No puedes eliminar tu propia cuenta.";
    if (objetivo.rol === "administrador" && cantidadAdmins <= 1) {
      return "Debe existir al menos un administrador.";
    }
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
    return null;
  };

  const actualizarPerfil: AuthContextType["actualizarPerfil"] = (datos) => {
    if (!actual) return SIN_PERMISO;
    if (correoEnUso(datos.correo, actual.id)) return "El correo ya se encuentra registrado";
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === actual.id
          ? {
              ...u, // el rol y la contraseña no se tocan desde el perfil
              nombre: datos.nombre.trim(),
              apellido: datos.apellido.trim(),
              correo: norm(datos.correo),
              fechaNacimiento: datos.fechaNacimiento,
              genero: datos.genero,
              region: datos.region,
              direccion: datos.direccion.trim(),
            }
          : u,
      ),
    );
    return null;
  };

  const estaBloqueado = (correo: string) => {
    const r = intentos[norm(correo)];
    return Boolean(r?.bloqueado && (!r.hasta || r.hasta > Date.now()));
  };

  const desbloquear = (correo: string): string | null => {
    if (!permisos.gestionarUsuarios(rol)) return SIN_PERMISO;
    setIntentos((prev) => {
      const copia = { ...prev };
      delete copia[norm(correo)];
      return copia;
    });
    return null;
  };

  return (
    <AuthContext
      value={{
        usuario,
        rol,
        usuarios: permisos.gestionarUsuarios(rol) ? usuarios.map(sinContrasena) : [],
        login,
        logout,
        registrar,
        crearUsuario,
        actualizarUsuario,
        eliminarUsuario,
        actualizarPerfil,
        estaBloqueado,
        desbloquear,
      }}
    >
      {children}
    </AuthContext>
  );
};

export const useAuth = () => {
  const contexto = useContext(AuthContext);
  if (contexto === null) throw new Error("useAuth requiere AuthProvider");
  return contexto;
};
