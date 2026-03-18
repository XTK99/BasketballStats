const teams = [
  { id: 1610612737, name: "Atlanta Hawks", nickname: "Hawks", abbr: "ATL" },
  { id: 1610612738, name: "Boston Celtics", nickname: "Celtics", abbr: "BOS" },
  {
    id: 1610612739,
    name: "Cleveland Cavaliers",
    nickname: "Cavaliers",
    abbr: "CLE",
  },
  {
    id: 1610612740,
    name: "New Orleans Pelicans",
    nickname: "Pelicans",
    abbr: "NOP",
  },
  { id: 1610612741, name: "Chicago Bulls", nickname: "Bulls", abbr: "CHI" },
  {
    id: 1610612742,
    name: "Dallas Mavericks",
    nickname: "Mavericks",
    abbr: "DAL",
  },
  { id: 1610612743, name: "Denver Nuggets", nickname: "Nuggets", abbr: "DEN" },
  {
    id: 1610612744,
    name: "Golden State Warriors",
    nickname: "Warriors",
    abbr: "GSW",
  },
  { id: 1610612745, name: "Houston Rockets", nickname: "Rockets", abbr: "HOU" },
  { id: 1610612746, name: "LA Clippers", nickname: "Clippers", abbr: "LAC" },
  {
    id: 1610612747,
    name: "Los Angeles Lakers",
    nickname: "Lakers",
    abbr: "LAL",
  },
  { id: 1610612748, name: "Miami Heat", nickname: "Heat", abbr: "MIA" },
  { id: 1610612749, name: "Milwaukee Bucks", nickname: "Bucks", abbr: "MIL" },
  {
    id: 1610612750,
    name: "Minnesota Timberwolves",
    nickname: "Timberwolves",
    abbr: "MIN",
  },
  { id: 1610612751, name: "Brooklyn Nets", nickname: "Nets", abbr: "BKN" },
  { id: 1610612752, name: "New York Knicks", nickname: "Knicks", abbr: "NYK" },
  { id: 1610612753, name: "Orlando Magic", nickname: "Magic", abbr: "ORL" },
  { id: 1610612754, name: "Indiana Pacers", nickname: "Pacers", abbr: "IND" },
  {
    id: 1610612755,
    name: "Philadelphia 76ers",
    nickname: "76ers",
    abbr: "PHI",
  },
  { id: 1610612756, name: "Phoenix Suns", nickname: "Suns", abbr: "PHX" },
  {
    id: 1610612757,
    name: "Portland Trail Blazers",
    nickname: "Trail Blazers",
    abbr: "POR",
  },
  { id: 1610612758, name: "Sacramento Kings", nickname: "Kings", abbr: "SAC" },
  { id: 1610612759, name: "San Antonio Spurs", nickname: "Spurs", abbr: "SAS" },
  {
    id: 1610612760,
    name: "Oklahoma City Thunder",
    nickname: "Thunder",
    abbr: "OKC",
  },
  { id: 1610612761, name: "Toronto Raptors", nickname: "Raptors", abbr: "TOR" },
  { id: 1610612762, name: "Utah Jazz", nickname: "Jazz", abbr: "UTA" },
  {
    id: 1610612763,
    name: "Memphis Grizzlies",
    nickname: "Grizzlies",
    abbr: "MEM",
  },
  {
    id: 1610612764,
    name: "Washington Wizards",
    nickname: "Wizards",
    abbr: "WAS",
  },
  { id: 1610612765, name: "Detroit Pistons", nickname: "Pistons", abbr: "DET" },
  {
    id: 1610612766,
    name: "Charlotte Hornets",
    nickname: "Hornets",
    abbr: "CHA",
  },
];

function getTeamIdByName(input) {
  const search = input.trim().toLowerCase();

  const team = teams.find((t) => {
    const fullName = t.name?.toLowerCase();
    const nickname = t.nickname?.toLowerCase();
    const abbr = t.abbr?.toLowerCase();

    return fullName === search || nickname === search || abbr === search;
  });

  if (!team) {
    throw new Error(`Team not found: ${input}`);
  }

  return team.id;
}

module.exports = { getTeamIdByName, teams };
