
/**
 * Get current date in a formatted string
 */
export function getCurrentDate(): string {
  const now = new Date();
  
  // Format: May 5, 2025, 3:42 PM
  const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
  
  // Format: PST/PDT depending on daylight saving
  const timeZoneFormatter = new Intl.DateTimeFormat('en-US', {
    timeZoneName: 'short'
  });
  
  const formattedDate = dateTimeFormatter.format(now);
  const timeZone = timeZoneFormatter.format(now).split(' ')[1]; // Extract "PST" or "PDT"
  
  return `${formattedDate} ${timeZone}`;
}

/**
 * Wrap long text to fit within a specified width
 */
export function wrapText(
  text: string,
  maxWidth: number,
  fontSize: number,
  fontWidthMap: (text: string) => number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const testWidth = fontWidthMap(testLine);
    
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

/**
 * Format currency value
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Format percentage value
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}
