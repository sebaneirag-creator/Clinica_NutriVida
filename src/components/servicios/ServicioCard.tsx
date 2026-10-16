import { Link } from "react-router";
import { useCarrito } from "../../context/CarritoContext";
import { useToast } from "../../context/ToastContext";
import type { Servicio } from "../../types/Servicio";
import { formatPrecio } from "../../utils/formato";
import { BadgeCategoria } from "../ui/BadgeCategoria";

export const ServicioCard = ({ servicio }: { servicio: Servicio }) => {
  const { disponibles, agregar } = useCarrito();
  const { mostrar } = useToast();

  const cupos = disponibles(servicio.codigo);
  const hayCupos = cupos > 0;

  const reservar = () => {
    if (agregar(servicio)) {
      mostrar(`"${servicio.nombre}" agregado a tu reserva`, "success");
    } else {
      mostrar(`"${servicio.nombre}" no tiene cupos disponibles`, "danger");
    }
  };

  return (
    <div className="col-md-6 col-lg-4">
      <div className="card card-catalogo h-100">
        <div className="card-body d-flex flex-column p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <BadgeCategoria categoria={servicio.categoria} className="px-3 py-1" />
            <span
              className={`badge ${
                hayCupos
                  ? "bg-success-subtle text-success border border-success-subtle"
                  : "bg-danger-subtle text-danger border border-danger-subtle"
              } rounded-pill px-2 py-1`}
            >
              <i className={`bi ${hayCupos ? "bi-check-circle" : "bi-x-circle"} me-1`}></i>
              {hayCupos ? `${cupos} cupos` : "Agotado"}
            </span>
          </div>

          <h5 className="card-title fw-bold text-dark mb-2">{servicio.nombre}</h5>

          <div className="d-flex flex-wrap gap-2 mb-3">
            {servicio.duracion && servicio.duracion !== "—" && (
              <span className="badge bg-light text-secondary border fw-normal">
                <i className="bi bi-clock me-1 text-primary"></i>
                {servicio.duracion}
              </span>
            )}
            <span className="badge bg-light text-secondary border fw-normal">
              <i className="bi bi-geo-alt me-1 text-success"></i>
              {servicio.modalidad}
            </span>
          </div>

          <p className="card-text text-secondary small flex-grow-1 mb-4">{servicio.descripcion}</p>

          <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
            <div>
              <span className="d-block text-muted small" style={{ fontSize: "0.75rem" }}>Valor</span>
              <span className="fs-5 fw-bold text-dark">{formatPrecio(servicio.precio)}</span>
            </div>
            <div className="d-flex gap-2">
              <Link
                to={`/servicios/${servicio.codigo}`}
                className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                title={`Ver detalles de ${servicio.nombre}`}
              >
                Detalle
              </Link>
              {hayCupos ? (
                <button
                  className="btn btn-sm btn-success rounded-pill px-3 d-flex align-items-center gap-1"
                  onClick={reservar}
                  title="Agregar a reserva"
                >
                  <i className="bi bi-cart-plus"></i> Reservar
                </button>
              ) : (
                <button className="btn btn-sm btn-secondary rounded-pill px-3 disabled" disabled title="Sin cupos disponibles">
                  <i className="bi bi-x-circle"></i> Agotado
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
