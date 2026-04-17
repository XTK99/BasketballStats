// venueDb.js
// Writes MLB venues to the database

const pool = require("../../../../../db/db.js");

async function saveVenues(venues) {
  if (!Array.isArray(venues) || !venues.length)
    throw new Error("venues must be a non-empty array");
  const columns = ["id", "name", "link", "active", "season"];
  const values = [];
  const placeholders = venues.map((venue, i) => {
    const base = i * columns.length;
    values.push(
      venue.id,
      venue.name,
      venue.link,
      venue.active ? 1 : 0,
      venue.season,
    );
    return `(${columns.map((_, j) => `$${base + j + 1}`).join(", ")})`;
  });
  const query = `
    INSERT INTO mlb_venues (
      ${columns.join(", ")}
    ) VALUES
      ${placeholders.join(",\n      ")}
    ON CONFLICT (id) DO NOTHING
  `;
  await pool.query(query, values);
}

module.exports = { saveVenues };
