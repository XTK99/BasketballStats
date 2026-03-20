function ModeToggle({
  mode,
  setMode,
  setData,
  setError,
  setSelectedGame,
  setBoxScore,
}) {
  function handleModeChange(nextMode) {
    setMode(nextMode);

    if (setData) setData(null);
    if (setError) setError("");
    if (setSelectedGame) setSelectedGame(null);
    if (setBoxScore) setBoxScore(null);
  }

  return (
    <div className="mode-toggle">
      <button
        type="button"
        className={mode === "player" ? "mode-button active" : "mode-button"}
        onClick={() => handleModeChange("player")}
      >
        Player
      </button>

      <button
        type="button"
        className={mode === "team" ? "mode-button active" : "mode-button"}
        onClick={() => handleModeChange("team")}
      >
        Team
      </button>
    </div>
  );
}

export default ModeToggle;
