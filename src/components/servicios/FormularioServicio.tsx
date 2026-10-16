import { useState, type FormEvent } from "react";
import type { Servicio } from "../../types/Servicio";
import { Campo } from "../ui/Campo";

const NUEVA = "__nueva__";

interface Props {
  inicial?: Servicio;
  /** Nombres de categorías existentes (se obtienen de los servicios guardados). */
  categorias: string[];
  /** Devuelve un mensaje de error o null si se guardó bien. */
  onGuardar: (servicio: Servicio) => string | null;
  onCancelar: () => void;
}

export const FormularioServicio = ({ inicial, categorias, onGuardar, onCancelar }: Props) => {
  const [form, setForm] = useState({
    codigo: inicial?.codigo ?? "",
    categoria: inicial?.categoria ?? "",
    nombre: inicial?.nombre ?? "",
    duracion: inicial?.duracion ?? "",
    modalidad: inicial?.modalidad ?? "",
    precio: inicial ? String(inicial.precio) : "",
    stock: inicial ? String(inicial.stock) : "",
    descripcion: inicial?.descripcion ?? "",
  });
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [error, setError] = useState("");

  const esNueva = form.categoria === NUEVA;

  const cambiar = (campo: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }));

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (Object.values(form).some((v) => v.trim() === "")) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (esNueva && nuevaCategoria.trim() === "") {
      setError("Escribe el nombre de la nueva categoría");
      return;
    }
    const resultado = onGuardar(
      {
        ...form,
        categoria: esNueva ? nuevaCategoria.trim() : form.categoria,
        precio: Number(form.precio),
        stock: Number(form.stock),
      },
    );
    if (resultado) setError(resultado);
  };

  return (
    <form onSubmit={enviar} noValidate>
      <div className="row g-3">
        <Campo id="codigo" etiqueta="Código" obligatorio className="col-md-4">
          <input id="codigo" className="form-control" placeholder="Ej: CN006" disabled={Boolean(inicial)} value={form.codigo} onChange={cambiar("codigo")} />
        </Campo>
        <Campo id="nombre" etiqueta="Nombre" obligatorio className="col-md-8">
          <input id="nombre" className="form-control" value={form.nombre} onChange={cambiar("nombre")} />
        </Campo>
        <Campo id="categoria" etiqueta="Categoría" obligatorio className="col-md-6">
          <select id="categoria" className="form-select" value={form.categoria} onChange={cambiar("categoria")}>
            <option value="" disabled>Seleccione</option>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value={NUEVA}>➕ Crear nueva categoría…</option>
          </select>
        </Campo>
        <Campo id="modalidad" etiqueta="Modalidad" obligatorio className="col-md-6">
          <input id="modalidad" className="form-control" list="modalidades" placeholder="Presencial, Online (video)..." value={form.modalidad} onChange={cambiar("modalidad")} />
        </Campo>
        {esNueva && (
          <Campo id="nuevaCategoria" etiqueta="Nombre de la nueva categoría" obligatorio>
            <input id="nuevaCategoria" className="form-control" placeholder="Ej: Suplementación" value={nuevaCategoria} onChange={(e) => setNuevaCategoria(e.target.value)} autoFocus />
          </Campo>
        )}
        <datalist id="modalidades">
          <option value="Presencial" />
          <option value="Online (video)" />
          <option value="Presencial (grupo)" />
        </datalist>
        <Campo id="duracion" etiqueta="Duración" obligatorio className="col-md-4">
          <input id="duracion" className="form-control" placeholder="30 min (o — si no aplica)" value={form.duracion} onChange={cambiar("duracion")} />
        </Campo>
        <Campo id="precio" etiqueta="Precio (CLP)" obligatorio className="col-md-4">
          <input id="precio" type="number" min={1} className="form-control" value={form.precio} onChange={cambiar("precio")} />
        </Campo>
        <Campo id="stock" etiqueta="Stock (cupos)" obligatorio className="col-md-4">
          <input id="stock" type="number" min={0} max={999} className="form-control" value={form.stock} onChange={cambiar("stock")} />
        </Campo>
        <Campo id="descripcion" etiqueta="Descripción" obligatorio>
          <textarea id="descripcion" rows={3} className="form-control" value={form.descripcion} onChange={cambiar("descripcion")} />
        </Campo>
      </div>

      {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-light rounded-pill px-4" onClick={onCancelar}>Cancelar</button>
        <button type="submit" className="btn btn-success rounded-pill px-4">
          <i className="bi bi-check-lg me-1"></i>{inicial ? "Guardar cambios" : "Crear servicio"}
        </button>
      </div>
    </form>
  );
};
