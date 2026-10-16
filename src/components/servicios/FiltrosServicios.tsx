import { formatPrecio } from "../../utils/formato";

interface FiltrosProps {
  categorias: string[];
  busqueda: string;
  categoria: string;
  precioMax: number;
  /** Precio más alto del catálogo: es el máximo del deslizador. */
  tope: number;
  onBusqueda: (valor: string) => void;
  onCategoria: (valor: string) => void;
  onPrecioMax: (valor: number) => void;
  onReset: () => void;
}

export const FiltrosServicios = ({
  categorias,
  busqueda,
  categoria,
  precioMax,
  tope,
  onBusqueda,
  onCategoria,
  onPrecioMax,
  onReset,
}: FiltrosProps) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
      <div className="row g-2 align-items-center">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control bg-light border-start-0"
              placeholder="Buscar servicio..."
              value={busqueda}
              onChange={(e) => onBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 text-muted">
              <i className="bi bi-tag"></i>
            </span>
            <select
              className="form-select bg-light border-start-0"
              aria-label="Seleccionar categoría"
              value={categoria}
              onChange={(e) => onCategoria(e.target.value)}
            >
              <option value="todos">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-12 col-sm-8 col-lg-4">
          <div className="d-flex align-items-center gap-2 px-1">
            <span className="text-muted small text-nowrap">
              Hasta: <strong className="text-success">{formatPrecio(precioMax)}</strong>
            </span>
            <input
              type="range"
              className="form-range flex-grow-1"
              min={0}
              max={tope}
              step={5000}
              value={precioMax}
              aria-label="Precio máximo"
              onChange={(e) => onPrecioMax(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="col-12 col-sm-4 col-lg-2 text-sm-end">
          <button className="btn btn-outline-secondary rounded-pill w-100" title="Restablecer filtros" onClick={onReset}>
            <i className="bi bi-arrow-counterclockwise me-1"></i>Limpiar
          </button>
        </div>
      </div>
    </div>
  );
};
