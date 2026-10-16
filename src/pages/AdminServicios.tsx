import { useState } from "react";
import { Link } from "react-router";
import { EncabezadoAdmin } from "../components/admin/EncabezadoAdmin";
import { FormularioServicio } from "../components/servicios/FormularioServicio";
import { StockEditor } from "../components/servicios/StockEditor";
import { BadgeCategoria } from "../components/ui/BadgeCategoria";
import { ModalConfirmar } from "../components/ui/ModalConfirmar";
import { ModalFormulario } from "../components/ui/ModalFormulario";
import { useAuth } from "../context/AuthContext";
import { useCatalogo } from "../context/CatalogoContext";
import { useToast } from "../context/ToastContext";
import type { Servicio } from "../types/Servicio";
import { formatPrecio } from "../utils/formato";
import { permisos } from "../utils/roles";

const AdminServicios = () => {
  const { rol } = useAuth();
  const { servicios, categorias, crearServicio, actualizarServicio, eliminarServicio } = useCatalogo();
  const { mostrar } = useToast();

  const puedeGestionar = permisos.gestionarProductos(rol);

  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todos");
  // undefined = cerrado, null = creando, Servicio = editando
  const [formulario, setFormulario] = useState<Servicio | null | undefined>(undefined);
  const [porEliminar, setPorEliminar] = useState<Servicio | null>(null);

  const q = busqueda.toLowerCase().trim();
  const filtrados = servicios.filter(
    (s) =>
      (categoria === "todos" || s.categoria === categoria) &&
      (q === "" || s.nombre.toLowerCase().includes(q) || s.codigo.toLowerCase().includes(q)),
  );

  const guardar = (servicio: Servicio): string | null => {
    const editando = formulario !== null && formulario !== undefined;
    const error = editando ? actualizarServicio(servicio) : crearServicio(servicio);
    if (error) return error;
    mostrar(editando ? "Servicio actualizado" : "Servicio creado", "success");
    setFormulario(undefined);
    return null;
  };

  const confirmarEliminar = () => {
    if (!porEliminar) return;
    const error = eliminarServicio(porEliminar.codigo);
    mostrar(error ?? `"${porEliminar.nombre}" eliminado`, error ? "danger" : "success");
    setPorEliminar(null);
  };

  return (
    <main className="pt-5">
      <section className="py-5 mt-2">
        <div className="container">
          <EncabezadoAdmin
            titulo="Servicios"
            subtitulo={puedeGestionar ? "Administra el catálogo completo de servicios" : "Consulta los servicios y actualiza su stock"}
          >
            {puedeGestionar && (
              <button className="btn btn-success rounded-pill px-4" onClick={() => setFormulario(null)}>
                <i className="bi bi-plus-lg me-2"></i>Nuevo servicio
              </button>
            )}
          </EncabezadoAdmin>

          {!puedeGestionar && (
            <div className="alert alert-info d-flex align-items-center gap-2">
              <i className="bi bi-info-circle"></i>
              Como vendedor puedes consultar los servicios y modificar su stock. No puedes crearlos, editarlos ni eliminarlos.
            </div>
          )}

          <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
            <div className="row g-2">
              <div className="col-12 col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-search"></i></span>
                  <input className="form-control bg-light border-start-0" placeholder="Buscar por nombre o código..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <select className="form-select bg-light" aria-label="Filtrar por categoría" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                  <option value="todos">Todas las categorías</option>
                  {categorias.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light text-muted small text-uppercase">
                  <tr>
                    <th className="ps-4">Servicio</th>
                    <th className="d-none d-md-table-cell">Categoría</th>
                    <th className="text-end">Precio</th>
                    <th style={{ minWidth: 150 }}>Stock</th>
                    {puedeGestionar && <th className="text-end pe-4">Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {filtrados.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-5">No hay servicios que coincidan con la búsqueda.</td>
                    </tr>
                  ) : (
                    filtrados.map((s) => (
                      <tr key={s.codigo}>
                        <td className="ps-4">
                          <Link to={`/servicios/${s.codigo}`} className="fw-bold text-dark text-decoration-none d-block">{s.nombre}</Link>
                          <span className="text-muted small">{s.codigo}</span>
                          <span className="d-md-none d-block"><BadgeCategoria categoria={s.categoria} className="mt-1" /></span>
                        </td>
                        <td className="d-none d-md-table-cell">
                          <BadgeCategoria categoria={s.categoria} />
                        </td>
                        <td className="text-end fw-semibold">{formatPrecio(s.precio)}</td>
                        <td>
                          <StockEditor codigo={s.codigo} stock={s.stock} />
                        </td>
                        {puedeGestionar && (
                          <td className="text-end pe-4 text-nowrap">
                            <button className="btn btn-sm btn-outline-secondary rounded-circle me-1" title="Editar" onClick={() => setFormulario(s)}>
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger rounded-circle" title="Eliminar" onClick={() => setPorEliminar(s)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <ModalFormulario
        abierto={formulario !== undefined}
        titulo={formulario ? "Editar servicio" : "Nuevo servicio"}
        icono="bi-journal-medical"
        onCerrar={() => setFormulario(undefined)}
      >
        <FormularioServicio
          inicial={formulario ?? undefined}
          categorias={categorias}
          onGuardar={guardar}
          onCancelar={() => setFormulario(undefined)}
        />
      </ModalFormulario>

      <ModalConfirmar
        abierto={porEliminar !== null}
        titulo="Eliminar servicio"
        mensaje={`¿Seguro que deseas eliminar "${porEliminar?.nombre}"? También se quitará de los carritos de reserva.`}
        onConfirmar={confirmarEliminar}
        onCerrar={() => setPorEliminar(null)}
      />
    </main>
  );
};

export default AdminServicios;
