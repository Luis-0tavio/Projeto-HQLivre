import { useMemo, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "./context/autenticacao_provider.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Catalog from "./components/Catalog.jsx";
import Recommendations from "./components/Recommendations.jsx";
import ComunidadeLayout from "./components/ComunidadeLayout.jsx";
import ClubeDetalhe from "./components/ClubeDetalhe.jsx";
import FanartMural from "./components/FanartMural.jsx";
import { comics } from "./data/comics.js";
import Login from "./components/Login.jsx";
import Perfil from "./components/Perfil.jsx";
import Reader from "./components/Reader.jsx";
import PublishComic from "./components/PublishComic.jsx";

function getReadingReward(authorLevel) {
  if (authorLevel === "Iniciante") return 50;
  if (authorLevel === "Em Ascensão") return 20;
  return 10;
}

function App() {
  const navigate = useNavigate();
  const { favoriteGenre } = useAuth();
  // useState responsável por guardar o saldo atual do leitor.
  // Toda vez que o usuário clicar em "Simular leitura", este estado será atualizado.
  const [readerPoints, setReaderPoints] = useState(0);
  const [completedComicIds, setCompletedComicIds] = useState(() => new Set());
  const [catalogComics, setCatalogComics] = useState(() => comics);

  // useState central dos filtros do catálogo.
  // O objeto concentra todos os filtros para facilitar a leitura e o envio para componentes filhos.
  const [filters, setFilters] = useState({
    priceTypes: ["free", "paid"],
    levels: ["Iniciante", "Em Ascensão", "Mestre", "Lendário"],
    minPrice: 0,
    maxPrice: 40,
    search: ""
  });

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

  // O leitor recebe os pontos ao concluir uma HQ, no máximo uma vez por HQ nesta sessão.
  function handleReadComic(comic) {
    navigate(`/leitura/${comic.id}`);
  }

  function handleCompleteReading(comic) {
    if (completedComicIds.has(comic.id)) return 0;

    const reward = getReadingReward(comic.level);
    setReaderPoints((currentPoints) => currentPoints + reward);
    setCompletedComicIds((currentIds) => new Set(currentIds).add(comic.id));
    return reward;
  }

  function handlePublishComic({ title, author, genre, synopsis, coverUrl, interactive, pages }) {
    const newComic = {
      id: Date.now(),
      title,
      author,
      price: 0,
      level: "Iniciante",
      genre,
      synopsis,
      interactive,
      coverUrl: coverUrl || pages[0].previewUrl,
      pages: pages.map((page) => ({ imageUrl: page.previewUrl, balloons: page.balloons ?? [] }))
    };

    setCatalogComics((currentComics) => [newComic, ...currentComics]);
    navigate("/#catalogo");
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
    return catalogComics.filter((comic) => {
      const comicPriceType = comic.price === 0 ? "free" : "paid";
      const matchesPriceType = filters.priceTypes.includes(comicPriceType);
      const matchesLevel = filters.levels.includes(comic.level);
      const matchesPriceRange = comic.price >= minPrice && comic.price <= maxPrice;
      const searchTerm = filters.search.trim().toLocaleLowerCase("pt-BR");
      const matchesSearch = !searchTerm ||
        comic.title.toLocaleLowerCase("pt-BR").includes(searchTerm) ||
        comic.author.toLocaleLowerCase("pt-BR").includes(searchTerm);

      return matchesPriceType && matchesLevel && matchesPriceRange && matchesSearch;
    });
  }, [filters, catalogComics]);

  return (
    <div className="app-shell">
      <Header readerPoints={readerPoints} />
      <Routes>
        <Route path="/" element={
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
            <Recommendations comics={catalogComics} isNewUser={false} favoriteGenre={favoriteGenre} />
          </main>
        } />
        <Route path="/comunidade" element={<ComunidadeLayout />} />
        <Route path="/comunidade/clube/:clubId" element={<ClubeDetalhe />} />
        <Route path="/publicar" element={<PublishComic onPublish={handlePublishComic} />} />
        <Route path="/leitura/:comicId" element={<Reader comics={catalogComics} onComplete={handleCompleteReading} />} />
        <Route path="/fanarts" element={<main className="fanart-page"><FanartMural /></main>} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil comics={catalogComics} />} />
      </Routes>
      <footer className="site-footer">
        <div className="footer-links">
          <a href="/">Início</a>
          <a href="/#catalogo">Catálogo</a>
          <a href="/comunidade">Comunidade</a>
          <a href="/fanarts">Fanarts</a>
        </div>
        <p>&copy; 2026 HQLivre. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
