function ComicCover({ title, coverUrl }) {
  return (
    <div className="comic-cover">
      <img
        src={`https://picsum.photos/300/400?random=${encodeURIComponent(title)}`}
        alt={`Capa da HQ ${title}`}
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
