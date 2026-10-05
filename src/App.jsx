import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Catalog from "./components/Catalog.jsx";
import Recommendations from "./components/Recommendations.jsx";
import ComunidadeLayout from "./components/ComunidadeLayout.jsx";
import { comics } from "./data/comics.js";

function getReadingReward(authorLevel) {
  if (authorLevel === "Iniciante") return 50;
  if (authorLevel === "Em Ascensão") return 20;
  return 10;
}

function App() {
  // useState responsável por guardar o saldo atual do leitor.
  // Toda vez que o usuário clicar em "Simular leitura", este estado será atualizado.
  const [readerPoints, setReaderPoints] = useState(0);

  // useState que simula o tipo de usuário.
  // Se for true, a seção "Pode gostar" prioriza autores iniciantes.
  // Em uma aplicação real, isso viria de autenticação, data de cadastro ou histórico de leitura.
  const [isNewUser] = useState(true);

  // useState que representa o gosto principal do leitor.
  // Mantemos este valor simples para demonstrar a regra de recomendação quando isNewUser for false.
  const [favoriteGenre] = useState("Fantasia");

  // useState central dos filtros do catálogo.
  // O objeto concentra todos os filtros para facilitar a leitura e o envio para componentes filhos.
  const [filters, setFilters] = useState({
    priceTypes: ["free", "paid"],
    levels: ["Iniciante", "Em Ascensão", "Mestre", "Lendário"],
    minPrice: 0,
    maxPrice: 40
  });
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || "inicio");

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash.slice(1) || "inicio");
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Função genérica para alterar campos simples do objeto de filtros.
  // Usamos o spread (...currentFilters) para preservar os outros filtros já selecionados.
  function handleFilterChange(field, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value
    }));
  }

  // Função que marca ou desmarca os tipos de preço.
  // Se o item já existe no array, ele é removido; caso contrário, é adicionado.
  function togglePriceType(priceType) {
    setFilters((currentFilters) => {
      const alreadySelected = currentFilters.priceTypes.includes(priceType);

      return {
        ...currentFilters,
        priceTypes: alreadySelected
          ? currentFilters.priceTypes.filter((item) => item !== priceType)
          : [...currentFilters.priceTypes, priceType]
      };
    });
  }

  // Função que marca ou desmarca níveis de autor no filtro.
  // Ela segue a mesma ideia do toggle de preço, mas atua sobre o array de níveis.
  function toggleLevel(level) {
    setFilters((currentFilters) => {
      const alreadySelected = currentFilters.levels.includes(level);

      return {
        ...currentFilters,
        levels: alreadySelected
          ? currentFilters.levels.filter((item) => item !== level)
          : [...currentFilters.levels, level]
      };
    });
  }

  // Função executada quando o leitor clica em "Simular leitura".
  // O React recebe o saldo anterior e soma a recompensa calculada pelo nível do autor.
  function handleReadComic(comic) {
    const reward = getReadingReward(comic.level);
    setReaderPoints((currentPoints) => currentPoints + reward);
  }

  // useMemo evita recalcular a lista filtrada em toda renderização sem necessidade.
  // O cálculo só roda novamente quando os filtros mudam.
  const filteredComics = useMemo(() => {
    const minPrice = Number(filters.minPrice) || 0;
    const maxPrice = Number(filters.maxPrice) || 0;

    // Lógica de filtragem:
    // 1. Converte o preço da HQ em "free" ou "paid".
    // 2. Verifica se esse tipo está selecionado.
    // 3. Verifica se o nível do autor está selecionado.
    // 4. Verifica se o preço está dentro da faixa informada.
    return comics.filter((comic) => {
      const comicPriceType = comic.price === 0 ? "free" : "paid";
      const matchesPriceType = filters.priceTypes.includes(comicPriceType);
      const matchesLevel = filters.levels.includes(comic.level);
      const matchesPriceRange = comic.price >= minPrice && comic.price <= maxPrice;

      return matchesPriceType && matchesLevel && matchesPriceRange;
    });
  }, [filters]);

  return (
    <div className="app-shell">
      <Header readerPoints={readerPoints} />
      {route === "comunidade" ? (
        <ComunidadeLayout />
      ) : (
        <main>
          <Hero />
          <Catalog
            comics={filteredComics}
            filters={filters}
            onFilterChange={handleFilterChange}
            onTogglePriceType={togglePriceType}
            onToggleLevel={toggleLevel}
            onReadComic={handleReadComic}
          />
          <Recommendations comics={comics} isNewUser={isNewUser} favoriteGenre={favoriteGenre} />
        </main>
      )}
      {route !== "comunidade" && (
        <footer className="site-footer">
          <div className="footer-links">
            <a href="#inicio">Início</a>
            <a href="#catalogo">Catálogo</a>
            <a href="#comunidade">Comunidade</a>
          </div>
          <p>&copy; 2026 HQLivre. Todos os direitos reservados.</p>
        </footer>
      )}
    </div>
  );
}

export default App;
