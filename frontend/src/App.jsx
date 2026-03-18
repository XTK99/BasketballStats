import { useState } from "react";
import { getPlayerGames } from "./api/nbaApi";

function App() {
  const [player, setPlayer] = useState("LeBron James");
  const [last, setLast] = useState(5);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    try {
      setLoading(true);
      setError("");
      const result = await getPlayerGames(player, last);
      setData(result);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>NBA Stats Viewer</h1>

      <input
        type="text"
        value={player}
        onChange={(e) => setPlayer(e.target.value)}
        placeholder="Enter player name"
      />

      <input
        type="number"
        value={last}
        onChange={(e) => setLast(Number(e.target.value))}
        min="1"
        max="20"
      />

      <button onClick={handleSearch}>Search</button>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {data && (
        <div>
          <h2>{data.player}</h2>
          <p>Season: {data.season}</p>
          <p>Games: {data.count}</p>

          <h3>Averages</h3>
          <p>PTS: {data.averages.points}</p>
          <p>REB: {data.averages.rebounds}</p>
          <p>AST: {data.averages.assists}</p>

          <h3>Games</h3>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Date</th>
                <th>Matchup</th>
                <th>Result</th>
                <th>PTS</th>
                <th>REB</th>
                <th>AST</th>
              </tr>
            </thead>
            <tbody>
              {data.games.map((game) => (
                <tr key={game.gameId}>
                  <td>{game.date}</td>
                  <td>{game.matchup}</td>
                  <td>{game.result}</td>
                  <td>{game.points}</td>
                  <td>{game.rebounds}</td>
                  <td>{game.assists}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
