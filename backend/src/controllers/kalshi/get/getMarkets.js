const { kalshiApiRequest } = require("../../../utils/kalshi/kalshiApiWrapper");

/**
 * Fetch Kalshi markets with dynamic query params from req.query
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
module.exports = async function getMarkets(req, res) {
  try {
    const endpoint = "/markets";

    // Filter out empty query params
    const params = {};
    Object.entries(req.query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params[key] = value;
      }
    });

    const axiosOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
      params,
    };
    console.log("Making Kalshi API request with params:", params);
    const response = await kalshiApiRequest(endpoint, axiosOptions);
    console.log(response);
    return res.json(response.data);
  } catch (error) {
    console.error("Error fetching Kalshi markets:", error);
    // Forward status from Kalshi API if available, else 500
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: error.message };
    return res.status(status).json(data);
  }
};
