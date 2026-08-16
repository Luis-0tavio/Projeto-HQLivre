function Header({ readerPoints }) {
  return (
    <header className="site-header">
      <a className="logo" href="#inicio" aria-label="HQLivre - Início">
        HQLivre
      </a>

      <nav className="main-nav" aria-label="Navegação principal">
        <a href="#inicio">Início</a>
        <a href="#catalogo">Catálogo</a>
        <a href="#comunidade">Comunidade</a>
      </nav>

      <div className="reader-points" aria-label="Saldo de pontos do leitor">
        <span>Saldo de Pontos</span>
        <strong>{readerPoints}</strong>
      </div>
    </header>
  );
}

export default Header;
