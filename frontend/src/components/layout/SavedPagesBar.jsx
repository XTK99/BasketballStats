import "./SavedPagesBar.css";

function SavedPagesBar({
  savedPages,
  onSaveCurrentPage,
  onLoadPage,
  onDeletePage,
}) {
  return (
    <section className="saved-pages-bar">
      <div className="saved-pages-header">
        <div>
          <p className="saved-pages-kicker">Workspace</p>
          <h3 className="saved-pages-title">Saved Pages</h3>
        </div>

        <button className="saved-pages-save-btn" onClick={onSaveCurrentPage}>
          Save Current Page
        </button>
      </div>

      {savedPages.length === 0 ? (
        <p className="saved-pages-empty">
          No saved pages yet. Save a player or team view to jump back later.
        </p>
      ) : (
        <div className="saved-pages-list">
          {savedPages.map((page) => (
            <div key={page.id} className="saved-page-card">
              <button
                className="saved-page-main"
                onClick={() => onLoadPage(page)}
                title={`Load ${page.label}`}
              >
                <span className="saved-page-type">{page.type}</span>
                <span className="saved-page-label">{page.label}</span>
                <span className="saved-page-meta">
                  {page.name} • Last {page.last}
                </span>
              </button>

              <button
                className="saved-page-delete"
                onClick={() => onDeletePage(page.id)}
                title={`Delete ${page.label}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default SavedPagesBar;
