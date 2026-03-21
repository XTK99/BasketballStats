export function getConfidenceLevel(sampleSize = 0) {
  const count = Number(sampleSize) || 0;

  if (count >= 8) {
    return {
      label: "High Confidence",
      tone: "high",
    };
  }

  if (count >= 4) {
    return {
      label: "Medium Confidence",
      tone: "medium",
    };
  }

  return {
    label: "Low Confidence",
    tone: "low",
  };
}
