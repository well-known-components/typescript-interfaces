import type * as stream from "stream"
import type * as fetch from "node-fetch"

export type ExtendedRequestInfo<
  Query extends object = Record<string, string | string[]>,
  Params extends object = Record<string, string>
> = fetch.Request & {
  query: Query
  params: Params
}

// only objects for the time being
export type JsonBody = Record<string, any>

type JsonResponse = ResponseInit & { body: JsonBody }
type StreamResponse = ResponseInit & { body: stream.Readable }

export type IResponse<T> = JsonResponse | StreamResponse

export type IRequestHandler<T = any> = (req: ExtendedRequestInfo) => Promise<IResponse<T>>

export type IServerComponent = {
  start: () => Promise<any>
  stop: () => Promise<any>
  get: (path: string, handler: IRequestHandler) => void
  post: (path: string, handler: IRequestHandler) => void
  put: (path: string, handler: IRequestHandler) => void
  delete: (path: string, handler: IRequestHandler) => void
}
