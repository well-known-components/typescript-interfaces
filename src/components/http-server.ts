import type * as stream from "stream"
import type * as fetch from "node-fetch"
import type { IAdapterHandler } from "./base-component"
import type { ParseUrlParams as _ParseUrlParams } from "typed-url-params"

/**
 * @alpha
 */
export namespace IHttpServerComponent {
  // only objects for the time being. Rationale: https://menduz.com/posts/2019.05.07
  export type JsonBody = Record<string, any>

  export type JsonResponse = ResponseInit & { body: JsonBody }
  export type StreamResponse = ResponseInit & { body: stream.Readable }

  export type IRequest = fetch.Request
  export type IResponse = JsonResponse | StreamResponse | ResponseInit
  export type DefaultContext<Context = {}> = Context & {
    request: IRequest
    query: Record<string, any>
    params: Record<string, string | string[]>
  }
  export type IRequestHandler<Context> = IAdapterHandler<DefaultContext<Context>, Readonly<IResponse>>
  export type ParseUrlParams<State extends string, Memo extends Record<string, any> = {}> = _ParseUrlParams<State, Memo>

  /**
   * HTTP request methods.
   *
   * HTTP defines a set of request methods to indicate the desired action to be
   * performed for a given resource. Although they can also be nouns, these
   * request methods are sometimes referred as HTTP verbs. Each of them implements
   * a different semantic, but some common features are shared by a group of them:
   * e.g. a request method can be safe, idempotent, or cacheable.
   *
   * @public
   */
  export type HTTPMethod =
    /**
     * The `CONNECT` method establishes a tunnel to the server identified by the
     * target resource.
     */
    | "CONNECT"

    /**
     * The `DELETE` method deletes the specified resource.
     */
    | "DELETE"

    /**
     * The `GET` method requests a representation of the specified resource.
     * Requests using GET should only retrieve data.
     */
    | "GET"

    /**
     * The `HEAD` method asks for a response identical to that of a GET request,
     * but without the response body.
     */
    | "HEAD"

    /**
     * The `OPTIONS` method is used to describe the communication options for the
     * target resource.
     */
    | "OPTIONS"

    /**
     * The PATCH method is used to apply partial modifications to a resource.
     */
    | "PATCH"

    /**
     * The `POST` method is used to submit an entity to the specified resource,
     * often causing a change in state or side effects on the server.
     */
    | "POST"

    /**
     * The `PUT` method replaces all current representations of the target
     * resource with the request payload.
     */
    | "PUT"

    /**
     * The `TRACE` method performs a message loop-back test along the path to the
     * target resource.
     */
    | "TRACE"
}

/**
 * @alpha
 */
export type IHttpServerComponent = {
  /**
   * Register a route in this server
   */
  registerRoute: <Context, T extends string>(
    /**
     *  context to be passed on to the handlers
     */
    context: Context,
    /**
     * http method to bind to
     */
    method: IHttpServerComponent.HTTPMethod | Lowercase<IHttpServerComponent.HTTPMethod>,
    /**
     * /path/to/:bind
     */
    path: T,
    /**
     * adapter code to handle the request
     */
    handler: IHttpServerComponent.IRequestHandler<Context & { params: IHttpServerComponent.ParseUrlParams<T> }>
  ) => void
}
