CREATE TABLE players (
  id INTEGER PRIMARY KEY,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  is_active BOOLEAN,
  team_id INTEGER
);

CREATE TABLE teams (
  id INTEGER PRIMARY KEY,
  full_name TEXT,
  abbreviation TEXT
);

CREATE TABLE games (
  game_id TEXT PRIMARY KEY,
  game_date DATE,
  season TEXT,
  home_team_id INTEGER,
  away_team_id INTEGER,
  home_points INTEGER,
  away_points INTEGER
);

CREATE TABLE player_game_logs (
  id SERIAL PRIMARY KEY,
  game_id TEXT,
  player_id INTEGER,
  team_id INTEGER,
  opponent_team_id INTEGER,
  game_date DATE,
  is_home BOOLEAN,
  is_win BOOLEAN,
  minutes FLOAT,
  points INTEGER,
  rebounds INTEGER,
  assists INTEGER,
  steals INTEGER,
  blocks INTEGER,
  turnovers INTEGER,
  fgm INTEGER,
  fga INTEGER,
  fg3m INTEGER,
  fg3a INTEGER,
  ftm INTEGER,
  fta INTEGER
);