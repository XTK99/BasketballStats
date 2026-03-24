const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const { Pool } = require("pg");

console.log("DB FILE HOST:", process.env.DB_HOST);
console.log("DB FILE NAME:", process.env.DB_NAME);

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 5432),
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
