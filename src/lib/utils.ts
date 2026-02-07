export function formatPrice(num: number): string {
  // Using plain number formatting + manual suffix so we can normalize spaces.
  // Some UIs/fonts collapse the default currency formatting in a confusing way.
  const formatted = new Intl.NumberFormat("hu-HU", {
    maximumFractionDigits: 0,
  }).format(num);

  // Replace non‑breaking spaces with normal spaces for readability.
  return `${formatted.replace(/\u00A0/g, " ")} Ft`;
}
