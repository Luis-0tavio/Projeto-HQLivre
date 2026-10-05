function TopicoForum({ community }) {
  return (
    <div className="forum-section">
      <div className="forum-heading"><div><p className="section-kicker">Fórum da comunidade</p><h3>Tópicos recentes</h3></div><button className="ghost-button" type="button">+ Novo tópico</button></div>
      {community.topics.length === 0 ? (
        <div className="empty-state">Esta comunidade ainda não tem tópicos.</div>
      ) : (
        <div className="topic-list">
          {community.topics.map((topic) => (
            <article className="topic-row" key={topic.id}>
              <div className="topic-icon">✦</div>
              <div className="topic-main"><h4>{topic.title}</h4><p>por {topic.author} · {topic.date}</p></div>
              <div className="topic-replies"><span>◌</span>{topic.replies} respostas</div>
              <button type="button" aria-label={`Abrir tópico: ${topic.title}`}>→</button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopicoForum;
