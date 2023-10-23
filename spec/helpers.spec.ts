import { parseBasicAuthHeader, formatDuration, getIP, getFormattingMethodName } from "../src/helpers";

describe("parseBasicAuthHeader", () => {
  test("returns undefined if authType is not 'Basic'", () => {
    const header = "Bearer abc123";
    expect(parseBasicAuthHeader(header)).toBeUndefined();
  });

  test("returns a BasicAuth object if authType is 'Basic'", () => {
    const header = "Basic YWxhZGRpbjpvcGVuc2VzYW1l"; // aladdin:opensesame in base64
    expect(parseBasicAuthHeader(header)).toEqual({
      type: "Basic",
      username: "aladdin",
      password: "opensesame",
    });
  });

  test("returns undefined if authString is not valid base64 data", () => {
    const header = "Basic abc123";
    expect(parseBasicAuthHeader(header)).toBeUndefined();
  });

  test("returns a BasicAuth object with empty strings for username and password if authString is not in the correct format", () => {
    const header = "Basic YWJjMTIz"; // abc123 in base64
    expect(parseBasicAuthHeader(header)).toEqual({
      type: "Basic",
      username: "",
      password: "",
    })
  });
});

describe("formatDuration", () => {
  test("returns duration in seconds if duration is greater than or equal to 1 second", () => {
    const duration = 1.23456789e9; // 1.23456789 seconds in nanoseconds
    expect(formatDuration(duration)).toBe("1.2s");
  });

  test("returns duration in milliseconds if duration is greater than or equal to 1 millisecond", () => {
    const duration = 1234567; // 1.234567 milliseconds in nanoseconds
    expect(formatDuration(duration)).toBe("1.235ms");
  });

  test("returns duration in microseconds if duration is greater than or equal to 1 microsecond", () => {
    const duration = 1234; // 1.234 microseconds in nanoseconds
    expect(formatDuration(duration)).toBe("1.234µs");
  });

  test("returns duration in nanoseconds if duration is less than 1 microsecond", () => {
    const duration = 123; // 123 nanoseconds
    expect(formatDuration(duration)).toBe("123.0ns");
  });
});

describe("getIP", () => {
  const headers = new Headers({
    "x-forwarded-for": "192.0.2.1, 198.51.100.2, 203.0.113.3",
    "x-client-ip": "203.0.113.4",
    "x-real-ip": "203.0.113.5",
  });


  test("returns the IP address from the specified header", () => {
    expect(getIP(headers, ["x-client-ip"])).toBe("203.0.113.4");
    expect(getIP(headers, ["x-real-ip"] )).toBe("203.0.113.5");
  });

  test("returns the first IP address from x-forwarded-for header", () => {
    expect(getIP(headers, ["x-forwarded-for"])).toBe("192.0.2.1");
  });

  test("returns the first IP address from x-forwarded-for", () => {
    expect(getIP(headers)).toBe("192.0.2.1");
  });

  test("returns null if all headers are undefined", () => {
    const emptyHeaders = new Headers();
    expect(getIP(emptyHeaders)).toBeNull();
  });


  test("returns null if the specified header is found but has no value", () => {
    const headersWithEmptyHeader = new Headers({
      "x-client-ip": "",
    });
    expect(getIP(headersWithEmptyHeader, ["x-client-ip"])).toBe("");
  });
});

describe("getFormattingMethodName", () => {
  test("returns the correct formatting method name", () => {
    expect(getFormattingMethodName("json")).toBe("formatJson");
  });

  test("returns the correct formatting method name with uppercase first letter", () => {
    expect(getFormattingMethodName("xml")).toBe("formatXml");
  });

  test("returns the correct formatting method name for multi-word formats", () => {
    expect(getFormattingMethodName("camelCase")).toBe("formatCamelCase");
  });
});
