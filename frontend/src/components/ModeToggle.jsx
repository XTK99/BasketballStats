function ModeToggle({ mode, setMode, setSearchValue, setData, setError }) {
  function handleModeChange(newMode) {
    setMode(newMode);
    setData(null);
    setError("");
    setSearchValue(newMode === "player" ? "LeBron James" : "LAL");
  }

  return (
    <div style={{ marginBottom: "16px" }}>
      <button onClick={() => handleModeChange("player")}>Player</button>
      <button
        onClick={() => handleModeChange("team")}
        style={{ marginLeft: "8px" }}
      >
        Team
      </button>
    </div>
  );
}

export default ModeToggle;
