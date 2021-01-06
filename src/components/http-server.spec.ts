import { IAdapterHandler } from "./base-component"
import { IHttpServerComponent as http } from "./http-server"

declare var it: any
declare var describe: any

it("case 1", () => {
  const t1: http.DefaultContext<{}, "/:a+"> = { params: { a: [""] }, query: {}, request: {} as any }
  testArray(t1.params.a)
  testAssignability<string>(t1)

  const tx1: http.DefaultContext<{}, string> = { params: { a: "" }, query: {}, request: {} as any }
  testAssignability<"/:a">(tx1)

  function testAssignability<path extends string>(x: http.DefaultContext<{}, path>) {}
  function testArray(x: string[]) {}
})

it("case 2", () => {
  const t1: IAdapterHandler<http.DefaultContext<{}, "/:a+">, http.IResponse> = null!
  const t2: IAdapterHandler<http.DefaultContext<{}, string>, http.IResponse> = t1

  function testAssignability<path extends string>(x: IAdapterHandler<http.DefaultContext<{}, path>, http.IResponse>) {}

  testAssignability<string>(t1)
  testAssignability<string>(t2)
  testAssignability<"/:a+">(t1)
  testAssignability<"/:a+">(t2)
})
