import React from "react";

const STOCKS = [
  {
    symbol: "AAPL",
    company: "Apple Inc.",
    sector: "Technology",
    price: 212.4,
    peRatio: 31.24,
    high52: 236.1,
    low52: 164.08,
    discountPrice: 24.5,
    trend: [195, 198, 200, 203, 202, 205, 208, 210, 212],
  },
  {
    symbol: "MSFT",
    company: "Microsoft Corp.",
    sector: "Technology",
    price: 418.9,
    peRatio: 35.55,
    high52: 468.35,
    low52: 309.45,
    discountPrice: 42.1,
    trend: [430, 428, 426, 424, 422, 421, 420, 419, 418.9],
  },
  {
    symbol: "NVDA",
    company: "NVIDIA Corp.",
    sector: "Semiconductor",
    price: 940.5,
    peRatio: 71.14,
    high52: 974.0,
    low52: 392.3,
    discountPrice: 78.8,
    trend: [880, 892, 901, 915, 920, 928, 933, 938, 940.5],
  },
];

function Sparkline({ points, width = 92, height = 30 }) {
  if (!points?.length) {
    return null;
  }
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1 || 1)) * (width - 2) + 1;
      const y = height - ((p - min) / range) * (height - 2) - 1;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Trend graph">
      <path d={d} fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function StocksPage() {
  return (
    <section style={{ border: "1px solid #1f365d", borderRadius: 14, overflow: "hidden", background: "#081a3a" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", color: "#ffffff" }}>
        <thead style={{ background: "#14284f" }}>
          <tr style={{ textAlign: "left" }}>
            <th style={{ padding: "14px 16px" }}>Company</th>
            <th style={{ padding: "14px 16px" }}>Sector</th>
            <th style={{ padding: "14px 16px" }}>Price</th>
            <th style={{ padding: "14px 16px" }}>P/E Ratio</th>
            <th style={{ padding: "14px 16px" }}>52W High</th>
            <th style={{ padding: "14px 16px" }}>52W Low</th>
            <th style={{ padding: "14px 16px" }}>Discount Price</th>
            <th style={{ padding: "14px 16px" }}>Trend Graph</th>
          </tr>
        </thead>
        <tbody>
          {STOCKS.map((stock) => (
            <tr key={stock.symbol} style={{ borderTop: "1px solid #1f365d" }}>
              <td style={{ padding: "14px 16px" }}>{stock.company}</td>
              <td style={{ padding: "14px 16px" }}>{stock.sector}</td>
              <td style={{ padding: "14px 16px" }}>${stock.price.toFixed(2)}</td>
              <td style={{ padding: "14px 16px" }}>{stock.peRatio.toFixed(2)}</td>
              <td style={{ padding: "14px 16px" }}>${stock.high52.toFixed(2)}</td>
              <td style={{ padding: "14px 16px" }}>${stock.low52.toFixed(2)}</td>
              <td style={{ padding: "14px 16px" }}>${stock.discountPrice.toFixed(2)}</td>
              <td style={{ padding: "14px 16px" }}>
                <Sparkline points={stock.trend} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
