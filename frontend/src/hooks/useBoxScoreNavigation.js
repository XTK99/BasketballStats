export function useBoxScoreNavigation({
  setActiveDashboardView,
  setPlayerQuery,
  setTeamQuery,
  skipNextTeamAutoSearchRef,
  loadTeamDashboard,
  loadPlayerAndRelatedTeamDashboard,
  boxScoreState,
}) {
  const {
    selectedGameId,
    selectedGame,
    boxScore,
    setIsBoxScoreOpen,
    boxScoreRef,
    setSelectedGame,
    setSelectedGameId,
    setBoxScore,
    setBoxScoreError,
    setBoxScoreLoading,
    selectGame,
    reloadBoxScore,
  } = boxScoreState;

  async function handleSelectGame(gameOrGameId) {
    await selectGame(gameOrGameId);
  }

  async function handleSelectTeamFromBoxScore(teamName) {
    if (!teamName) return;

    setActiveDashboardView("team");
    skipNextTeamAutoSearchRef.current = true;
    setTeamQuery(teamName);
    await loadTeamDashboard(teamName);
  }

  async function handleSelectPlayerFromBoxScore(playerName) {
    const trimmedPlayerName = String(playerName || "").trim();
    if (!trimmedPlayerName) return;

    const previousSelectedGameId =
      selectedGame?.gameId ||
      selectedGameId ||
      boxScore?.gameId ||
      boxScore?.game?.gameId ||
      null;

    const previousSelectedGame = selectedGame || null;

    setActiveDashboardView("player");
    setPlayerQuery(trimmedPlayerName);

    try {
      const normalizedPlayerGames =
        (await loadPlayerAndRelatedTeamDashboard(trimmedPlayerName)) || [];

      if (!previousSelectedGameId) return;

      const matchingGame = normalizedPlayerGames.find(
        (game) =>
          game?.gameId === previousSelectedGameId ||
          game?.GAME_ID === previousSelectedGameId,
      );

      if (matchingGame) {
        await selectGame(matchingGame);
        return;
      }

      setIsBoxScoreOpen(true);
      setSelectedGameId(previousSelectedGameId);
      setSelectedGame(
        previousSelectedGame || {
          gameId: previousSelectedGameId,
        },
      );
      setBoxScoreLoading(true);
      setBoxScoreError("");

      await reloadBoxScore(previousSelectedGameId);

      requestAnimationFrame(() => {
        setTimeout(() => {
          boxScoreRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 50);
      });
    } catch (error) {
      console.error("Failed to switch to player from box score:", error);
      setBoxScoreError("Failed to load box score.");
      setBoxScore(null);
    } finally {
      setBoxScoreLoading(false);
    }
  }

  return {
    handleSelectGame,
    handleSelectTeamFromBoxScore,
    handleSelectPlayerFromBoxScore,
  };
}
