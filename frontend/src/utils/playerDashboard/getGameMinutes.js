export function getGameMinutes(game) {
  const rawMinutes =
    game?.MIN ??
    game?.minutes ??
    game?.min ??
    game?.Minutes ??
    game?.playerMinutes ??
    0;

  if (typeof rawMinutes === "number") {
    return Number.isFinite(rawMinutes) ? rawMinutes : 0;
  }

  const text = String(rawMinutes).trim();
  if (!text) return 0;

  if (text.includes(":")) {
    const [mins, secs] = text.split(":");
    const minuteValue = Number(mins) || 0;
    const secondValue = Number(secs) || 0;
    return minuteValue + secondValue / 60;
  }

  const numericValue = Number(text);
  return Number.isFinite(numericValue) ? numericValue : 0;
}
