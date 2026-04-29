// league.js
// MLB League model

class League {
  constructor({
    id,
    name,
    link,
    abbreviation,
    nameShort,
    seasonState,
    hasWildCard,
    hasSplitSeason,
    numGames,
    hasPlayoffPoints,
    numTeams,
    numWildcardTeams,
    season,
    orgCode,
    conferencesInUse,
    divisionsInUse,
    sport,
    sortOrder,
    active,
  }) {
    this.id = id;
    this.name = name;
    this.link = link;
    this.abbreviation = abbreviation;
    this.name_short = nameShort;
    this.season_state = seasonState;
    this.has_wild_card = !!hasWildCard;
    this.has_split_season = !!hasSplitSeason;
    this.num_games = numGames;
    this.has_playoff_points = !!hasPlayoffPoints;
    this.num_teams = numTeams;
    this.num_wildcard_teams = numWildcardTeams;
    this.season = season;
    this.org_code = orgCode;
    this.conferences_in_use = !!conferencesInUse;
    this.divisions_in_use = !!divisionsInUse;
    this.sport_id = sport?.id || null;
    this.sport_link = sport?.link || null;
    this.sort_order = sortOrder;
    this.active = !!active;
  }
}

module.exports = League;
