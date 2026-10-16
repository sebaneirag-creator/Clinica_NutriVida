import type { ReactNode } from "react";

interface ModalProps {
  abierto: boolean;
  onCerrar: () => void;
  grande?: boolean;
  children: ReactNode;
}

// Modal controlado por estado, usando solo las clases CSS de Bootstrap
export const Modal = ({ abierto, onCerrar, grande = false, children }: ModalProps) => {
  if (!abierto) return null;
  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1} onClick={onCerrar}>
        <div
          className={`modal-dialog modal-dialog-centered${grande ? " modal-lg" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content rounded-4 border-0 shadow">{children}</div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};
