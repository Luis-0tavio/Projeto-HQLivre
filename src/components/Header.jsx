import { Link } from "react-router-dom";

function Header({ readerPoints }) {
  return (
    <header className="site-header">
      <Link className="logo" to="/" aria-label="HQLivre - Início">
        HQLivre
      </Link>

      <nav className="main-nav" aria-label="Navegação principal">
        <Link to="/">Início</Link>
        <a href="/#catalogo">Catálogo</a>
        <Link to="/comunidade">Comunidade</Link>
      </nav>

      <div className="reader-points" aria-label="Saldo de pontos do leitor">
        <span>Saldo de Pontos</span>
        <strong>{readerPoints}</strong>
      </div>
    </header>
  );
}

export default Header;
