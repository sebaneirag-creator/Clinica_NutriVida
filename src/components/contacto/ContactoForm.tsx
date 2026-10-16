import { useState, type FormEvent } from "react";
import { Modal } from "../ui/Modal";

export const ContactoForm = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
      setError("Nombre, correo y mensaje son obligatorios");
      return;
    }
    if (nombre.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      return;
    }
    if (!email.trim().endsWith("@duocuc.cl")) {
      setError("El dominio del correo debe ser @duocuc.cl");
      return;
    }

    setExito(true);
    setNombre("");
    setEmail("");
    setTelefono("");
    setMensaje("");
  };

  return (
    <>
      <form onSubmit={enviar}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre completo<span className="obligatorio">*</span>
          </label>
          <input type="text" className="form-control" id="nombre" placeholder="Tu nombre" required minLength={2} maxLength={50} value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Correo electrónico<span className="obligatorio">*</span>
          </label>
          <input type="email" className="form-control" id="email" placeholder="correo@correo.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="telefono" className="form-label">Teléfono</label>
          <input type="tel" className="form-control" id="telefono" placeholder="+56 9 1234 5678" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        </div>
        <div className="mb-4">
          <label htmlFor="mensaje" className="form-label">
            Mensaje<span className="obligatorio">*</span>
          </label>
          <textarea className="form-control" id="mensaje" rows={4} placeholder="Escribe tu mensaje aquí..." required minLength={10} maxLength={500} value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-contacto w-100">Enviar Mensaje</button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <Modal abierto={exito} onCerrar={() => setExito(false)}>
        <div className="text-center p-4">
          <div className="mb-3">
            <i className="bi bi-check-circle text-success" style={{ fontSize: "3rem" }}></i>
          </div>
          <h4 className="fw-bold text-dark mb-2">¡Mensaje enviado!</h4>
          <p className="text-muted mb-4">Gracias por escribirnos. Te responderemos a la brevedad.</p>
          <button type="button" className="btn btn-success rounded-pill px-5" onClick={() => setExito(false)}>
            Entendido
          </button>
        </div>
      </Modal>
    </>
  );
};
