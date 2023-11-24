import { Elysia } from "elysia";
import { ElysiaLogging } from "../src/elysiaLogging";
import { type Logger, LogFormat } from "../src/types";

// Use console for logging
const logger : Logger = console;

// Create ElysiaLogging instance
const elysiaLogging = ElysiaLogging(logger, {
  format: LogFormat.JSON
});

// Create Elysia app
const app = new Elysia()
  .use(elysiaLogging)
  .get("/", () => {
    if (Math.random() < 0.75) {
      return new Response("Welcome to Bun!");
    }
    throw { message: 'Whoops!', name: 'CustomError' };
  })
  .listen({
    port: Bun.env.PORT ?? 3000,
    maxRequestBodySize: Number.MAX_SAFE_INTEGER,
  });

logger.info(`🦊 Running at http://${app.server?.hostname}:${app.server?.port}`);
