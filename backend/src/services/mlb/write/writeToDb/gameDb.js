// gameDb.js
// Functions for inserting game records into the mlb_games table

const pool = require("../../../../../db/db.js");

/**
 * Mass insert game records into the mlb_games table. On conflict, do nothing.
 * @param {Array<Object>} games - Array of game objects
 */

async function saveGames(games, batchSize = 100) {
  if (!games || games.length === 0) return;
  const columns = [
    "game_id",
    "game_guid",
    "link",
    "game_type",
    "season",
    "game_date",
    "official_date",
    "status",
    "venue_id",
    "content_link",
    "is_tie",
    "game_number",
    "public_facing",
    "double_header",
    "gameday_type",
    "tiebreaker",
    "calendar_event_id",
    "season_display",
    "day_night",
    "scheduled_innings",
    "reverse_home_away_status",
    "inning_break_length",
    "games_in_series",
    "series_game_number",
    "series_description",
    "record_source",
    "if_necessary",
    "if_necessary_description",
    "home_team_id",
    "away_team_id",
  ];

  // Transform each game to extract nested properties
  function mapGamePayload(game) {
    return {
      gamePk: game.gamePk,
      gameGuid: game.gameGuid,
      link: game.link,
      gameType: game.gameType,
      season: game.season,
      gameDate: game.gameDate,
      officialDate: game.officialDate,
      status: game.status,
      venueId: game.venue?.id ?? null,
      contentLink: game.content?.link ?? null,
      isTie: game.isTie,
      gameNumber: game.gameNumber,
      publicFacing: game.publicFacing,
      doubleHeader: game.doubleHeader,
      gamedayType: game.gamedayType,
      tiebreaker: game.tiebreaker,
      calendarEventId: game.calendarEventID ?? game.calendarEventId ?? null,
      seasonDisplay: game.seasonDisplay,
      dayNight: game.dayNight,
      scheduledInnings: game.scheduledInnings,
      reverseHomeAwayStatus: game.reverseHomeAwayStatus,
      inningBreakLength: game.inningBreakLength,
      gamesInSeries: game.gamesInSeries,
      seriesGameNumber: game.seriesGameNumber,
      seriesDescription: game.seriesDescription,
      recordSource: game.recordSource,
      ifNecessary: game.ifNecessary,
      ifNecessaryDescription: game.ifNecessaryDescription,
      homeTeamId: game.teams?.home?.team?.id ?? null,
      awayTeamId: game.teams?.away?.team?.id ?? null,
    };
  }

  for (let i = 0; i < games.length; i += batchSize) {
    const batch = games.slice(i, i + batchSize).map(mapGamePayload);
    const valuePlaceholders = batch
      .map((_, idx) => {
        const base = idx * columns.length;
        const placeholders = columns.map((_, j) => `$${base + j + 1}`);
        return `(${placeholders.join(", ")})`;
      })
      .join(", ");

    const query = `
      INSERT INTO mlb_games (${columns.join(", ")})
      VALUES ${valuePlaceholders}
      ON CONFLICT (game_id) DO NOTHING;
    `;

    const values = batch.flatMap((game) => [
      game.gamePk,
      game.gameGuid,
      game.link,
      game.gameType,
      game.season,
      game.gameDate,
      game.officialDate,
      JSON.stringify(game.status),
      game.venueId,
      game.contentLink,
      game.isTie,
      game.gameNumber,
      game.publicFacing,
      game.doubleHeader,
      game.gamedayType,
      game.tiebreaker,
      game.calendarEventId,
      game.seasonDisplay,
      game.dayNight,
      game.scheduledInnings,
      game.reverseHomeAwayStatus,
      game.inningBreakLength,
      game.gamesInSeries,
      game.seriesGameNumber,
      game.seriesDescription,
      game.recordSource,
      game.ifNecessary,
      game.ifNecessaryDescription,
      game.homeTeamId,
      game.awayTeamId,
    ]);

    await pool.query(query, values);
  }
}

module.exports = {
  saveGames,
};
