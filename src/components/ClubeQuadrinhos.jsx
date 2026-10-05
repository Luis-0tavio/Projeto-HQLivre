import { useState } from "react";
import { communities } from "../data/community.js";
import TopicoForum from "./TopicoForum.jsx";

function ClubeQuadrinhos() {
  const [selectedCommunity, setSelectedCommunity] = useState(communities[0]);
  const [showCreate, setShowCreate] = useState(false);
  const [newCommunity, setNewCommunity] = useState({ name: "", description: "", icon: "", privacy: "Pública" });
  const [allCommunities, setAllCommunities] = useState(communities);

  const createCommunity = (event) => {
    event.preventDefault();
    const community = {
      id: Date.now(),
      name: newCommunity.name,
      description: newCommunity.description,
      members: 1,
      icon: newCommunity.icon || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80",
      privacy: newCommunity.privacy,
      role: "Dono",
      owner: "Alex R.",
      topics: []
    };
    setAllCommunities((current) => [community, ...current]);
    setSelectedCommunity(community);
    setNewCommunity({ name: "", description: "", icon: "", privacy: "Pública" });
    setShowCreate(false);
  };

  return (
    <div className="club-section">
      <div className="content-heading">
        <div><p className="section-kicker">Clube dos Quadrinhos</p><h2>Comunidades em destaque</h2></div>
        <button className="primary-button" type="button" onClick={() => setShowCreate(true)}>+ Criar Comunidade</button>
      </div>

      {showCreate && (
        <form className="modal-card create-form" onSubmit={createCommunity}>
          <div className="modal-heading"><div><p className="section-kicker">Novo espaço</p><h3>Criar comunidade</h3></div><button type="button" onClick={() => setShowCreate(false)} aria-label="Fechar">×</button></div>
          <label>Nome<input required value={newCommunity.name} onChange={(event) => setNewCommunity({ ...newCommunity, name: event.target.value })} placeholder="Ex.: Clube de desenhos" /></label>
          <label>Descrição<textarea required value={newCommunity.description} onChange={(event) => setNewCommunity({ ...newCommunity, description: event.target.value })} placeholder="Descreva o propósito da comunidade" /></label>
          <label>Ícone<input type="url" value={newCommunity.icon} onChange={(event) => setNewCommunity({ ...newCommunity, icon: event.target.value })} placeholder="URL da imagem" /></label>
          <label>Tipo de privacidade<select value={newCommunity.privacy} onChange={(event) => setNewCommunity({ ...newCommunity, privacy: event.target.value })}><option>Pública</option><option>Restrita</option></select></label>
          <div className="form-actions"><button className="ghost-button" type="button" onClick={() => setShowCreate(false)}>Cancelar</button><button className="primary-button" type="submit">Criar comunidade</button></div>
        </form>
      )}

      <div className="community-grid">
        {allCommunities.map((community) => (
          <article className="community-card" key={community.id}>
            <img src={community.icon} alt="" />
            <div className="community-card-body">
              <div className="community-card-top"><span className={`privacy-badge ${community.privacy.toLowerCase()}`}>{community.privacy}</span><span className="role-badge">{community.role}</span></div>
              <h3>{community.name}</h3>
              <p>{community.description}</p>
              <div className="community-card-footer"><span>✦ {community.members.toLocaleString("pt-BR")} membros</span><button type="button" onClick={() => setSelectedCommunity(community)}>Entrar</button></div>
            </div>
          </article>
        ))}
      </div>

      <div className="community-detail">
        <div className="community-detail-header">
          <img src={selectedCommunity.icon} alt="" />
          <div><span className={`privacy-badge ${selectedCommunity.privacy.toLowerCase()}`}>{selectedCommunity.privacy}</span><h2>{selectedCommunity.name}</h2><p>{selectedCommunity.description}</p><div className="community-stats"><span>✦ {selectedCommunity.members.toLocaleString("pt-BR")} membros</span><span>⌂ {selectedCommunity.owner}</span></div></div>
          <span className="role-badge">{selectedCommunity.role}</span>
        </div>
        <TopicoForum community={selectedCommunity} />
      </div>
    </div>
  );
}

export default ClubeQuadrinhos;
