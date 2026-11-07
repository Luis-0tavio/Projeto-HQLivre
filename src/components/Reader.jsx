import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

function renderCommentText(text, hideSpoilers) {
  return text.split(/(\/\/[\s\S]*?\/\/)/g).map((part, index) => {
    const isSpoiler = part.startsWith("//") && part.endsWith("//") && part.length >= 4;
    if (!isSpoiler) return part;

    const spoilerText = part.slice(2, -2);
    return hideSpoilers ? (
      <span className="reader-spoiler" tabIndex="0" key={`spoiler-${index}`} aria-label="Spoiler oculto; passe o mouse ou foque para revelar">
        {spoilerText}
      </span>
    ) : spoilerText;
  });
}

function cropComicBalloon(imageUrl, balloon) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const x = Math.round((balloon.x / 100) * image.naturalWidth);
      const y = Math.round((balloon.y / 100) * image.naturalHeight);
      const width = Math.round((balloon.width / 100) * image.naturalWidth);
      const height = Math.round((balloon.height / 100) * image.naturalHeight);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Não foi possível recortar o balão."));
        return;
      }

      if (balloon.shape === "circle") {
        context.beginPath();
        context.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
        context.clip();
      }
      context.drawImage(image, x, y, width, height, 0, 0, width, height);
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = reject;
    image.src = imageUrl;
  });
}

function Reader({ comics, onComplete }) {
  const { comicId } = useParams();
  const comic = comics.find((item) => item.id === Number(comicId));
  const pages = comic?.pages ?? [
    {
      title: "Amostra de leitura",
      panels: [
        { scene: "city", caption: `${comic?.title} começa aqui.`, dialogue: `Uma história de ${comic?.genre.toLowerCase()}, criada por ${comic?.author}.` },
        { scene: "station", caption: "Cada página é uma nova descoberta.", dialogue: "Continue acompanhando esta HQ para ver o próximo capítulo." },
        { scene: "dawn", caption: "Esta é uma prévia do leitor HQLivre.", dialogue: "Boa leitura!" }
      ]
    }
  ];
  const [pageIndex, setPageIndex] = useState(0);
  const [readingMode, setReadingMode] = useState("pages");
  const [zoom, setZoom] = useState(100);
  const [fitWidth, setFitWidth] = useState(false);
  const [interactiveReading, setInteractiveReading] = useState(false);
  const [expandedDialogue, setExpandedDialogue] = useState(null);
  const [croppedBalloons, setCroppedBalloons] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [finished, setFinished] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [commentDraft, setCommentDraft] = useState("");
  const [comments, setComments] = useState([]);
  const [hideSpoilers, setHideSpoilers] = useState(true);
  const pageRefs = useRef([]);
  const toolsRef = useRef(null);
  const pendingScrollReset = useRef(true);

  const resetReaderScroll = useCallback(() => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    root.style.scrollBehavior = previousScrollBehavior;
  }, []);

  useLayoutEffect(() => {
    pendingScrollReset.current = true;
    resetReaderScroll();
    const frame = window.requestAnimationFrame(() => {
      resetReaderScroll();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [comicId, resetReaderScroll]);

  useEffect(() => {
    const firstPageImage = pageRefs.current[0]?.querySelector(".reader-page-image");
    if (firstPageImage?.complete && firstPageImage.naturalWidth > 0 && pendingScrollReset.current) {
      resetReaderScroll();
      pendingScrollReset.current = false;
    }
  }, [comicId, resetReaderScroll]);

  const goToPage = useCallback((index) => {
    const nextIndex = Math.max(0, Math.min(index, pages.length - 1));
    setPageIndex(nextIndex);
    if (readingMode === "scroll") {
      pageRefs.current[nextIndex]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [pages.length, readingMode]);

  useEffect(() => {
    setPageIndex(0);
    setReadingMode("pages");
    setZoom(100);
    setFitWidth(false);
    setInteractiveReading(false);
    setExpandedDialogue(null);
    setCroppedBalloons({});
    setFinished(false);
    setPointsEarned(0);
    setCommentDraft("");
    setComments([]);
    setHideSpoilers(true);
    pageRefs.current = [];
  }, [comicId]);

  useEffect(() => {
    function closeToolsOnOutsideClick(event) {
      if (toolsRef.current?.open && !toolsRef.current.contains(event.target)) {
        toolsRef.current.open = false;
      }
    }

    document.addEventListener("pointerdown", closeToolsOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeToolsOnOutsideClick);
  }, []);

  useEffect(() => {
    function updateFullscreenState() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener("fullscreenchange", updateFullscreenState);
    return () => document.removeEventListener("fullscreenchange", updateFullscreenState);
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(event.target.tagName) || event.target.isContentEditable) return;

      if (event.key === "ArrowRight" || (readingMode === "pages" && event.key === "PageDown")) {
        event.preventDefault();
        goToPage(pageIndex + 1);
      } else if (event.key === "ArrowLeft" || (readingMode === "pages" && event.key === "PageUp")) {
        event.preventDefault();
        goToPage(pageIndex - 1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [readingMode, goToPage, pageIndex]);

  useEffect(() => {
    if (readingMode !== "scroll") return;

    const observer = new IntersectionObserver((entries) => {
      const mostVisible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
      if (mostVisible) {
        const visibleIndex = pageRefs.current.indexOf(mostVisible.target);
        if (visibleIndex >= 0) setPageIndex(visibleIndex);
      }
    }, { threshold: [0.35, 0.6, 0.85] });

    pageRefs.current.forEach((page) => page && observer.observe(page));
    return () => observer.disconnect();
  }, [readingMode, comicId, pages.length]);

  if (!comic) {
    return (
      <main className="reader-main">
        <div className="reader-not-found">
          <h1>HQ não encontrada</h1>
          <Link className="reader-back-link" to="/#catalogo">Voltar ao catálogo</Link>
        </div>
      </main>
    );
  }

  const visiblePageIndex = Math.min(pageIndex, pages.length - 1);
  const progress = ((visiblePageIndex + 1) / pages.length) * 100;

  function finishReading() {
    setPointsEarned(onComplete(comic));
    setFinished(true);
  }

  function submitComment(event) {
    event.preventDefault();
    const text = commentDraft.trim();
    if (!text) return;

    setComments((currentComments) => [{ id: Date.now(), text, likes: 0, dislikes: 0, vote: null }, ...currentComments]);
    setCommentDraft("");
  }

  async function toggleImageBalloon(dialogueId, balloon, imageUrl) {
    if (expandedDialogue === dialogueId) {
      setExpandedDialogue(null);
      return;
    }

    try {
      const crop = croppedBalloons[dialogueId] ?? await cropComicBalloon(imageUrl, balloon);
      setCroppedBalloons((currentCrops) => ({ ...currentCrops, [dialogueId]: crop }));
      setExpandedDialogue(dialogueId);
    } catch (error) {
      console.error("Falha ao recortar o balão da HQ.", error);
    }
  }

  async function toggleFullscreen() {
    const pageElement = pageRefs.current[visiblePageIndex];
    if (!pageElement) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (pageElement.requestFullscreen) {
      await pageElement.requestFullscreen();
    }
  }

  function toggleCommentReaction(commentId, reaction) {
    setComments((currentComments) => currentComments.map((comment) => {
      if (comment.id !== commentId) return comment;

      const nextVote = comment.vote === reaction ? null : reaction;
      return {
        ...comment,
        likes: comment.likes + (nextVote === "like" ? 1 : 0) - (comment.vote === "like" ? 1 : 0),
        dislikes: comment.dislikes + (nextVote === "dislike" ? 1 : 0) - (comment.vote === "dislike" ? 1 : 0),
        vote: nextVote
      };
    }));
  }

  function renderPage(page, index) {
    return (
      <article
        className={`reader-comic-page${page.imageUrl ? " reader-comic-page-image" : ""}`}
        key={`${comic.id}-${index}`}
        ref={(element) => { pageRefs.current[index] = element; }}
        style={{ zoom: `${zoom}%` }}
      >
        {page.imageUrl ? (
          <div className="reader-image-stage">
            <img
              className="reader-page-image"
              src={page.imageUrl}
              alt={`${comic.title}, página ${index + 1}`}
              onLoad={() => {
                if (index === 0 && pendingScrollReset.current) {
                  resetReaderScroll();
                  pendingScrollReset.current = false;
                }
              }}
            />
            {(page.balloons ?? []).map((balloon, balloonIndex) => {
              const dialogueId = `${index}-${balloonIndex}`;
              const isExpanded = expandedDialogue === dialogueId;
              const cropScale = isExpanded ? 1.8 : 1;
              const cropLeft = balloon.x - (balloon.width * (cropScale - 1)) / 2;
              const cropTop = balloon.y - (balloon.height * (cropScale - 1)) / 2;
              const cropWidth = balloon.width * cropScale;
              const cropHeight = balloon.height * cropScale;
              return (
                <button
                  type="button"
                  key={dialogueId}
                  className={`reader-dialogue reader-image-balloon reader-image-balloon-${balloon.shape === "circle" ? "circle" : "rectangle"}${isExpanded ? " reader-dialogue-expanded" : ""}`}
                  style={{
                    "--balloon-x": `${cropLeft}%`,
                    "--balloon-y": `${cropTop}%`,
                    "--balloon-width": `${cropWidth}%`,
                    "--balloon-height": `${cropHeight}%`
                  }}
                  disabled={!interactiveReading}
                  aria-expanded={interactiveReading && expandedDialogue === dialogueId}
                  aria-label={balloon.text}
                  onClick={() => toggleImageBalloon(dialogueId, balloon, page.imageUrl)}
                >
                  {isExpanded && croppedBalloons[dialogueId] && (
                    <img className="reader-balloon-crop" src={croppedBalloons[dialogueId]} alt="" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <>
            <header className="reader-page-heading">
              <p>{comic.genre} · por {comic.author}</p>
              <h1>{page.title}</h1>
            </header>
            <div className="reader-panels">
              {page.panels.map((panel, panelIndex) => {
                const dialogueId = `${index}-${panelIndex}`;
                return (
                  <section className={`reader-panel reader-scene-${panel.scene}`} key={dialogueId}>
                    <div className="reader-art" aria-hidden="true">
                      <span className="reader-moon" />
                      <span className="reader-skyline" />
                      <span className="reader-figure" />
                      <span className="reader-glow" />
                    </div>
                    <span className="reader-panel-number">{String(panelIndex + 1).padStart(2, "0")}</span>
                    <p className="reader-caption">{panel.caption}</p>
                    <button
                      type="button"
                      className={`reader-dialogue${expandedDialogue === dialogueId ? " reader-dialogue-expanded" : ""}`}
                      disabled={!interactiveReading}
                      aria-expanded={interactiveReading && expandedDialogue === dialogueId}
                      onClick={() => setExpandedDialogue((current) => current === dialogueId ? null : dialogueId)}
                    >
                      “{panel.dialogue}”
                    </button>
                  </section>
                );
              })}
            </div>
            <footer className="reader-page-footer">HQLivre · {comic.title} · {index + 1}</footer>
          </>
        )}
        {isFullscreen && index === visiblePageIndex && (
          <button type="button" className="reader-fullscreen-exit" onClick={() => document.exitFullscreen()}>
            Sair da tela cheia
          </button>
        )}
      </article>
    );
  }

  return (
    <main className="reader-main">
      <div className="reader-topbar">
        <Link className="reader-back-link" to="/#catalogo">← Voltar ao catálogo</Link>
        <span>{comic.title}</span>
        <span className="reader-page-count">Página {visiblePageIndex + 1} de {pages.length}</span>
      </div>
      <div className="reader-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(progress)} aria-label={`Leitura ${Math.round(progress)}% concluída`}>
        <span style={{ width: `${progress}%` }} />
      </div>

      <section className={`reader-layout${fitWidth ? " reader-fit-width" : ""}`} aria-label={`Leitura de ${comic.title}`}>
        <div className={`reader-pages${readingMode === "scroll" ? " reader-pages-scroll" : ""}`}>
          {readingMode === "scroll" ? pages.map(renderPage) : renderPage(pages[visiblePageIndex], visiblePageIndex)}
        </div>

        <aside className="reader-tools">
          <details className="reader-tools-disclosure" ref={toolsRef}>
            <summary>Opções de leitura</summary>
            <div className="reader-tools-content">
              <fieldset>
                <legend>Modo de leitura</legend>
                <label><input type="radio" name="readingMode" value="pages" checked={readingMode === "pages"} onChange={() => setReadingMode("pages")} /> Passar página</label>
                <label><input type="radio" name="readingMode" value="scroll" checked={readingMode === "scroll"} onChange={() => setReadingMode("scroll")} /> Rolamento contínuo</label>
              </fieldset>

              <label className="reader-zoom-control" htmlFor="readerZoom">
                <span>Zoom <strong>{zoom}%</strong></span>
                <input id="readerZoom" type="range" min="75" max="140" step="5" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
              </label>

              <label className="reader-fit-control">
                <input type="checkbox" checked={fitWidth} onChange={(event) => setFitWidth(event.target.checked)} /> Ajustar página à largura
              </label>
              <label className="reader-interactive-control">
                <input type="checkbox" checked={interactiveReading} onChange={(event) => {
                  setInteractiveReading(event.target.checked);
                  setExpandedDialogue(null);
                }} disabled={comic.interactive === false} /> Leitura interativa
              </label>
              <p className="reader-interactive-hint">{comic.interactive === false ? "Esta HQ não tem balões marcados para leitura interativa." : "Ative e clique nos balões para ampliar o texto."}</p>
              <button type="button" className="reader-fullscreen-button" onClick={toggleFullscreen}>
                {isFullscreen ? "Sair da tela cheia" : "Preencher tela inteira"}
              </button>
            </div>
          </details>
        </aside>
      </section>

      <nav className="reader-navigation" aria-label="Navegação das páginas">
        {!finished ? (
          <>
            <button type="button" className="reader-secondary-button" onClick={() => goToPage(visiblePageIndex - 1)} disabled={visiblePageIndex === 0}>← Anterior</button>
            <span>Página {visiblePageIndex + 1} de {pages.length}</span>
            {visiblePageIndex < pages.length - 1 ? (
              <button type="button" className="primary-button" onClick={() => goToPage(visiblePageIndex + 1)}>Próxima página →</button>
            ) : (
              <button type="button" className="primary-button" onClick={finishReading}>Concluir leitura ✓</button>
            )}
          </>
        ) : (
          <div className="reader-finished">
            <span aria-hidden="true">✓</span>
            <h2>Leitura concluída</h2>
            <p>{pointsEarned > 0 ? `Você ganhou ${pointsEarned} pontos por apoiar ${comic.author}.` : "Você já recebeu os pontos desta leitura. Obrigado por ler!"}</p>
            <Link className="primary-button" to="/#catalogo">Explorar mais HQs</Link>
          </div>
        )}
      </nav>

      {(readingMode === "scroll" || visiblePageIndex === pages.length - 1) && (
        <>
        <div className="reader-comments-divider" role="separator" aria-label="Separação entre leitura e comentários" />
        <section className="reader-comments" aria-labelledby="readerCommentsTitle">
          <div className="reader-comments-heading">
            <div>
              <p className="section-kicker">Comunidade</p>
              <h2 id="readerCommentsTitle">Comentários</h2>
            </div>
            <label className="reader-spoiler-setting">
              <input type="checkbox" checked={hideSpoilers} onChange={(event) => setHideSpoilers(event.target.checked)} />
              Ocultar spoilers
            </label>
          </div>
          <p className="reader-spoiler-hint">Escreva spoilers entre <code>//assim//</code>. Passe o mouse ou use Tab para revelar.</p>
          <form className="reader-comment-form" onSubmit={submitComment}>
            <label htmlFor="readerComment">Deixe seu comentário</label>
            <textarea
              id="readerComment"
              value={commentDraft}
              onChange={(event) => setCommentDraft(event.target.value)}
              placeholder={`O que achou de ${comic.title}?`}
              rows="4"
            />
            <button className="primary-button" type="submit" disabled={!commentDraft.trim()}>Publicar comentário</button>
          </form>
          <div className="reader-comment-list" aria-live="polite">
            {comments.length === 0 ? (
              <p className="reader-no-comments">Ainda não há comentários. Comece a conversa.</p>
            ) : comments.map((comment) => (
              <article className="reader-comment" key={comment.id}>
                <strong>Leitor</strong>
                <p>{renderCommentText(comment.text, hideSpoilers)}</p>
                <div className="reader-comment-reactions" aria-label="Reações ao comentário">
                  <button type="button" className={comment.vote === "like" ? "active" : ""} aria-pressed={comment.vote === "like"} aria-label={`Curtir comentário (${comment.likes})`} onClick={() => toggleCommentReaction(comment.id, "like")}>
                    👍 <span>{comment.likes}</span>
                  </button>
                  <button type="button" className={comment.vote === "dislike" ? "active" : ""} aria-pressed={comment.vote === "dislike"} aria-label={`Não curtir comentário (${comment.dislikes})`} onClick={() => toggleCommentReaction(comment.id, "dislike")}>
                    👎 <span>{comment.dislikes}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        </>
      )}
    </main>
  );
}

export default Reader;
