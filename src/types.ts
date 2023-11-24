import type { Context } from "elysia";
import { Log } from "./log";

// This creates a type that is like "json" | "common" | "short"
type LogFormatString = {[K in keyof typeof Log.prototype as K extends `format${infer Rest}` ? Lowercase<Rest> : never]: typeof Log.prototype[K]};

// This is the type of a function that takes a LogObject and returns a string or a LogObject
type LogFormatMethod = (log: LogObject) => string | LogObject;

// This creates a LogFormat const that is like "JSON"="json", "COMMON"="common", "SHORT"="short"
type LogFormatRecord = Record<Uppercase<keyof LogFormatString>, string>;

//
export const LogFormat = {
  JSON: 'json',
  COMMON: 'common',
  SHORT: 'short',
  // Add other methods here
} as const;

export type LogFormatType = keyof LogFormatString | LogFormatMethod | LogFormatter | LogFormatRecord;

/**
 * Represents the basic authentication credentials.
 */
export type BasicAuth = {
  type: string;
  username: string;
  password: string;
}

/**
 * Represents the list of IP headers that can be used to retrieve the client's IP address.
 */
export type IPHeaders = 'x-forwarded-for' | 'x-real-ip' | 'x-client-ip' | 'cf-connecting-ip' | 'fastly-client-ip' | 'x-cluster-client-ip' | 'x-forwarded' | 'forwarded-for' | 'forwarded' | 'appengine-user-ip' | 'true-client-ip' | 'cf-pseudo-ipv4';

/**
 * Represents a log object that contains information about a request and its response.
 */
export type LogObject = {
  request: {
    /**
     * The IP address of the client that made the request.
     */
    ip?: string;
    /**
     * The unique ID of the request.
     */
    requestID?: string;
    /**
     * The HTTP method used in the request.
     */
    method: string;
    /**
     * The headers included in the request.
     */
    headers?: Record<string, string>;
    /**
     * The URL of the request.
     */
    url: {
      /**
       * The path of the URL.
       */
      path: string;
      /**
       * The params string of the URL.
       */
      params: Record<string, string>; // | Record<string, never>;
    };
  };
  response: {
    /**
     * The status code of the response.
     */
    status_code: number | string | undefined;
    /**
     * The time it took to process the request and generate the response, in milliseconds.
     */
    time: number;
  };
  /**
   * An optional error message associated with the request.
   */
  error?: string | object | Error;
};

/**
 * Options for the request logger middleware.
 */
export interface RequestLoggerOptions {
  level?: string;
  format?: LogFormatType, // string | ((log: LogObject) => string | LogObject);
  includeHeaders?: string[];
  skip?: (ctx: Context) => boolean;
  ipHeaders?: IPHeaders[];
}

/**
 * Common Logger interface.
 */
export interface Logger {
  debug: <T extends unknown[]>(...args: T) => void;
  info: <T extends unknown[]>(...args: T) => void;
  warn: <T extends unknown[]>(...args: T) => void;
  error: <T extends unknown[]>(...args: T) => void;
}

/**
 * Interface for a log formatter.
 *
 * A log formatter is a class with a format() method that takes a log
 * object and returns a string or a log object.
 */
export interface LogFormatter {
  /**
   * Formats a log object.
   *
   * @param log Log object to format
   *
   * @returns Formatted log object or string
   */
  format(log: LogObject): string | LogObject;
}
