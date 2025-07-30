import * as readline from "readline";
console.log("AIN Valuation Engine CLI is running.");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.question("Type something and press Enter: ", (answer: string) => {
  console.log(`You typed: ${answer}`);
  rl.close();
});

