import { Link } from "react-router";
import { EncabezadoAdmin } from "../components/admin/EncabezadoAdmin";
import { BadgeRol } from "../components/ui/BadgeRol";
import { useAuth } from "../context/AuthContext";
import { useCatalogo } from "../context/CatalogoContext";
import { permisos } from "../utils/roles";

interface Opcion {
  to: string;
  icono: string;
  titulo: string;
  texto: string;
  visible: boolean;
}

const AdminPanel = () => {
  const { usuario, rol, usuarios } = useAuth();
  const { servicios, categorias } = useCatalogo();

  const agotados = servicios.filter((s) => s.stock === 0).length;

  // Cada rol solo ve las operaciones que le corresponden
  const opciones: Opcion[] = [
    {
      to: "/admin/usuarios",
      icono: "bi-people",
      titulo: permisos.gestionarUsuarios(rol) ? "Usuarios" : "Crear cliente",
      texto: permisos.gestionarUsuarios(rol)
        ? "Crear, consultar, modificar y eliminar usuarios, y asignar roles."
        : "Registra cuentas nuevas con rol cliente.",
      visible: permisos.rolesAsignables(rol).length > 0,
    },
    {
      to: "/admin/servicios",
      icono: "bi-journal-medical",
      titulo: permisos.gestionarProductos(rol) ? "Servicios" : "Servicios y stock",
      texto: permisos.gestionarProductos(rol)
        ? "Crear, consultar, modificar y eliminar servicios del catálogo."
        : "Consulta el catálogo y actualiza el stock de cada servicio.",
      visible: permisos.editarStock(rol),
    },
    {
      to: "/admin/categorias",
      icono: "bi-tags",
      titulo: "Categorías",
      texto: "Crear, consultar, modificar y eliminar categorías de servicios.",
      visible: permisos.gestionarCategorias(rol),
    },
  ];

  return (
    <main className="pt-5">
      <section className="py-5 mt-2">
        <div className="container">
          <EncabezadoAdmin enPanel titulo="Panel de administración" subtitulo="Gestiona la clínica según los permisos de tu rol">
            {usuario && (
              <span className="text-muted">
                Sesión como <BadgeRol rol={usuario.rol} className="ms-1" />
              </span>
            )}
          </EncabezadoAdmin>

          <div className="row g-3 mb-4">
            {[
              { n: servicios.length, t: "Servicios", i: "bi-journal-medical" },
              { n: agotados, t: "Sin stock", i: "bi-exclamation-circle" },
              ...(permisos.gestionarCategorias(rol) ? [{ n: categorias.length, t: "Categorías", i: "bi-tags" }] : []),
              ...(permisos.gestionarUsuarios(rol) ? [{ n: usuarios.length, t: "Usuarios", i: "bi-people" }] : []),
            ].map((dato) => (
              <div className="col-6 col-lg-3" key={dato.t}>
                <div className="card border-0 shadow-sm rounded-4 p-3 bg-white text-center">
                  <i className={`bi ${dato.i} text-success fs-3`}></i>
                  <div className="fs-3 fw-bold text-dark">{dato.n}</div>
                  <div className="text-muted small">{dato.t}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4">
            {opciones.filter((o) => o.visible).map((o) => (
              <div className="col-md-6 col-lg-4" key={o.to}>
                <Link to={o.to} className="text-decoration-none">
                  <div className="card card-catalogo h-100 p-4">
                    <div className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 56, height: 56 }}>
                      <i className={`bi ${o.icono} fs-3`}></i>
                    </div>
                    <h5 className="fw-bold text-dark">{o.titulo}</h5>
                    <p className="text-muted small mb-0">{o.texto}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminPanel;
