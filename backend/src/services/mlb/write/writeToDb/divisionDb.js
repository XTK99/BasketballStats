// divisionDb.js
// Writes MLB divisions to the database

const pool = require("../../../../../db/db.js");

async function saveDivisions(divisions) {
  if (!Array.isArray(divisions) || !divisions.length)
    throw new Error("divisions must be a non-empty array");
  const columns = [
    "id",
    "name",
    "season",
    "name_short",
    "link",
    "abbreviation",
    "league_id",
    "league_link",
    "sport_id",
    "sport_link",
    "has_wildcard",
    "sort_order",
    "active",
  ];
  const values = [];
  const placeholders = divisions.map((division, i) => {
    const base = i * columns.length;
    values.push(
      division.id,
      division.name,
      division.season,
      division.nameShort,
      division.link,
      division.abbreviation,
      division.league?.id,
      division.league?.link,
      division.sport?.id,
      division.sport?.link,
      division.hasWildcard ? 1 : 0,
      division.sortOrder,
      division.active ? 1 : 0,
    );
    return `(${columns.map((_, j) => `$${base + j + 1}`).join(", ")})`;
  });
  const query = `
    INSERT INTO mlb_divisions (
      ${columns.join(", ")}
    ) VALUES
      ${placeholders.join(",\n      ")}
    ON CONFLICT (id) DO NOTHING
  `;
  await pool.query(query, values);
}

module.exports = { saveDivisions };
