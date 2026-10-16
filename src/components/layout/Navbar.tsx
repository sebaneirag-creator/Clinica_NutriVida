import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useCarrito } from "../../context/CarritoContext";
import { permisos } from "../../utils/roles";
import { BadgeRol } from "../ui/BadgeRol";

// text-nowrap evita que los textos se partan en dos líneas
const claseNav = ({ isActive }: { isActive: boolean }) =>
  `nav-link text-nowrap d-inline-flex align-items-center gap-1${isActive ? " active fw-semibold" : ""}`;

export const Navbar = () => {
  const { usuario, rol, logout } = useAuth();
  const { totalUnidades } = useCarrito();
  const [abierto, setAbierto] = useState(false);
  const [menuUsuario, setMenuUsuario] = useState(false);
  const refMenu = useRef<HTMLLIElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Al navegar se cierran el menú móvil y el menú de usuario
  useEffect(() => {
    setAbierto(false);
    setMenuUsuario(false);
  }, [location.key]);

  // El menú de usuario se cierra al hacer clic fuera o presionar Escape
  useEffect(() => {
    if (!menuUsuario) return;
    const fuera = (e: MouseEvent) => {
      if (refMenu.current && !refMenu.current.contains(e.target as Node)) setMenuUsuario(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuUsuario(false);
    };
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", escape);
    };
  }, [menuUsuario]);

  const cerrarSesion = () => {
    logout();
    navigate("/");
  };

  return (
    <header>
      {/* navbar-expand-xl: el menú completo solo se muestra en pantallas anchas, así nada se aprieta */}
      <nav className="navbar navbar-expand-xl navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src="/assets/img/icons/logo.png" alt="NutriVida" className="brand-logo" />
            <span className="brand-text">Clínica NutriVida</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            aria-expanded={abierto}
            aria-controls="navbarNav"
            aria-label="Mostrar menú"
            onClick={() => setAbierto(!abierto)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${abierto ? "show" : ""}`} id="navbarNav">
            {/* Enlaces de navegación */}
            <ul className="navbar-nav mx-xl-auto align-items-xl-center gap-xl-2">
              <li className="nav-item">
                <NavLink className={claseNav} to="/" end>Inicio</NavLink>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-nowrap" to="/#nosotros">Quiénes somos</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-nowrap" to="/#contacto">Contáctanos</Link>
              </li>
              <li className="nav-item">
                <NavLink className={claseNav} to="/servicios">Servicios</NavLink>
              </li>
              {permisos.accederAdministracion(rol) && (
                <li className="nav-item">
                  <NavLink className={claseNav} to="/admin">
                    <i className="bi bi-gear"></i>Administración
                  </NavLink>
                </li>
              )}
            </ul>

            {/* Acciones: reserva y cuenta */}
            <ul className="navbar-nav align-items-xl-center gap-2 mt-3 mt-xl-0">
              <li className="nav-item">
                <Link className="btn btn-success rounded-pill px-3 text-nowrap d-inline-flex align-items-center gap-2" to="/carrito">
                  <i className="bi bi-cart2"></i>Mi reserva
                  {totalUnidades > 0 && (
                    <span className="badge bg-danger rounded-pill badge-carrito">{totalUnidades}</span>
                  )}
                </Link>
              </li>

              {usuario ? (
                <li className="nav-item dropdown" ref={refMenu}>
                  <button
                    type="button"
                    className="btn d-inline-flex align-items-center gap-2 text-nowrap rounded-pill border bg-white px-3 py-1"
                    aria-haspopup="true"
                    aria-expanded={menuUsuario}
                    onClick={() => setMenuUsuario(!menuUsuario)}
                  >
                    <i className="bi bi-person-circle fs-5 text-success"></i>
                    <span className="fw-medium">{usuario.nombre}</span>
                    <i className={`bi bi-chevron-${menuUsuario ? "up" : "down"} small text-muted`}></i>
                  </button>
                  <ul
                    data-bs-popper="static"
                    className={`dropdown-menu dropdown-menu-end shadow border-0 rounded-3 p-2${menuUsuario ? " show" : ""}`}
                    style={{ minWidth: 220 }}
                  >
                    <li className="px-3 py-2">
                      <div className="fw-semibold text-dark text-nowrap">
                        {usuario.nombre} {usuario.apellido}
                      </div>
                      <div className="text-muted small text-nowrap mb-2">{usuario.correo}</div>
                      <BadgeRol rol={usuario.rol} />
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <Link className="dropdown-item rounded-2" to="/perfil">
                        <i className="bi bi-person me-2"></i>Mi perfil
                      </Link>
                    </li>
                    <li>
                      <button type="button" className="dropdown-item rounded-2 text-danger" onClick={cerrarSesion}>
                        <i className="bi bi-box-arrow-right me-2"></i>Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link text-nowrap d-inline-flex align-items-center gap-1" to="/login">
                    <i className="bi bi-box-arrow-in-right"></i>Iniciar sesión
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
