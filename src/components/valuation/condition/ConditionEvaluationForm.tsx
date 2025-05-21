
// Fix the line with operator '+' error
// Change from:
// const sum = categories.reduce((acc, key) => {
//   return acc + Number(values[key]);
// }, 0);

// To:
const sum = categories.reduce((acc, key) => {
  return acc + (typeof values[key] === 'string' ? parseFloat(values[key] as string) || 0 : Number(values[key] || 0));
}, 0);
