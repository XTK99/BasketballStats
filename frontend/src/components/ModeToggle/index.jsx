import "./ModeToggle.css";

function ModeToggle({ mode, setMode }) {
  return (
    <div className="mode-toggle">
      <button
        className={`mode-toggle-button ${mode === "player" ? "active" : ""}`}
        onClick={() => setMode("player")}
      >
        Player
      </button>

      <button
        className={`mode-toggle-button ${mode === "team" ? "active" : ""}`}
        onClick={() => setMode("team")}
      >
        Team
      </button>
    </div>
  );
}

export default ModeToggle;
