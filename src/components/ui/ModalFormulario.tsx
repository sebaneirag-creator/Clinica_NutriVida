import type { ReactNode } from "react";
import { Modal } from "./Modal";

interface Props {
  abierto: boolean;
  titulo: string;
  icono?: string;
  onCerrar: () => void;
  children: ReactNode;
}

// Modal con título para alojar formularios de creación y edición
export const ModalFormulario = ({ abierto, titulo, icono, onCerrar, children }: Props) => (
  <Modal abierto={abierto} onCerrar={onCerrar} grande>
    <div className="modal-header border-0 pb-0">
      <h5 className="modal-title fw-bold text-dark">
        {icono && <i className={`bi ${icono} text-success me-2`}></i>}
        {titulo}
      </h5>
      <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar}></button>
    </div>
    <div className="modal-body">{children}</div>
  </Modal>
);
