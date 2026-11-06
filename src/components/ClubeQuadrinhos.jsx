import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { communities } from "../data/community.js";

function ClubeQuadrinhos() {
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [newCommunity, setNewCommunity] = useState({ name: "", description: "", icon: "", privacy: "Pública" });
  const [allCommunities, setAllCommunities] = useState(communities);
  const filteredCommunities = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    if (!query) return allCommunities;
    return allCommunities.filter((community) =>
      `${community.name} ${community.description}`.toLocaleLowerCase("pt-BR").includes(query)
    );
  }, [allCommunities, search]);

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
      topics: [],
      category: "Geral"
    };
    setAllCommunities((current) => [community, ...current]);
    setNewCommunity({ name: "", description: "", icon: "", privacy: "Pública" });
    setShowCreate(false);
    navigate(`/comunidade/clube/${community.id}`, { state: { community, isMember: true } });
  };

  return (
    <div className="club-section">
      <div className="club-list-heading">
        <div><p className="section-kicker">Comunidade</p><h1>Clubes dos Quadrinhos</h1></div>
        <div className="club-list-actions">
          <label className="club-search">
            <span aria-hidden="true">⌕</span>
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar clubes..." aria-label="Buscar clubes" />
          </label>
          <button className="primary-button" type="button" onClick={() => setShowCreate(true)}>+ Criar Comunidade</button>
        </div>
      </div>

      {showCreate && (
        <form className="modal-card create-form" onSubmit={createCommunity}>
          <div className="modal-heading"><div><p className="section-kicker">Novo espaço</p><h3>Criar comunidade</h3></div><button type="button" onClick={() => setShowCreate(false)} aria-label="Fechar">×</button></div>
          <label>Nome<input required value={newCommunity.name} onChange={(event) => setNewCommunity({ ...newCommunity, name: event.target.value })} placeholder="Ex.: Clube de desenhos" /></label>
          <label>Descrição<textarea required value={newCommunity.description} onChange={(event) => setNewCommunity({ ...newCommunity, description: event.target.value })} placeholder="Descreva o propósito da comunidade" /></label>
          <label>Ícone<input type="url" value={newCommunity.icon} onChange={(event) => setNewCommunity({ ...newCommunity, icon: event.target.value })} placeholder="URL da imagem" /></label>
          <label>Tipo de privacidade<select value={newCommunity.privacy} onChange={(event) => setNewCommunity({ ...newCommunity, privacy: event.target.value })}><option>Pública</option><option>Moderada</option></select></label>
          <div className="form-actions"><button className="ghost-button" type="button" onClick={() => setShowCreate(false)}>Cancelar</button><button className="primary-button" type="submit">Criar comunidade</button></div>
        </form>
      )}

      {filteredCommunities.length ? (
        <div className="community-grid">
        {filteredCommunities.map((community) => (
          <article className="community-card" key={community.id}>
            <img src={community.icon} alt="" />
            <div className="community-card-body">
              <div className="community-card-top"><span className={`privacy-badge ${community.privacy.toLowerCase()}`}>{community.privacy}</span><span className="role-badge">{community.role}</span></div>
              <h3>{community.name}</h3>
              <p>{community.description}</p>
              <div className="community-card-footer"><span>✦ {community.members.toLocaleString("pt-BR")} membros</span><Link to={`/comunidade/clube/${community.id}`} state={{ community }}>Ver clube →</Link></div>
            </div>
          </article>
        ))}
        </div>
      ) : <p className="club-empty-state">Nenhum clube encontrado para “{search}”.</p>}
    </div>
  );
}

export default ClubeQuadrinhos;
