import * as readline from "readline";
import logger from "../utils/logger";

logger.info("AIN Valuation Engine CLI is running.");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.question("Type something and press Enter: ", (answer: string) => {
  logger.info(`You typed: ${answer}`);
  rl.close();
});

