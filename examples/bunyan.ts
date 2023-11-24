import { Elysia } from "elysia";
import { ElysiaLogging } from "../src/elysiaLogging";
import { type Logger } from "../src/types";
import { createLogger, INFO } from 'bunyan'

// Define Bunyan logger
const logger : Logger = createLogger ({
  name: "logger",
  streams: [ { level: INFO, stream: process.stdout } ],
});

const elysiaLogging = ElysiaLogging(logger, {
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

logger.info(`🦊 Running at http://${app.server?.hostname}:${app.server?.port}`);

