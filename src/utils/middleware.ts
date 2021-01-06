/*
function gen(n) {
  return new Array(n + 1).fill(null).map((_, i) => i)
}
function generateSignature(n) {
  return gen(n).map(i => {
    const ctx = gen(i).map($ => 'Ctx' + ($+1)).join(', ')
    const sigs = gen(i).map($ => `middleware${$}: Middleware<Ctx${$}, ReturnType, Ctx${$ + 1}>`).join(', ')
    return `export function compose<Ctx0, ReturnType, ${ctx}>(${sigs}): ComposedMiddleware<Ctx${i+1}, ReturnType>`
  }).join('\n')
}
console.log(generateSignature(10))

*/

import { IAdapterHandler } from "../components/base-component"

/**
 * @public
 */
export namespace Middleware {
  export type ComposedMiddleware<Ctx, ReturnType> = (
    context: Ctx,
    handler: IAdapterHandler<Ctx, ReturnType>
  ) => Promise<ReturnType>

  export function compose<Ctx, ReturnType>(
    ...middlewares: Middleware<Ctx, ReturnType>[]
  ): ComposedMiddleware<Ctx, ReturnType> {
    if (!Array.isArray(middlewares)) throw new TypeError("Middleware stack must be an array!")

    for (const fn of middlewares) {
      if (typeof fn !== "function") throw new TypeError("Middleware must be composed of functions!")
    }

    return function (context: Ctx, handler: IAdapterHandler<Ctx, ReturnType>) {
      // last called middleware #
      let index = -1
      return dispatch(0)
      function dispatch(i: number, newContext?: Ctx): Promise<ReturnType> {
        if (i <= index) return Promise.reject(new Error("next() called multiple times"))
        index = i
        let fn = middlewares[i]

        // last middleware will call the real handler
        if (i === middlewares.length) fn = handler

        if (!fn) {
          // this should _never_ happen
          return Promise.reject(new Error("Empty response generated"))
        }

        try {
          return Promise.resolve(fn(newContext || context, dispatch.bind(null, i + 1)))
        } catch (err) {
          return Promise.reject(err)
        }
      }
    }
  }
}

/**
 * @public
 */
export type Middleware<Ctx, ReturnType> = (
  ctx: Readonly<Ctx>,
  next: (newContext: Readonly<Ctx>) => Promise<ReturnType>
) => Promise<ReturnType>
