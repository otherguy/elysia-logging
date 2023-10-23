import type { LogObject } from './types';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { formatDuration, parseBasicAuthHeader } from './helpers';

/**
 * Log class
 *
 * This class is used to format the log object in different ways.
 *  - formatJson() returns the log object as is
 * - formatCommon() returns the log object as a common log format (NCSA) string
 * - formatShort() returns the log object as a short string (perfect for dev console)
 *
 * @param log Log object
 *
 * @returns Log object
 *
 * @example
 * const log = new Log(logObject);
 * console.log(log.formatCommon());
 * console.log(log.formatShort());
 * console.log(log.formatJson());
 **/
export class Log {
  // Properties
  private logObject: LogObject;

  // Constructor
  constructor(log: LogObject) {
    this.logObject = log;
  }

  // Getters and setters
  public set error(error: any) {
    this.logObject.error = error;
  }

  public get log() : LogObject {
    return this.logObject;
  }

  /**
   * Simply return the log object and let the logger pretty print it
   *
   * @returns Log object as is
   */
  formatJson(): any {
    return { ...{
      message: `${this.logObject.request.method} ${this.logObject.request.url.path} completed with status ${this.logObject.response.status_code} in ${formatDuration(this.logObject.response.time)}`
    }, ...this.logObject } as any;
  }

  /**
   * Formats the log object as a common log format (NCSA) string
   *
   * @see https://en.wikipedia.org/wiki/Common_Log_Format
   *
   *
   * @returns Log object as a common log format (NCSA) string
   */
  formatCommon() : string {
    // Get basic auth user if set, else "-"
    const basicAuthUser : string= parseBasicAuthHeader(this.logObject.request.headers?.authorization ?? "")?.username ?? "-";

    // @TODO: This is not yet exposed by Elysia (https://github.com/elysiajs/elysia/issues/190)
    const requestProtocol : string = this.logObject.request.headers?.["x-forwarded-proto"] ?? "HTTP/1.1";

    // Formate date/time of the request (%d/%b/%Y:%H:%M:%S %z)
    const timeZone : string = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zonedDate : Date = utcToZonedTime(Date.now(), timeZone);
    const formattedDate : string = format(zonedDate, "dd/MMM/yyyy:HH:mm:ss xx");

    // @TODO: This is not yet exposed by Elysia (https://github.com/elysiajs/elysia/issues/190)
    const responseSize : number | undefined = undefined;

    // Return formatted log string
    return `${this.logObject.request.ip} - ${basicAuthUser} [${formattedDate}] "${this.logObject.request.method} ${this.logObject.request.url.path} ${requestProtocol}" ${this.logObject.response.status_code} ${responseSize ?? "-"}`
  }

  /**
   * Formats the log object as a short string (perfect for dev console)
   *
   * @returns Log object as a short string (perfect for dev console)
   */
  formatShort(): string {
    const durationInNanoseconds = this.logObject.response.time;
    const timeMessage: string = formatDuration(durationInNanoseconds);
    const queryString = Object.keys(this.logObject.request.url.params).length ? `?${new URLSearchParams(this.logObject.request.url.params).toString()}` : "";

    const requestUri = this.logObject.request.url.path + queryString;
    return `[${this.logObject.request.ip}] ${this.logObject.request.method} ${requestUri} ${this.logObject.response.status_code} (${timeMessage})`;
  }
}
