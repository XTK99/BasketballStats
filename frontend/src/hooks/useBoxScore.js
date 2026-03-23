import { useRef, useState } from "react";
import { getBoxScore } from "../api/nbaApi";

export function useBoxScore({ getAllGames }) {
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [boxScore, setBoxScore] = useState(null);
  const [boxScoreLoading, setBoxScoreLoading] = useState(false);
  const [boxScoreError, setBoxScoreError] = useState("");
  const [isBoxScoreOpen, setIsBoxScoreOpen] = useState(true);

  const boxScoreRef = useRef(null);

  async function selectGame(gameOrGameId) {
    setIsBoxScoreOpen(true);

    const allGames =
      typeof getAllGames === "function" ? getAllGames() || [] : [];

    const game =
      typeof gameOrGameId === "string"
        ? allGames.find((entry) => entry.gameId === gameOrGameId)
        : gameOrGameId;

    const gameId = game?.gameId;
    if (!gameId) return null;

    try {
      setSelectedGameId(gameId);
      setSelectedGame(game);
      setBoxScoreLoading(true);
      setBoxScoreError("");

      const response = await getBoxScore(gameId);
      setBoxScore(response);

      requestAnimationFrame(() => {
        setTimeout(() => {
          boxScoreRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 50);
      });

      return response;
    } catch (error) {
      console.error("Failed to load box score:", error);
      setBoxScoreError("Failed to load box score.");
      setBoxScore(null);
      return null;
    } finally {
      setBoxScoreLoading(false);
    }
  }

  async function reloadBoxScore(gameIdOverride) {
    const gameId = gameIdOverride || selectedGameId;
    if (!gameId) return null;

    try {
      setBoxScoreLoading(true);
      setBoxScoreError("");

      const response = await getBoxScore(gameId);
      setBoxScore(response);
      return response;
    } catch (error) {
      console.error("Failed to reload box score:", error);
      setBoxScoreError("Failed to load box score.");
      setBoxScore(null);
      return null;
    } finally {
      setBoxScoreLoading(false);
    }
  }

  function clearBoxScore() {
    setSelectedGameId(null);
    setSelectedGame(null);
    setBoxScore(null);
    setBoxScoreError("");
    setBoxScoreLoading(false);
  }

  return {
    selectedGameId,
    selectedGame,
    boxScore,
    boxScoreLoading,
    boxScoreError,
    isBoxScoreOpen,
    setIsBoxScoreOpen,
    boxScoreRef,
    setSelectedGame,
    setSelectedGameId,
    setBoxScore,
    setBoxScoreError,
    setBoxScoreLoading,
    selectGame,
    reloadBoxScore,
    clearBoxScore,
  };
}
