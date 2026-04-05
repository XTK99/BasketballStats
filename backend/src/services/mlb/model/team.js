// team.js
// Data model for MLB teams, matching the recommended database table structure

// Team.js
// MLB Team model as a class

class Team {
  constructor({
    allStarStatus,
    id,
    name,
    link,
    season,
    venue,
    teamCode,
    fileCode,
    abbreviation,
    teamName,
    locationName,
    firstYearOfPlay,
    league,
    division,
    sport,
    shortName,
    parentOrgName,
    parentOrgId,
    franchiseName,
    clubName,
    active,
  }) {
    this.all_star_status = allStarStatus;
    this.id = id;
    this.name = name;
    this.link = link;
    this.season = season;
    this.venue_id = venue?.id;
    this.venue_name = venue?.name;
    this.venue_link = venue?.link;
    this.team_code = teamCode;
    this.file_code = fileCode;
    this.abbreviation = abbreviation;
    this.team_name = teamName;
    this.location_name = locationName;
    this.first_year_of_play = firstYearOfPlay;
    this.league_id = league?.id;
    this.league_name = league?.name;
    this.league_link = league?.link;
    this.division_id = division?.id;
    this.division_name = division?.name;
    this.division_link = division?.link;
    this.sport_id = sport?.id;
    this.sport_name = sport?.name;
    this.sport_link = sport?.link;
    this.short_name = shortName;
    this.parent_org_name = parentOrgName;
    this.parent_org_id = parentOrgId;
    this.franchise_name = franchiseName;
    this.club_name = clubName;
    this.active = !!active;
  }
}

module.exports = Team;
