const DEFAULT_API_BASE = "http://127.0.0.1:8000";
const STOCKS_ENDPOINT =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_STOCKS_API_URL) ||
  `${DEFAULT_API_BASE}/api/v1/stocks/public/`;

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeTrend = (trend, fallbackPrice) => {
  if (!Array.isArray(trend) || trend.length === 0) {
    return [fallbackPrice];
  }
  return trend.map((point) => toNumber(point, fallbackPrice));
};

const normalizeStock = (raw) => {
  const price = toNumber(raw.price, 0);
  return {
    symbol: String(raw.symbol || raw.ticker || "").toUpperCase(),
    name: String(raw.name || raw.company || "Unknown Company"),
    sector: String(raw.sector || "Unknown"),
    price,
    changePct: toNumber(raw.changePct ?? raw.change_percent ?? raw.change, 0),
    trend: normalizeTrend(raw.trend || raw.history || raw.priceHistory, price),
  };
};

export async function fetchPublicStocks() {
  const response = await fetch(STOCKS_ENDPOINT, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch stocks: ${response.status}`);
  }

  const payload = await response.json();
  const rawItems = Array.isArray(payload) ? payload : payload.results || payload.data || [];
  return rawItems.map(normalizeStock).filter((stock) => stock.symbol);
}
