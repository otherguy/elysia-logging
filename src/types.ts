import type { Context } from "elysia";

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
  format?: string | ((log: LogObject) => string | LogObject);
  includeHeaders?: string[];
  skip?: (ctx: Context) => boolean;
  ipHeaders?: IPHeaders[];
}

/**
 * Common Logger interface.
 */
export interface Logger  {
  debug: <T extends unknown[]>(...args: T) => void;
  info: <T extends unknown[]>(...args: T) => void;
  warn: <T extends unknown[]>(...args: T) => void;
  error: <T extends unknown[]>(...args: T) => void;
}
