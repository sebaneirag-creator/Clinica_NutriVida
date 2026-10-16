import { useState, type FormEvent } from "react";
import { EncabezadoAdmin } from "../components/admin/EncabezadoAdmin";
import { Campo } from "../components/ui/Campo";
import { ModalConfirmar } from "../components/ui/ModalConfirmar";
import { ModalFormulario } from "../components/ui/ModalFormulario";
import { useCatalogo } from "../context/CatalogoContext";
import { useToast } from "../context/ToastContext";

interface FormularioCategoriaProps {
  inicial?: string;
  onGuardar: (nombre: string) => string | null;
  onCancelar: () => void;
}

const FormularioCategoria = ({ inicial, onGuardar, onCancelar }: FormularioCategoriaProps) => {
  const [nombre, setNombre] = useState(inicial ?? "");
  const [error, setError] = useState("");

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setError(onGuardar(nombre) ?? "");
  };

  return (
    <form onSubmit={enviar} noValidate>
      <div className="row g-3">
        <Campo id="nombre-categoria" etiqueta="Nombre de la categoría" obligatorio>
          <input id="nombre-categoria" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} autoFocus />
        </Campo>
      </div>
      {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-light rounded-pill px-4" onClick={onCancelar}>Cancelar</button>
        <button type="submit" className="btn btn-success rounded-pill px-4">
          <i className="bi bi-check-lg me-1"></i>{inicial ? "Guardar cambios" : "Crear categoría"}
        </button>
      </div>
    </form>
  );
};

const AdminCategorias = () => {
  const { categorias, servicios, crearCategoria, renombrarCategoria, eliminarCategoria } = useCatalogo();
  const { mostrar } = useToast();

  // undefined = cerrado, null = creando, string = nombre de la categoría que se edita
  const [formulario, setFormulario] = useState<string | null | undefined>(undefined);
  const [porEliminar, setPorEliminar] = useState<string | null>(null);

  const guardar = (nombre: string): string | null => {
    const error = formulario ? renombrarCategoria(formulario, nombre) : crearCategoria(nombre);
    if (error) return error;
    mostrar(formulario ? "Categoría renombrada" : "Categoría creada", "success");
    setFormulario(undefined);
    return null;
  };

  const confirmarEliminar = () => {
    if (!porEliminar) return;
    const error = eliminarCategoria(porEliminar);
    mostrar(error ?? `Categoría "${porEliminar}" eliminada`, error ? "danger" : "success");
    setPorEliminar(null);
  };

  return (
    <main className="pt-5">
      <section className="py-5 mt-2">
        <div className="container" style={{ maxWidth: 900 }}>
          <EncabezadoAdmin titulo="Categorías" subtitulo="Las categorías se obtienen de los servicios; aquí puedes crearlas, renombrarlas o eliminarlas">
            <button className="btn btn-success rounded-pill px-4" onClick={() => setFormulario(null)}>
              <i className="bi bi-plus-lg me-2"></i>Nueva categoría
            </button>
          </EncabezadoAdmin>

          <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light text-muted small text-uppercase">
                  <tr>
                    <th className="ps-4">Categoría</th>
                    <th className="text-center">Servicios</th>
                    <th className="text-end pe-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center text-muted py-5">Aún no hay categorías.</td>
                    </tr>
                  ) : (
                    categorias.map((c) => (
                      <tr key={c}>
                        <td className="ps-4 fw-bold text-dark">{c}</td>
                        <td className="text-center">
                          <span className="badge bg-light text-secondary border">
                            {servicios.filter((s) => s.categoria === c).length}
                          </span>
                        </td>
                        <td className="text-end pe-4 text-nowrap">
                          <button className="btn btn-sm btn-outline-secondary rounded-circle me-1" title="Renombrar" onClick={() => setFormulario(c)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger rounded-circle" title="Eliminar" onClick={() => setPorEliminar(c)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
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
        titulo={formulario ? "Renombrar categoría" : "Nueva categoría"}
        icono="bi-tags"
        onCerrar={() => setFormulario(undefined)}
      >
        <FormularioCategoria inicial={formulario ?? undefined} onGuardar={guardar} onCancelar={() => setFormulario(undefined)} />
      </ModalFormulario>

      <ModalConfirmar
        abierto={porEliminar !== null}
        titulo="Eliminar categoría"
        mensaje={`¿Seguro que deseas eliminar la categoría "${porEliminar}"? Solo es posible si no tiene servicios asociados.`}
        onConfirmar={confirmarEliminar}
        onCerrar={() => setPorEliminar(null)}
      />
    </main>
  );
};

export default AdminCategorias;
