function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\w\s.+]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getStatAliases(statKey) {
  const map = {
    points: ["points", "point", "pts", "player points"],
    rebounds: ["rebounds", "rebound", "reb"],
    assists: ["assists", "assist", "ast"],
    minutes: ["minutes", "mins", "min"],
    threePointersMade: [
      "threes",
      "three pointers",
      "3 pointers",
      "3-pointers",
      "3pt",
      "3pt made",
      "three pointers made",
      "made threes",
    ],
  };

  return map[statKey] || [statKey];
}

const DEBUG_ALLOW_FALLBACK_MARKET = true;

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

function flattenValues(value, bucket = []) {
  if (value == null) return bucket;

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    bucket.push(String(value));
    return bucket;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => flattenValues(item, bucket));
    return bucket;
  }

  if (typeof value === "object") {
    Object.values(value).forEach((item) => flattenValues(item, bucket));
    return bucket;
  }

  return bucket;
}

function getMarketText(market) {
  return normalizeText(
    [
      market?.title,
      market?.subtitle,
      market?.question,
      market?.yes_sub_title,
      market?.no_sub_title,
      ...flattenValues(market?.custom_strike),
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function looksLikeBasketballPlayerProp(text) {
  return (
    text.includes("points") ||
    text.includes("point") ||
    text.includes("pts") ||
    text.includes("rebounds") ||
    text.includes("rebound") ||
    text.includes("reb") ||
    text.includes("assists") ||
    text.includes("assist") ||
    text.includes("ast") ||
    text.includes("minutes") ||
    text.includes("mins") ||
    text.includes("min") ||
    text.includes("threes") ||
    text.includes("three pointers") ||
    text.includes("3 pointers") ||
    text.includes("3-pointers") ||
    text.includes("3pt")
  );
}

function hasBadTickerFamily(market) {
  const ticker = String(market?.ticker || "").toUpperCase();
  const eventTicker = String(market?.event_ticker || "").toUpperCase();

  return (
    ticker.includes("CROSSCATEGORY") ||
    ticker.includes("MULTIGAME") ||
    ticker.includes("EXTENDED") ||
    eventTicker.includes("CROSSCATEGORY") ||
    eventTicker.includes("MULTIGAME") ||
    eventTicker.includes("EXTENDED")
  );
}

function parseNumericLine(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function getKalshiMilestoneLine(line, marketType) {
  const numeric = Number(line);
  if (!Number.isFinite(numeric)) return null;

  if (marketType === "over") {
    return Math.floor(numeric) + 1;
  }

  return null;
}

function textHasLine(text, line) {
  if (line == null) return false;

  const candidates = [String(line), line.toFixed(1), String(Math.trunc(line))];

  return candidates.some((candidate) => {
    const escaped = candidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|\\s)${escaped}($|\\s)`);
    return regex.test(text);
  });
}

function textHasKalshiMilestone(text, line, marketType) {
  const milestone = getKalshiMilestoneLine(line, marketType);
  if (milestone == null) return false;

  return [
    `${milestone} +`,
    `${milestone}+`,
    `${milestone}plus`,
    `${milestone} plus`,
    `${milestone} or more`,
    `at least ${milestone}`,
  ].some((candidate) => text.includes(candidate));
}

function getPlayerAliases(playerName) {
  const normalized = normalizeText(playerName);
  const parts = normalized.split(" ").filter(Boolean);

  if (parts.length === 0) return [];
  if (parts.length === 1) return [normalized];

  const first = parts[0];
  const last = parts[parts.length - 1];
  const firstInitialLast = `${first[0]} ${last}`;
  const firstInitialDotLast = `${first[0]}. ${last}`;

  return Array.from(
    new Set([
      normalized,
      `${first} ${last}`,
      firstInitialLast,
      firstInitialDotLast,
      last,
    ]),
  );
}

function getOpponentAliases(opponent) {
  const abbr = String(opponent || "").toUpperCase();
  const fullName = TEAM_NAME_MAP[abbr];

  return Array.from(
    new Set([normalizeText(abbr), normalizeText(fullName)].filter(Boolean)),
  );
}

function getStrikeCandidates(market) {
  const strike = market?.custom_strike;
  if (!strike || typeof strike !== "object") return [];

  return Object.values(strike)
    .flatMap((value) => {
      if (value == null) return [];
      if (typeof value === "number") return [String(value), value.toFixed(1)];
      if (typeof value === "string") return [value];
      if (typeof value === "object") {
        return Object.values(value).flatMap((nested) => {
          if (nested == null) return [];
          if (typeof nested === "number") {
            return [String(nested), nested.toFixed(1)];
          }
          if (typeof nested === "string") return [nested];
          return [];
        });
      }
      return [];
    })
    .map((value) => normalizeText(value));
}

function marketHasLine(market, text, line, marketType) {
  if (line == null) return false;

  const candidates = [String(line), line.toFixed(1), String(Math.trunc(line))];

  if (marketType === "over" && String(line).includes(".")) {
    const milestone = Math.floor(line) + 1;
    candidates.push(
      String(milestone),
      `${milestone}+`,
      `${milestone} +`,
      `${milestone} plus`,
      `${milestone} or more`,
      `at least ${milestone}`,
    );
  }

  if (marketType === "under" && String(line).includes(".")) {
    const milestone = Math.ceil(line) - 1;
    candidates.push(
      String(milestone),
      `under ${milestone + 1}`,
      `less than ${milestone + 1}`,
      `fewer than ${milestone + 1}`,
      `${milestone} or fewer`,
      `at most ${milestone}`,
    );
  }

  const normalizedCandidates = candidates.map(normalizeText);
  const strikeValues = getStrikeCandidates(market);

  return normalizedCandidates.some(
    (candidate) =>
      text.includes(candidate) ||
      strikeValues.some((strike) => strike.includes(candidate)),
  );
}

function marketHasSide(text, marketType) {
  if (marketType === "over") {
    return (
      text.includes("over") ||
      text.includes(" or more") ||
      text.includes("at least")
    );
  }

  if (marketType === "under") {
    return (
      text.includes("under") ||
      text.includes("less than") ||
      text.includes("fewer than") ||
      text.includes(" or fewer") ||
      text.includes("at most")
    );
  }

  return false;
}

export function findKalshiMarketForGame({
  markets,
  playerName,
  statKey,
  line,
  marketType,
  opponent,
  gameId,
  matchup,
}) {
  const safeMarkets = Array.isArray(markets) ? markets : [];

  const playerAliases = getPlayerAliases(playerName);
  const opponentAliases = getOpponentAliases(opponent);
  const targetStats = getStatAliases(statKey).map(normalizeText);
  const targetLine = parseNumericLine(line);

  const scoredMarkets = safeMarkets
    .filter((market) => !hasBadTickerFamily(market))
    .map((market) => {
      const text = getMarketText(market);
      const looksRelevant = looksLikeBasketballPlayerProp(text);

      const hasPlayer = playerAliases.some(
        (alias) => alias && text.includes(alias),
      );
      const hasOpponent = opponentAliases.some(
        (alias) => alias && text.includes(alias),
      );
      const hasStat = targetStats.some(
        (alias) => alias && text.includes(alias),
      );
      const hasExactLine = textHasLine(text, targetLine);
      const hasMilestoneLine = textHasKalshiMilestone(
        text,
        targetLine,
        marketType,
      );
      const hasStructuredLine = marketHasLine(
        market,
        text,
        targetLine,
        marketType,
      );
      const hasLine = hasExactLine || hasMilestoneLine || hasStructuredLine;
      const hasSide = marketHasSide(text, marketType);

      let score = 0;

      if (looksRelevant) score += 6;
      if (hasPlayer) score += 10;
      if (hasStat) score += 8;
      if (hasOpponent) score += 5;
      if (hasLine) score += 4;
      if (hasSide) score += 2;
      if (market?.series_ticker) score += 2;
      if (Number.isFinite(Number(market?.settled_ts))) score += 1;

      return {
        market,
        text,
        score,
        looksRelevant,
        hasPlayer,
        hasOpponent,
        hasStat,
        hasSide,
        hasLine,
        hasExactLine,
        hasMilestoneLine,
        hasStructuredLine,
      };
    });

  const candidates = scoredMarkets
    .filter((item) => item.looksRelevant && item.hasPlayer && item.hasStat)
    .sort((a, b) => b.score - a.score);

  const best = candidates[0];

  if (!best) {
    const fallback = scoredMarkets
      .filter((item) => item.looksRelevant && (item.hasPlayer || item.hasStat))
      .sort((a, b) => b.score - a.score)[0];

    if (!DEBUG_ALLOW_FALLBACK_MARKET || !fallback) {
      return null;
    }

    return {
      marketTicker:
        fallback.market?.ticker ??
        fallback.market?.market_ticker ??
        fallback.market?.id ??
        null,
      seriesTicker:
        fallback.market?.series_ticker ??
        fallback.market?.seriesTicker ??
        fallback.market?.event_ticker ??
        null,
      marketSettledTs:
        fallback.market?.settled_ts ??
        fallback.market?.market_settled_ts ??
        fallback.market?.close_time ??
        null,
      marketTitle:
        fallback.market?.title ??
        fallback.market?.question ??
        fallback.market?.subtitle ??
        "",
      rawMarket: fallback.market,
    };
  }

  return {
    marketTicker:
      best.market?.ticker ??
      best.market?.market_ticker ??
      best.market?.id ??
      null,
    seriesTicker:
      best.market?.series_ticker ??
      best.market?.seriesTicker ??
      best.market?.event_ticker ??
      null,
    marketSettledTs:
      best.market?.settled_ts ??
      best.market?.market_settled_ts ??
      best.market?.close_time ??
      null,
    marketTitle:
      best.market?.title ??
      best.market?.question ??
      best.market?.subtitle ??
      "",
    rawMarket: best.market,
  };
}
