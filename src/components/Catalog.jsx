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
        <label className="catalog-search">
          <span>Pesquisar HQs</span>
          <input
            type="search"
            value={filters.search}
            onChange={(event) => onFilterChange("search", event.target.value)}
            placeholder="Buscar por título ou autor..."
          />
        </label>

        <details className="filters-disclosure">
          <summary>Filtros avançados</summary>
          <div className="filters-panel" aria-label="Filtros avançados">

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
            <div className="price-range-heading">
              <strong>Faixa de preço</strong>
              <span>R$ {filters.minPrice} — R$ {filters.maxPrice}</span>
            </div>
            <div className="price-slider">
              <input
                aria-label="Preço mínimo"
                type="range"
                min="0"
                max="40"
                step="1"
                value={filters.minPrice}
                onChange={(event) => onFilterChange("minPrice", Math.min(Number(event.target.value), Number(filters.maxPrice)))}
              />
              <input
                aria-label="Preço máximo"
                type="range"
                min="0"
                max="40"
                step="1"
                value={filters.maxPrice}
                onChange={(event) => onFilterChange("maxPrice", Math.max(Number(event.target.value), Number(filters.minPrice)))}
              />
            </div>
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
          </div>
        </details>

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
                      {comic.synopsis && <p className="comic-synopsis">{comic.synopsis}</p>}
                    </div>
                    <div className="comic-actions">
                      <div className="comic-meta">
                        <span className="badge">{comic.price > 0 ? "Paga" : "Gratuita"}</span>
                        <span className="badge">{formatPrice(comic.price)}</span>
                        <span className="badge">Nível {comic.level}</span>
                      </div>
                      <button className="read-button" type="button" onClick={() => onReadComic(comic)}>
                        Começar leitura
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
