function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const TEAM_NAME_MAP = {
  ATL: "atlanta hawks",
  BOS: "boston celtics",
  BKN: "brooklyn nets",
  CHA: "charlotte hornets",
  CHI: "chicago bulls",
  CLE: "cleveland cavaliers",
  DAL: "dallas mavericks",
  DEN: "denver nuggets",
  DET: "detroit pistons",
  GSW: "golden state warriors",
  HOU: "houston rockets",
  IND: "indiana pacers",
  LAC: "los angeles clippers",
  LAL: "los angeles lakers",
  MEM: "memphis grizzlies",
  MIA: "miami heat",
  MIL: "milwaukee bucks",
  MIN: "minnesota timberwolves",
  NOP: "new orleans pelicans",
  NYK: "new york knicks",
  OKC: "oklahoma city thunder",
  ORL: "orlando magic",
  PHI: "philadelphia 76ers",
  PHX: "phoenix suns",
  POR: "portland trail blazers",
  SAC: "sacramento kings",
  SAS: "san antonio spurs",
  TOR: "toronto raptors",
  UTA: "utah jazz",
  WAS: "washington wizards",
};

function getEventText(event) {
  return normalizeText(
    [
      event?.ticker,
      event?.title,
      event?.subtitle,
      event?.series_ticker,
      event?.category,
      event?.mutually_exclusive_category,
    ].join(" "),
  );
}

function getOpponentAliases(opponent) {
  const abbr = String(opponent || "").toUpperCase();
  const fullName = TEAM_NAME_MAP[abbr];

  return Array.from(
    new Set([normalizeText(abbr), normalizeText(fullName)].filter(Boolean)),
  );
}

function getTeamAliasesForPlayerContext() {
  return ["lal", "los angeles lakers", "lakers"];
}

export function findKalshiEventForGame({ events, game, playerName }) {
  const safeEvents = Array.isArray(events) ? events : [];
  const opponentAliases = getOpponentAliases(game?.opponent);
  const lakersAliases = getTeamAliasesForPlayerContext();

  const scored = safeEvents.map((event) => {
    const text = getEventText(event);

    const hasOpponent = opponentAliases.some(
      (alias) => alias && text.includes(alias),
    );

    const hasLakers = lakersAliases.some(
      (alias) => alias && text.includes(alias),
    );

    const hasSportsWords =
      text.includes("nba") ||
      text.includes("basketball") ||
      text.includes("points") ||
      text.includes("rebounds") ||
      text.includes("assists") ||
      text.includes("minutes") ||
      text.includes("threes");

    let score = 0;
    if (hasOpponent) score += 8;
    if (hasLakers) score += 8;
    if (hasSportsWords) score += 4;
    if (Array.isArray(event?.markets) && event.markets.length > 0) score += 4;

    return {
      event,
      text,
      score,
      hasOpponent,
      hasLakers,
      hasSportsWords,
    };
  });

  scored.sort((a, b) => b.score - a.score);

  console.log("KALSHI EVENT MATCH DEBUG", {
    playerName,
    gameId: game?.gameId,
    matchup: game?.matchup,
    opponent: game?.opponent,
    topEvents: scored.slice(0, 10).map((item) => ({
      ticker: item.event?.ticker,
      title: item.event?.title,
      subtitle: item.event?.subtitle,
      series_ticker: item.event?.series_ticker,
      score: item.score,
      hasOpponent: item.hasOpponent,
      hasLakers: item.hasLakers,
      hasSportsWords: item.hasSportsWords,
      marketCount: Array.isArray(item.event?.markets)
        ? item.event.markets.length
        : 0,
      text: item.text,
    })),
  });

  const best = scored[0];

  if (!best || best.score < 8) {
    return null;
  }

  return best.event;
}
