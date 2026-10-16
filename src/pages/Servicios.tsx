import { useState } from "react";
import { Link } from "react-router";
import { FiltrosServicios } from "../components/servicios/FiltrosServicios";
import { ServicioCard } from "../components/servicios/ServicioCard";
import { useCatalogo } from "../context/CatalogoContext";

const Servicios = () => {
  const { servicios } = useCatalogo();
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todos");
  const [precioMaxSel, setPrecioMaxSel] = useState<number | null>(null);

  // El deslizador llega hasta el servicio más caro del catálogo (que ahora puede cambiar)
  const tope = Math.max(10000, Math.ceil(Math.max(0, ...servicios.map((s) => s.precio)) / 5000) * 5000);
  const precioMax = Math.min(precioMaxSel ?? tope, tope);

  const reset = () => {
    setBusqueda("");
    setCategoria("todos");
    setPrecioMaxSel(null);
  };

  // El filtro de categorías se arma leyendo la categoría de cada servicio guardado:
  // si se crea o edita un servicio con una categoría nueva, aparece sola.
  // Si la categoría elegida deja de existir, se vuelve a "todas".
  const categoriasEnUso = Array.from(new Set(servicios.map((s) => s.categoria)));
  const categoriaActiva = categoriasEnUso.includes(categoria) ? categoria : "todos";

  const q = busqueda.toLowerCase().trim();
  const filtrados = servicios.filter(
    (s) =>
      (categoriaActiva === "todos" || s.categoria === categoriaActiva) &&
      s.precio <= precioMax &&
      (q === "" ||
        s.nombre.toLowerCase().includes(q) ||
        s.descripcion.toLowerCase().includes(q) ||
        s.categoria.toLowerCase().includes(q) ||
        s.modalidad.toLowerCase().includes(q)),
  );

  return (
    <main className="pt-5">
      <section className="servicios-hero mt-3">
        <div className="container text-center">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-2">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none text-muted">
                  <i className="bi bi-house-door me-1"></i>Inicio
                </Link>
              </li>
              <li className="breadcrumb-item active text-success fw-semibold" aria-current="page">Servicios</li>
            </ol>
          </nav>
          <h1 className="section-title mb-2">Nuestros Servicios</h1>
          <p className="section-subtitle mb-3">
            Encuentra la atención nutricional personalizada que se adapta a tus metas y estilo de vida
          </p>
          <div className="d-flex justify-content-center flex-wrap gap-2 pt-1">
            <span className="badge bg-white text-secondary border shadow-sm px-3 py-2 rounded-pill">
              <i className="bi bi-shield-check text-success me-1"></i> Profesionales acreditados
            </span>
            <span className="badge bg-white text-secondary border shadow-sm px-3 py-2 rounded-pill">
              <i className="bi bi-camera-video text-success me-1"></i> Presencial y Online
            </span>
            <span className="badge bg-white text-secondary border shadow-sm px-3 py-2 rounded-pill">
              <i className="bi bi-heart-pulse text-success me-1"></i> Planes a tu medida
            </span>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <FiltrosServicios
            categorias={categoriasEnUso}
            tope={tope}
            busqueda={busqueda}
            categoria={categoriaActiva}
            precioMax={precioMax}
            onBusqueda={setBusqueda}
            onCategoria={setCategoria}
            onPrecioMax={setPrecioMaxSel}
            onReset={reset}
          />

          <div className="d-flex justify-content-between align-items-center mb-4 text-muted small">
            <span>
              <strong className="text-dark">{filtrados.length}</strong>{" "}
              {filtrados.length === 1 ? "servicio disponible" : "servicios disponibles"}
            </span>
            <span className="d-none d-sm-inline">
              <i className="bi bi-info-circle me-1"></i>Precios en pesos chilenos (CLP)
            </span>
          </div>

          <div className="row g-4">
            {filtrados.length === 0 ? (
              <div className="col-12 text-center py-5">
                <div className="p-5 bg-white rounded-4 shadow-sm border">
                  <i className="bi bi-search text-muted" style={{ fontSize: "3rem" }}></i>
                  <h4 className="mt-3 fw-bold text-dark">No se encontraron servicios</h4>
                  <p className="text-muted mb-4">
                    No hay resultados que coincidan con tu búsqueda o los filtros seleccionados.
                  </p>
                  <button className="btn btn-outline-success rounded-pill px-4" onClick={reset}>
                    <i className="bi bi-arrow-counterclockwise me-1"></i>Restablecer filtros
                  </button>
                </div>
              </div>
            ) : (
              filtrados.map((s) => <ServicioCard key={s.codigo} servicio={s} />)
            )}
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 mt-5 bg-white">
            <div className="row align-items-center g-3">
              <div className="col-lg-8 text-center text-lg-start">
                <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-3 mb-2">
                  <span className="d-inline-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle icon-circle-sm">
                    <i className="bi bi-chat-dots fs-5"></i>
                  </span>
                  <h5 className="fw-bold mb-0 text-dark">¿Tienes dudas sobre qué servicio elegir?</h5>
                </div>
                <p className="text-muted mb-0 small">
                  Nuestro equipo puede guiarte para seleccionar la opción más adecuada para tus
                  necesidades de salud o rendimiento.
                </p>
              </div>
              <div className="col-lg-4 text-center text-lg-end">
                <Link to="/#contacto" className="btn btn-success rounded-pill px-4">
                  <i className="bi bi-envelope me-1"></i>Contáctanos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Servicios;
