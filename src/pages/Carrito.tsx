import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Modal } from "../components/ui/Modal";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import { useToast } from "../context/ToastContext";
import { BadgeCategoria } from "../components/ui/BadgeCategoria";
import { formatPrecio, getTipoIcon } from "../utils/formato";

interface ControlCantidadProps {
  codigo: string;
  cantidad: number;
}

const ControlCantidad = ({ codigo, cantidad }: ControlCantidadProps) => {
  const { reducir, agregar, disponibles } = useCarrito();
  const { mostrar } = useToast();
  const { lineas } = useCarrito();

  const hayCupos = disponibles(codigo) > 0;

  const aumentar = () => {
    const item = lineas.find((l) => l.servicio.codigo === codigo)?.servicio;
    if (!item) return;
    if (!agregar(item)) mostrar("No hay más cupos disponibles", "warning");
  };

  return (
    <div className="d-inline-flex align-items-center bg-light border rounded-pill px-2 py-1">
      <button
        className="btn btn-sm btn-link text-dark p-0 px-2 text-decoration-none"
        onClick={() => reducir(codigo)}
        title="Disminuir cantidad"
        style={{ fontSize: "1rem", lineHeight: 1 }}
      >
        <i className="bi bi-dash-lg"></i>
      </button>
      <span className="fw-bold px-2 text-dark" style={{ minWidth: 24, textAlign: "center" }}>
        {cantidad}
      </span>
      <button
        className={`btn btn-sm btn-link ${hayCupos ? "text-success" : "text-muted"} p-0 px-2 text-decoration-none`}
        onClick={aumentar}
        disabled={!hayCupos}
        title={hayCupos ? "Aumentar cantidad" : "Sin cupos disponibles"}
        style={{ fontSize: "1rem", lineHeight: 1 }}
      >
        <i className="bi bi-plus-lg"></i>
      </button>
    </div>
  );
};

const AvisoUltimosCupos = ({ codigo, className }: { codigo: string; className: string }) => {
  const { disponibles } = useCarrito();
  const cupos = disponibles(codigo);
  if (cupos <= 0 || cupos > 2) return null;
  return (
    <div className={`text-warning small ${className}`} style={{ fontSize: "0.72rem" }}>
      ¡Últimos {cupos} cupos!
    </div>
  );
};

const Carrito = () => {
  const { lineas, total, totalUnidades, eliminar, vaciar, confirmar } = useCarrito();
  const { mostrar } = useToast();
  // Se aplana cada línea para reutilizar el mismo marcado de la tabla y las tarjetas
  const items = lineas.map((l) => ({ ...l.servicio, cantidad: l.cantidad }));
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [modalVaciar, setModalVaciar] = useState(false);
  const [modalLogin, setModalLogin] = useState(false);
  const [modalExito, setModalExito] = useState(false);

  const confirmarReserva = () => {
    if (!usuario) {
      setModalLogin(true);
      return;
    }
    const error = confirmar();
    if (error) {
      mostrar(error, "danger");
      return;
    }
    setModalExito(true);
  };

  const confirmarVaciar = () => {
    vaciar();
    setModalVaciar(false);
  };

  return (
    <main className="pt-5">
      <section className="py-5 mt-2">
        <div className="container">
          <nav aria-label="breadcrumb" className="mb-2">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none text-muted">
                  <i className="bi bi-house-door me-1"></i>Inicio
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/servicios" className="text-decoration-none text-muted">Servicios</Link>
              </li>
              <li className="breadcrumb-item active text-success fw-semibold" aria-current="page">Mi reserva</li>
            </ol>
          </nav>
          <div className="mb-4">
            <h1 className="section-title text-start mb-1">Mi Reserva</h1>
            <p className="text-muted mb-0">
              Revisa y confirma los servicios seleccionados para tu atención nutricional
            </p>
          </div>

          {items.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-3">
              <div className="mb-3">
                <div className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                  <i className="bi bi-cart3 fs-1"></i>
                </div>
              </div>
              <h3 className="fw-bold text-dark mb-2">Tu carrito de reserva está vacío</h3>
              <p className="text-muted mx-auto mb-4" style={{ maxWidth: 480 }}>
                Aún no has agregado ningún servicio o consulta. Explora nuestras opciones y agenda
                tu atención nutricional hoy mismo.
              </p>
              <div>
                <Link to="/servicios" className="btn btn-success rounded-pill px-4 py-2 fw-semibold">
                  <i className="bi bi-grid me-2"></i>Explorar catálogo de servicios
                </Link>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden mb-3">
                  <div className="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-dark">
                      <i className="bi bi-calendar2-check text-success me-2"></i>
                      Servicios seleccionados ({items.length})
                    </span>
                    <button
                      className="btn btn-sm text-danger text-decoration-none fw-semibold p-0"
                      onClick={() => setModalVaciar(true)}
                      title="Vaciar todo el carrito"
                    >
                      <i className="bi bi-trash3 me-1"></i>Vaciar carrito
                    </button>
                  </div>

                  {/* TABLA DESKTOP */}
                  <div className="card-body p-0 carrito-desktop-table d-none d-md-block">
                    <div className="table-responsive">
                      <table className="table align-middle mb-0">
                        <thead className="table-light text-muted small text-uppercase">
                          <tr>
                            <th className="ps-4 py-3" style={{ minWidth: 250 }}>Servicio</th>
                            <th className="py-3 text-center" style={{ minWidth: 140 }}>Cantidad</th>
                            <th className="py-3 text-end" style={{ minWidth: 120 }}>Subtotal</th>
                            <th className="pe-4 py-3 text-end" style={{ width: 50 }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((s) => (
                            <tr className="border-bottom" key={s.codigo}>
                              <td className="ps-4 py-3">
                                <div className="d-flex align-items-center gap-3">
                                  <div className="bg-light rounded-3 text-success d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, flexShrink: 0 }}>
                                    <i className={`bi ${getTipoIcon(s.categoria)} fs-5`}></i>
                                  </div>
                                  <div>
                                    <Link to={`/servicios/${s.codigo}`} className="text-decoration-none text-dark fw-bold d-block mb-1">
                                      {s.nombre}
                                    </Link>
                                    <div className="d-flex flex-wrap gap-2 align-items-center">
                                      <BadgeCategoria categoria={s.categoria} />
                                      <span className="text-muted small"><i className="bi bi-clock me-1"></i>{s.duracion}</span>
                                      <span className="text-muted small">•</span>
                                      <span className="text-muted small">{formatPrecio(s.precio)} c/u</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 text-center">
                                <ControlCantidad codigo={s.codigo} cantidad={s.cantidad} />
                                <AvisoUltimosCupos codigo={s.codigo} className="mt-1" />
                              </td>
                              <td className="py-3 text-end">
                                <span className="fw-bold text-dark fs-6">{formatPrecio(s.precio * s.cantidad)}</span>
                              </td>
                              <td className="pe-4 py-3 text-end">
                                <button
                                  className="btn btn-sm btn-outline-danger border-0 rounded-circle d-inline-flex align-items-center justify-content-center"
                                  style={{ width: 32, height: 32 }}
                                  onClick={() => eliminar(s.codigo)}
                                  title="Eliminar servicio"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* CARDS MOBILE */}
                  <div className="card-body p-3 carrito-mobile-card d-md-none">
                    {items.map((s) => (
                      <div className="border rounded-3 p-3 mb-3" key={s.codigo}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="flex-grow-1">
                            <Link to={`/servicios/${s.codigo}`} className="text-decoration-none text-dark fw-bold d-block mb-1">
                              {s.nombre}
                            </Link>
                            <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
                              <BadgeCategoria categoria={s.categoria} />
                              <span className="text-muted small"><i className="bi bi-clock me-1"></i>{s.duracion}</span>
                            </div>
                          </div>
                          <button
                            className="btn btn-sm btn-outline-danger border-0 rounded-circle flex-shrink-0 ms-2"
                            style={{ width: 32, height: 32 }}
                            onClick={() => eliminar(s.codigo)}
                            title="Eliminar"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <ControlCantidad codigo={s.codigo} cantidad={s.cantidad} />
                          <span className="fw-bold text-success">{formatPrecio(s.precio * s.cantidad)}</span>
                        </div>
                        <AvisoUltimosCupos codigo={s.codigo} className="mt-2" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <Link to="/servicios" className="btn btn-outline-secondary rounded-pill px-4">
                    <i className="bi bi-arrow-left me-2"></i>Agregar más servicios
                  </Link>
                  <span className="text-muted small d-none d-sm-inline">
                    <i className="bi bi-info-circle me-1"></i>Precios en pesos chilenos (CLP)
                  </span>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 bg-white p-4 carrito-sidebar position-sticky" style={{ top: 95 }}>
                  <h5 className="fw-bold text-dark mb-3">Resumen de reserva</h5>

                  <div className="d-flex justify-content-between text-muted mb-2">
                    <span>Servicios distintos</span>
                    <span className="fw-semibold text-dark">{items.length}</span>
                  </div>
                  <div className="d-flex justify-content-between text-muted mb-3">
                    <span>Total sesiones / cupos</span>
                    <span className="fw-semibold text-dark">{totalUnidades}</span>
                  </div>

                  <hr className="my-3 text-secondary opacity-25" />

                  <div className="d-flex justify-content-between align-items-baseline mb-4">
                    <div>
                      <span className="text-muted small d-block">Total estimado</span>
                      <span className="fw-bold fs-3 text-success">{formatPrecio(total)}</span>
                    </div>
                    <span className="badge bg-light text-muted border">CLP</span>
                  </div>

                  <button className="btn btn-success w-100 rounded-pill fw-medium py-2 mb-2" onClick={confirmarReserva}>
                    <i className="bi bi-calendar-check me-2"></i>Confirmar reserva(s)
                  </button>

                  <Link to="/servicios" className="btn btn-light border w-100 rounded-pill fw-medium py-2 mb-3 text-muted">
                    <i className="bi bi-plus-circle me-1"></i>Ver otros servicios
                  </Link>

                  <div className="p-3 bg-light rounded-3 text-muted small mt-2">
                    <div className="d-flex align-items-start gap-2">
                      <i className="bi bi-shield-check text-success fs-5 flex-shrink-0 mt-n1"></i>
                      <div>
                        <strong className="d-block text-dark mb-1">Reserva garantizada</strong>
                        <p className="mb-0 text-muted" style={{ fontSize: "0.8rem", lineHeight: 1.4 }}>
                          Atención personalizada con nutricionistas certificados. Confirmación
                          inmediata tras agendar.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MODAL VACIAR */}
      <Modal abierto={modalVaciar} onCerrar={() => setModalVaciar(false)}>
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title fw-bold text-dark"><i className="bi bi-trash text-danger me-2"></i>Vaciar carrito</h5>
          <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setModalVaciar(false)}></button>
        </div>
        <div className="modal-body text-muted">
          ¿Estás seguro de que deseas eliminar todos los servicios de tu carrito de reservas?
        </div>
        <div className="modal-footer border-0 pt-0">
          <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setModalVaciar(false)}>Cancelar</button>
          <button type="button" className="btn btn-danger rounded-pill px-4" onClick={confirmarVaciar}>Vaciar carrito</button>
        </div>
      </Modal>

      {/* MODAL LOGIN REQUERIDO */}
      <Modal abierto={modalLogin} onCerrar={() => setModalLogin(false)}>
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title fw-bold text-dark"><i className="bi bi-person-lock text-warning me-2"></i>Inicio de sesión requerido</h5>
          <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setModalLogin(false)}></button>
        </div>
        <div className="modal-body text-muted">
          Debes iniciar sesión con tu cuenta para poder confirmar y registrar tu reserva.
        </div>
        <div className="modal-footer border-0 pt-0">
          <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setModalLogin(false)}>Cancelar</button>
          <Link to="/login" className="btn btn-success rounded-pill px-4">Iniciar sesión</Link>
        </div>
      </Modal>

      {/* MODAL ÉXITO */}
      <Modal abierto={modalExito} onCerrar={() => setModalExito(false)}>
        <div className="text-center p-4">
          <div className="mb-3">
            <div className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center icon-circle">
              <i className="bi bi-check-circle fs-1"></i>
            </div>
          </div>
          <h4 className="fw-bold text-dark mb-2">¡Reserva(s) confirmada!</h4>
          <p className="text-muted mb-4">
            Tus servicios han sido agendados exitosamente. Te esperamos en Clínica NutriVida.
          </p>
          <button
            type="button"
            className="btn btn-success rounded-pill px-5"
            onClick={() => {
              setModalExito(false);
              navigate("/");
            }}
          >
            Entendido
          </button>
        </div>
      </Modal>
    </main>
  );
};

export default Carrito;
