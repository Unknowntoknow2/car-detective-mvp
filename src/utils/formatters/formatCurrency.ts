
export function formatCurrency(
  amount: number | undefined | null,
  locale: string = "en-US",
  currency: string = "USD"
): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "$0";
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(amount);
  } catch (error) {
    // Fallback to simple formatting if locale/currency is invalid
    return `$${amount.toLocaleString()}`;
  }
}
