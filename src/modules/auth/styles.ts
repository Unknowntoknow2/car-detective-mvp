
// CSS-in-JS styles for auth pages if needed
export const authStyles = {
  inputFocus: "ring-2 ring-primary/30 transition-all duration-200",
  buttonHover: "transform hover:scale-105 transition-transform duration-200",
  cardHover: "hover:shadow-lg transition-shadow duration-300",
  formContainer: "w-full max-w-md mx-auto",
  brandSection: "bg-gradient-to-br from-primary/80 to-primary text-primary-foreground",
  errorMessage: "bg-destructive/10 text-destructive rounded p-3 text-sm",
  successMessage: "bg-success/10 text-success rounded p-3 text-sm",
  iconContainer: "mx-auto bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center",
};

// Theme-specific styles
export const lightThemeStyles = {
  cardBackground: "bg-white",
  inputBackground: "bg-gray-50",
  textPrimary: "text-gray-900",
  textSecondary: "text-gray-600",
};

export const darkThemeStyles = {
  cardBackground: "bg-gray-800",
  inputBackground: "bg-gray-700",
  textPrimary: "text-gray-100",
  textSecondary: "text-gray-300",
};

export default authStyles;
