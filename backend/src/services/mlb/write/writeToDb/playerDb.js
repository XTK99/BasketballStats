// playerDb.js
// Writes MLB players to the database
// TODO: split functions into separate files
// TODO: player model
// TODO: get players from rosters probably
// TODO: Figure out player promotions/how to handle?
const pool = require("../../../../../db/db.js");

async function savePlayers(players) {
  if (!Array.isArray(players) || !players.length)
    throw new Error("players must be a non-empty array");
  // Updated columns: only code for primaryPosition, all fields for batSide and pitchHand
  const columns = [
    "id",
    "full_name",
    "link",
    "first_name",
    "last_name",
    "primary_number",
    "birth_date",
    "current_age",
    "birth_city",
    "birth_state_province",
    "birth_country",
    "height",
    "weight",
    "active",
    "primary_position_code",
    "use_name",
    "use_last_name",
    "middle_name",
    "boxscore_name",
    "nick_name",
    "gender",
    "is_player",
    "is_verified",
    "draft_year",
    "mlb_debut_date",
    "bat_side_code",
    "bat_side_description",
    "pitch_hand_code",
    "pitch_hand_description",
    "name_first_last",
    "name_slug",
    "first_last_name",
    "last_first_name",
    "last_init_name",
    "init_last_name",
    "full_fml_name",
    "full_lfm_name",
    "strike_zone_top",
    "strike_zone_bottom",
  ];
  const values = [];
  const placeholders = players.map((player, i) => {
    const base = i * columns.length;
    values.push(
      player.id,
      player.fullName,
      player.link,
      player.firstName,
      player.lastName,
      player.primaryNumber,
      player.birthDate,
      player.currentAge,
      player.birthCity,
      player.birthStateProvince,
      player.birthCountry,
      player.height,
      player.weight,
      player.active ? 1 : 0,
      player.primaryPosition?.code,
      player.useName,
      player.useLastName,
      player.middleName,
      player.boxscoreName,
      player.nickName,
      player.gender,
      player.isPlayer ? 1 : 0,
      player.isVerified ? 1 : 0,
      player.draftYear,
      player.mlbDebutDate,
      player.batSide?.code,
      player.batSide?.description,
      player.pitchHand?.code,
      player.pitchHand?.description,
      player.nameFirstLast,
      player.nameSlug,
      player.firstLastName,
      player.lastFirstName,
      player.lastInitName,
      player.initLastName,
      player.fullFMLName,
      player.fullLFMName,
      player.strikeZoneTop,
      player.strikeZoneBottom,
    );
    return `(${columns.map((_, j) => `$${base + j + 1}`).join(", ")})`;
  });
  const query = `
    INSERT INTO mlb_players (
      ${columns.join(", ")}
    ) VALUES
      ${placeholders.join(",\n      ")}
    ON CONFLICT (id) DO NOTHING
  `;
  await pool.query(query, values);
}

/**
 * Inserts a single player object into the mlb_players table.
 * @param {Object} player
 * @returns {Promise<void>}
 */
async function savePlayer(player) {
  const columns = [
    "id",
    "full_name",
    "link",
    "first_name",
    "last_name",
    "primary_number",
    "birth_date",
    "current_age",
    "birth_city",
    "birth_state_province",
    "birth_country",
    "height",
    "weight",
    "active",
    "primary_position_code",
    "use_name",
    "use_last_name",
    "middle_name",
    "boxscore_name",
    "nick_name",
    "gender",
    "is_player",
    "is_verified",
    "draft_year",
    "mlb_debut_date",
    "bat_side_code",
    "bat_side_description",
    "pitch_hand_code",
    "pitch_hand_description",
    "name_first_last",
    "name_slug",
    "first_last_name",
    "last_first_name",
    "last_init_name",
    "init_last_name",
    "full_fml_name",
    "full_lfm_name",
    "strike_zone_top",
    "strike_zone_bottom",
  ];
  const values = [
    player.id,
    player.fullName,
    player.link,
    player.firstName,
    player.lastName,
    player.primaryNumber,
    player.birthDate,
    player.currentAge,
    player.birthCity,
    player.birthStateProvince,
    player.birthCountry,
    player.height,
    player.weight,
    player.active ? 1 : 0,
    player.primaryPosition?.code,
    player.useName,
    player.useLastName,
    player.middleName,
    player.boxscoreName,
    player.nickName,
    player.gender,
    player.isPlayer ? 1 : 0,
    player.isVerified ? 1 : 0,
    player.draftYear,
    player.mlbDebutDate,
    player.batSide?.code,
    player.batSide?.description,
    player.pitchHand?.code,
    player.pitchHand?.description,
    player.nameFirstLast,
    player.nameSlug,
    player.firstLastName,
    player.lastFirstName,
    player.lastInitName,
    player.initLastName,
    player.fullFMLName,
    player.fullLFMName,
    player.strikeZoneTop,
    player.strikeZoneBottom,
  ];
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
  const query = `
    INSERT INTO mlb_players (
      ${columns.join(", ")}
    ) VALUES
      (${placeholders})
    ON CONFLICT (id) DO NOTHING
  `;
  await pool.query(query, values);
}

module.exports = {
  savePlayers,
  savePlayer,
};
