
export function formatCurrency(
  value: number | undefined | null,
  locale: string = "en-US",
  currency: string = "USD"
): string {
  if (value === undefined || value === null) {
    return "$0";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
}
