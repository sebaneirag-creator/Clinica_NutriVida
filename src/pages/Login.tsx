import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const correoLimpio = correo.trim();

    if (!correoLimpio || !contrasena) {
      setError("Debes completar todos los campos");
      return;
    }
    if (!correoLimpio.endsWith("@duocuc.cl")) {
      setError("El correo debe ser del dominio @duocuc.cl");
      return;
    }

    const resultado = login(correoLimpio, contrasena);
    if (resultado) {
      setError(resultado);
      return;
    }
    navigate("/");
  };

  return (
    <main className="pt-5">
      <section className="py-4 py-md-5">
        <div className="container">
          <div className="card-auth">
            <div className="card-body p-4 p-md-5">
              <div className="text-center">
                <div className="auth-icon"><i className="bi bi-person-circle"></i></div>
                <h1 className="auth-title">Iniciar sesión</h1>
                <p className="auth-subtitle">Ingresa tus datos para acceder a tu cuenta</p>
              </div>

              <form onSubmit={enviar}>
                <div className="mb-3">
                  <label htmlFor="correo" className="form-label">Correo electrónico</label>
                  <input type="email" className="form-control" id="correo" placeholder="correo@duocuc.cl" value={correo} onChange={(e) => setCorreo(e.target.value)} />
                </div>
                <div className="mb-4">
                  <label htmlFor="inputPass" className="form-label">Contraseña</label>
                  <input type="password" className="form-control" id="inputPass" placeholder="••••••••" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
                </div>
                <div className="d-grid mb-3">
                  <button type="submit" className="btn btn-success btn-lg">
                    <i className="bi bi-box-arrow-in-right me-2"></i>Iniciar sesión
                  </button>
                </div>
              </form>

              {error && <div className="alert alert-danger">{error}</div>}

              <div className="text-center pt-2">
                <p className="mb-0 text-secondary">
                  ¿No tienes una cuenta? <Link to="/registro" className="auth-link">Crear cuenta</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
