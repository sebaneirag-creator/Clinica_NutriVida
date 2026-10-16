import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router";
import { Avatar } from "../components/ui/Avatar";
import { BadgeRol } from "../components/ui/BadgeRol";
import { Campo } from "../components/ui/Campo";
import { CamposPersonales } from "../components/usuarios/CamposPersonales";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { nombreRegion } from "../data/regiones";
import type { DatosPersonales, UsuarioPublico } from "../types/Usuario";
import { formatFecha } from "../utils/formato";
import { ETIQUETA_ROL } from "../utils/roles";
import { calcularEdad, validarDatosPersonales } from "../utils/validaciones";

const datosDe = (u: UsuarioPublico | null): DatosPersonales => ({
  nombre: u?.nombre ?? "",
  apellido: u?.apellido ?? "",
  correo: u?.correo ?? "",
  fechaNacimiento: u?.fechaNacimiento ?? "",
  genero: u?.genero ?? "",
  region: u?.region ?? "",
  direccion: u?.direccion ?? "",
});

const generos: Record<string, string> = { Mujer: "Mujer", Hombre: "Hombre", Otro: "Otro", NoDice: "Prefiero no decir" };

const Fila = ({ icono, etiqueta, children }: { icono: string; etiqueta: string; children: ReactNode }) => (
  <div className="d-flex align-items-start gap-3 py-3 border-bottom">
    <i className={`bi ${icono} text-success fs-5`}></i>
    <div>
      <span className="text-muted small d-block">{etiqueta}</span>
      <span className="fw-semibold text-dark">{children}</span>
    </div>
  </div>
);

const Perfil = () => {
  const { usuario, actualizarPerfil } = useAuth();
  const { mostrar } = useToast();
  const [editando, setEditando] = useState(false);
  const [datos, setDatos] = useState<DatosPersonales>(() => datosDe(usuario));
  const [error, setError] = useState("");

  if (!usuario) return null; // la ruta ya está protegida; esto solo estrecha el tipo

  const empezar = () => {
    setDatos(datosDe(usuario));
    setError("");
    setEditando(true);
  };

  const guardar = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const mensaje = validarDatosPersonales(datos) ?? actualizarPerfil(datos);
    if (mensaje) {
      setError(mensaje);
      return;
    }
    mostrar("Perfil actualizado correctamente", "success");
    setEditando(false);
  };

  return (
    <main className="pt-5">
      <section className="py-5 mt-2">
        <div className="container" style={{ maxWidth: 820 }}>
          <nav aria-label="breadcrumb" className="mb-2">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none text-muted"><i className="bi bi-house-door me-1"></i>Inicio</Link>
              </li>
              <li className="breadcrumb-item active text-success fw-semibold" aria-current="page">Mi perfil</li>
            </ol>
          </nav>

          <div className="card border-0 shadow-sm rounded-4 bg-white p-4 p-md-5">
            <div className="d-flex flex-column flex-sm-row align-items-center gap-4 mb-4">
              <Avatar />
              <div className="text-center text-sm-start flex-grow-1">
                <h1 className="h3 fw-bold text-dark mb-1">{usuario.nombre} {usuario.apellido}</h1>
                <BadgeRol rol={usuario.rol} className="px-3 py-1" />
              </div>
              {!editando && (
                <button className="btn btn-success rounded-pill px-4" onClick={empezar}>
                  <i className="bi bi-pencil me-2"></i>Editar perfil
                </button>
              )}
            </div>

            {editando ? (
              <form onSubmit={guardar} noValidate>
                <div className="row g-3">
                  <CamposPersonales datos={datos} prefijo="p-" onCambio={(campo, valor) => setDatos((d) => ({ ...d, [campo]: valor }))} />
                  <Campo id="p-rol" etiqueta="Rol" className="col-md-6">
                    <input id="p-rol" className="form-control" value={ETIQUETA_ROL[usuario.rol]} disabled />
                    <div className="form-text">Tu rol no se puede modificar desde el perfil.</div>
                  </Campo>
                </div>
                {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setEditando(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-success rounded-pill px-4">
                    <i className="bi bi-check-lg me-1"></i>Guardar cambios
                  </button>
                </div>
              </form>
            ) : (
              <div className="row">
                <div className="col-md-6">
                  <Fila icono="bi-person" etiqueta="Nombre completo">{usuario.nombre} {usuario.apellido}</Fila>
                  <Fila icono="bi-envelope" etiqueta="Correo electrónico">{usuario.correo}</Fila>
                  <Fila icono="bi-calendar-event" etiqueta="Fecha de nacimiento">
                    {formatFecha(usuario.fechaNacimiento)} ({calcularEdad(usuario.fechaNacimiento)} años)
                  </Fila>
                  <Fila icono="bi-gender-ambiguous" etiqueta="Género">{generos[usuario.genero] ?? usuario.genero}</Fila>
                </div>
                <div className="col-md-6">
                  <Fila icono="bi-geo-alt" etiqueta="Dirección">{usuario.direccion}</Fila>
                  <Fila icono="bi-map" etiqueta="Región">{nombreRegion(usuario.region)}</Fila>
                  <Fila icono="bi-shield-check" etiqueta="Rol">{ETIQUETA_ROL[usuario.rol]}</Fila>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Perfil;
