const axios = require("axios");
const {
  KALSHI_ACCESS_KEY,
  getKalshiAccessSignature,
} = require("../auth/kalshiAuthHeaders");

const BASE_URL = "https://api.elections.kalshi.com/trade-api/v2";

/**
 * Makes an axios request to Kalshi API with preloaded auth headers
 * @param {string} endpoint - Endpoint path (e.g. /v2/markets)
 * @param {object} options - Axios request options (method, params, data, etc.)
 * @returns {Promise<AxiosResponse>}
 */
async function kalshiApiRequest(endpoint, options = {}) {
  // Prepare auth headers
  const timestamp = Date.now().toString();
  // The payload to sign may depend on Kalshi's API requirements
  // For GET, often the path + query string + timestamp
  const payloadToSign = endpoint + timestamp; // Placeholder
  const signature = getKalshiAccessSignature(payloadToSign);

  const authHeaders = {
    "KALSHI-ACCESS-KEY": KALSHI_ACCESS_KEY,
    "KALSHI-ACCESS-SIGNATURE": signature,
    "KALSHI-ACCESS-TIMESTAMP": timestamp,
    ...options.headers,
  };
  console.log("Kalshi API Request:");

  return axios({
    url: BASE_URL + endpoint,
    ...options,
    headers: authHeaders,
  });
}

module.exports = {
  kalshiApiRequest,
};
