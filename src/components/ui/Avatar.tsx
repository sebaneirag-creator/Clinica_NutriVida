// Avatar genérico (opcional según el enunciado)
export const Avatar = ({ tamano = 96 }: { tamano?: number }) => (
  <div
    className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center"
    style={{ width: tamano, height: tamano }}
  >
    <i className="bi bi-person-fill" style={{ fontSize: tamano * 0.55 }}></i>
  </div>
);
