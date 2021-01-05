/**
 * @public
 */
export namespace ILoggerComponent {
  export type ILogger = {
    log(message: string, extra?: Record<string, string | number>): void
    error(error: string | Error, extra?: Record<string, string | number>): void
    debug(message: string, extra?: Record<string, string | number>): void
    info(message: string, extra?: Record<string, string | number>): void
    warn(message: string, extra?: Record<string, string | number>): void
  }
}

/**
 * @public
 */
export type ILoggerComponent = {
  /**
   * Gets a scoped logger
   */
  getLogger(loggerName: string): ILoggerComponent.ILogger
}
