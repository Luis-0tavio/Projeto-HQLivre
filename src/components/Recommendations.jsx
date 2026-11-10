import ComicCover from "./ComicCover.jsx";

function Recommendations({ comics, isNewUser, favoriteGenre }) {
  // Regra de negócio de recomendação:
  // - Usuário novo recebe visibilidade de autores iniciantes.
  // - Usuário recorrente recebe sugestões baseadas no gosto do usuário.
  const normalizedFavoriteGenre = favoriteGenre?.trim().toLocaleLowerCase("pt-BR");
  const isFavoriteGenre = (comic) =>
    normalizedFavoriteGenre &&
    (comic.genre || "").trim().toLocaleLowerCase("pt-BR") === normalizedFavoriteGenre;
  const recommendedComics = isNewUser
    ? comics.filter((comic) => comic.level === "Iniciante")
    : comics
        .filter(
          (comic) =>
            isFavoriteGenre(comic) ||
            ["Mestre", "Lendário"].includes(comic.level)
        )
        .sort((first, second) => Number(isFavoriteGenre(second)) - Number(isFavoriteGenre(first)));

  return (
    <section className="recommendations-section" aria-labelledby="recommendationsTitle">
      <div className="section-heading">
        <p className="section-kicker">Descoberta inteligente</p>
        <h2 id="recommendationsTitle">Pode gostar</h2>
      </div>

      <p className="recommendation-note">
        {isNewUser
          ? "Como este perfil é novo, a vitrine prioriza autores iniciantes para gerar visibilidade imediata."
          : favoriteGenre
            ? `Recomendações baseadas no gosto por ${favoriteGenre} e autores com alto engajamento.`
            : "Defina seu gênero preferido no perfil para receber sugestões mais personalizadas."}
      </p>

      <div className="recommendations-grid">
        {recommendedComics.slice(0, 4).map((comic) => (
          <article className="recommendation-card" key={comic.id}>
            <ComicCover title={comic.title} coverUrl={comic.coverUrl} />
            <div>
              <h3>{comic.title}</h3>
              <p>{comic.genre} • Nível {comic.level}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Recommendations;
