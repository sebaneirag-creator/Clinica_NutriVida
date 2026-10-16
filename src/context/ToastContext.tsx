import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type TipoToast = "success" | "danger" | "warning";

interface ToastContextType {
  mostrar: (mensaje: string, tipo?: TipoToast) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{ mensaje: string; tipo: TipoToast } | null>(
    null,
  );

  useEffect(() => {
    if (!toast) return;
    const temporizador = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(temporizador);
  }, [toast]);

  const mostrar = (mensaje: string, tipo: TipoToast = "success") =>
    setToast({ mensaje, tipo });

  return (
    <ToastContext value={{ mostrar }}>
      {children}
      <div className="position-fixed bottom-0 end-0 p-3 toast-container">
        {toast && (
          <div
            className={`toast show align-items-center text-bg-${toast.tipo} border-0 shadow-lg`}
            role="alert"
          >
            <div className="d-flex">
              <div className="toast-body">{toast.mensaje}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                aria-label="Cerrar"
                onClick={() => setToast(null)}
              />
            </div>
          </div>
        )}
      </div>
    </ToastContext>
  );
};

export const useToast = () => {
  const contexto = useContext(ToastContext);
  if (contexto === null) throw new Error("useToast requiere ToastProvider");
  return contexto;
};
