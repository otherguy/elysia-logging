import { Elysia } from "elysia";
import { ElysiaLogging } from "../src/elysiaLogging";
import { type Logger, LogFormat } from "../src/types";
import { createLogger, transports, format } from "winston";

// Define Winston logger
const logger : Logger = createLogger({
  // Use the LOG_LEVEL environment variable, or default to "info"
  level: Bun.env.LOG_LEVEL ?? "info",

  // Use JSON format
  format: format.json(),

  // Log to the console
  transports: [new transports.Console()],
});

const elysiaLogging = ElysiaLogging(logger, {
  // Use the pino "http" custom level defined above
  level: "http",

  // Access logs in JSON format
  format: LogFormat.JSON,
})

//
const app = new Elysia()
  .use(elysiaLogging)
  .get("/", () => {
    if (Math.random() < 0.75) {
      return new Response("Welcome to Bun!");
    }
    throw new Error("Whoops!");
  })
  .listen({
    port: Bun.env.PORT ?? 3000,
    maxRequestBodySize: Number.MAX_SAFE_INTEGER,
  });

logger.info(`🦊 Running at http://${app.server?.hostname}:${app.server?.port}`);
