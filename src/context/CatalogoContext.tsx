import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { servicios as serviciosIniciales } from "../data/servicios";
import type { Servicio } from "../types/Servicio";
import { permisos, SIN_PERMISO } from "../utils/roles";
import { cargar, guardar } from "../utils/storage";
import { validarServicio, validarStock } from "../utils/validaciones";
import { useAuth } from "./AuthContext";

const CLAVE_SERVICIOS = "nutrivida_servicios";
// Categorías creadas por el administrador que todavía no tienen ningún servicio
const CLAVE_CATEGORIAS_VACIAS = "nutrivida_categorias_vacias";
// Clave de la versión anterior (categorías con id): solo se lee para migrar
const CLAVE_CATEGORIAS_ANTIGUAS = "nutrivida_categorias";

const NOMBRES_ANTIGUOS: Record<string, string> = {
  consulta: "Consulta",
  plan: "Plan especializado",
  evaluacion: "Evaluación",
  taller: "Taller grupal",
};

interface CategoriaAntigua {
  id: string;
  nombre: string;
}

type ServicioGuardado = Partial<Servicio> & { categoriaId?: string };

function cargarServicios(): Servicio[] {
  const guardados = cargar<ServicioGuardado[] | null>(CLAVE_SERVICIOS, null);
  if (guardados === null) return serviciosIniciales;
  const antiguas = cargar<CategoriaAntigua[]>(CLAVE_CATEGORIAS_ANTIGUAS, []);
  // Migración: antes cada servicio guardaba un id de categoría; ahora guarda el nombre
  return guardados.map((s) => {
    const { categoriaId, ...resto } = s;
    const categoria =
      s.categoria ??
      antiguas.find((c) => c.id === categoriaId)?.nombre ??
      NOMBRES_ANTIGUOS[categoriaId ?? ""] ??
      "Sin categoría";
    return { ...resto, categoria } as Servicio;
  });
}

function cargarCategoriasVacias(servicios: Servicio[]): string[] {
  const guardadas = cargar<string[] | null>(CLAVE_CATEGORIAS_VACIAS, null);
  if (guardadas !== null) return guardadas;
  const antiguas = cargar<CategoriaAntigua[]>(CLAVE_CATEGORIAS_ANTIGUAS, []);
  return antiguas.map((c) => c.nombre).filter((n) => !servicios.some((s) => s.categoria === n));
}

interface CatalogoContextType {
  servicios: Servicio[];
  /** Categorías existentes: las de los servicios guardados más las creadas sin servicios. */
  categorias: string[];
  crearServicio: (s: Servicio) => string | null;
  actualizarServicio: (s: Servicio) => string | null;
  eliminarServicio: (codigo: string) => string | null;
  actualizarStock: (codigo: string, stock: number) => string | null;
  crearCategoria: (nombre: string) => string | null;
  /** Renombra la categoría en todos los servicios que la usan. */
  renombrarCategoria: (actual: string, nuevo: string) => string | null;
  eliminarCategoria: (nombre: string) => string | null;
  /** Descuenta el stock de una compra de forma atómica (todo o nada). */
  descontarStock: (lineas: { codigo: string; cantidad: number }[]) => string | null;
}

const CatalogoContext = createContext<CatalogoContextType | null>(null);

export const CatalogoProvider = ({ children }: { children: ReactNode }) => {
  const { rol } = useAuth();
  const [servicios, setServicios] = useState<Servicio[]>(cargarServicios);
  const [categoriasVacias, setCategoriasVacias] = useState<string[]>(() =>
    cargarCategoriasVacias(cargarServicios()),
  );

  useEffect(() => guardar(CLAVE_SERVICIOS, servicios), [servicios]);
  useEffect(() => guardar(CLAVE_CATEGORIAS_VACIAS, categoriasVacias), [categoriasVacias]);

  // Las categorías se obtienen de los propios servicios: no hay una lista fija en el código
  const categorias = Array.from(new Set([...servicios.map((s) => s.categoria), ...categoriasVacias]));

  // Si ya existe una categoría con el mismo nombre (sin importar mayúsculas), se reutiliza su escritura
  const canonica = (nombre: string): string => {
    const limpio = nombre.trim();
    return categorias.find((c) => c.toLowerCase() === limpio.toLowerCase()) ?? limpio;
  };

  const limpiar = (s: Servicio): Servicio => ({
    ...s,
    codigo: s.codigo.trim().toUpperCase(),
    categoria: canonica(s.categoria),
    nombre: s.nombre.trim(),
    modalidad: s.modalidad.trim(),
    duracion: s.duracion.trim(),
    descripcion: s.descripcion.trim(),
  });

  const crearServicio: CatalogoContextType["crearServicio"] = (datos) => {
    if (!permisos.gestionarProductos(rol)) return SIN_PERMISO;
    const nuevo = limpiar(datos);
    const error = validarServicio(nuevo);
    if (error) return error;
    if (servicios.some((s) => s.codigo === nuevo.codigo)) {
      return `Ya existe un servicio con el código ${nuevo.codigo}.`;
    }
    setServicios((prev) => [...prev, nuevo]);
    return null;
  };

  const actualizarServicio: CatalogoContextType["actualizarServicio"] = (datos) => {
    if (!permisos.gestionarProductos(rol)) return SIN_PERMISO;
    const editado = limpiar(datos);
    const error = validarServicio(editado);
    if (error) return error;
    if (!servicios.some((s) => s.codigo === editado.codigo)) return "El servicio ya no existe.";
    setServicios((prev) => prev.map((s) => (s.codigo === editado.codigo ? editado : s)));
    return null;
  };

  const eliminarServicio: CatalogoContextType["eliminarServicio"] = (codigo) => {
    if (!permisos.gestionarProductos(rol)) return SIN_PERMISO;
    setServicios((prev) => prev.filter((s) => s.codigo !== codigo));
    return null;
  };

  // El vendedor solo puede tocar el stock, nunca el resto del servicio
  const actualizarStock: CatalogoContextType["actualizarStock"] = (codigo, stock) => {
    if (!permisos.editarStock(rol)) return SIN_PERMISO;
    const error = validarStock(stock);
    if (error) return error;
    if (!servicios.some((s) => s.codigo === codigo)) return "El servicio ya no existe.";
    setServicios((prev) => prev.map((s) => (s.codigo === codigo ? { ...s, stock } : s)));
    return null;
  };

  const validarNombreCategoria = (nombre: string, actual?: string): string | null => {
    const limpio = nombre.trim();
    if (limpio.length < 3) return "El nombre de la categoría debe tener al menos 3 caracteres";
    if (categorias.some((c) => c !== actual && c.toLowerCase() === limpio.toLowerCase())) {
      return "Ya existe una categoría con ese nombre";
    }
    return null;
  };

  const crearCategoria: CatalogoContextType["crearCategoria"] = (nombre) => {
    if (!permisos.gestionarCategorias(rol)) return SIN_PERMISO;
    const error = validarNombreCategoria(nombre);
    if (error) return error;
    setCategoriasVacias((prev) => [...prev, nombre.trim()]);
    return null;
  };

  const renombrarCategoria: CatalogoContextType["renombrarCategoria"] = (actual, nuevo) => {
    if (!permisos.gestionarCategorias(rol)) return SIN_PERMISO;
    const error = validarNombreCategoria(nuevo, actual);
    if (error) return error;
    const nombre = nuevo.trim();
    setServicios((prev) => prev.map((s) => (s.categoria === actual ? { ...s, categoria: nombre } : s)));
    setCategoriasVacias((prev) => prev.map((c) => (c === actual ? nombre : c)));
    return null;
  };

  const eliminarCategoria: CatalogoContextType["eliminarCategoria"] = (nombre) => {
    if (!permisos.gestionarCategorias(rol)) return SIN_PERMISO;
    const asociados = servicios.filter((s) => s.categoria === nombre).length;
    if (asociados > 0) {
      return `No se puede eliminar: tiene ${asociados} servicio(s) asociado(s). Reasígnalos o elimínalos primero.`;
    }
    setCategoriasVacias((prev) => prev.filter((c) => c !== nombre));
    return null;
  };

  const descontarStock: CatalogoContextType["descontarStock"] = (lineas) => {
    for (const l of lineas) {
      const s = servicios.find((x) => x.codigo === l.codigo);
      if (!s) return `El servicio ${l.codigo} ya no existe.`;
      if (s.stock < l.cantidad) {
        return `"${s.nombre}" no tiene cupos suficientes (quedan ${s.stock}).`;
      }
    }
    setServicios((prev) =>
      prev.map((s) => {
        const linea = lineas.find((l) => l.codigo === s.codigo);
        return linea ? { ...s, stock: s.stock - linea.cantidad } : s;
      }),
    );
    return null;
  };

  return (
    <CatalogoContext
      value={{
        servicios,
        categorias,
        crearServicio,
        actualizarServicio,
        eliminarServicio,
        actualizarStock,
        crearCategoria,
        renombrarCategoria,
        eliminarCategoria,
        descontarStock,
      }}
    >
      {children}
    </CatalogoContext>
  );
};

export const useCatalogo = () => {
  const contexto = useContext(CatalogoContext);
  if (contexto === null) throw new Error("useCatalogo requiere CatalogoProvider");
  return contexto;
};
