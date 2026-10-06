import { Link, useParams } from "react-router-dom";
import { communities } from "../data/community.js";

const members = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
];

function ClubeDetalhe() {
  const { clubId } = useParams();
  const club = communities.find((community) => community.id === Number(clubId));

  if (!club) {
    return (
      <main className="club-detail-not-found">
        <h1>Clube não encontrado</h1>
        <Link className="primary-button" to="/comunidade">Voltar aos clubes</Link>
      </main>
    );
  }

  return (
    <main className="club-detail-page">
      <div className="club-detail-topbar">
        <Link className="secondary-button" to="/comunidade">← Voltar aos Clubes</Link>
        <span>Clube dos Quadrinhos</span>
      </div>

      <div className="club-detail-layout">
        <aside className="club-profile-panel">
          <img className="club-profile-cover" src={club.icon} alt="" />
          <div className="club-profile-content">
            <div className="club-profile-role"><span>{club.role}</span><span className={`privacy-badge ${club.privacy.toLowerCase()}`}>{club.privacy}</span></div>
            <h1>{club.name}</h1>
            <p>{club.description}</p>
            <button className="primary-button club-join-button" type="button">Participar</button>
            <div className="club-profile-meta">
              <strong>{club.members.toLocaleString("pt-BR")}</strong>
              <span>membros</span>
            </div>
            <div className="club-members">
              <div className="member-avatars">
                {members.map((member, index) => <img key={member} src={member} alt={`Membro ${index + 1}`} />)}
                <span>+12</span>
              </div>
              <small>Uma comunidade de leitores e autores</small>
            </div>
            <div className="club-owner"><span>⌂</span><div><small>Fundado por</small><strong>{club.owner}</strong></div></div>
          </div>
        </aside>

        <section className="club-forum">
          <div className="club-forum-heading">
            <div><p className="section-kicker">Fórum do clube</p><h2>Discussões recentes</h2></div>
            <button className="primary-button" type="button">+ Criar Novo Tópico</button>
          </div>

          <div className="forum-table-wrap">
            <table className="forum-table">
              <thead><tr><th>Tópico</th><th>Respostas</th><th>Última publicação</th></tr></thead>
              <tbody>
                {club.topics.map((topic) => (
                  <tr key={topic.id}>
                    <td><div className="topic-title"><span>✦</span><div><strong>{topic.title}</strong><small>por {topic.author}</small></div></div></td>
                    <td><span className="reply-count">{topic.replies}</span></td>
                    <td><time>{topic.date}</time></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="club-forum-footer"><span>Mostrando {club.topics.length} tópicos</span><button type="button">Ver tópicos antigos →</button></div>
        </section>
      </div>
    </main>
  );
}

export default ClubeDetalhe;
