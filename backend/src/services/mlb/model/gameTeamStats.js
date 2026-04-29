// gameTeamStats.js
// Model for MLB game team stats

class GameTeamStats {
  constructor({
    game_team_stats_id = null,
    game_id,
    team_id,
    is_home,
    // Batting
    runs = 0,
    hits = 0,
    doubles = 0,
    triples = 0,
    home_runs = 0,
    at_bats = 0,
    plate_appearances = 0,
    total_bases = 0,
    rbi = 0,
    strikeouts = 0,
    walks = 0,
    intentional_walks = 0,
    hit_by_pitch = 0,
    stolen_bases = 0,
    caught_stealing = 0,
    left_on_base = 0,
    sac_bunts = 0,
    sac_flies = 0,
    gidp = 0,
    fly_outs = 0,
    ground_outs = 0,
    pop_outs = 0,
    line_outs = 0,
    // Pitching
    pitching_runs = 0,
    earned_runs = 0,
    pitching_hits = 0,
    pitching_doubles = 0,
    pitching_triples = 0,
    pitching_home_runs = 0,
    pitching_strikeouts = 0,
    pitching_walks = 0,
    pitching_intentional_walks = 0,
    pitching_hit_by_pitch = 0,
    pitches_thrown = 0,
    strikes = 0,
    balls = 0,
    innings_pitched = 0.0,
    batters_faced = 0,
    outs = 0,
    wild_pitches = 0,
    balks = 0,
    pickoffs = 0,
    inherited_runners = 0,
    inherited_runners_scored = 0,
    // Fielding
    fielding_errors = 0,
    assists = 0,
    put_outs = 0,
    passed_ball = 0,
    fielding_caught_stealing = 0,
    fielding_stolen_bases = 0,
  }) {
    this.game_team_stats_id = game_team_stats_id;
    this.game_id = game_id;
    this.team_id = team_id;
    this.is_home = is_home;
    // Batting
    this.runs = runs;
    this.hits = hits;
    this.doubles = doubles;
    this.triples = triples;
    this.home_runs = home_runs;
    this.at_bats = at_bats;
    this.plate_appearances = plate_appearances;
    this.total_bases = total_bases;
    this.rbi = rbi;
    this.strikeouts = strikeouts;
    this.walks = walks;
    this.intentional_walks = intentional_walks;
    this.hit_by_pitch = hit_by_pitch;
    this.stolen_bases = stolen_bases;
    this.caught_stealing = caught_stealing;
    this.left_on_base = left_on_base;
    this.sac_bunts = sac_bunts;
    this.sac_flies = sac_flies;
    this.gidp = gidp;
    this.fly_outs = fly_outs;
    this.ground_outs = ground_outs;
    this.pop_outs = pop_outs;
    this.line_outs = line_outs;
    // Pitching
    this.pitching_runs = pitching_runs;
    this.earned_runs = earned_runs;
    this.pitching_hits = pitching_hits;
    this.pitching_doubles = pitching_doubles;
    this.pitching_triples = pitching_triples;
    this.pitching_home_runs = pitching_home_runs;
    this.pitching_strikeouts = pitching_strikeouts;
    this.pitching_walks = pitching_walks;
    this.pitching_intentional_walks = pitching_intentional_walks;
    this.pitching_hit_by_pitch = pitching_hit_by_pitch;
    this.pitches_thrown = pitches_thrown;
    this.strikes = strikes;
    this.balls = balls;
    this.innings_pitched = innings_pitched;
    this.batters_faced = batters_faced;
    this.outs = outs;
    this.wild_pitches = wild_pitches;
    this.balks = balks;
    this.pickoffs = pickoffs;
    this.inherited_runners = inherited_runners;
    this.inherited_runners_scored = inherited_runners_scored;
    // Fielding
    this.fielding_errors = fielding_errors;
    this.assists = assists;
    this.put_outs = put_outs;
    this.passed_ball = passed_ball;
    this.fielding_caught_stealing = fielding_caught_stealing;
    this.fielding_stolen_bases = fielding_stolen_bases;
  }
}

module.exports = { GameTeamStats };
