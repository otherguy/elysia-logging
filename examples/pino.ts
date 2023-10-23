import { Elysia } from "elysia";
import { ElysiaLogging } from "../src/elysiaLogging";
import { pino, Logger } from "pino";

// Define Pino logger
const logger : Logger = pino({
  // Use the LOG_LEVEL environment variable, or default to "info"
  level: Bun.env.LOG_LEVEL ?? "info",

  // Rename 'msg' to 'message'
  messageKey: "message",

  // Rename 'err' to 'error'
  errorKey: "error",

  // Rename 'time' to 'ts'
  timestamp: () => `,"ts":"${Date.now()}"`,

  formatters: {
    //Use `level` label instead of integer values
    level: (label) => {
      return { level: label };
    },
  },

  // Define a custom "http" level
  customLevels: {
    http: 35, // same as `info`
  },
});

const elysiaLogging = ElysiaLogging(logger, {
  // Use the pino "http" custom level defined above
  level: "http",

  // Access logs in JSON format
  format: "json",
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

logger.info(
  `🦊 API is running at http://${app.server?.hostname}:${app.server?.port}`
);
