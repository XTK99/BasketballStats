function mapTeamStats(teamObj, is_home, gameId) {
  if (!teamObj || !teamObj.teamStats) return null;
  const batting = teamObj.teamStats.batting || {};
  const pitching = teamObj.teamStats.pitching || {};
  const fielding = teamObj.teamStats.fielding || {};

  return {
    game_id: gameId,
    team_id: teamObj.team?.id ? String(teamObj.team.id) : undefined,
    is_home,
    // Batting
    runs: batting.runs ?? 0,
    hits: batting.hits ?? 0,
    doubles: batting.doubles ?? 0,
    triples: batting.triples ?? 0,
    home_runs: batting.homeRuns ?? 0,
    at_bats: batting.atBats ?? 0,
    plate_appearances: batting.plateAppearances ?? 0,
    total_bases: batting.totalBases ?? 0,
    rbi: batting.rbi ?? 0,
    strikeouts: batting.strikeOuts ?? 0,
    walks: batting.baseOnBalls ?? 0,
    intentional_walks: batting.intentionalWalks ?? 0,
    hit_by_pitch: batting.hitByPitch ?? 0,
    stolen_bases: batting.stolenBases ?? 0,
    caught_stealing: batting.caughtStealing ?? 0,
    left_on_base: batting.leftOnBase ?? 0,
    sac_bunts: batting.sacBunts ?? 0,
    sac_flies: batting.sacFlies ?? 0,
    gidp: batting.groundIntoDoublePlay ?? 0,
    fly_outs: batting.flyOuts ?? 0,
    ground_outs: batting.groundOuts ?? 0,
    pop_outs: batting.popOuts ?? 0,
    line_outs: batting.lineOuts ?? 0,
    // Pitching
    pitching_runs: pitching.runs ?? 0,
    earned_runs: pitching.earnedRuns ?? 0,
    pitching_hits: pitching.hits ?? 0,
    pitching_doubles: pitching.doubles ?? 0,
    pitching_triples: pitching.triples ?? 0,
    pitching_home_runs: pitching.homeRuns ?? 0,
    pitching_strikeouts: pitching.strikeOuts ?? 0,
    pitching_walks: pitching.baseOnBalls ?? 0,
    pitching_intentional_walks: pitching.intentionalWalks ?? 0,
    pitching_hit_by_pitch: pitching.hitByPitch ?? 0,
    pitches_thrown: pitching.pitchesThrown ?? pitching.numberOfPitches ?? 0,
    strikes: pitching.strikes ?? 0,
    balls: pitching.balls ?? 0,
    innings_pitched: parseFloat(pitching.inningsPitched) || 0,
    batters_faced: pitching.battersFaced ?? 0,
    outs: pitching.outs ?? 0,
    wild_pitches: pitching.wildPitches ?? 0,
    balks: pitching.balks ?? 0,
    pickoffs: pitching.pickoffs ?? 0,
    inherited_runners: pitching.inheritedRunners ?? 0,
    inherited_runners_scored: pitching.inheritedRunnersScored ?? 0,
    // Fielding
    fielding_errors: fielding.errors ?? 0,
    assists: fielding.assists ?? 0,
    put_outs: fielding.putOuts ?? 0,
    passed_ball: fielding.passedBall ?? 0,
    fielding_caught_stealing: fielding.caughtStealing ?? 0,
    fielding_stolen_bases: fielding.stolenBases ?? 0,
  };
}

module.exports = { mapTeamStats };
