const teams = [
  { teamId: 1610612737, teamName: "Atlanta Hawks", abbreviation: "ATL" },
  { teamId: 1610612738, teamName: "Boston Celtics", abbreviation: "BOS" },
  { teamId: 1610612751, teamName: "Brooklyn Nets", abbreviation: "BKN" },
  { teamId: 1610612766, teamName: "Charlotte Hornets", abbreviation: "CHA" },
  { teamId: 1610612741, teamName: "Chicago Bulls", abbreviation: "CHI" },
  { teamId: 1610612739, teamName: "Cleveland Cavaliers", abbreviation: "CLE" },
  { teamId: 1610612742, teamName: "Dallas Mavericks", abbreviation: "DAL" },
  { teamId: 1610612743, teamName: "Denver Nuggets", abbreviation: "DEN" },
  { teamId: 1610612765, teamName: "Detroit Pistons", abbreviation: "DET" },
  {
    teamId: 1610612744,
    teamName: "Golden State Warriors",
    abbreviation: "GSW",
  },
  { teamId: 1610612745, teamName: "Houston Rockets", abbreviation: "HOU" },
  { teamId: 1610612754, teamName: "Indiana Pacers", abbreviation: "IND" },
  { teamId: 1610612746, teamName: "Los Angeles Clippers", abbreviation: "LAC" },
  { teamId: 1610612747, teamName: "Los Angeles Lakers", abbreviation: "LAL" },
  { teamId: 1610612763, teamName: "Memphis Grizzlies", abbreviation: "MEM" },
  { teamId: 1610612748, teamName: "Miami Heat", abbreviation: "MIA" },
  { teamId: 1610612749, teamName: "Milwaukee Bucks", abbreviation: "MIL" },
  {
    teamId: 1610612750,
    teamName: "Minnesota Timberwolves",
    abbreviation: "MIN",
  },
  { teamId: 1610612740, teamName: "New Orleans Pelicans", abbreviation: "NOP" },
  { teamId: 1610612752, teamName: "New York Knicks", abbreviation: "NYK" },
  {
    teamId: 1610612760,
    teamName: "Oklahoma City Thunder",
    abbreviation: "OKC",
  },
  { teamId: 1610612753, teamName: "Orlando Magic", abbreviation: "ORL" },
  { teamId: 1610612755, teamName: "Philadelphia 76ers", abbreviation: "PHI" },
  { teamId: 1610612756, teamName: "Phoenix Suns", abbreviation: "PHX" },
  {
    teamId: 1610612757,
    teamName: "Portland Trail Blazers",
    abbreviation: "POR",
  },
  { teamId: 1610612758, teamName: "Sacramento Kings", abbreviation: "SAC" },
  { teamId: 1610612759, teamName: "San Antonio Spurs", abbreviation: "SAS" },
  { teamId: 1610612761, teamName: "Toronto Raptors", abbreviation: "TOR" },
  { teamId: 1610612762, teamName: "Utah Jazz", abbreviation: "UTA" },
  { teamId: 1610612764, teamName: "Washington Wizards", abbreviation: "WAS" },
];

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function searchTeamsByName(query, limit = 10) {
  const q = normalize(query);

  if (!q) return [];

  const startsWith = [];
  const includes = [];

  for (const team of teams) {
    const name = normalize(team.teamName);
    const abbr = normalize(team.abbreviation);

    if (name.startsWith(q) || abbr.startsWith(q)) {
      startsWith.push(team);
    } else if (name.includes(q) || abbr.includes(q)) {
      includes.push(team);
    }
  }

  return [...startsWith, ...includes].slice(0, limit);
}

module.exports = {
  searchTeamsByName,
};
