import ComicCover from "./ComicCover.jsx";

function formatPrice(price) {
  return price === 0 ? "Gratuita" : `R$ ${price.toFixed(2).replace(".", ",")}`;
}

function Catalog({
  comics,
  filters,
  onFilterChange,
  onTogglePriceType,
  onToggleLevel,
  onReadComic
}) {
  return (
    <section id="catalogo" className="catalog-section">
      <div className="section-heading">
        <p className="section-kicker">Catálogo</p>
        <h2>Explore HQs independentes</h2>
      </div>

      <div className="catalog-layout">
        <aside className="filters-panel" aria-label="Filtros avançados">
          <h3>Filtros avançados</h3>

          <fieldset>
            <legend>Preço</legend>
            <label>
              <input
                type="checkbox"
                checked={filters.priceTypes.includes("free")}
                onChange={() => onTogglePriceType("free")}
              />
              Gratuita
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.priceTypes.includes("paid")}
                onChange={() => onTogglePriceType("paid")}
              />
              Paga
            </label>
          </fieldset>

          <div className="price-range">
            <label htmlFor="minPrice">Preço mínimo</label>
            <input
              id="minPrice"
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={(event) => onFilterChange("minPrice", event.target.value)}
            />

            <label htmlFor="maxPrice">Preço máximo</label>
            <input
              id="maxPrice"
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={(event) => onFilterChange("maxPrice", event.target.value)}
            />
          </div>

          <fieldset>
            <legend>Nível do autor</legend>
            {["Iniciante", "Em Ascensão", "Mestre", "Lendário"].map((level) => (
              <label key={level}>
                <input
                  type="checkbox"
                  checked={filters.levels.includes(level)}
                  onChange={() => onToggleLevel(level)}
                />
                Nível {level}
              </label>
            ))}
          </fieldset>
        </aside>

        <div className="catalog-content">
          <p className="result-count">
            {comics.length} HQ{comics.length === 1 ? "" : "s"} encontrada{comics.length === 1 ? "" : "s"}
          </p>

          <div className="comics-grid">
            {comics.length === 0 ? (
              <p className="empty-state">Nenhuma HQ encontrada com os filtros atuais.</p>
            ) : (
              comics.map((comic) => (
                <article className="comic-card" key={comic.id}>
                  <ComicCover title={comic.title} coverUrl={comic.coverUrl} />
                  <div className="comic-info">
                    <div className="comic-text">
                      <h3>{comic.title}</h3>
                      <p>por {comic.author}</p>
                    </div>
                    <div className="comic-actions">
                      <div className="comic-meta">
                        <span className="badge">{comic.price > 0 ? "Paga" : "Gratuita"}</span>
                        <span className="badge">{formatPrice(comic.price)}</span>
                        <span className="badge">Nível {comic.level}</span>
                      </div>
                      <button className="read-button" type="button" onClick={() => onReadComic(comic)}>
                        Simular leitura
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Catalog;
