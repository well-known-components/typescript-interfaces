/**
 * @public
 */
export namespace IBaseComponent {
  export type ComponentStartOptions = {
    /**
     * Whether or not the application has started all its components
     */
    started(): boolean
    /**
     * Whether or not the application has started
     */
    live(): boolean
    /**
     * Get all the components from the application
     */
    getComponents(): Record<string, any>
  }
}

/**
 * Describes the lifecycle methods for all the components. Every
 * component could extend this interface.
 * @public
 */
export interface IBaseComponent {
  /**
   * starts the component, i.e. it connects the database or binds the port in a listener server
   */
  start?: (startOptions: IBaseComponent.ComponentStartOptions) => Promise<void>
  /**
   * finishes pending work and/or releases all the resources (connections, bound ports, open file descriptors)
   */
  stop?: () => Promise<void>
}

/**
 * Base interface to normalize adapters
 * @public
 */
export type IAdapterHandler<Context, ReturnType> = (context: Context) => Promise<ReturnType>

/**
 * Base interface to normalize adapters that accept middlewares
 * @public
 */
export type IMiddlewareAdapterHandler<Context, ReturnType> = (
  context: Context,
  next: () => Promise<ReturnType>
) => Promise<ReturnType>
