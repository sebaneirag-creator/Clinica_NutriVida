import { Link, useNavigate, useParams } from "react-router";
import { useCarrito } from "../context/CarritoContext";
import { useToast } from "../context/ToastContext";
import { BadgeCategoria } from "../components/ui/BadgeCategoria";
import { useCatalogo } from "../context/CatalogoContext";
import { formatPrecio, imagenCategoria } from "../utils/formato";

const incluyePorDefecto = [
  "Atención profesional personalizada por nutricionista certificado.",
  "Guía alimentaria y material de apoyo adaptado a tus necesidades.",
  "Seguimiento y orientación para alcanzar tus objetivos de salud.",
];

const queIncluyePorTipo: Record<string, string[]> = {
  consulta: [
    "Evaluación antropométrica y anamnesis clínica completa.",
    "Diagnóstico del estado nutricional y análisis de requerimientos.",
    "Diseño de pauta alimentaria personalizada con metas progresivas.",
    "Recomendaciones prácticas para compras, porciones y hábitos diarios.",
  ],
  "plan especializado": [
    "Primera consulta diagnóstica + diseño de plan a tu medida.",
    "Sesiones de control periódico y medición continua de indicadores.",
    "Ajustes mensuales según tus avances, rutina y evolución metabólica.",
    "Acompañamiento continuo y resolución de dudas durante todo el plan.",
  ],
  evaluación: [
    "Medición de parámetros corporales con instrumental especializado.",
    "Análisis de composición: masa grasa, masa muscular, agua y metabolismo basal.",
    "Entrega de informe claro y comprensible con tus resultados.",
    "Orientación inicial sobre los siguientes pasos recomendados para tu salud.",
  ],
  "taller grupal": [
    "Sesión interactiva guiada por nutricionista especialista.",
    "Material educativo y recetarios o pautas descargables.",
    "Espacio abierto para preguntas, dinámicas y resolución de dudas.",
    "Degustación o preparaciones según la temática del taller.",
  ],
};

const DetalleServicio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { disponibles, agregar } = useCarrito();
  const { servicios } = useCatalogo();
  const { mostrar } = useToast();

  const servicio = servicios.find((s) => s.codigo === id);

  if (!servicio) {
    return (
      <main className="pt-5">
        <section className="py-5 mt-2">
          <div className="container text-center">
            <div className="p-5 bg-white rounded-4 shadow-sm border d-inline-block" style={{ maxWidth: 500 }}>
              <i className="bi bi-search text-muted" style={{ fontSize: "3rem" }}></i>
              <h3 className="fw-bold mt-3 text-dark">Servicio no encontrado</h3>
              <p className="text-muted mb-4">
                El servicio con código "<strong>{id}</strong>" no existe en nuestro catálogo.
              </p>
              <Link to="/servicios" className="btn btn-success rounded-pill px-4">
                <i className="bi bi-arrow-left me-1"></i>Volver a servicios
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const cupos = disponibles(servicio.codigo);
  const hayCupos = cupos > 0;
  const listaIncluye = (queIncluyePorTipo[servicio.categoria.trim().toLowerCase()] ?? incluyePorDefecto);

  const reservar = () => {
    if (!agregar(servicio)) {
      mostrar("No hay cupos disponibles", "danger");
      return;
    }
    navigate("/carrito");
  };

  return (
    <main className="pt-5">
      <section className="py-5 mt-2">
        <div className="container">
          <div className="mb-4 d-flex flex-wrap align-items-center justify-content-between gap-2">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to="/" className="text-decoration-none text-muted">
                    <i className="bi bi-house-door me-1"></i>Inicio
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/servicios" className="text-decoration-none text-muted">Servicios</Link>
                </li>
                <li className="breadcrumb-item active text-success fw-semibold" aria-current="page">
                  {servicio.nombre}
                </li>
              </ol>
            </nav>
            <Link to="/servicios" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
              <i className="bi bi-arrow-left me-1"></i>Volver a servicios
            </Link>
          </div>

          <div className="row g-4 align-items-start">
            {/* COLUMNA PRINCIPAL */}
            <div className="col-lg-7 col-xl-8">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <BadgeCategoria categoria={servicio.categoria} className="px-3 py-1" />
                <span
                  className={`badge ${
                    hayCupos
                      ? "bg-success-subtle text-success border border-success-subtle"
                      : "bg-danger-subtle text-danger border border-danger-subtle"
                  } rounded-pill px-3 py-1`}
                >
                  <i className={`bi ${hayCupos ? "bi-check-circle" : "bi-x-circle"} me-1`}></i>
                  {hayCupos ? `${cupos} cupos disponibles` : "Sin cupos disponibles"}
                </span>
              </div>

              <h1 className="fw-bold text-dark mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem" }}>
                {servicio.nombre}
              </h1>
              <p className="lead text-muted mb-4 fs-6">{servicio.descripcion}</p>

              {imagenCategoria(servicio.categoria) && (
                <div className="detalle-img-frame mb-4 text-center p-3 shadow-sm">
                  <img
                    src={imagenCategoria(servicio.categoria)!}
                    alt={servicio.nombre}
                    className="img-fluid rounded-3"
                    style={{ maxHeight: 280, width: "auto", objectFit: "contain" }}
                  />
                </div>
              )}

              <div className="card card-detalle border-0 shadow-sm rounded-4 p-4 mb-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="d-inline-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle" style={{ width: 36, height: 36 }}>
                    <i className="bi bi-check2-all fs-5"></i>
                  </span>
                  <h5 className="fw-bold mb-0 text-dark">¿Qué incluye este servicio?</h5>
                </div>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                  {listaIncluye.map((item) => (
                    <li key={item} className="d-flex align-items-start gap-2 small text-secondary">
                      <i className="bi bi-check-circle-fill text-success mt-1 flex-shrink-0"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card border-0 bg-white shadow-sm rounded-4 p-3 mb-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, flexShrink: 0 }}>
                    <i className="bi bi-person-badge fs-4"></i>
                  </div>
                  <div className="small">
                    <strong className="text-dark d-block">Atención profesional certificada</strong>
                    <span className="text-muted">
                      Todos nuestros servicios son realizados por nutricionistas titulados y
                      colegiados, con sólida experiencia clínica.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SIDEBAR DE RESERVA */}
            <div className="col-lg-5 col-xl-4">
              <div className="card card-detalle border-0 shadow-sm rounded-4 p-4 position-sticky" style={{ top: 90 }}>
                <span className="text-uppercase text-muted small fw-bold mb-1 d-block">Valor del servicio</span>
                <div className="d-flex align-items-baseline mb-3">
                  <span className="fs-2 fw-bold text-dark">{formatPrecio(servicio.precio)}</span>
                  <span className="text-muted small ms-2">CLP</span>
                </div>

                <hr className="my-3 text-secondary opacity-25" />

                <h6 className="fw-bold text-dark mb-3">Detalles de la sesión</h6>
                <div className="d-flex flex-column gap-3 mb-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted small"><i className="bi bi-tag text-success me-2"></i>Código</span>
                    <strong className="text-dark small">{servicio.codigo}</strong>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted small"><i className="bi bi-clock text-success me-2"></i>Duración</span>
                    <strong className="text-dark small">
                      {servicio.duracion && servicio.duracion !== "—" ? servicio.duracion : "Personalizada"}
                    </strong>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted small"><i className="bi bi-geo-alt text-success me-2"></i>Modalidad</span>
                    <strong className="text-dark small">{servicio.modalidad}</strong>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted small"><i className="bi bi-people text-success me-2"></i>Disponibilidad</span>
                    <span className={`badge ${hayCupos ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"} rounded-pill small`}>
                      {hayCupos ? `${cupos} cupos` : "Agotado"}
                    </span>
                  </div>
                </div>

                {hayCupos ? (
                  <button
                    className="btn btn-success btn-lg w-100 rounded-pill shadow-sm mb-3 d-flex align-items-center justify-content-center gap-2"
                    onClick={reservar}
                  >
                    <i className="bi bi-cart2 fs-5"></i>
                    <span>Reservar servicio</span>
                  </button>
                ) : (
                  <button className="btn btn-secondary btn-lg w-100 rounded-pill mb-3 disabled" disabled>
                    <i className="bi bi-x-circle me-2"></i>Sin cupos disponibles
                  </button>
                )}

                <div className="bg-light rounded-3 p-3 mt-1">
                  <div className="d-flex flex-column gap-2" style={{ fontSize: "0.82rem" }}>
                    <div className="d-flex align-items-start gap-2 text-muted">
                      <i className="bi bi-shield-check text-success mt-1 flex-shrink-0"></i>
                      <span>Atención profesional garantizada y confidencial.</span>
                    </div>
                    <div className="d-flex align-items-start gap-2 text-muted">
                      <i className="bi bi-check2-circle text-success mt-1 flex-shrink-0"></i>
                      <span>Confirmación y reserva inmediata de tu cupo.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DetalleServicio;
