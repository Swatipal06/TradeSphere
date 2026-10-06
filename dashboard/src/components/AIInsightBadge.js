import React from "react";

export const AIInsightBadge = ({ direction = "Neutral", confidence = 0, size = "normal" }) => {
  const dirUpper = (direction || "NEUTRAL").toUpperCase();
  const isBullish = dirUpper === "BULLISH";
  const isBearish = dirUpper === "BEARISH";

  let badgeClass = "badge-neutral";
  let icon = "";
  let label = "Neutral";

  if (isBullish) {
    badgeClass = "badge-bullish";
    icon = "";
    label = "Bullish";
  } else if (isBearish) {
    badgeClass = "badge-bearish";
    icon = "";
    label = "Bearish";
  }

  const fontSize = size === "small" ? "0.7rem" : "0.75rem";
  const padding = size === "small" ? "2px 6px" : "3px 8px";

  return (
    <span
      className={badgeClass}
      style={{ fontSize, padding, display: "inline-flex", alignItems: "center", gap: "4px" }}
    >
      <span>{icon}</span>
      <span>{label}</span>
      {confidence > 0 && <span style={{ opacity: 0.85, fontWeight: "600" }}> {confidence}%</span>}
    </span>
  );
};

export default AIInsightBadge;
