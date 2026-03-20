const express = require("express");

const router = express.Router();

const KALSHI_BASE_URL = "https://api.elections.kalshi.com/trade-api/v2";

async function safeFetchJson(url) {
  const response = await fetch(url);

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      data,
    };
  }

  return {
    ok: true,
    status: response.status,
    data,
  };
}

router.get("/markets", async (req, res) => {
  try {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(req.query)) {
      if (value != null && value !== "") {
        params.set(key, String(value));
      }
    }

    const url = `${KALSHI_BASE_URL}/markets?${params.toString()}`;
    const result = await safeFetchJson(url);

    if (!result.ok) {
      return res
        .status(result.status)
        .json(result.data || { error: "Failed to fetch Kalshi markets" });
    }

    res.json(result.data);
  } catch (error) {
    console.error("Kalshi markets proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/markets/:ticker", async (req, res) => {
  try {
    const safeTicker = encodeURIComponent(req.params.ticker);
    const url = `${KALSHI_BASE_URL}/markets/${safeTicker}`;
    const result = await safeFetchJson(url);

    if (!result.ok) {
      return res
        .status(result.status)
        .json(result.data || { error: "Failed to fetch Kalshi market" });
    }

    res.json(result.data);
  } catch (error) {
    console.error("Kalshi market proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/markets/:ticker/orderbook", async (req, res) => {
  try {
    const safeTicker = encodeURIComponent(req.params.ticker);
    const url = `${KALSHI_BASE_URL}/markets/${safeTicker}/orderbook`;
    const result = await safeFetchJson(url);

    if (!result.ok) {
      return res
        .status(result.status)
        .json(result.data || { error: "Failed to fetch Kalshi orderbook" });
    }

    res.json(result.data);
  } catch (error) {
    console.error("Kalshi orderbook proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/historical/cutoff", async (req, res) => {
  try {
    const url = `${KALSHI_BASE_URL}/historical/cutoff`;
    const result = await safeFetchJson(url);

    if (!result.ok) {
      return res
        .status(result.status)
        .json(result.data || { error: "Failed to fetch historical cutoff" });
    }

    res.json(result.data);
  } catch (error) {
    console.error("Kalshi historical cutoff proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/historical/markets/:ticker", async (req, res) => {
  try {
    const safeTicker = encodeURIComponent(req.params.ticker);
    const url = `${KALSHI_BASE_URL}/historical/markets/${safeTicker}`;
    const result = await safeFetchJson(url);

    if (!result.ok) {
      return res
        .status(result.status)
        .json(result.data || { error: "Failed to fetch historical market" });
    }

    res.json(result.data);
  } catch (error) {
    console.error("Kalshi historical market proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/historical/markets/:ticker/candlesticks", async (req, res) => {
  try {
    const safeTicker = encodeURIComponent(req.params.ticker);
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(req.query)) {
      if (value != null && value !== "") {
        params.set(key, String(value));
      }
    }

    const url = `${KALSHI_BASE_URL}/historical/markets/${safeTicker}/candlesticks?${params.toString()}`;
    const result = await safeFetchJson(url);

    if (!result.ok) {
      return res
        .status(result.status)
        .json(
          result.data || { error: "Failed to fetch historical candlesticks" },
        );
    }

    res.json(result.data);
  } catch (error) {
    console.error("Kalshi historical candlesticks proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get(
  "/series/:seriesTicker/markets/:ticker/candlesticks",
  async (req, res) => {
    try {
      const safeSeries = encodeURIComponent(req.params.seriesTicker);
      const safeTicker = encodeURIComponent(req.params.ticker);
      const params = new URLSearchParams();

      for (const [key, value] of Object.entries(req.query)) {
        if (value != null && value !== "") {
          params.set(key, String(value));
        }
      }

      const url = `${KALSHI_BASE_URL}/series/${safeSeries}/markets/${safeTicker}/candlesticks?${params.toString()}`;
      const result = await safeFetchJson(url);

      if (!result.ok) {
        return res
          .status(result.status)
          .json(result.data || { error: "Failed to fetch live candlesticks" });
      }

      res.json(result.data);
    } catch (error) {
      console.error("Kalshi live candlesticks proxy error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

router.get("/events", async (req, res) => {
  try {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(req.query)) {
      if (value != null && value !== "") {
        params.set(key, String(value));
      }
    }

    const url = `${KALSHI_BASE_URL}/events?${params.toString()}`;
    const result = await safeFetchJson(url);

    if (!result.ok) {
      return res
        .status(result.status)
        .json(result.data || { error: "Failed to fetch Kalshi events" });
    }

    res.json(result.data);
  } catch (error) {
    console.error("Kalshi events proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/events/:eventTicker", async (req, res) => {
  try {
    const safeEventTicker = encodeURIComponent(req.params.eventTicker);
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(req.query)) {
      if (value != null && value !== "") {
        params.set(key, String(value));
      }
    }

    const query = params.toString();
    const url = `${KALSHI_BASE_URL}/events/${safeEventTicker}${query ? `?${query}` : ""}`;
    const result = await safeFetchJson(url);

    if (!result.ok) {
      return res
        .status(result.status)
        .json(result.data || { error: "Failed to fetch Kalshi event" });
    }

    res.json(result.data);
  } catch (error) {
    console.error("Kalshi event proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
