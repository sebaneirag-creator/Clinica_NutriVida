import { useState } from "react";
import { EncabezadoAdmin } from "../components/admin/EncabezadoAdmin";
import { BadgeRol } from "../components/ui/BadgeRol";
import { ModalConfirmar } from "../components/ui/ModalConfirmar";
import { ModalFormulario } from "../components/ui/ModalFormulario";
import { FormularioUsuario } from "../components/usuarios/FormularioUsuario";
import { useAuth, type CambiosUsuario } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { nombreRegion } from "../data/regiones";
import type { Rol, UsuarioPublico } from "../types/Usuario";
import { ETIQUETA_ROL, permisos, TODOS_LOS_ROLES } from "../utils/roles";

const AdminUsuarios = () => {
  const { usuario, rol, usuarios, crearUsuario, actualizarUsuario, eliminarUsuario, estaBloqueado, desbloquear } = useAuth();
  const { mostrar } = useToast();

  const esAdmin = permisos.gestionarUsuarios(rol);
  const rolesAsignables = permisos.rolesAsignables(rol);

  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState<Rol | "todos">("todos");
  // undefined = cerrado, null = creando, UsuarioPublico = editando
  const [formulario, setFormulario] = useState<UsuarioPublico | null | undefined>(undefined);
  const [porEliminar, setPorEliminar] = useState<UsuarioPublico | null>(null);

  const crear = (datos: CambiosUsuario): string | null => {
    const error = crearUsuario({ ...datos, contrasena: datos.contrasena ?? "" });
    if (!error) mostrar(`Usuario ${datos.nombre} creado como ${ETIQUETA_ROL[datos.rol].toLowerCase()}`, "success");
    return error;
  };

  const guardar = (datos: CambiosUsuario): string | null => {
    const error = formulario ? actualizarUsuario(formulario.id, datos) : crear(datos);
    if (error) return error;
    if (formulario) mostrar("Usuario actualizado", "success");
    setFormulario(undefined);
    return null;
  };

  const confirmarEliminar = () => {
    if (!porEliminar) return;
    const error = eliminarUsuario(porEliminar.id);
    mostrar(error ?? `Usuario ${porEliminar.nombre} eliminado`, error ? "danger" : "success");
    setPorEliminar(null);
  };

  // ---- Vista del vendedor: solo puede crear clientes ----
  if (!esAdmin) {
    return (
      <main className="pt-5">
        <section className="py-5 mt-2">
          <div className="container" style={{ maxWidth: 820 }}>
            <EncabezadoAdmin titulo="Crear cliente" subtitulo="Registra una cuenta nueva con rol cliente" />
            <div className="card border-0 shadow-sm rounded-4 bg-white p-4 p-md-5">
              <FormularioUsuario rolesDisponibles={rolesAsignables} onGuardar={crear} textoGuardar="Crear cliente" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ---- Vista del administrador: CRUD completo ----
  const q = busqueda.toLowerCase().trim();
  const filtrados = usuarios.filter(
    (u) =>
      (filtroRol === "todos" || u.rol === filtroRol) &&
      (q === "" || `${u.nombre} ${u.apellido} ${u.correo}`.toLowerCase().includes(q)),
  );

  return (
    <main className="pt-5">
      <section className="py-5 mt-2">
        <div className="container">
          <EncabezadoAdmin titulo="Usuarios" subtitulo="Administra las cuentas y sus roles">
            <button className="btn btn-success rounded-pill px-4" onClick={() => setFormulario(null)}>
              <i className="bi bi-person-plus me-2"></i>Nuevo usuario
            </button>
          </EncabezadoAdmin>

          <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
            <div className="row g-2">
              <div className="col-12 col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-search"></i></span>
                  <input className="form-control bg-light border-start-0" placeholder="Buscar por nombre o correo..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <select className="form-select bg-light" aria-label="Filtrar por rol" value={filtroRol} onChange={(e) => setFiltroRol(e.target.value as Rol | "todos")}>
                  <option value="todos">Todos los roles</option>
                  {TODOS_LOS_ROLES.map((r) => (
                    <option key={r} value={r}>{ETIQUETA_ROL[r]}</option>
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
                    <th className="ps-4">Usuario</th>
                    <th className="d-none d-md-table-cell">Región</th>
                    <th>Rol</th>
                    <th className="text-end pe-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-5">No hay usuarios que coincidan con la búsqueda.</td>
                    </tr>
                  ) : (
                    filtrados.map((u) => (
                      <tr key={u.id}>
                        <td className="ps-4">
                          <span className="fw-bold text-dark d-block">
                            {u.nombre} {u.apellido}
                            {u.id === usuario?.id && <span className="badge bg-light text-secondary border ms-2">Tú</span>}
                          </span>
                          <span className="text-muted small">{u.correo}</span>
                          {estaBloqueado(u.correo) && <span className="badge bg-danger-subtle text-danger ms-2">Bloqueado</span>}
                        </td>
                        <td className="d-none d-md-table-cell text-muted">{nombreRegion(u.region)}</td>
                        <td><BadgeRol rol={u.rol} /></td>
                        <td className="text-end pe-4 text-nowrap">
                          {estaBloqueado(u.correo) && (
                            <button
                              className="btn btn-sm btn-outline-warning rounded-circle me-1"
                              title="Desbloquear cuenta"
                              onClick={() => {
                                desbloquear(u.correo);
                                mostrar(`Cuenta de ${u.nombre} desbloqueada`, "success");
                              }}
                            >
                              <i className="bi bi-unlock"></i>
                            </button>
                          )}
                          <button className="btn btn-sm btn-outline-secondary rounded-circle me-1" title="Editar" onClick={() => setFormulario(u)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger rounded-circle" title="Eliminar" disabled={u.id === usuario?.id} onClick={() => setPorEliminar(u)}>
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
        titulo={formulario ? "Editar usuario" : "Nuevo usuario"}
        icono="bi-person"
        onCerrar={() => setFormulario(undefined)}
      >
        <FormularioUsuario
          inicial={formulario ?? undefined}
          rolesDisponibles={rolesAsignables}
          onGuardar={guardar}
          onCancelar={() => setFormulario(undefined)}
        />
      </ModalFormulario>

      <ModalConfirmar
        abierto={porEliminar !== null}
        titulo="Eliminar usuario"
        mensaje={`¿Seguro que deseas eliminar la cuenta de ${porEliminar?.nombre} ${porEliminar?.apellido}? Esta acción no se puede deshacer.`}
        onConfirmar={confirmarEliminar}
        onCerrar={() => setPorEliminar(null)}
      />
    </main>
  );
};

export default AdminUsuarios;
