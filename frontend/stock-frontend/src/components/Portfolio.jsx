import React from "react";

const STOCKS = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    price: 212.4,
    peRatio: 31.24,
    high52: 236.1,
    low52: 164.08,
    discountPrice: 24.5,
    changePct: 1.12,
    trend: [195, 198, 200, 203, 202, 205, 208, 210, 212],
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    sector: "Technology",
    price: 418.9,
    peRatio: 35.55,
    high52: 468.35,
    low52: 309.45,
    discountPrice: 42.1,
    changePct: -0.47,
    trend: [430, 428, 426, 424, 422, 421, 420, 419, 418.9],
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    sector: "Semiconductor",
    price: 940.5,
    peRatio: 71.14,
    high52: 974.0,
    low52: 392.3,
    discountPrice: 78.8,
    changePct: 2.74,
    trend: [880, 892, 901, 915, 920, 928, 933, 938, 940.5],
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    sector: "Automobile",
    price: 189.7,
    peRatio: 58.2,
    high52: 299.2,
    low52: 138.8,
    discountPrice: 19.6,
    changePct: 0.62,
    trend: [180, 181, 183, 185, 184, 186, 188, 189, 189.7],
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    sector: "Consumer",
    price: 181.6,
    peRatio: 54.37,
    high52: 201.2,
    low52: 118.35,
    discountPrice: 16.9,
    changePct: -0.22,
    trend: [186, 185, 184, 183, 183, 182.5, 182, 181.8, 181.6],
  },
];

const MY_HOLDINGS = [
  { symbol: "AAPL", qty: 10, avgCost: 182.0 },
  { symbol: "NVDA", qty: 3, avgCost: 720.0 },
  { symbol: "TSLA", qty: 8, avgCost: 170.5 },
];

function Sparkline({ points, width = 92, height = 30 }) {
  if (!points || points.length === 0) {
    return null;
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const path = points
    .map((point, index) => {
      const x = (index / (points.length - 1 || 1)) * (width - 2) + 1;
      const y = height - ((point - min) / range) * (height - 2) - 1;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Stock trend">
      <path d={path} fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DashboardCard({ label, value, positive }) {
  const valueColor = positive === undefined ? "#111827" : positive ? "#16a34a" : "#dc2626";
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 14,
        background: "#ffffff",
        minWidth: 190,
      }}
    >
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: valueColor }}>{value}</div>
    </div>
  );
}

export default function Portfolio() {
  const mapBySymbol = new Map(STOCKS.map((s) => [s.symbol, s]));
  const invested = MY_HOLDINGS.reduce((acc, h) => acc + h.qty * h.avgCost, 0);
  const current = MY_HOLDINGS.reduce((acc, h) => {
    const live = mapBySymbol.get(h.symbol)?.price || 0;
    return acc + h.qty * live;
  }, 0);
  const pnl = current - invested;
  const pnlPct = invested ? (pnl / invested) * 100 : 0;

  const dashboard = {
    invested,
    current,
    pnl,
    pnlPct,
    positions: MY_HOLDINGS.length,
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h2 style={{ marginBottom: 4 }}>Portfolio Dashboard</h2>
      <p style={{ marginTop: 0, marginBottom: 16, color: "#6b7280" }}>Track holdings and explore market trends.</p>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <DashboardCard label="Total Invested" value={`$${dashboard.invested.toFixed(2)}`} />
        <DashboardCard label="Current Value" value={`$${dashboard.current.toFixed(2)}`} />
        <DashboardCard label="Profit / Loss" value={`$${dashboard.pnl.toFixed(2)}`} positive={dashboard.pnl >= 0} />
        <DashboardCard
          label="Return %"
          value={`${dashboard.pnlPct >= 0 ? "+" : ""}${dashboard.pnlPct.toFixed(2)}%`}
          positive={dashboard.pnlPct >= 0}
        />
        <DashboardCard label="Open Positions" value={String(dashboard.positions)} />
      </section>

      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          background: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Market Explorer</h3>
          <span style={{ fontSize: 12, color: "#6b7280" }}>Static View</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ padding: "10px 8px" }}>Company</th>
                <th style={{ padding: "10px 8px" }}>Sector</th>
                <th style={{ padding: "10px 8px" }}>Price</th>
                <th style={{ padding: "10px 8px" }}>P/E Ratio</th>
                <th style={{ padding: "10px 8px" }}>52W High</th>
                <th style={{ padding: "10px 8px" }}>52W Low</th>
                <th style={{ padding: "10px 8px" }}>Discount Price</th>
                <th style={{ padding: "10px 8px" }}>Trend Graph</th>
              </tr>
            </thead>
            <tbody>
              {STOCKS.map((stock) => (
                <tr key={stock.symbol} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "10px 8px" }}>{stock.name}</td>
                  <td style={{ padding: "10px 8px", color: "#6b7280" }}>{stock.sector}</td>
                  <td style={{ padding: "10px 8px" }}>${stock.price.toFixed(2)}</td>
                  <td style={{ padding: "10px 8px" }}>{stock.peRatio.toFixed(2)}</td>
                  <td style={{ padding: "10px 8px" }}>${stock.high52.toFixed(2)}</td>
                  <td style={{ padding: "10px 8px" }}>${stock.low52.toFixed(2)}</td>
                  <td style={{ padding: "10px 8px" }}>${stock.discountPrice.toFixed(2)}</td>
                  <td style={{ padding: "10px 8px" }}>
                    <Sparkline points={stock.trend} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
