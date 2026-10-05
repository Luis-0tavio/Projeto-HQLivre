import { useState } from "react";
import { communityThreads } from "../data/comics.js";

function CommunityQA() {
  const [showQuestion, setShowQuestion] = useState(false);
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [threads, setThreads] = useState(communityThreads);

  const submitQuestion = (event) => {
    event.preventDefault();
    setThreads((current) => [{
      id: Date.now(),
      questionAuthor: "Alex R.",
      questionLevel: "Leitor",
      question,
      answerAuthor: "",
      answerLevel: "",
      answer: "Ainda não há resposta."
    }, ...current]);
    setQuestion("");
    setDescription("");
    setShowQuestion(false);
  };

  return (
    <div className="qa-section">
      <div className="content-heading">
        <div>
          <p className="section-kicker">Perguntas e Respostas</p>
          <h2>Entre autores e leitores</h2>
          <p>Uma troca de experiências para crescer junto.</p>
        </div>
        <button className="primary-button" type="button" onClick={() => setShowQuestion(true)}>+ Fazer uma pergunta</button>
      </div>

      {showQuestion && (
        <form className="modal-card question-form" onSubmit={submitQuestion}>
          <div className="modal-heading">
            <div><p className="section-kicker">Nova dúvida</p><h3>Fazer uma pergunta</h3></div>
            <button type="button" onClick={() => setShowQuestion(false)} aria-label="Fechar">×</button>
          </div>
          <label>Título<input required value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Qual é sua dúvida?" /></label>
          <label>Descrição<textarea required value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Conteja o contexto" /></label>
          <div className="form-actions"><button className="ghost-button" type="button" onClick={() => setShowQuestion(false)}>Cancelar</button><button className="primary-button" type="submit">Publicar pergunta</button></div>
        </form>
      )}

      <div className="qa-list">
        {threads.map((thread) => (
          <article className="qa-thread" key={thread.id}>
            <div className="qa-question"><span className="badge">Pergunta · {thread.questionLevel}</span><h3>{thread.question}</h3><p>por {thread.questionAuthor}</p></div>
            <div className="qa-answer"><span className="badge badge-mentor">Resposta · {thread.answerLevel}</span><p>{thread.answer}</p><strong>{thread.answerAuthor || "Aguardando resposta"}</strong></div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default CommunityQA;
