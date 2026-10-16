import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { LineaCarrito, Servicio } from "../types/Servicio";
import { cargar, guardar } from "../utils/storage";
import { useCatalogo } from "./CatalogoContext";

const CLAVE_CARRITO = "nutrivida_carrito";

interface ItemGuardado {
  codigo: string;
  cantidad: number;
}

interface CarritoContextType {
  lineas: LineaCarrito[];
  totalUnidades: number;
  total: number;
  /** Cupos que aún se pueden agregar (stock menos lo que ya hay en el carrito). */
  disponibles: (codigo: string) => number;
  agregar: (servicio: Servicio) => boolean;
  reducir: (codigo: string) => void;
  eliminar: (codigo: string) => void;
  vaciar: () => void;
  /** Descuenta el stock y vacía el carrito. Devuelve un error si algo cambió. */
  confirmar: () => string | null;
}

const CarritoContext = createContext<CarritoContextType | null>(null);

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const { servicios, descontarStock } = useCatalogo();
  const [items, setItems] = useState<ItemGuardado[]>(() =>
    cargar<ItemGuardado[]>(CLAVE_CARRITO, []).map((i) => ({ codigo: i.codigo, cantidad: i.cantidad })),
  );

  useEffect(() => guardar(CLAVE_CARRITO, items), [items]);

  // Coherencia: si un servicio se elimina o baja su stock, el carrito se ajusta
  useEffect(() => {
    setItems((prev) => {
      const ajustados = prev.flatMap((i) => {
        const s = servicios.find((x) => x.codigo === i.codigo);
        if (!s || s.stock <= 0) return [];
        return [{ codigo: i.codigo, cantidad: Math.min(i.cantidad, s.stock) }];
      });
      return JSON.stringify(ajustados) === JSON.stringify(prev) ? prev : ajustados;
    });
  }, [servicios]);

  const lineas: LineaCarrito[] = items.flatMap((i) => {
    const servicio = servicios.find((s) => s.codigo === i.codigo);
    return servicio ? [{ servicio, cantidad: i.cantidad }] : [];
  });

  const disponibles = (codigo: string): number => {
    const servicio = servicios.find((s) => s.codigo === codigo);
    if (!servicio) return 0;
    const enCarrito = items.find((i) => i.codigo === codigo)?.cantidad ?? 0;
    return servicio.stock - enCarrito;
  };

  const agregar = (servicio: Servicio): boolean => {
    if (disponibles(servicio.codigo) <= 0) return false;
    setItems((prev) =>
      prev.some((i) => i.codigo === servicio.codigo)
        ? prev.map((i) => (i.codigo === servicio.codigo ? { ...i, cantidad: i.cantidad + 1 } : i))
        : [...prev, { codigo: servicio.codigo, cantidad: 1 }],
    );
    return true;
  };

  const reducir = (codigo: string) => {
    setItems((prev) =>
      prev
        .map((i) => (i.codigo === codigo ? { ...i, cantidad: i.cantidad - 1 } : i))
        .filter((i) => i.cantidad > 0),
    );
  };

  const eliminar = (codigo: string) => setItems((prev) => prev.filter((i) => i.codigo !== codigo));
  const vaciar = () => setItems([]);

  const confirmar = (): string | null => {
    const error = descontarStock(items);
    if (error) return error;
    setItems([]);
    return null;
  };

  const totalUnidades = lineas.reduce((suma, l) => suma + l.cantidad, 0);
  const total = lineas.reduce((suma, l) => suma + l.servicio.precio * l.cantidad, 0);

  return (
    <CarritoContext
      value={{ lineas, totalUnidades, total, disponibles, agregar, reducir, eliminar, vaciar, confirmar }}
    >
      {children}
    </CarritoContext>
  );
};

export const useCarrito = () => {
  const contexto = useContext(CarritoContext);
  if (contexto === null) throw new Error("useCarrito requiere CarritoProvider");
  return contexto;
};
