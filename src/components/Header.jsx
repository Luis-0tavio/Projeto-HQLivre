import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/autenticacao_provider.jsx";

function Header({ readerPoints }) {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="site-header">
      <Link className="logo" to="/" aria-label="HQLivre - Início">
        HQLivre
      </Link>

      <nav className="main-nav" aria-label="Navegação principal">
        <Link to="/">Início</Link>
        <a href="/#catalogo">Catálogo</a>
        <Link to="/comunidade">Comunidade</Link>
        {user && <Link to="/perfil">Perfil</Link>}
      </nav>

      <div className="reader-points" aria-label="Saldo de pontos do leitor">
        <span>Saldo de Pontos</span>
        <strong>{readerPoints}</strong>
      </div>

      <div className="profile">
        {loading ? (
          <span className="profile-status">Verificando sessão...</span>
        ) : user ? (
          <>
            <span className="profile-email" title={user.email}>
              {user.email}
            </span>
            <button className="btn_ES" type="button" onClick={() => signOut()}>
              Sair
            </button>
          </>
        ) : (
          <button className="btn_ES" type="button" onClick={() => navigate("/login")}>
            Entrar
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
