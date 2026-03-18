const teams = [
  { teamId: 1610612737, teamName: "Atlanta Hawks" },
  { teamId: 1610612738, teamName: "Boston Celtics" },
  { teamId: 1610612739, teamName: "Cleveland Cavaliers" },
  { teamId: 1610612740, teamName: "New Orleans Pelicans" },
  { teamId: 1610612741, teamName: "Chicago Bulls" },
  { teamId: 1610612742, teamName: "Dallas Mavericks" },
  { teamId: 1610612743, teamName: "Denver Nuggets" },
  { teamId: 1610612744, teamName: "Golden State Warriors" },
  { teamId: 1610612745, teamName: "Houston Rockets" },
  { teamId: 1610612746, teamName: "LA Clippers" },
  { teamId: 1610612747, teamName: "Los Angeles Lakers" },
  { teamId: 1610612748, teamName: "Miami Heat" },
  { teamId: 1610612749, teamName: "Milwaukee Bucks" },
  { teamId: 1610612750, teamName: "Minnesota Timberwolves" },
  { teamId: 1610612751, teamName: "Brooklyn Nets" },
  { teamId: 1610612752, teamName: "New York Knicks" },
  { teamId: 1610612753, teamName: "Orlando Magic" },
  { teamId: 1610612754, teamName: "Indiana Pacers" },
  { teamId: 1610612755, teamName: "Philadelphia 76ers" },
  { teamId: 1610612756, teamName: "Phoenix Suns" },
  { teamId: 1610612757, teamName: "Portland Trail Blazers" },
  { teamId: 1610612758, teamName: "Sacramento Kings" },
  { teamId: 1610612759, teamName: "San Antonio Spurs" },
  { teamId: 1610612760, teamName: "Oklahoma City Thunder" },
  { teamId: 1610612761, teamName: "Toronto Raptors" },
  { teamId: 1610612762, teamName: "Utah Jazz" },
  { teamId: 1610612763, teamName: "Memphis Grizzlies" },
  { teamId: 1610612764, teamName: "Washington Wizards" },
  { teamId: 1610612765, teamName: "Detroit Pistons" },
  { teamId: 1610612766, teamName: "Charlotte Hornets" },
];

function normalizeTeamName(str) {
  return str.toLowerCase().trim();
}

function getTeamIdByName(teamName) {
  const team = teams.find(
    (t) => normalizeTeamName(t.teamName) === normalizeTeamName(teamName),
  );

  if (!team) {
    throw new Error(`Team not found: ${teamName}`);
  }

  return team.teamId;
}

module.exports = {
  getTeamIdByName,
  teams,
};
