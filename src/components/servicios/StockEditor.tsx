import { useEffect, useState } from "react";
import { useCatalogo } from "../../context/CatalogoContext";
import { useToast } from "../../context/ToastContext";

// Control para editar el stock de un servicio (administrador y vendedor)
export const StockEditor = ({ codigo, stock }: { codigo: string; stock: number }) => {
  const { actualizarStock } = useCatalogo();
  const { mostrar } = useToast();
  const [valor, setValor] = useState(String(stock));

  useEffect(() => {
    setValor(String(stock));
  }, [stock]);

  const cambiado = valor !== String(stock);

  const guardar = () => {
    const error = valor.trim() === "" ? "Ingresa un stock válido" : actualizarStock(codigo, Number(valor));
    if (error) {
      mostrar(error, "danger");
      setValor(String(stock));
      return;
    }
    mostrar(`Stock de ${codigo} actualizado`, "success");
  };

  return (
    <div className="input-group input-group-sm" style={{ maxWidth: 150 }}>
      <input
        type="number"
        min={0}
        max={999}
        className="form-control"
        aria-label={`Stock de ${codigo}`}
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && cambiado && guardar()}
      />
      <button className="btn btn-outline-success" title="Guardar stock" disabled={!cambiado} onClick={guardar}>
        <i className="bi bi-check-lg"></i>
      </button>
    </div>
  );
};
