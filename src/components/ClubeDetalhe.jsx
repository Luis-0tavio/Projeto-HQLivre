import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { communities } from "../data/community.js";

const members = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
];

const filters = [
  { id: "all", label: "Todos" },
  { id: "question", label: "Perguntas & Dúvidas" },
  { id: "debate", label: "Debates" },
  { id: "collaboration", label: "Colaborações" }
];

const topicKinds = {
  question: "Dúvida",
  debate: "Debate",
  collaboration: "Colaboração"
};

const chatChannels = [
  { id: "geral", label: "💬  # chat-geral" },
  { id: "rascunhos", label: "🎨  # wip-rascunhos" },
  { id: "equipe", label: "🤝  # procuro-equipe" }
];

const initialChatMessages = {
  geral: [
    { id: "welcome", author: "Marta S.", level: "Mestre", avatar: members[0], time: "14:02", text: "Bem-vindos! Qual projeto vocês estão criando esta semana?", reactions: [{ emoji: "🔥", count: 4 }, { emoji: "👏", count: 2 }] },
    { id: "general-1", author: "Ravi Torres", level: "Iniciante", avatar: members[1], time: "14:05", text: "Terminei o roteiro do primeiro capítulo, finalmente! ✨", reactions: [{ emoji: "🎉", count: 3 }] },
    { id: "general-2", author: "Nina Campos", level: "Em Ascensão", avatar: members[2], time: "14:08", text: "Que conquista, Ravi! Se quiser, posso ler e dar uma opinião." }
  ],
  rascunhos: [
    { id: "wip-1", author: "Lia Rocha", level: "Mestre", avatar: members[2], time: "13:54", text: "Estudo rápido de composição para uma página de suspense. Ainda decidindo a ordem dos quadros:", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=720&q=80", reactions: [{ emoji: "🔥", count: 4 }, { emoji: "👀", count: 2 }] },
    { id: "wip-2", author: "Theo Lara", level: "Lendário", avatar: members[3], time: "14:01", text: "O contraste do quadro central está funcionando muito bem!" }
  ],
  equipe: [
    { id: "team-1", author: "João Mirai", level: "Iniciante", avatar: members[1], time: "13:48", text: "Procuro alguém para ilustrar um conto curto de fantasia. Já tenho o roteiro fechado." },
    { id: "team-2", author: "Tainá Lima", level: "Mestre", avatar: members[0], time: "13:52", text: "Tenho disponibilidade! Me chama para conversarmos sobre o estilo." }
  ]
};

const pollOptions = [
  { id: "endings", label: "Criar finais", votes: 18 },
  { id: "dialogue", label: "Diálogos naturais", votes: 27 },
  { id: "panels", label: "Ritmo dos quadros", votes: 15 }
];

function ClubeDetalhe() {
  const { clubId } = useParams();
  const location = useLocation();
  const club = communities.find((community) => community.id === Number(clubId)) || location.state?.community;
  const [topics, setTopics] = useState(() => club?.topics || []);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [isMember, setIsMember] = useState(Boolean(location.state?.isMember));
  const [membershipPending, setMembershipPending] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: "", body: "", kind: "question" });
  const [reply, setReply] = useState("");
  const [activeMode, setActiveMode] = useState("forum");
  const [activeChannel, setActiveChannel] = useState("geral");
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [chatDraft, setChatDraft] = useState("");
  const [chatReactions, setChatReactions] = useState({});
  const [pollVote, setPollVote] = useState(null);
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [challengeEntry, setChallengeEntry] = useState("");
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);

  useEffect(() => {
    setTopics(club?.topics || []);
    setSelectedTopicId(null);
    setIsMember(Boolean(location.state?.isMember));
    setMembershipPending(false);
  }, [clubId, location.state, club]);

  if (!club) {
    return (
      <main className="club-detail-not-found">
        <h1>Clube não encontrado</h1>
        <Link className="primary-button" to="/comunidade">Voltar aos clubes</Link>
      </main>
    );
  }

  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId);
  const visibleTopics = topics.filter((topic) => activeFilter === "all" || topic.kind === activeFilter);
  const requiresApproval = club.privacy !== "Pública";

  function confirmMembership() {
    if (requiresApproval) setMembershipPending(true);
    else setIsMember(true);
    setShowJoinDialog(false);
  }

  function submitTopic(event) {
    event.preventDefault();
    const topic = {
      id: Date.now(),
      title: newTopic.title.trim(),
      author: "Alex R.",
      authorLevel: "Iniciante",
      date: "Agora",
      replies: 0,
      kind: newTopic.kind,
      body: newTopic.body.trim(),
      responses: []
    };
    setTopics((current) => [topic, ...current]);
    setNewTopic({ title: "", body: "", kind: "question" });
    setShowCreateTopic(false);
    setSelectedTopicId(topic.id);
  }

  function submitReply(event) {
    event.preventDefault();
    const text = reply.trim();
    if (!text || !selectedTopic) return;
    setTopics((current) => current.map((topic) => topic.id === selectedTopic.id
      ? {
          ...topic,
          replies: topic.replies + 1,
          responses: [...(topic.responses || []), { author: "Alex R.", level: "Iniciante", body: text }]
        }
      : topic
    ));
    setReply("");
  }

  function submitChatMessage(event) {
    event.preventDefault();
    const text = chatDraft.trim();
    if (!text) return;
    const message = {
      id: `local-${Date.now()}`,
      author: "Alex R.",
      level: "Iniciante",
      avatar: members[3],
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      text
    };
    setChatMessages((current) => ({ ...current, [activeChannel]: [...current[activeChannel], message] }));
    setChatDraft("");
  }

  function toggleChatReaction(messageId, emoji) {
    const key = `${messageId}-${emoji}`;
    setChatReactions((current) => ({ ...current, [key]: !current[key] }));
  }

  function submitChallenge(event) {
    event.preventDefault();
    if (!challengeEntry.trim()) return;
    setChallengeSubmitted(true);
    setShowChallengeForm(false);
  }

  function voteInPoll(optionId) {
    if (!pollVote) setPollVote(optionId);
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

            <dl className="club-facts">
              <div><dt>Categoria</dt><dd>{club.category || "Geral"}</dd></div>
              <div><dt>Idioma</dt><dd>Português</dd></div>
              <div><dt>Tipo</dt><dd>{requiresApproval ? "Moderada" : "Pública"}</dd></div>
              <div><dt>Dono</dt><dd>{club.owner}</dd></div>
              <div><dt>Local</dt><dd>Brasil</dd></div>
            </dl>

            {isMember ? (
              <div className="membership-actions">
                <span className="member-status">Membro ✓</span>
                <button className="ghost-button" type="button" onClick={() => setIsMember(false)}>Sair da comunidade</button>
              </div>
            ) : membershipPending ? (
              <button className="pending-membership" type="button" disabled>Aguardando aprovação</button>
            ) : (
              <button className="primary-button club-join-button" type="button" onClick={() => setShowJoinDialog(true)}>Participar</button>
            )}

            <div className="club-profile-meta">
              <strong>{(club.members + (isMember ? 1 : 0)).toLocaleString("pt-BR")}</strong>
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
          <nav className="club-mode-tabs" aria-label="Navegação do clube">
            <button type="button" className={activeMode === "forum" ? "active" : ""} onClick={() => setActiveMode("forum")}>📋 Fórum de Discussões</button>
            <button type="button" className={activeMode === "chat" ? "active" : ""} onClick={() => setActiveMode("chat")}>💬 Bate-papo ao Vivo</button>
            <button type="button" className={activeMode === "challenges" ? "active" : ""} onClick={() => setActiveMode("challenges")}>🏆 Desafios & Enquetes</button>
          </nav>

          {activeMode === "chat" ? (
            <div className="club-chat">
              <aside className="chat-channel-sidebar">
                <p>CANAIS DE TEXTO</p>
                {chatChannels.map((channel) => (
                  <button key={channel.id} type="button" className={activeChannel === channel.id ? "active" : ""} onClick={() => setActiveChannel(channel.id)}>
                    {channel.label}
                  </button>
                ))}
              </aside>
              <section className="chat-main" aria-label="Bate-papo do clube">
                <header className="chat-header">
                  <div><strong>#{chatChannels.find((channel) => channel.id === activeChannel)?.label.split("#")[1]?.trim()}</strong><small>Converse com a comunidade em tempo real</small></div>
                  <span className="online-count"><i />24 membros online agora</span>
                </header>
                <div className="chat-message-list" aria-live="polite">
                  {(chatMessages[activeChannel] || []).map((message) => (
                    <article className="chat-message" key={message.id}>
                      <img className="chat-avatar" src={message.avatar} alt="" />
                      <div className="chat-message-content">
                        <div className="chat-message-meta"><strong>{message.author}</strong><span className={`chat-level ${message.level.toLowerCase().replace(" ", "-")}`}>{message.level}</span><time>{message.time}</time></div>
                        <p>{message.text}</p>
                        {message.image && <img className="chat-attachment" src={message.image} alt="Prévia de um rascunho de HQ compartilhado no chat" />}
                        {(() => {
                          const reactions = [...(message.reactions || [])];
                          const hasApplause = reactions.some((reaction) => reaction.emoji === "👏");
                          const reactedWithApplause = Boolean(chatReactions[`${message.id}-👏`]);
                          if (!hasApplause && reactedWithApplause) reactions.push({ emoji: "👏", count: 0 });
                          return (reactions.length > 0 || message.author !== "Alex R.") && (
                          <div className="chat-reactions">
                            {reactions.map((reaction) => {
                              const reacted = Boolean(chatReactions[`${message.id}-${reaction.emoji}`]);
                              return <button key={reaction.emoji} type="button" className={reacted ? "reacted" : ""} aria-pressed={reacted} onClick={() => toggleChatReaction(message.id, reaction.emoji)}>{reaction.emoji} {reaction.count + (reacted ? 1 : 0)}</button>;
                            })}
                            <button type="button" className="add-reaction" onClick={() => toggleChatReaction(message.id, "👏")} aria-label="Reagir com palmas">＋</button>
                          </div>
                          );
                        })()}
                      </div>
                    </article>
                  ))}
                </div>
                <form className="chat-compose" onSubmit={submitChatMessage}>
                  <input aria-label="Nova mensagem" value={chatDraft} onChange={(event) => setChatDraft(event.target.value)} placeholder={`Conversar em #${chatChannels.find((channel) => channel.id === activeChannel)?.label.split("#")[1]?.trim()}...`} />
                  <button type="submit" disabled={!chatDraft.trim()} aria-label="Enviar mensagem">Enviar ↗</button>
                </form>
              </section>
            </div>
          ) : activeMode === "challenges" ? (
            <div className="club-challenges">
              <article className="weekly-challenge">
                <div className="challenge-sparkle" aria-hidden="true">✦</div>
                <span className="challenge-kicker">✦ DESAFIO ATIVO DA SEMANA</span>
                <h2>Crie uma cena de diálogo tenso em apenas 1 página</h2>
                <p>Construa a tensão com ritmo, pausas e o que os personagens deixam de dizer.</p>
                <div className="challenge-meta"><span>◷ Termina em 3 dias</span><strong>Recompensa: +50 Pontos HQLivre</strong></div>
                {challengeSubmitted ? (
                  <div className="challenge-success" role="status">✓ Participação enviada! Boa sorte no desafio.</div>
                ) : (
                  <button className="challenge-submit-button" type="button" onClick={() => setShowChallengeForm(true)}>Enviar Participação</button>
                )}
              </article>

              {showChallengeForm && (
                <form className="challenge-entry-form" onSubmit={submitChallenge}>
                  <label htmlFor="challenge-entry">Conte um pouco sobre sua participação</label>
                  <textarea id="challenge-entry" value={challengeEntry} onChange={(event) => setChallengeEntry(event.target.value)} placeholder="Descreva sua cena ou compartilhe um link para o seu trabalho..." required />
                  <div><button className="ghost-button" type="button" onClick={() => setShowChallengeForm(false)}>Cancelar</button><button className="primary-button" type="submit">Enviar participação</button></div>
                </form>
              )}

              <section className="community-polls">
                <div className="poll-section-heading"><div><p className="section-kicker">Voz da comunidade</p><h2>Enquetes</h2></div><span>Uma escolha por membro</span></div>
                <article className="poll-card">
                  <span className="poll-label">ENQUETE DA SEMANA</span>
                  <h3>Qual é a maior dificuldade de vocês ao criar um roteiro?</h3>
                  <div className="poll-options">
                    {(() => {
                      const totalVotes = pollOptions.reduce((sum, option) => sum + option.votes + (pollVote === option.id ? 1 : 0), 0);
                      return pollOptions.map((option) => {
                        const votes = option.votes + (pollVote === option.id ? 1 : 0);
                        const percentage = Math.round((votes / totalVotes) * 100);
                        return (
                          <button key={option.id} type="button" className={`poll-option ${pollVote ? "show-results" : ""} ${pollVote === option.id ? "selected" : ""}`} onClick={() => voteInPoll(option.id)} disabled={Boolean(pollVote)} aria-pressed={pollVote === option.id}>
                            <span className="poll-option-progress" style={{ width: pollVote ? `${percentage}%` : "0%" }} />
                            <span className="poll-option-content"><strong>{option.label}</strong>{pollVote && <span>{percentage}% · {votes} votos</span>}</span>
                          </button>
                        );
                      });
                    })()}
                  </div>
                  <footer>{pollVote ? "Obrigado por votar!" : "Vote para ver os resultados"} · {pollOptions.reduce((sum, option) => sum + option.votes, 0) + (pollVote ? 1 : 0)} votos</footer>
                </article>
              </section>
            </div>
          ) : selectedTopic ? (
            <div className="topic-thread">
              <button className="thread-back" type="button" onClick={() => setSelectedTopicId(null)}>← Voltar às discussões</button>
              <header className="thread-heading">
                <span className={`topic-kind-badge ${selectedTopic.kind}`}>{topicKinds[selectedTopic.kind] || "Discussão"}</span>
                {selectedTopic.kind === "question" && selectedTopic.answeredBy && (
                  <span className="answered-badge">Respondida por {selectedTopic.answeredBy.level}</span>
                )}
                <h2>{selectedTopic.title}</h2>
                <p>{selectedTopic.date} · {selectedTopic.replies} respostas</p>
              </header>
              <article className="thread-post original-post">
                <div className="thread-author">
                  <img src={members[0]} alt="" />
                  <strong>{selectedTopic.author}</strong>
                  <span>{selectedTopic.authorLevel || "Leitor"}</span>
                </div>
                <div className="thread-post-content"><span className="post-number">Post original</span><p>{selectedTopic.body || "Este tópico ainda não tem uma descrição. Compartilhe sua opinião e participe da conversa."}</p></div>
              </article>
              <div className="thread-replies">
                {(selectedTopic.responses || []).map((response, index) => (
                  <article className="thread-post" key={`${selectedTopic.id}-reply-${index}`}>
                    <div className="thread-author">
                      <img src={members[(index + 1) % members.length]} alt="" />
                      <strong>{response.author}</strong>
                      <span>{response.level}</span>
                    </div>
                    <div className="thread-post-content"><span className="post-number">Resposta #{index + 1}</span><p>{response.body}</p></div>
                  </article>
                ))}
              </div>
              <form className="thread-reply-form" onSubmit={submitReply}>
                <label htmlFor="thread-reply">Sua resposta</label>
                <textarea id="thread-reply" value={reply} onChange={(event) => setReply(event.target.value)} placeholder={isMember ? "Escreva uma resposta para esta conversa..." : "Participe do clube para responder"} disabled={!isMember} required />
                {isMember
                  ? <button className="primary-button" type="submit">Publicar resposta</button>
                  : <button className="primary-button" type="button" onClick={() => setShowJoinDialog(true)}>Participar para responder</button>}
              </form>
            </div>
          ) : (
            <>
              <div className="club-forum-heading">
                <div><p className="section-kicker">Fórum do clube</p><h2>Discussões recentes</h2></div>
                <button className="primary-button" type="button" onClick={() => isMember ? setShowCreateTopic(true) : setShowJoinDialog(true)} disabled={membershipPending}>
                  + Criar Novo Tópico
                </button>
              </div>
              <div className="topic-filters" role="group" aria-label="Filtrar discussões">
                {filters.map((filter) => (
                  <button key={filter.id} type="button" className={activeFilter === filter.id ? "active" : ""} onClick={() => setActiveFilter(filter.id)}>
                    {filter.label}
                  </button>
                ))}
              </div>
              {membershipPending && <p className="membership-notice">Sua solicitação de entrada aguarda aprovação do moderador.</p>}
              <div className="forum-table-wrap">
                <table className="forum-table">
                  <thead><tr><th>Tópico</th><th>Respostas</th><th>Última publicação</th></tr></thead>
                  <tbody>
                    {visibleTopics.map((topic) => (
                      <tr key={topic.id}>
                        <td>
                          <div className="topic-listing">
                            <button className="topic-title topic-open" type="button" onClick={() => setSelectedTopicId(topic.id)}>
                              <span aria-hidden="true">✦</span>
                              <span className="topic-title-copy">
                                <strong>{topic.title}</strong>
                                <span className="topic-badges">
                                  <span className={`topic-kind-badge ${topic.kind}`}>{topic.kind === "question" ? `Dúvida · ${topic.authorLevel || "Iniciante"}` : topicKinds[topic.kind]}</span>
                                  {topic.kind === "question" && topic.answeredBy && <span className="answered-badge">Respondida por {topic.answeredBy.level}</span>}
                                </span>
                                <small>por {topic.author}</small>
                              </span>
                            </button>
                            {topic.kind === "collaboration" && activeFilter === "collaboration" && (
                              <div className="collab-actions">
                                <div className="recruitment-tags">
                                  {(topic.recruitment || ["Procura-se Ilustrador", "Roteirista Disponível"]).map((tag) => <span key={tag}>{tag}</span>)}
                                </div>
                                <button type="button" className="quick-chat-button" onClick={() => { setActiveMode("chat"); setActiveChannel("equipe"); }}>Chamar no Chat</button>
                              </div>
                            )}
                          </div>
                        </td>
                        <td><span className="reply-count">{topic.replies}</span></td>
                        <td><time>{topic.date}</time></td>
                      </tr>
                    ))}
                    {!visibleTopics.length && <tr><td className="forum-empty" colSpan="3">Ainda não há tópicos nesta categoria.</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="club-forum-footer"><span>Mostrando {visibleTopics.length} de {topics.length} tópicos</span><span>◆ Clube {club.privacy.toLowerCase()}</span></div>
            </>
          )}
        </section>
      </div>

      {showJoinDialog && (
        <div className="classic-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowJoinDialog(false); }}>
          <section className="classic-modal" role="dialog" aria-modal="true" aria-labelledby="join-title">
            <header><span>HQLivre · Comunidades</span><button type="button" onClick={() => setShowJoinDialog(false)} aria-label="Fechar">×</button></header>
            <div className="classic-modal-content">
              <div className="join-club-identity"><img src={club.icon} alt="" /><h2 id="join-title">Participar da comunidade<br /><strong>{club.name}</strong>?</h2></div>
              <p>{requiresApproval ? "Sua solicitação será enviada aos moderadores. Você poderá participar depois que sua entrada for aprovada." : "Sua entrada é imediata. Ao confirmar, você já poderá publicar tópicos e responder às conversas."}</p>
              <div className="club-rules"><strong>Regras básicas do clube</strong><ul><li>Respeite os outros membros e suas opiniões.</li><li>Mantenha as conversas relacionadas ao propósito da comunidade.</li><li>Não publique spam ou conteúdo ofensivo.</li></ul></div>
            </div>
            <footer>
              <button className="ghost-button" type="button" onClick={() => setShowJoinDialog(false)}>Cancelar</button>
              <button className="primary-button" type="button" onClick={confirmMembership}>{requiresApproval ? "Solicitar entrada" : "Confirmar entrada"}</button>
            </footer>
          </section>
        </div>
      )}

      {showCreateTopic && (
        <div className="classic-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowCreateTopic(false); }}>
          <form className="classic-modal create-topic-modal" onSubmit={submitTopic}>
            <header><span>Novo tópico · {club.name}</span><button type="button" onClick={() => setShowCreateTopic(false)} aria-label="Fechar">×</button></header>
            <div className="classic-modal-content create-form">
              <label>Título<input required value={newTopic.title} onChange={(event) => setNewTopic({ ...newTopic, title: event.target.value })} /></label>
              <label>Categoria<select value={newTopic.kind} onChange={(event) => setNewTopic({ ...newTopic, kind: event.target.value })}><option value="question">Perguntas & Dúvidas</option><option value="debate">Debate</option><option value="collaboration">Colaboração</option></select></label>
              <label>Mensagem<textarea required value={newTopic.body} onChange={(event) => setNewTopic({ ...newTopic, body: event.target.value })} /></label>
            </div>
            <footer><button className="ghost-button" type="button" onClick={() => setShowCreateTopic(false)}>Cancelar</button><button className="primary-button" type="submit">Publicar tópico</button></footer>
          </form>
        </div>
      )}
    </main>
  );
}

export default ClubeDetalhe;
