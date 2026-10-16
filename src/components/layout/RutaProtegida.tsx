import { Link, Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";
import type { Rol } from "../../types/Usuario";

// Protege un grupo de rutas: exige sesión y, opcionalmente, uno de los roles indicados
export const RutaProtegida = ({ roles }: { roles?: Rol[] }) => {
  const { usuario } = useAuth();

  if (!usuario) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(usuario.rol)) {
    return (
      <main className="pt-5">
        <section className="py-5 mt-2">
          <div className="container text-center">
            <div className="p-5 bg-white rounded-4 shadow-sm border d-inline-block" style={{ maxWidth: 500 }}>
              <i className="bi bi-shield-lock text-danger" style={{ fontSize: "3rem" }}></i>
              <h3 className="fw-bold mt-3 text-dark">Acceso restringido</h3>
              <p className="text-muted mb-4">Tu rol no tiene permiso para ver esta sección.</p>
              <Link to="/" className="btn btn-success rounded-pill px-4">Volver al inicio</Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return <Outlet />;
};
