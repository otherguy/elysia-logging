import { Elysia } from "elysia";
import { ElysiaLogging } from "../src/elysiaLogging";
import { LogFormatType, type Logger } from "../src/types";

interface MockLogger extends Logger {
  http: <T extends unknown[]>(...args: T) => void;
}

describe("ElysiaLogging", () => {
  let app: Elysia;
  let logger: MockLogger;

  beforeEach(() => {
    app = new Elysia();
    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      http: jest.fn(),
    }
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("logs request and response", async () => {
    app.use(
      ElysiaLogging(logger, {
        level: "http",
        format: "json", // function(log) { return "{log}" },
      })
    )

    app.get("/", (ctx) => {
      ctx.body = "Hello, world!";
    });

    await app.handle(
      new Request('http://localhost/')
    )

    expect(logger.http).toHaveBeenCalled();
    expect(logger.http).toHaveBeenCalledWith({
      message: expect.any(String) as string,
      request: {
        ip: undefined, //"::ffff:127.0.0.1",
        method: "GET",
        url: {
          path: "/",
          params: {},
        },
      },
      response: {
        status_code: 200,
        time: expect.any(Number) as number,
      },
    });
  });

  it("accepts a function as format", async () => {
    app.use(
      ElysiaLogging(logger, {
        level: "info",
        format: function(log) { return `${log.request.method} ${log.request.url.path} ${log.response.status_code}` },
      })
    )

    app.get("/", (ctx) => {
      ctx.body = "Hello, world!";
    });

    await app.handle(
      new Request('http://localhost/')
    )

    expect(logger.info).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith("GET / 200");
  });

  it("does not log if skip function returns true", async () => {
    app.use(
      ElysiaLogging(logger, { skip: () => true })
    )

    app.get("/", (ctx) => {
      ctx.body = "Hello, world!";
    });

    await app.handle(
      new Request('http://localhost/')
    )

    expect(logger.info).toHaveBeenCalledTimes(0);
  });

  it("logs error if there is one", async () => {
    const error = new Error("Something went wrong");
    app.use(
      ElysiaLogging(logger)
    )

    app.get("/", () => {
      throw error;
    });

    await app.handle(
      new Request('http://localhost/')
    )

    expect(logger.info).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith({
      message: expect.any(String) as string,
      request: {
        ip: undefined, // "::ffff:127.0.0.1"
        method: "GET",
        url: {
          path: "/",
          params: {},
        },
      },
      response: {
        status_code: 500,
        time: expect.any(Number) as number,
      },
      error: error,
    });
  });

  it("logs error string if there is one", async () => {
    const error = "Something went wrong";

    app.use(
      ElysiaLogging(logger)
    )

    app.get("/", () => {
      throw error;
    });

    await app.handle(
      new Request('http://localhost/')
    )

    expect(logger.info).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith({
      message: expect.any(String) as string,
      request: {
        ip: undefined, // "::ffff:127.0.0.1"
        method: "GET",
        url: {
          path: "/",
          params: {},
        },
      },
      response: {
        status_code: 500,
        time: expect.any(Number) as number,
      },
      error: error,
    });
  });

  it("throws an error if format is not a valid format string", () => {
    const middleware = ElysiaLogging(logger, {
      format: "invalid-format" as unknown as LogFormatType
    });

    expect(() => app.use(middleware)).toThrow("Formatter 'invalid-format' not found!");
  });
});
