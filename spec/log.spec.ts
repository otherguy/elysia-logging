import { LogObject } from "../src";
import { Log } from "../src/log";

describe("Log", () => {
  const logObject = {
    message: "GET / completed with status 200 in 123ms",
    request: {
      ip: "127.0.0.1",
      method: "GET",
      url: {
        path: "/",
        params: {},
      },
      headers: {
        authorization: "Basic YWxhZGRpbjpvcGVuc2VzYW1l",
      },
    },
    response: {
      status_code: 200,
      time: 123456789,
    },
    error: "",
  };

  describe("formatJson", () => {
    test("returns the log object", () => {
      const log = new Log(logObject);
      expect(log.formatJson()).toEqual(logObject);
    });

    test("returns the log object when there are params", () => {
      const logObjectWithParams : LogObject = JSON.parse(JSON.stringify(logObject));
      logObjectWithParams.request.url.params = {
        id: "1",
        name: "John Doe",
      };
      const log = new Log(logObjectWithParams);
      expect(log.formatJson()).toEqual(logObjectWithParams);
    });
  });

  describe("formatShort", () => {
    test("returns a short string representation of the log", () => {
      const log = new Log(logObject);
      const formattedLog = log.formatShort();
      expect(formattedLog).toMatch(
        /^\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\] GET \/ 200 \(\d{1,3}\.\d{1,3}ms\)$/
      );
    });
  });

  describe("formatCommon", () => {
    test("returns the formatted log string", () => {
      const log = new Log(logObject);
      const formattedLog = log.formatCommon();

      // @TODO: not yet implemented in Elysia
      const responseSize = "-";

      const dateRegexPattern = "\\d{2}\\/[A-Z][a-z]{2}\\/\\d{4}:\\d{2}:\\d{2}:\\d{2} \\+\\d{4}";

      expect(formattedLog).toMatch(RegExp(`${logObject.request.ip} - aladdin \\[${dateRegexPattern}\\] "${logObject.request.method} ${logObject.request.url.path} HTTP/1.1" ${logObject.response.status_code} ${responseSize}`));
    });

    test("returns the formatted log string if there is no basic auth", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { authorization, ...restHeaders } = logObject.request.headers;

      const logObjectNoAuth = {
        ...logObject,
        request: {
          ...logObject.request,
          headers: restHeaders
        }
      };

      const log = new Log(logObjectNoAuth);
      const formattedLog = log.formatCommon();

      // @TODO: not yet implemented in Elysia
      const responseSize = "-";

      const dateRegexPattern = "\\d{2}\\/[A-Z][a-z]{2}\\/\\d{4}:\\d{2}:\\d{2}:\\d{2} \\+\\d{4}";

      expect(formattedLog).toMatch(RegExp(`${logObject.request.ip} - - \\[${dateRegexPattern}\\] "${logObject.request.method} ${logObject.request.url.path} HTTP/1.1" ${logObject.response.status_code} ${responseSize}`));
    });
  });

  describe("error setter and log getter", () => {
    test("sets and gets the error property", () => {
      const log = new Log(logObject);
      log.error = "Something went wrong";
      expect(log.log.error).toBe("Something went wrong");
    });
  });
});
