import { Elysia } from "elysia";
import { ElysiaLogging } from "../src/elysiaLogging";
import { type Logger, LogFormat } from "../src/types";
import { Logger as TSLog, ILogObj } from "tslog";

// Define TSLog logger
const logger : TSLog<ILogObj> = new TSLog();

const elysiaLogging = ElysiaLogging(logger as Logger, {
  level: "info",
  format: LogFormat.SHORT,
});

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

logger.silly(`🦊 Running at http://${app.server?.hostname}:${app.server?.port}`);
