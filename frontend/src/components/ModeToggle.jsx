function ModeToggle({ mode, setMode, setSearchValue, setData, setError }) {
  function handleModeChange(newMode) {
    setMode(newMode);
    setData(null);
    setError("");
    setSearchValue(newMode === "player" ? "LeBron James" : "LAL");
  }

  return (
    <div className="mode-toggle">
      <button
        className={`mode-button ${mode === "player" ? "active" : ""}`}
        onClick={() => handleModeChange("player")}
      >
        Player
      </button>

      <button
        className={`mode-button ${mode === "team" ? "active" : ""}`}
        onClick={() => handleModeChange("team")}
      >
        Team
      </button>
    </div>
  );
}

export default ModeToggle;
