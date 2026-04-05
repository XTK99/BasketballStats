// team.js
// Data model for MLB teams, matching the recommended database table structure

// Team.js
// MLB Team model as a class

class Team {
  constructor({
    id,
    name,
    team_name,
    abbreviation,
    location_name,
    short_name,
    franchise_name,
    club_name,
    first_year_of_play,
    active,
    league_id,
    division_id,
    venue_id,
    season,
    team_code,
    file_code,
  }) {
    this.id = id;
    this.name = name;
    this.team_name = team_name;
    this.abbreviation = abbreviation;
    this.location_name = location_name;
    this.short_name = short_name;
    this.franchise_name = franchise_name;
    this.club_name = club_name;
    this.first_year_of_play = first_year_of_play;
    this.active = !!active;
    this.league_id = league_id;
    this.division_id = division_id;
    this.venue_id = venue_id;
    this.season = season;
    this.team_code = team_code;
    this.file_code = file_code;
  }
}

module.exports = Team;
