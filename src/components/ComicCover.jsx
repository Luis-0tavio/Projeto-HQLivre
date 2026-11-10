function ComicCover({ title, coverUrl }) {
  const fallbackUrl = `https://picsum.photos/300/400?random=${encodeURIComponent(title)}`;

  return (
    <div className="comic-cover">
      <img
        src={coverUrl || fallbackUrl}
        alt={`Capa da HQ ${title}`}
        onError={(event) => {
          if (event.currentTarget.src !== fallbackUrl) event.currentTarget.src = fallbackUrl;
        }}
        style={{
          width: "100%",
          height: "250px",
          objectFit: "cover",
          display: "block",
          borderRadius: "8px 8px 0 0"
        }}
      />
    </div>
  );
}

export default ComicCover;
