export const formatNumber = (value?: string | number | null): string => {
  if (value === null || value === undefined || value === "") return "0";

  const num = typeof value === "number" ? value : parseFloat(value);

  if (isNaN(num) || num < 0) return "0";

  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }

  return num.toString();
};
