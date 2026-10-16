import { Link } from "react-router";
import { ContactoForm } from "../components/contacto/ContactoForm";

const destacados = [
  { codigo: "CN001", icono: "bi-heart-pulse", titulo: "Primera consulta nutricional", texto: "Primera evaluación nutricional completa para diseñar tu plan personalizado.", precio: "$35.000" },
  { codigo: "PL001", icono: "bi-clipboard2-pulse", titulo: "Plan de pérdida de peso", texto: "Plan de alimentación de 1 mes con seguimiento y ajustes semanales.", precio: "$65.000" },
  { codigo: "EV001", icono: "bi-activity", titulo: "Antropometría completa", texto: "Evaluación completa de composición corporal con mediciones detalladas.", precio: "$18.000" },
];

const equipo = [
  { img: "nut1.png", nombre: "Carolina Fuentes M.", rol: "Especialista en obesidad y síndrome metabólico" },
  { img: "nut2.png", nombre: "Rodrigo Sepúlveda A.", rol: "Especialista en nutrición deportiva y rendimiento" },
  { img: "nut3.png", nombre: "Daniela Morales C.", rol: "Especialista en alimentación vegetariana, vegana y trastornos alimentarios" },
  { img: "nut4.png", nombre: "Felipe Araya R.", rol: "Especialista en nutrición pediátrica y familiar" },
];

const contactos = [
  { icono: "bi-geo-alt", titulo: "Dirección", contenido: <p>Milano 01591, Temuco</p> },
  { icono: "bi-telephone", titulo: "Teléfono", contenido: <p><a href="tel:+56912345678">+56 9 1234 5678</a></p> },
  { icono: "bi-envelope", titulo: "Correo", contenido: <p><a href="mailto:contacto@nutrivida.cl">contacto@nutrivida.cl</a></p> },
  { icono: "bi-clock", titulo: "Horario", contenido: <p>Lun - Vie: 9:00 - 18:00</p> },
];

const Inicio = () => {
  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <img src="/assets/img/icons/logo.png" alt="NutriVida" className="hero-logo" />
            <h1 className="hero-title">Alimenta Tu Bienestar<br />Transforma Tu Salud</h1>
            <p className="hero-subtitle">
              En NutriVida te acompañamos con atención nutricional personalizada para
              alcanzar tus objetivos y construir hábitos saludables.
            </p>
            <Link to="/servicios" className="btn btn-accent btn-lg mt-3">Reservar servicio</Link>
          </div>

          <div className="row g-4 justify-content-center">
            {destacados.map((d) => (
              <div className="col-md-4" key={d.codigo}>
                <div className="card card-servicio">
                  <div className="card-body">
                    <div className="card-icon"><i className={`bi ${d.icono}`}></i></div>
                    <h5 className="card-title">{d.titulo}</h5>
                    <p className="card-text">{d.texto}</p>
                    <div className="card-price">{d.precio}</div>
                    <Link to={`/servicios/${d.codigo}`} className="btn">Ver más</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className="py-section bg-alt">
        <div className="container">
          <h2 className="section-title">Quiénes Somos</h2>
          <p className="section-subtitle mb-5">Conoce al equipo detrás de NutriVida</p>

          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4 mb-lg-0 pe-lg-4">
              <h3 className="subsection-title mb-3">Nuestra Historia</h3>
              <p className="history-text">
                Somos el equipo de NutriVida, una clínica de nutrición y dietética fundada
                en 2016 en Temuco. Contamos con 4 nutricionistas certificados cuyo propósito
                es entregar orientación nutricional personalizada y promover hábitos
                saludables, ayudando a cada paciente a alcanzar sus objetivos de bienestar.
              </p>
            </div>
            <div className="col-lg-6 text-center">
              <img src="/assets/img/team.png" alt="Nutricionista NutriVida" className="img-fluid rounded-4 history-img" />
            </div>
          </div>

          <h3 className="subsection-title text-center mt-5 mb-2">Nuestro Equipo</h3>
          <p className="section-subtitle">Profesionales comprometidos con tu salud</p>
          <div className="row g-4 justify-content-center">
            {equipo.map((n) => (
              <div className="col-md-6 col-lg-3" key={n.img}>
                <div className="card card-equipo h-100 text-center">
                  <div className="card-body">
                    <img src={`/assets/img/${n.img}`} alt={`Nut. ${n.nombre}`} className="equipo-avatar" />
                    <h5 className="card-title">{n.nombre}</h5>
                    <p className="card-text text-muted">{n.rol}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-section">
        <div className="container">
          <h2 className="section-title">Contáctanos</h2>
          <p className="section-subtitle">Estamos aquí para ayudarte. Envíanos tu consulta.</p>

          <div className="row g-4 g-lg-5">
            <div className="col-lg-6">
              <div className="card card-contacto h-100">
                <div className="card-body p-4 p-lg-5">
                  <h4 className="contacto-card-title mb-4">Envíanos un mensaje</h4>
                  <ContactoForm />
                </div>
              </div>
            </div>

            <div className="col-lg-6 d-flex flex-column">
              <div className="card card-contacto mb-4">
                <div className="card-body p-4 p-lg-4">
                  <h4 className="contacto-card-title mb-4">Información de contacto</h4>
                  {contactos.map((c, i) => (
                    <div className={`contact-item${i === contactos.length - 1 ? " mb-0" : ""}`} key={c.titulo}>
                      <div className="contact-icon"><i className={`bi ${c.icono}`}></i></div>
                      <div className="contact-info">
                        <strong>{c.titulo}</strong>
                        {c.contenido}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card card-contacto flex-grow-1 overflow-hidden">
                <div className="map-responsive">
                  <iframe
                    title="Ubicación NutriVida"
                    src="https://www.google.com/maps/embed?pb=!1m21!1m12!1m3!1d449.3127921749834!2d-72.62761412843615!3d-38.759737890809305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m6!3e3!4m0!4m3!3m2!1d-38.75973853338196!2d-72.62755234923134!5e0!3m2!1ses-419!2scl!4v1788635136026!5m2!1ses-419!2scl"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="row align-items-center justify-content-center g-5">
            <div className="col-lg-3 text-center">
              <img src="/assets/img/doctora1.png" alt="Nutricionista NutriVida" className="cta-img" />
            </div>
            <div className="col-lg-5">
              <div className="cta-text-box">
                <h2>¿Listo para empezar?</h2>
                <p>Reserva tu primera consulta y descubre cómo podemos mejorar tu calidad de vida.</p>
                <Link to="/servicios/CN001" className="btn btn-accent btn-lg">Reserva tu primera consulta</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Inicio;
