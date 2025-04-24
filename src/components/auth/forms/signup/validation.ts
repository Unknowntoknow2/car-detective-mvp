
export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone: string) => {
  return /^\+?[1-9]\d{9,14}$/.test(phone);
};

export const validateEmail = (email: string): string => {
  if (!email) return 'Email is required';
  if (!isValidEmail(email)) return 'Please enter a valid email address';
  return '';
};

export const validatePassword = (password: string): string => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasUppercase || !hasLowercase || !hasNumber) {
    return 'Password must include at least one uppercase letter, one lowercase letter, and one number';
  }
  
  return '';
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (!confirmPassword) return 'Please confirm your password';
  if (confirmPassword !== password) return 'Passwords do not match';
  return '';
};

export const validatePhone = (phone: string): string => {
  if (!phone) return 'Phone number is required';
  if (!isValidPhone(phone)) return 'Please enter a valid international phone number (e.g., +1234567890)';
  return '';
};
