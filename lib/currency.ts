/**
 * Format a number as Naira currency
 * @param amount - The amount to format
 * @returns Formatted currency string with Naira symbol
 */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    currencyDisplay: 'symbol',
  }).format(amount);
}

/**
 * Convert dollar symbol to Naira symbol in strings
 * @param text - Text that may contain dollar symbols
 * @returns Text with dollar symbols replaced with Naira symbols
 */
export function convertDollarToNaira(text: string): string {
  return text.replace(/\$/g, '₦');
}
