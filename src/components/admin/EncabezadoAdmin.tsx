import type { ReactNode } from "react";
import { Link } from "react-router";

interface Props {
  titulo: string;
  subtitulo: string;
  /** En el panel principal la miga termina en "Administración". */
  enPanel?: boolean;
  children?: ReactNode;
}

export const EncabezadoAdmin = ({ titulo, subtitulo, enPanel = false, children }: Props) => (
  <>
    <nav aria-label="breadcrumb" className="mb-2">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/" className="text-decoration-none text-muted"><i className="bi bi-house-door me-1"></i>Inicio</Link>
        </li>
        {enPanel ? (
          <li className="breadcrumb-item active text-success fw-semibold" aria-current="page">Administración</li>
        ) : (
          <>
            <li className="breadcrumb-item">
              <Link to="/admin" className="text-decoration-none text-muted">Administración</Link>
            </li>
            <li className="breadcrumb-item active text-success fw-semibold" aria-current="page">{titulo}</li>
          </>
        )}
      </ol>
    </nav>
    <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
      <div>
        <h1 className="section-title text-start mb-1">{titulo}</h1>
        <p className="text-muted mb-0">{subtitulo}</p>
      </div>
      {children}
    </div>
  </>
);
