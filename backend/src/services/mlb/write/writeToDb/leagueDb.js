// leagueDb.js
// Writes MLB leagues to the database

const pool = require("../../../../../db/db.js");

async function saveLeagues(leagues) {
  if (!Array.isArray(leagues) || !leagues.length)
    throw new Error("leagues must be a non-empty array");
  const columns = [
    "id",
    "name",
    "link",
    "abbreviation",
    "name_short",
    "season_state",
    "has_wild_card",
    "has_split_season",
    "num_games",
    "has_playoff_points",
    "num_teams",
    "num_wildcard_teams",
    "season",
    "org_code",
    "conferences_in_use",
    "divisions_in_use",
    "sport_id",
    "sport_link",
    "sort_order",
    "active",
  ];
  const values = [];
  const placeholders = leagues.map((league, i) => {
    const base = i * columns.length;
    values.push(
      league.id,
      league.name,
      league.link,
      league.abbreviation,
      league.nameShort,
      league.seasonState,
      league.hasWildCard ? 1 : 0,
      league.hasSplitSeason ? 1 : 0,
      league.numGames,
      league.hasPlayoffPoints ? 1 : 0,
      league.numTeams,
      league.numWildcardTeams,
      league.season,
      league.orgCode,
      league.conferencesInUse ? 1 : 0,
      league.divisionsInUse ? 1 : 0,
      league.sport?.id,
      league.sport?.link,
      league.sortOrder,
      league.active ? 1 : 0,
    );
    return `(${columns.map((_, j) => `$${base + j + 1}`).join(", ")})`;
  });
  const query = `
    INSERT INTO mlb_leagues (
      ${columns.join(", ")}
    ) VALUES
      ${placeholders.join(",\n      ")}
    ON CONFLICT (id) DO NOTHING
  `;
  await pool.query(query, values);
}

module.exports = { saveLeagues };
