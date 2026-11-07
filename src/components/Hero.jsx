import { Link } from "react-router-dom";

function Hero() {
  return (
    <section id="inicio" className="hero-section">
      <div className="hero-content">
        <p className="hero-kicker">Plataforma aberta para quadrinistas independentes</p>
        <h1>Sua HQ, seu público, sua história.</h1>
        <p>
          Publique, descubra leitores e cresça com uma comunidade feita para
          valorizar autores de todos os níveis.
        </p>
        <Link className="primary-button" to="/publicar">
          Poste sua HQ gratuitamente
        </Link>
      </div>
    </section>
  );
}

export default Hero;
