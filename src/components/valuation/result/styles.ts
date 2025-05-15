
const styles = {
  container: "space-y-6 max-w-6xl mx-auto px-4 py-6 mb-20 sm:mb-0",
  
  grid: {
    container: "grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6",
    fullWidth: "col-span-1 lg:col-span-2"
  },
  
  header: {
    container: "flex flex-col md:flex-row justify-between gap-6",
    info: "space-y-2",
    title: "text-2xl font-bold flex items-center gap-2",
    subtitle: "text-muted-foreground",
    price: "text-4xl font-bold text-right",
    badge: {
      container: "flex flex-wrap gap-2 mt-2",
      item: "inline-flex items-center rounded-lg bg-muted px-2 py-1 text-xs font-medium"
    }
  },
  
  summary: {
    container: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4",
    card: "bg-white dark:bg-slate-950 rounded-lg border shadow-sm p-4",
    title: "text-sm font-medium text-muted-foreground",
    value: "text-2xl font-semibold"
  },
  
  premiumBadge: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
  
  section: {
    title: "text-lg font-semibold mb-4",
    card: "bg-white dark:bg-slate-950 rounded-lg border p-4"
  }
};

export default styles;
