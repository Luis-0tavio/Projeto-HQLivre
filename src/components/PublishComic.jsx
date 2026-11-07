import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase.js";

const MAX_FILE_SIZE = 12 * 1024 * 1024;
const MAX_PAGES = 30;

async function suggestBalloonBounds(file, shape, pageNumber) {
  const image = new Image();
  const imageUrl = URL.createObjectURL(file);
  try {
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = imageUrl;
    });

    const scale = Math.min(1, 240 / image.naturalWidth, 360 / image.naturalHeight);
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0, width, height);
    const pixels = context.getImageData(0, 0, width, height).data;
    const visited = new Uint8Array(width * height);
    const queue = new Int32Array(width * height);
    const candidates = [];

    for (let origin = 0; origin < width * height; origin += 1) {
      if (visited[origin]) continue;
      const offset = origin * 4;
      const light = pixels[offset] > 190 && pixels[offset + 1] > 190 && pixels[offset + 2] > 190;
      visited[origin] = 1;
      if (!light) continue;

      let head = 0;
      let tail = 0;
      queue[tail++] = origin;
      let minX = width;
      let maxX = 0;
      let minY = height;
      let maxY = 0;
      let touchesEdge = false;

      while (head < tail) {
        const index = queue[head++];
        const x = index % width;
        const y = Math.floor(index / width);
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        if (x === 0 || y === 0 || x === width - 1 || y === height - 1) touchesEdge = true;

        const neighbors = [x > 0 ? index - 1 : -1, x < width - 1 ? index + 1 : -1, y > 0 ? index - width : -1, y < height - 1 ? index + width : -1];
        for (const neighbor of neighbors) {
          if (neighbor < 0 || visited[neighbor]) continue;
          visited[neighbor] = 1;
          const neighborOffset = neighbor * 4;
          if (pixels[neighborOffset] > 190 && pixels[neighborOffset + 1] > 190 && pixels[neighborOffset + 2] > 190) {
            queue[tail++] = neighbor;
          }
        }
      }

      const boxWidth = maxX - minX + 1;
      const boxHeight = maxY - minY + 1;
      const boxArea = boxWidth * boxHeight;
      const ratio = boxWidth / boxHeight;
      if (touchesEdge || boxArea < width * height * 0.001 || boxArea > width * height * 0.2 || ratio < 0.28 || ratio > 3.5) continue;

      const padding = 2;
      const left = Math.max(0, minX - padding);
      const top = Math.max(0, minY - padding);
      const right = Math.min(width, maxX + padding + 1);
      const bottom = Math.min(height, maxY + padding + 1);
      candidates.push({
        x: (left / width) * 100,
        y: (top / height) * 100,
        width: ((right - left) / width) * 100,
        height: ((bottom - top) / height) * 100,
        shape,
        text: `Balão sugerido da página ${pageNumber}`
      });
    }

    return candidates
      .sort((first, second) => (second.width * second.height) - (first.width * first.height))
      .slice(0, 30);
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

async function getCompressedPageDataUrl(file) {
  const image = new Image();
  const imageUrl = URL.createObjectURL(file);
  try {
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = imageUrl;
    });
    const scale = Math.min(1, 1400 / image.naturalWidth, 1800 / image.naturalHeight);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Não foi possível preparar a página.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

function BalloonEditor({ page, pageNumber, shape, onChange }) {
  const [draft, setDraft] = useState(null);
  const [resizePreview, setResizePreview] = useState(null);
  const [suggestionMessage, setSuggestionMessage] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const canvasRef = useRef(null);
  const resizing = useRef(null);

  function getPoint(event) {
    const bounds = (canvasRef.current ?? event.currentTarget).getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100)),
      y: Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100))
    };
  }

  function startDrawing(event) {
    if (event.target.closest("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = getPoint(event);
    setDraft({ start: point, end: point });
  }

  function updateDrawing(event) {
    const point = getPoint(event);
    if (resizing.current) {
      const { index, corner, start, original } = resizing.current;
      const dx = point.x - start.x;
      const dy = point.y - start.y;
      let left = original.x;
      let top = original.y;
      let right = original.x + original.width;
      let bottom = original.y + original.height;
      if (corner.includes("left")) left = Math.max(0, Math.min(right - 1, original.x + dx));
      if (corner.includes("right")) right = Math.min(100, Math.max(left + 1, original.x + original.width + dx));
      if (corner.includes("top")) top = Math.max(0, Math.min(bottom - 1, original.y + dy));
      if (corner.includes("bottom")) bottom = Math.min(100, Math.max(top + 1, original.y + original.height + dy));
      setResizePreview({ ...original, x: left, y: top, width: right - left, height: bottom - top });
      return;
    }
    if (!draft) return;
    setDraft((current) => current ? { ...current, end: point } : current);
  }

  function finishDrawing(event) {
    if (resizing.current) {
      if (resizePreview) {
        const balloons = [...(page.balloons ?? [])];
        balloons[resizing.current.index] = resizePreview;
        onChange(balloons);
      }
      resizing.current = null;
      setResizePreview(null);
      return;
    }
    if (!draft) return;
    const end = getPoint(event);
    const left = Math.min(draft.start.x, end.x);
    const top = Math.min(draft.start.y, end.y);
    const width = Math.abs(end.x - draft.start.x);
    const height = Math.abs(end.y - draft.start.y);
    if (width > 1 && height > 1) {
      onChange([...(page.balloons ?? []), { x: left, y: top, width, height, shape, text: `Balão da página ${pageNumber}` }]);
    }
    setDraft(null);
  }

  function startResize(event, index, corner) {
    event.preventDefault();
    event.stopPropagation();
    const canvas = canvasRef.current;
    canvas.setPointerCapture(event.pointerId);
    const original = page.balloons[index];
    resizing.current = { index, corner, start: getPoint(event), original };
    setResizePreview(original);
  }

  async function autoSuggest() {
    if (isSuggesting) return;
    setIsSuggesting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setSuggestionMessage("Entre na sua conta para usar a sugestão com IA.");
        return;
      }
      const image = await getCompressedPageDataUrl(page.file);
      const { data, error } = await supabase.functions.invoke("suggest-balloons", {
        body: { image, shape }
      });
      if (error) throw error;
      const suggestions = (data?.balloons ?? []).map((balloon) => ({
        x: Math.max(0, Math.min(100, Number(balloon.x))),
        y: Math.max(0, Math.min(100, Number(balloon.y))),
        width: Math.max(1, Math.min(100, Number(balloon.width))),
        height: Math.max(1, Math.min(100, Number(balloon.height))),
        shape,
        text: `Balão sugerido da página ${pageNumber}`
      })).filter((balloon) => Number.isFinite(balloon.x + balloon.y + balloon.width + balloon.height));
      if (suggestions.length) {
        onChange([...(page.balloons ?? []), ...suggestions]);
        setSuggestionMessage(`${suggestions.length} balão(ões) sugerido(s) pela IA. Confira e ajuste os vértices.`);
      } else {
        setSuggestionMessage("A IA não encontrou balões nesta página. Você pode marcá-los manualmente.");
      }
    } catch {
      try {
        const suggestions = await suggestBalloonBounds(page.file, shape, pageNumber);
        if (suggestions.length) {
          onChange([...(page.balloons ?? []), ...suggestions]);
          setSuggestionMessage("IA indisponível; criei sugestões locais para você revisar e ajustar.");
        } else {
          setSuggestionMessage("IA indisponível e sem sugestões locais. Marque os balões manualmente.");
        }
      } catch {
        setSuggestionMessage("Não foi possível analisar esta página. Tente marcar os balões manualmente.");
      }
    } finally {
      setIsSuggesting(false);
    }
  }

  const drawnRegions = (page.balloons ?? []).map((balloon, index) => resizePreview && resizing.current?.index === index ? resizePreview : balloon);
  if (draft) drawnRegions.push({
    x: Math.min(draft.start.x, draft.end.x), y: Math.min(draft.start.y, draft.end.y),
    width: Math.abs(draft.end.x - draft.start.x), height: Math.abs(draft.end.y - draft.start.y), shape, draft: true
  });

  return (
    <div className="publish-balloon-editor">
      <div
        ref={canvasRef}
        className="publish-balloon-canvas"
        onPointerDown={startDrawing}
        onPointerMove={updateDrawing}
        onPointerUp={finishDrawing}
        onPointerCancel={() => { setDraft(null); resizing.current = null; setResizePreview(null); }}
      >
        <img src={page.previewUrl} alt={`Marque os balões da página ${pageNumber}`} draggable="false" />
        {drawnRegions.map((balloon, index) => (
          <div
            key={`${page.id}-balloon-${index}`}
            className={`publish-balloon-mark publish-balloon-mark-${balloon.shape}${balloon.draft ? " is-draft" : ""}`}
            style={{ left: `${balloon.x}%`, top: `${balloon.y}%`, width: `${balloon.width}%`, height: `${balloon.height}%` }}
          >
            {!balloon.draft && <button type="button" aria-label={`Remover contorno ${index + 1}`} onPointerDown={(event) => event.stopPropagation()} onClick={() => onChange((page.balloons ?? []).filter((_, balloonIndex) => balloonIndex !== index))}>×</button>}
            {!balloon.draft && ["top-left", "top-right", "bottom-left", "bottom-right"].map((corner) => (
              <button key={corner} type="button" className={`publish-balloon-vertex vertex-${corner}`} aria-label={`Redimensionar vértice ${corner}`} onPointerDown={(event) => startResize(event, index, corner)} />
            ))}
          </div>
        ))}
      </div>
      <div className="publish-balloon-editor-help">
        <small>Arraste para marcar. Puxe os vértices para ajustar; × remove um contorno.</small>
        <button type="button" className="publish-auto-detect" onClick={autoSuggest} disabled={isSuggesting}>
          {isSuggesting ? "Analisando página…" : "Sugerir contornos com IA"}
        </button>
        {page.balloons?.length > 0 && <button type="button" className="publish-clear-balloons" onClick={() => { onChange([]); setSuggestionMessage(""); }}>Remover todos os contornos</button>}
      </div>
      {suggestionMessage && <small className="publish-detection-message" role="status">{suggestionMessage}</small>}
    </div>
  );
}

function PublishComic({ onPublish }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("Aventura");
  const [synopsis, setSynopsis] = useState("");
  const [interactive, setInteractive] = useState(false);
  const [balloonShape, setBalloonShape] = useState("circle");
  const [cover, setCover] = useState(null);
  const [pages, setPages] = useState([]);
  const [error, setError] = useState("");
  const previewUrls = useRef(new Set());
  const publicationSubmitted = useRef(false);

  useEffect(() => () => {
    if (!publicationSubmitted.current) {
      previewUrls.current.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    }
  }, []);

  function addPages(fileList) {
    const selectedFiles = Array.from(fileList);
    const invalidFile = selectedFiles.find((file) =>
      file.type
        ? file.type !== "image/png"
        : !file.name.toLocaleLowerCase("pt-BR").endsWith(".png")
    );

    if (invalidFile) {
      setError("Escolha arquivos PNG. Os outros formatos não foram adicionados.");
      return;
    }

    const oversizedFile = selectedFiles.find((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFile) {
      setError("Cada página deve ter no máximo 12 MB.");
      return;
    }

    if (pages.length + selectedFiles.length > MAX_PAGES) {
      setError(`A HQ pode ter até ${MAX_PAGES} páginas.`);
      return;
    }

    setError("");
    const newPages = selectedFiles.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      previewUrls.current.add(previewUrl);
      return {
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        previewUrl
      };
    });
    setPages((currentPages) => [...currentPages, ...newPages]);
  }

  function addCover(file) {
    if (!file) return;
    const extension = file.name.toLocaleLowerCase("pt-BR");
    const validType = file.type === "image/png" || file.type === "image/jpeg" ||
      (!file.type && /\.(png|jpe?g)$/.test(extension));

    if (!validType) {
      setError("A capa precisa estar em PNG ou JPEG.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("A capa deve ter no máximo 12 MB.");
      return;
    }

    if (cover) {
      URL.revokeObjectURL(cover.previewUrl);
      previewUrls.current.delete(cover.previewUrl);
    }
    const previewUrl = URL.createObjectURL(file);
    previewUrls.current.add(previewUrl);
    setCover({ file, previewUrl });
    setError("");
  }

  function removeCover() {
    if (cover) {
      URL.revokeObjectURL(cover.previewUrl);
      previewUrls.current.delete(cover.previewUrl);
    }
    setCover(null);
  }

  function movePage(index, direction) {
    setPages((currentPages) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= currentPages.length) return currentPages;
      const reorderedPages = [...currentPages];
      [reorderedPages[index], reorderedPages[targetIndex]] = [reorderedPages[targetIndex], reorderedPages[index]];
      return reorderedPages;
    });
  }

  function removePage(pageId) {
    setPages((currentPages) => {
      const pageToRemove = currentPages.find((page) => page.id === pageId);
      if (pageToRemove) {
        URL.revokeObjectURL(pageToRemove.previewUrl);
        previewUrls.current.delete(pageToRemove.previewUrl);
      }
      return currentPages.filter((page) => page.id !== pageId);
    });
  }

  function updatePageBalloons(pageId, balloons) {
    setPages((currentPages) => currentPages.map((page) => page.id === pageId ? { ...page, balloons } : page));
  }

  function submitComic(event) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !author.trim()) {
      setError("Preencha o título da HQ e o nome do autor.");
      return;
    }
    if (pages.length === 0) {
      setError("Adicione pelo menos uma página em PNG.");
      return;
    }

    publicationSubmitted.current = true;
    onPublish({ title: title.trim(), author: author.trim(), genre, synopsis: synopsis.trim(), coverUrl: cover?.previewUrl, interactive, pages });
  }

  return (
    <main className="publish-page">
      <div className="publish-header">
        <Link className="publish-back-link" to="/">← Voltar ao início</Link>
        <p className="section-kicker">Vitrine de quadrinhos independentes</p>
        <h1>Publique sua HQ</h1>
        <p>Envie as páginas em PNG na ordem de leitura. Você pode reorganizá-las antes de publicar.</p>
      </div>

      <form className="publish-form" onSubmit={submitComic}>
        <div className="publish-details">
          <label>
            Título da HQ
            <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength="80" placeholder="Ex.: Confissão entre pétalas e livros" required />
          </label>
          <label>
            Autor ou autora
            <input value={author} onChange={(event) => setAuthor(event.target.value)} maxLength="60" placeholder="Seu nome ou pseudônimo" required />
          </label>
          <label>
            Gênero
            <select value={genre} onChange={(event) => setGenre(event.target.value)}>
              {["Aventura", "Ação", "Comédia", "Drama", "Fantasia", "Mistério", "Romance", "Sci-fi", "Slice of Life"].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>

        <section className="publish-cover-section" aria-labelledby="publishCoverTitle">
          <div>
            <h2 id="publishCoverTitle">Capa <span>(opcional)</span></h2>
            <p>PNG ou JPEG, até 12 MB. Sem capa, a primeira página será usada.</p>
          </div>
          {cover ? (
            <div className="publish-cover-preview">
              <img src={cover.previewUrl} alt="Prévia da capa da HQ" />
              <div>
                <strong>{cover.file.name}</strong>
                <button type="button" onClick={removeCover}>Remover capa</button>
              </div>
            </div>
          ) : (
            <label className="publish-cover-picker">
              Escolher imagem de capa
              <input type="file" accept="image/png,image/jpeg,.png,.jpg,.jpeg" onChange={(event) => {
                addCover(event.target.files?.[0]);
                event.target.value = "";
              }} />
            </label>
          )}
        </section>

        <label className="publish-synopsis">
          Sinopse <span>(opcional)</span>
          <textarea value={synopsis} onChange={(event) => setSynopsis(event.target.value)} maxLength="500" rows="4" placeholder="Apresente sua HQ em poucas linhas." />
          <small>{synopsis.length}/500 caracteres</small>
        </label>

        <section className="publish-interactive-section" aria-labelledby="publishInteractiveTitle">
          <label className="publish-interactive-toggle">
            <input type="checkbox" checked={interactive} onChange={(event) => setInteractive(event.target.checked)} />
            <span><strong id="publishInteractiveTitle">Ativar leitura interativa</strong><small>Permita que leitores ampliem os balões marcados por você.</small></span>
          </label>
          {interactive && (
            <label className="publish-balloon-shape">
              Formato do contorno
              <select value={balloonShape} onChange={(event) => setBalloonShape(event.target.value)}>
                <option value="circle">Circular / oval</option>
                <option value="rectangle">Quadrado / retangular</option>
              </select>
            </label>
          )}
        </section>

        <section className="publish-pages" aria-labelledby="publishPagesTitle">
          <div className="publish-pages-heading">
            <div>
              <h2 id="publishPagesTitle">Páginas da HQ</h2>
              <p>PNG, até 12 MB por página · {pages.length}/{MAX_PAGES} páginas</p>
            </div>
            <label className="publish-upload-button">
              Adicionar PNGs
              <input type="file" accept="image/png,.png" multiple onChange={(event) => {
                addPages(event.target.files);
                event.target.value = "";
              }} />
            </label>
          </div>

          {pages.length === 0 ? (
            <label className="publish-dropzone">
              <span className="publish-upload-icon" aria-hidden="true">＋</span>
              <strong>Selecione as páginas da sua HQ</strong>
              <span>Escolha um ou mais arquivos PNG do seu dispositivo.</span>
              <input type="file" accept="image/png,.png" multiple onChange={(event) => {
                addPages(event.target.files);
                event.target.value = "";
              }} />
            </label>
          ) : (
            <ol className="publish-page-list">
              {pages.map((page, index) => (
                <li className="publish-page-item" key={page.id}>
                  <img src={page.previewUrl} alt={`Prévia da página ${index + 1}`} />
                  <div className="publish-page-info">
                    <strong>Página {index + 1}</strong>
                    <span>{page.file.name}</span>
                  </div>
                  {interactive && <BalloonEditor page={page} pageNumber={index + 1} shape={balloonShape} onChange={(balloons) => updatePageBalloons(page.id, balloons)} />}
                  <div className="publish-page-actions">
                    <button type="button" onClick={() => movePage(index, -1)} disabled={index === 0} aria-label={`Mover página ${index + 1} para cima`}>↑</button>
                    <button type="button" onClick={() => movePage(index, 1)} disabled={index === pages.length - 1} aria-label={`Mover página ${index + 1} para baixo`}>↓</button>
                    <button type="button" onClick={() => removePage(page.id)} aria-label={`Remover página ${index + 1}`}>Remover</button>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        {error && <p className="publish-error" role="alert">{error}</p>}

        <div className="publish-footer">
          <p>Esta demonstração adiciona a HQ ao catálogo durante a sessão atual.</p>
          <button className="primary-button" type="submit">Publicar HQ gratuitamente</button>
        </div>
      </form>
    </main>
  );
}

export default PublishComic;
