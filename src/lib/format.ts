export function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function priceRange(
  min?: number | null,
  max?: number | null,
  unit?: string | null,
): string | null {
  if (!min) return null;
  const suffix = unit ? ` / ${unit}` : "";
  if (max && max !== min) {
    return `${formatINR(min)} – ${formatINR(max)}${suffix}`;
  }
  return `${formatINR(min)}${suffix}`;
}

export function titleCase(input: string): string {
  return input
    .split(/[-\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
