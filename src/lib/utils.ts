/**
 * Formázza a számokat magyar Ft formátumba (szóköz ezres elválasztóval).
 */
export function formatPrice(value: number): string {
  return value.toLocaleString("hu-HU") + " Ft";
}
