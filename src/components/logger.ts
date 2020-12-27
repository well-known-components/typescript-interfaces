/**
 * @public
 */

export namespace ILoggerComponent {
  export type ILogger = {
    log(message: string, extra?: Record<string, string | number>): void
    error(error: string | Error): void
    debug(message: string, extra?: Record<string, string | number>): void
    info(message: string, extra?: Record<string, string | number>): void
    warn(message: string, extra?: Record<string, string | number>): void
  }
}

/**
 * @public
 */
export type ILoggerComponent = {
  getLogger(name: string): ILoggerComponent.ILogger
}
