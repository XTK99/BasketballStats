// division.js
// Division model for MLB divisions

/**
 * Example Division object:
 * {
 *   id: 6011,
 *   name: "Cape Cod East Division",
 *   season: "2026",
 *   nameShort: "CCBL East",
 *   link: "/api/v1/divisions/6011",
 *   abbreviation: "CCE",
 *   league: { id: 565, link: "/api/v1/league/565" },
 *   sport: { id: 22, link: "/api/v1/sports/22" },
 *   hasWildcard: true,
 *   sortOrder: 2312,
 *   numPlayoffTeams: 4,
 *   active: true
 * }
 */

class Division {
  constructor({
    id,
    name,
    season,
    nameShort,
    link,
    abbreviation,
    league,
    sport,
    hasWildcard,
    sortOrder,
    numPlayoffTeams,
    active,
  }) {
    this.id = id;
    this.name = name;
    this.season = season;
    this.nameShort = nameShort;
    this.link = link;
    this.abbreviation = abbreviation;
    this.league = league;
    this.sport = sport;
    this.hasWildcard = hasWildcard;
    this.sortOrder = sortOrder;
    this.numPlayoffTeams = numPlayoffTeams;
    this.active = active;
  }
}

module.exports = Division;
