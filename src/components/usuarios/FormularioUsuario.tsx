import { useState, type FormEvent } from "react";
import type { CambiosUsuario } from "../../context/AuthContext";
import type { DatosPersonales, Rol, UsuarioPublico } from "../../types/Usuario";
import { ETIQUETA_ROL } from "../../utils/roles";
import { validarContrasenas, validarDatosPersonales } from "../../utils/validaciones";
import { Campo } from "../ui/Campo";
import { CamposPersonales } from "./CamposPersonales";

interface Props {
  /** Si viene, el formulario edita ese usuario; si no, crea uno nuevo. */
  inicial?: UsuarioPublico;
  /** Roles que quien usa el formulario puede asignar (el vendedor solo "cliente"). */
  rolesDisponibles: Rol[];
  /** Devuelve un mensaje de error o null si se guardó bien. */
  onGuardar: (datos: CambiosUsuario) => string | null;
  onCancelar?: () => void;
  textoGuardar?: string;
}

const datosVacios: DatosPersonales = {
  nombre: "", apellido: "", correo: "", fechaNacimiento: "", genero: "", region: "", direccion: "",
};

export const FormularioUsuario = ({ inicial, rolesDisponibles, onGuardar, onCancelar, textoGuardar }: Props) => {
  const [datos, setDatos] = useState<DatosPersonales>(
    inicial
      ? {
          nombre: inicial.nombre,
          apellido: inicial.apellido,
          correo: inicial.correo,
          fechaNacimiento: inicial.fechaNacimiento,
          genero: inicial.genero,
          region: inicial.region,
          direccion: inicial.direccion,
        }
      : datosVacios,
  );
  const [rol, setRol] = useState<Rol>(inicial?.rol ?? rolesDisponibles[0] ?? "cliente");
  const [contrasena, setContrasena] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [error, setError] = useState("");

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    let mensaje = validarDatosPersonales(datos);
    // Al editar, la contraseña es opcional: solo se valida si se escribió algo
    if (!mensaje && (!inicial || contrasena || confirmacion)) {
      mensaje = validarContrasenas(contrasena, confirmacion);
    }
    if (mensaje) {
      setError(mensaje);
      return;
    }

    const resultado = onGuardar({ ...datos, rol, contrasena: contrasena || undefined });
    if (resultado) {
      setError(resultado);
      return;
    }
    if (!inicial) {
      setDatos(datosVacios);
      setContrasena("");
      setConfirmacion("");
    }
  };

  return (
    <form onSubmit={enviar} noValidate>
      <div className="row g-3">
        <CamposPersonales datos={datos} prefijo="u-" onCambio={(campo, valor) => setDatos((d) => ({ ...d, [campo]: valor }))} />

        <Campo id="u-pass" etiqueta={inicial ? "Nueva contraseña" : "Contraseña"} obligatorio={!inicial} className="col-md-6">
          <input id="u-pass" type="password" className="form-control" placeholder={inicial ? "Dejar vacío para no cambiarla" : "••••••••"} value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
        </Campo>
        <Campo id="u-confirm" etiqueta="Confirmar contraseña" obligatorio={!inicial} className="col-md-6">
          <input id="u-confirm" type="password" className="form-control" placeholder="••••••••" value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} />
        </Campo>

        <Campo id="u-rol" etiqueta="Rol" obligatorio className="col-md-6">
          <select id="u-rol" className="form-select" value={rol} disabled={rolesDisponibles.length <= 1} onChange={(e) => setRol(e.target.value as Rol)}>
            {rolesDisponibles.map((r) => (
              <option key={r} value={r}>{ETIQUETA_ROL[r]}</option>
            ))}
          </select>
          {rolesDisponibles.length <= 1 && (
            <div className="form-text">Tu rol solo permite crear cuentas de cliente.</div>
          )}
        </Campo>
      </div>

      {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}

      <div className="d-flex justify-content-end gap-2 mt-4">
        {onCancelar && (
          <button type="button" className="btn btn-light rounded-pill px-4" onClick={onCancelar}>Cancelar</button>
        )}
        <button type="submit" className="btn btn-success rounded-pill px-4">
          <i className="bi bi-check-lg me-1"></i>
          {textoGuardar ?? (inicial ? "Guardar cambios" : "Crear usuario")}
        </button>
      </div>
    </form>
  );
};
