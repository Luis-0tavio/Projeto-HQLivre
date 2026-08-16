function CommunityQA({ threads }) {
  return (
    <section id="comunidade" className="community-section" aria-labelledby="communityTitle">
      <div className="section-heading">
        <p className="section-kicker">Comunidade</p>
        <h2 id="communityTitle">Perguntas e respostas entre autores</h2>
      </div>

      <div className="qa-list">
        {threads.map((thread) => (
          <article className="qa-thread" key={thread.id}>
            <div className="qa-question">
              <span className="badge">Pergunta • {thread.questionLevel}</span>
              <h3>{thread.question}</h3>
              <p>por {thread.questionAuthor}</p>
            </div>

            <div className="qa-answer">
              <span className="badge badge-mentor">Resposta • {thread.answerLevel}</span>
              <p>{thread.answer}</p>
              <strong>{thread.answerAuthor}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CommunityQA;
