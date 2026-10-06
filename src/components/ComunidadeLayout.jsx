import { useState } from "react";
import { Link } from "react-router-dom";
import CommunityQA from "./CommunityQA.jsx";
import ClubeQuadrinhos from "./ClubeQuadrinhos.jsx";
import FanartMural from "./FanartMural.jsx";

const sections = [
  { id: "qa", label: "Perguntas e Respostas", icon: "?" },
  { id: "clube", label: "Clube dos Quadrinhos", icon: "◆" },
  { id: "fanarts", label: "Mural de Fanarts", icon: "✦" }
];

function ComunidadeLayout() {
  const [activeSection, setActiveSection] = useState("qa");

  return (
    <main className="community-page">
      <header className="community-hero">
        <div>
          <p className="section-kicker">Área da comunidade</p>
          <h1>Crie, aprenda e compartilhe.</h1>
          <p>Um espaço para autores, leitores e artistas independentes.</p>
        </div>
        <Link className="secondary-button" to="/">← Voltar para o Catálogo</Link>
      </header>

      <div className="community-layout">
        <aside className="community-sidebar-shell">
          <div className="community-sidebar">
            <div className="community-profile">
              <span className="avatar">AR</span>
              <div><strong>Alex R.</strong><small>Leitor em formação</small></div>
            </div>
            <nav className="community-menu" aria-label="Navegação da comunidade">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className={activeSection === section.id ? "active" : ""}
                  onClick={() => setActiveSection(section.id)}
                >
                  <span>{section.icon}</span>{section.label}
                </button>
              ))}
            </nav>
            <div className="community-sidebar-note">
              <span>✦</span>
              <p><strong>Contribua com a comunidade</strong>Seu conhecimento ajuda outras pessoas a criar.</p>
            </div>
          </div>
        </aside>

        <section className="community-content">
          {activeSection === "qa" && <CommunityQA />}
          {activeSection === "clube" && <ClubeQuadrinhos />}
          {activeSection === "fanarts" && <FanartMural />}
        </section>
      </div>
    </main>
  );
}

export default ComunidadeLayout;
