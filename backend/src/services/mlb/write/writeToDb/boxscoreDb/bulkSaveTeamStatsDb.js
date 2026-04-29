// bulkSaveTeamStatsDb.js
// Accepts a map of { [gameId]: teamStatsArray } and saves all team stats in bulk.

const pool = require("../../../../../../db/db.js");

/**
 * Bulk saves team stats for multiple games in one query.
 * @param {Object} gameStatsMap - Map of gameId: teamStatsArray
 * @returns {Promise<{ saved: number }>} Summary of results
 */
async function bulkSaveTeamStatsDb(gameStatsMap) {
  const columns = [
    "game_id",
    "team_id",
    "is_home",
    "runs",
    "hits",
    "doubles",
    "triples",
    "home_runs",
    "at_bats",
    "plate_appearances",
    "total_bases",
    "rbi",
    "strikeouts",
    "walks",
    "intentional_walks",
    "hit_by_pitch",
    "stolen_bases",
    "caught_stealing",
    "left_on_base",
    "sac_bunts",
    "sac_flies",
    "gidp",
    "fly_outs",
    "ground_outs",
    "pop_outs",
    "line_outs",
    "pitching_runs",
    "earned_runs",
    "pitching_hits",
    "pitching_doubles",
    "pitching_triples",
    "pitching_home_runs",
    "pitching_strikeouts",
    "pitching_walks",
    "pitching_intentional_walks",
    "pitching_hit_by_pitch",
    "pitches_thrown",
    "strikes",
    "balls",
    "innings_pitched",
    "batters_faced",
    "outs",
    "wild_pitches",
    "balks",
    "pickoffs",
    "inherited_runners",
    "inherited_runners_scored",
    "fielding_errors",
    "assists",
    "put_outs",
    "passed_ball",
    "fielding_caught_stealing",
    "fielding_stolen_bases",
  ];

  // Flatten all teamStats into one array, each with game_id set
  const allStats = [];
  for (const [gameId, teamStatsArray] of Object.entries(gameStatsMap)) {
    for (const stats of teamStatsArray) {
      allStats.push({ ...stats, game_id: stats.game_id || gameId });
    }
  }
  if (!allStats.length) throw new Error("No team stats to save");

  const BATCH_SIZE = 1000;
  let saved = 0;
  for (let i = 0; i < allStats.length; i += BATCH_SIZE) {
    const batchStats = allStats.slice(i, i + BATCH_SIZE);
    const values = [];
    const placeholders = batchStats.map((stats, idx) => {
      const base = idx * columns.length;
      values.push(
        stats.game_id,
        stats.team_id,
        stats.is_home,
        stats.runs,
        stats.hits,
        stats.doubles,
        stats.triples,
        stats.home_runs,
        stats.at_bats,
        stats.plate_appearances,
        stats.total_bases,
        stats.rbi,
        stats.strikeouts,
        stats.walks,
        stats.intentional_walks,
        stats.hit_by_pitch,
        stats.stolen_bases,
        stats.caught_stealing,
        stats.left_on_base,
        stats.sac_bunts,
        stats.sac_flies,
        stats.gidp,
        stats.fly_outs,
        stats.ground_outs,
        stats.pop_outs,
        stats.line_outs,
        stats.pitching_runs,
        stats.earned_runs,
        stats.pitching_hits,
        stats.pitching_doubles,
        stats.pitching_triples,
        stats.pitching_home_runs,
        stats.pitching_strikeouts,
        stats.pitching_walks,
        stats.pitching_intentional_walks,
        stats.pitching_hit_by_pitch,
        stats.pitches_thrown,
        stats.strikes,
        stats.balls,
        stats.innings_pitched,
        stats.batters_faced,
        stats.outs,
        stats.wild_pitches,
        stats.balks,
        stats.pickoffs,
        stats.inherited_runners,
        stats.inherited_runners_scored,
        stats.fielding_errors,
        stats.assists,
        stats.put_outs,
        stats.passed_ball,
        stats.fielding_caught_stealing,
        stats.fielding_stolen_bases,
      );
      return `(${columns.map((_, j) => `$${base + j + 1}`).join(", ")})`;
    });

    const query = `
      INSERT INTO mlb_game_team_stats (
        ${columns.join(", ")}
      ) VALUES
        ${placeholders.join(",\n        ")}
      ON CONFLICT (game_id, team_id) DO UPDATE SET
        runs = EXCLUDED.runs,
        hits = EXCLUDED.hits,
        doubles = EXCLUDED.doubles,
        triples = EXCLUDED.triples,
        home_runs = EXCLUDED.home_runs,
        at_bats = EXCLUDED.at_bats,
        plate_appearances = EXCLUDED.plate_appearances,
        total_bases = EXCLUDED.total_bases,
        rbi = EXCLUDED.rbi,
        strikeouts = EXCLUDED.strikeouts,
        walks = EXCLUDED.walks,
        intentional_walks = EXCLUDED.intentional_walks,
        hit_by_pitch = EXCLUDED.hit_by_pitch,
        stolen_bases = EXCLUDED.stolen_bases,
        caught_stealing = EXCLUDED.caught_stealing,
        left_on_base = EXCLUDED.left_on_base,
        sac_bunts = EXCLUDED.sac_bunts,
        sac_flies = EXCLUDED.sac_flies,
        gidp = EXCLUDED.gidp,
        fly_outs = EXCLUDED.fly_outs,
        ground_outs = EXCLUDED.ground_outs,
        pop_outs = EXCLUDED.pop_outs,
        line_outs = EXCLUDED.line_outs,
        pitching_runs = EXCLUDED.pitching_runs,
        earned_runs = EXCLUDED.earned_runs,
        pitching_hits = EXCLUDED.pitching_hits,
        pitching_doubles = EXCLUDED.pitching_doubles,
        pitching_triples = EXCLUDED.pitching_triples,
        pitching_home_runs = EXCLUDED.pitching_home_runs,
        pitching_strikeouts = EXCLUDED.pitching_strikeouts,
        pitching_walks = EXCLUDED.pitching_walks,
        pitching_intentional_walks = EXCLUDED.pitching_intentional_walks,
        pitching_hit_by_pitch = EXCLUDED.pitching_hit_by_pitch,
        pitches_thrown = EXCLUDED.pitches_thrown,
        strikes = EXCLUDED.strikes,
        balls = EXCLUDED.balls,
        innings_pitched = EXCLUDED.innings_pitched,
        batters_faced = EXCLUDED.batters_faced,
        outs = EXCLUDED.outs,
        wild_pitches = EXCLUDED.wild_pitches,
        balks = EXCLUDED.balks,
        pickoffs = EXCLUDED.pickoffs,
        inherited_runners = EXCLUDED.inherited_runners,
        inherited_runners_scored = EXCLUDED.inherited_runners_scored,
        fielding_errors = EXCLUDED.fielding_errors,
        assists = EXCLUDED.assists,
        put_outs = EXCLUDED.put_outs,
        passed_ball = EXCLUDED.passed_ball,
        fielding_caught_stealing = EXCLUDED.fielding_caught_stealing,
        fielding_stolen_bases = EXCLUDED.fielding_stolen_bases
    `;
    await pool.query(query, values);
    saved += batchStats.length;
    console.log(
      `[bulkSaveTeamStatsDb] Saved batch: ${saved} total records so far.`,
    );
  }
  return { saved };
}

module.exports = { bulkSaveTeamStatsDb };
