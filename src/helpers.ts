import type { IPHeaders, BasicAuth } from "./types";
import type { Headers } from "undici-types";
import { headersToCheck } from "./elysiaLogging";

const NANOSECOND = 1;
const MICROSECOND = 1e3 * NANOSECOND;
const MILLISECOND = 1e3 * MICROSECOND;
const SECOND = 1e3 * MILLISECOND;

/**
 * Parses a Basic Authentication header string and returns an object containing the username and password.
 *
 * @param header - The Basic Authentication header string to parse.
 *
 * @returns An object containing the username and password, or undefined if the header is invalid.
 */
export function parseBasicAuthHeader(header : string ) : BasicAuth | undefined {
  const [type, authString] : string[] = header.split(" ");

  // Check if authType is Basic and authString is valid base64
  if(type !== "Basic") return undefined;
  if(!isValidBase64(authString as string)) return undefined;

  const authStringDecoded = Buffer.from(authString as string, 'base64').toString();
  const [username, password] = authStringDecoded.includes(":") ? authStringDecoded.split(":", 2) : [undefined, undefined];

  return {
    type: type,
    username: username ?? "",
    password: password ?? "",
  };
}

/**
 * Formats a duration in nanoseconds to a human-readable string.
 *
 * @param durationInNanoseconds - The duration in nanoseconds to format.
 *
 * @returns A string representing the formatted duration.
 */
export function formatDuration(durationInNanoseconds: number): string {
  if (durationInNanoseconds >= SECOND) {
    return `${(durationInNanoseconds / SECOND).toPrecision(2)}s`;
  } else if (durationInNanoseconds >= MILLISECOND) {
    return `${(durationInNanoseconds / MILLISECOND).toPrecision(4)}ms`;
  } else if (durationInNanoseconds >= MICROSECOND) {
    return `${(durationInNanoseconds / MICROSECOND).toPrecision(4)}µs`;
  } else {
    return `${durationInNanoseconds.toPrecision(4)}ns`;
  }
}

/**
 * Returns the IP address of the client making the request.
 *
 * @param headers - The headers object from the request.
 * @param ipHeaders - An array of header names to check for the IP address. Defaults to common IP headers.
 *
 * @returns The IP address of the client, or undefined if not found.
 */
export function getIP(headers: Headers, ipHeaders: IPHeaders[] = headersToCheck): string | undefined | null {
  let clientIP: string | undefined | null = null;
  for (const header of ipHeaders) {
      clientIP = headers.get(header)
      if (clientIP !== null && typeof clientIP == 'string') {
        if (clientIP.includes(',')) {
          clientIP = clientIP.split(',')[0]
        }
        break
      }
  }
  return clientIP
}

/**
 * Returns the name of the formatting method for a given format string.
 *
 * @param format - The format string to get the formatting method name for.
 *
 * @returns The name of the formatting method.
 */
export function getFormattingMethodName(format : string): string {
  return `format${
    format.charAt(0).toUpperCase() + format.slice(1)
  }`
}

/**
 * Checks if a given string is a valid base64 encoded string.
 *
 * @param str - The string to be checked.
 *
 * @returns A boolean indicating whether the string is a valid base64 encoded string.
 */
function isValidBase64(str: string): boolean {
  return Buffer.from(str, 'base64').toString('base64') === str;
}
