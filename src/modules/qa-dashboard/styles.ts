
import { cn } from "@/lib/utils";

const styles = {
  container: cn(
    "max-w-7xl mx-auto px-4 py-6 space-y-6"
  ),
  header: cn(
    "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
  ),
  healthGrid: cn(
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
  ),
  filterBar: cn(
    "flex flex-col md:flex-row items-start md:items-center gap-4 mb-6 bg-white p-4 rounded-lg border border-neutral-light"
  ),
  tableContainer: cn(
    "bg-white rounded-lg border border-neutral-light shadow-sm overflow-x-auto"
  ),
  stats: {
    card: cn(
      "p-4 rounded-lg bg-white border border-neutral-light"
    ),
    title: cn(
      "text-sm font-medium text-neutral-dark mb-1"
    ),
    value: cn(
      "text-xl font-bold"
    ),
    progressContainer: cn(
      "h-2 bg-neutral-lighter rounded-full mt-2"
    ),
    progressBar: (percentage: number, color = "primary") => cn(
      "h-full rounded-full",
      color === "primary" ? "bg-primary" : 
      color === "success" ? "bg-success" : 
      color === "warning" ? "bg-warning" : 
      color === "error" ? "bg-error" : 
      "bg-primary"
    ),
  },
  actions: {
    container: cn(
      "flex flex-wrap gap-2"
    ),
    button: cn(
      "text-xs"
    ),
  },
  emptyState: cn(
    "text-center py-12 text-neutral-dark"
  ),
  badge: (status: string) => cn(
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
    status === "premium" ? "bg-primary-light text-primary" :
    status === "free" ? "bg-neutral-lighter text-neutral-darker" :
    status === "high" ? "bg-success-light text-success-dark" :
    status === "medium" ? "bg-warning-light text-warning-dark" :
    status === "low" ? "bg-error-light text-error-dark" :
    "bg-neutral-lighter text-neutral-darker"
  ),
  filterGroup: cn(
    "flex flex-col sm:flex-row gap-2 w-full sm:w-auto"
  ),
};

export default styles;
