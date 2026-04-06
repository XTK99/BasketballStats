// game.js
// Model representing an MLB game

class Game {
  constructor({
    gamePk,
    gameId, // allow both for compatibility
    gameGuid,
    link,
    gameType,
    season,
    gameDate,
    officialDate,
    status,
    venue,
    content,
    isTie,
    gameNumber,
    publicFacing,
    doubleHeader,
    gamedayType,
    tiebreaker,
    calendarEventId,
    seasonDisplay,
    dayNight,
    scheduledInnings,
    reverseHomeAwayStatus,
    inningBreakLength,
    gamesInSeries,
    seriesGameNumber,
    seriesDescription,
    recordSource,
    ifNecessary,
    ifNecessaryDescription,
    teams,
    homeTeamId,
    awayTeamId,
  }) {
    // Prefer gameId, fallback to gamePk for backward compatibility
    this.gameId = gameId ?? gamePk;
    this.gameGuid = gameGuid;
    this.link = link;
    this.gameType = gameType;
    this.season = season;
    this.gameDate = gameDate;
    this.officialDate = officialDate;
    this.status = status; // { abstractGameState, codedGameState, detailedState, statusCode, startTimeTBD, abstractGameCode }
    this.venueId = venue?.id;
    this.contentLink = content?.link;
    this.isTie = isTie;
    this.gameNumber = gameNumber;
    this.publicFacing = publicFacing;
    this.doubleHeader = doubleHeader;
    this.gamedayType = gamedayType;
    this.tiebreaker = tiebreaker;
    this.calendarEventId = calendarEventId;
    this.seasonDisplay = seasonDisplay;
    this.dayNight = dayNight;
    this.scheduledInnings = scheduledInnings;
    this.reverseHomeAwayStatus = reverseHomeAwayStatus;
    this.inningBreakLength = inningBreakLength;
    this.gamesInSeries = gamesInSeries;
    this.seriesGameNumber = seriesGameNumber;
    this.seriesDescription = seriesDescription;
    this.recordSource = recordSource;
    this.ifNecessary = ifNecessary;
    this.ifNecessaryDescription = ifNecessaryDescription;

    // Add homeTeamId and awayTeamId (from teams if not provided)
    this.homeTeamId = homeTeamId ?? teams?.home?.team?.id;
    this.awayTeamId = awayTeamId ?? teams?.away?.team?.id;
  }
}

module.exports = Game;
