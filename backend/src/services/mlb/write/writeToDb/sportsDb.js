// sportsDb.js
// Writes sports to the database

const pool = require("../../../../../db/db.js");

async function saveSports(sports) {
  if (!Array.isArray(sports) || !sports.length)
    throw new Error("sports must be a non-empty array");
  const columns = [
    "id",
    "code",
    "link",
    "name",
    "abbreviation",
    "sort_order",
    "active_status",
  ];
  const values = [];
  const placeholders = sports.map((sport, i) => {
    const base = i * columns.length;
    values.push(
      sport.id,
      sport.code,
      sport.link,
      sport.name,
      sport.abbreviation,
      sport.sortOrder,
      sport.activeStatus ? 1 : 0,
    );
    return `(${columns.map((_, j) => `$${base + j + 1}`).join(", ")})`;
  });
  const query = `
    INSERT INTO mlb_sports (
      ${columns.join(", ")}
    ) VALUES
      ${placeholders.join(",\n      ")}
    ON CONFLICT (id) DO NOTHING
  `;
  await pool.query(query, values);
}

module.exports = { saveSports };
