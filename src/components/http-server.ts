import type * as stream from "stream"
import type * as fetch from "node-fetch"

/**
 * @alpha
 */
export namespace IServerComponent {
  export interface ExtendedRequestInfo<
    Query extends object = Record<string, string | string[]>,
    Params extends object = Record<string, string>
  > extends fetch.Request {
    query: Query
    params: Params
  }

  // only objects for the time being
  export type JsonBody = Record<string, any>

  export type JsonResponse = ResponseInit & { body: JsonBody }
  export type StreamResponse = ResponseInit & { body: stream.Readable }

  export type IResponse<T> = JsonResponse | StreamResponse
  export type IRequestHandler<T = any> = (req: ExtendedRequestInfo) => Promise<IResponse<T>>
}
/**
 * @alpha
 */
export type IServerComponent = {
  start: () => Promise<any>
  stop: () => Promise<any>
  get: (path: string, handler: IServerComponent.IRequestHandler) => void
  post: (path: string, handler: IServerComponent.IRequestHandler) => void
  put: (path: string, handler: IServerComponent.IRequestHandler) => void
  delete: (path: string, handler: IServerComponent.IRequestHandler) => void
}
