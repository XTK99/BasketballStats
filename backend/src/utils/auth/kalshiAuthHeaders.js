const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
// KALSHI-ACCESS-KEY can be stored in a .env or a file (e.g., kalshi.pub)
const KALSHI_ACCESS_KEY = fs
  .readFileSync(path.join(__dirname, "../../../../kalshi.pub"), "utf8")
  .trim();

// Export the contents of kalshi.pem for use in signing
const KALSHI_PRIVATE_KEY = fs.readFileSync(
  path.join(__dirname, "../../../../kalshi.pem"),
  "utf8",
);
// Signs the payload with the RSA private key using SHA256
function getKalshiAccessSignature(payload) {
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(payload);
  sign.end();
  return sign.sign(KALSHI_PRIVATE_KEY, "base64");
}

module.exports = {
  KALSHI_ACCESS_KEY,
  getKalshiAccessSignature,
};
