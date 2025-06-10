
import { format } from "date-fns";

export function formatDate(
  date: Date | string | null | undefined,
  formatString: string = "MMM dd, yyyy"
): string {
  if (!date) return "N/A";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return "Invalid Date";
  
  return format(dateObj, formatString);
}
