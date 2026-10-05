import { useState } from "react";
import { fanarts } from "../data/community.js";

function FanartMural() {
  const [liked, setLiked] = useState([]);

  const toggleLike = (id) => {
    setLiked((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <div className="fanart-section">
      <div className="content-heading">
        <div><p className="section-kicker">Mural de Fanarts</p><h2>Arte inspirada nas HQs</h2><p>Uma galeria para celebrar a criatividade dos leitores.</p></div>
        <button className="primary-button" type="button">+ Postar arte</button>
      </div>
      <div className="masonry-grid">
        {fanarts.map((fart, index) => (
          <article className={`fart-card fart-card-${index + 1}`} key={fart.id}>
            <img src={fart.image} alt={`${fart.title}, arte de ${fart.artist}`} />
            <div className="fart-overlay"><span>Inspirado em {fart.comic}</span><h3>{fart.title}</h3><p>por {fart.artist}</p></div>
            <div className="fart-actions"><button type="button" className={liked.includes(fart.id) ? "liked" : ""} onClick={() => toggleLike(fart.id)}>♥ {fart.likes + (liked.includes(fart.id) ? 1 : 0)}</button><a href="#catalogo" aria-label={`Ver a HQ ${fart.comic}`}>Ver HQ ↗</a></div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default FanartMural;
