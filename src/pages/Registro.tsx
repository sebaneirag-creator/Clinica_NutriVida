import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Campo } from "../components/ui/Campo";
import { CamposPersonales } from "../components/usuarios/CamposPersonales";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import type { DatosPersonales } from "../types/Usuario";
import { validarContrasenas, validarDatosPersonales } from "../utils/validaciones";

const datosVacios: DatosPersonales = {
  nombre: "", apellido: "", correo: "", fechaNacimiento: "", genero: "", region: "", direccion: "",
};

const Registro = () => {
  const { registrar } = useAuth();
  const { mostrar } = useToast();
  const navigate = useNavigate();
  const [datos, setDatos] = useState<DatosPersonales>(datosVacios);
  const [contrasena, setContrasena] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "danger" } | null>(null);

  const error = (texto: string) => setMensaje({ texto, tipo: "danger" });

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    const errorDatos = validarDatosPersonales(datos);
    if (errorDatos) return error(errorDatos);

    const errorClave = validarContrasenas(contrasena, confirmacion);
    if (errorClave) return error(errorClave);

    if (!aceptaTerminos) return error("Debes aceptar los términos y condiciones para registrarte");

    // El registro público siempre crea cuentas de cliente (lo fuerza el contexto)
    const resultado = registrar({ ...datos, contrasena });
    if (resultado) return error(resultado);

    mostrar("Cuenta creada con éxito. Ahora puedes iniciar sesión.", "success");
    navigate("/login");
  };

  return (
    <main className="pt-5">
      <section className="py-4 py-md-5">
        <div className="container">
          <div className="card-auth">
            <div className="card-body p-4 p-md-5">
              <div className="text-center">
                <div className="auth-icon"><i className="bi bi-person-plus"></i></div>
                <h1 className="auth-title">Crear cuenta</h1>
                <p className="auth-subtitle">Regístrate para acceder a nuestros servicios</p>
              </div>

              <form onSubmit={enviar} noValidate>
                <div className="row g-3">
                  <CamposPersonales datos={datos} onCambio={(campo, valor) => setDatos((d) => ({ ...d, [campo]: valor }))} />
                  <Campo id="pass" etiqueta="Contraseña" obligatorio className="col-md-6">
                    <input type="password" className="form-control" id="pass" placeholder="••••••••" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
                  </Campo>
                  <Campo id="confirmPass" etiqueta="Confirmar contraseña" obligatorio className="col-md-6">
                    <input type="password" className="form-control" id="confirmPass" placeholder="••••••••" value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} />
                  </Campo>
                  <div className="col-12">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="aceptaTerminos" checked={aceptaTerminos} onChange={(e) => setAceptaTerminos(e.target.checked)} />
                      <label className="form-check-label" htmlFor="aceptaTerminos">
                        Acepto los términos y condiciones de registro<span className="obligatorio">*</span>
                      </label>
                    </div>
                  </div>
                  <div className="d-grid mt-2">
                    <button type="submit" className="btn btn-success btn-lg">
                      <i className="bi bi-person-plus me-2"></i>Crear cuenta
                    </button>
                  </div>
                </div>
              </form>

              {mensaje && <div className={`alert alert-${mensaje.tipo} mt-3`}>{mensaje.texto}</div>}

              <div className="text-center mt-3 pt-2">
                <p className="mb-0 text-secondary">
                  ¿Ya tienes una cuenta? <Link to="/login" className="auth-link">Iniciar sesión</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Registro;
