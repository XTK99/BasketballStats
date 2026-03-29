import { useMemo, useState } from "react";

function KalshiDashboard({
  groupedMarkets = [],
  loading = false,
  error = "",
  defaultTeamQuery = "",
}) {
  const [selectedDateCode, setSelectedDateCode] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(defaultTeamQuery || "");
  const [selectedMarketType, setSelectedMarketType] = useState("all");
  const [selectedPlayer, setSelectedPlayer] = useState("");

  const filteredMarkets = useMemo(() => {
    return groupedMarkets.filter((group) => {
      if (
        selectedDateCode &&
        group.dateCode !== selectedDateCode.toUpperCase()
      ) {
        return false;
      }

      if (selectedMarketType === "game" && !group.gameMarket) {
        return false;
      }

      if (
        selectedMarketType === "spread" &&
        (!group.spreadMarkets || group.spreadMarkets.length === 0)
      ) {
        return false;
      }

      if (
        selectedMarketType === "total" &&
        (!group.totalMarkets || group.totalMarkets.length === 0)
      ) {
        return false;
      }

      if (
        selectedMarketType === "points" &&
        (!group.pointsMarkets || group.pointsMarkets.length === 0)
      ) {
        return false;
      }

      if (
        selectedMarketType === "rebounds" &&
        (!group.reboundMarkets || group.reboundMarkets.length === 0)
      ) {
        return false;
      }

      if (
        selectedMarketType === "assists" &&
        (!group.assistMarkets || group.assistMarkets.length === 0)
      ) {
        return false;
      }

      if (
        selectedMarketType === "threes" &&
        (!group.threePointMarkets || group.threePointMarkets.length === 0)
      ) {
        return false;
      }

      if (selectedPlayer.trim()) {
        const playerText = selectedPlayer.toLowerCase();

        const allMarkets = [
          group.gameMarket,
          ...(group.spreadMarkets || []),
          ...(group.totalMarkets || []),
          ...(group.pointsMarkets || []),
          ...(group.reboundMarkets || []),
          ...(group.assistMarkets || []),
          ...(group.threePointMarkets || []),
          ...(group.futuresMarkets || []),
          ...(group.otherMarkets || []),
        ].filter(Boolean);

        const hasPlayerMatch = allMarkets.some((market) => {
          const text = [
            market?.title,
            market?.subtitle,
            market?.yesSubTitle,
            market?.noSubTitle,
            market?.ticker,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return text.includes(playerText);
        });

        if (!hasPlayerMatch) {
          return false;
        }
      }

      return true;
    });
  }, [groupedMarkets, selectedDateCode, selectedMarketType, selectedPlayer]);

  return (
    <div className="betting-view-stack">
      <section className="panel-card">
        <h3 className="panel-title">Kalshi Dashboard</h3>
        <p className="panel-subtitle">
          Explore grouped Kalshi NBA markets by date, team, market type, and
          eventually player.
        </p>

        <div className="simulator-controls">
          <div className="simulator-control">
            <label>Date Code</label>
            <input
              type="text"
              placeholder="Example: 26MAR21"
              value={selectedDateCode}
              onChange={(event) => setSelectedDateCode(event.target.value)}
            />
          </div>

          <div className="simulator-control">
            <label>Team</label>
            <input
              type="text"
              value={selectedTeam}
              onChange={(event) => setSelectedTeam(event.target.value)}
              placeholder="Lakers"
            />
          </div>

          <div className="simulator-control">
            <label>Market Type</label>
            <select
              value={selectedMarketType}
              onChange={(event) => setSelectedMarketType(event.target.value)}
            >
              <option value="all">All</option>
              <option value="game">Game Winner</option>
              <option value="spread">Spread</option>
              <option value="total">Total</option>
              <option value="points">Points</option>
              <option value="rebounds">Rebounds</option>
              <option value="assists">Assists</option>
              <option value="threes">3PT</option>
            </select>
          </div>

          <div className="simulator-control">
            <label>Player</label>
            <input
              type="text"
              placeholder="Optional player filter"
              value={selectedPlayer}
              onChange={(event) => setSelectedPlayer(event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="panel-card">
        <div className="boxscore-section-header">
          <h3 className="panel-title">Grouped Kalshi Markets</h3>
          <span>{filteredMarkets.length} grouped events</span>
        </div>

        {loading && <p>Loading Kalshi markets...</p>}
        {error && <p className="status-error">{error}</p>}

        {!loading && !error && filteredMarkets.length === 0 && (
          <p>No grouped Kalshi markets found.</p>
        )}

        {!loading &&
          !error &&
          filteredMarkets.map((group) => (
            <div
              key={group.eventTicker}
              className="panel-card"
              style={{ marginTop: 16 }}
            >
              <h4 className="panel-title">{group.eventTicker}</h4>
              <p>
                Date: {group.dateCode || "—"} | Matchup:{" "}
                {group.matchupCode || "—"}
              </p>

              {group.gameMarket && (
                <div style={{ marginTop: 12 }}>
                  <strong>Game Winner</strong>
                  <p>{group.gameMarket.ticker}</p>
                  <p>{group.gameMarket.title}</p>
                </div>
              )}

              {group.spreadMarkets?.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <strong>Spread Markets ({group.spreadMarkets.length})</strong>
                  {group.spreadMarkets.map((market) => (
                    <p key={market.ticker}>{market.ticker}</p>
                  ))}
                </div>
              )}

              {group.totalMarkets?.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <strong>Total Markets ({group.totalMarkets.length})</strong>
                  {group.totalMarkets.map((market) => (
                    <p key={market.ticker}>{market.ticker}</p>
                  ))}
                </div>
              )}

              {group.pointsMarkets?.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <strong>Points Markets ({group.pointsMarkets.length})</strong>
                  {group.pointsMarkets.map((market) => (
                    <p key={market.ticker}>{market.ticker}</p>
                  ))}
                </div>
              )}

              {group.reboundMarkets?.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <strong>
                    Rebound Markets ({group.reboundMarkets.length})
                  </strong>
                  {group.reboundMarkets.map((market) => (
                    <p key={market.ticker}>{market.ticker}</p>
                  ))}
                </div>
              )}

              {group.assistMarkets?.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <strong>Assist Markets ({group.assistMarkets.length})</strong>
                  {group.assistMarkets.map((market) => (
                    <p key={market.ticker}>{market.ticker}</p>
                  ))}
                </div>
              )}

              {group.threePointMarkets?.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <strong>
                    3PT Markets ({group.threePointMarkets.length})
                  </strong>
                  {group.threePointMarkets.map((market) => (
                    <p key={market.ticker}>{market.ticker}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
      </section>
    </div>
  );
}

export default KalshiDashboard;
