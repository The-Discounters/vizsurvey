import { resolve } from "path";
import dotenv from "dotenv";

async function loadEnvVars() {
  console.log(`loading environment variables from ./src/.env.test`);
  dotenv.config({ path: resolve("./src/.env.test") });
}

export default loadEnvVars;
