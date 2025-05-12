
export const truncateString = (str: string, maxLength: number): string => {
  if (!str) return '';
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength) + '...';
};
