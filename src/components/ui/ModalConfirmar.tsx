import { Modal } from "./Modal";

interface Props {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  onConfirmar: () => void;
  onCerrar: () => void;
}

export const ModalConfirmar = ({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = "Eliminar",
  onConfirmar,
  onCerrar,
}: Props) => (
  <Modal abierto={abierto} onCerrar={onCerrar}>
    <div className="modal-header border-0 pb-0">
      <h5 className="modal-title fw-bold text-dark">
        <i className="bi bi-exclamation-triangle text-danger me-2"></i>
        {titulo}
      </h5>
      <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar}></button>
    </div>
    <div className="modal-body text-muted">{mensaje}</div>
    <div className="modal-footer border-0 pt-0">
      <button type="button" className="btn btn-light rounded-pill px-4" onClick={onCerrar}>
        Cancelar
      </button>
      <button type="button" className="btn btn-danger rounded-pill px-4" onClick={onConfirmar}>
        {textoConfirmar}
      </button>
    </div>
  </Modal>
);
