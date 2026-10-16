import { Link } from "react-router";

const NoEncontrado = () => {
  return (
    <main className="pt-5">
      <section className="py-5 mt-2">
        <div className="container text-center">
          <h1 className="fw-bold text-dark">Página no encontrada</h1>
          <p className="text-muted mb-4">La dirección que buscas no existe.</p>
          <Link to="/" className="btn btn-success rounded-pill px-4">Volver al inicio</Link>
        </div>
      </section>
    </main>
  );
};

export default NoEncontrado;
