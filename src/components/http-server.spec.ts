import { IAdapterHandler } from "./base-component"
import { IHttpServerComponent as http } from "./http-server"

declare var it: any
declare var describe: any

it("case 1", () => {
  const t1: http.PathAwareContext<{}, "/:a+"> = { params: { a: [""] } }
  testArray(t1.params.a)
  testAssignability<string>(t1)

  const tx1: http.PathAwareContext<{}, string> = { params: { a: "" } }
  testAssignability<"/:a">(tx1)

  function testAssignability<path extends string>(x: http.PathAwareContext<{}, path>) {}
  function testArray(x: string | string[]) {}
})

it("case 2", () => {
  const t1: IAdapterHandler<http.PathAwareContext<{}, "/:a+">, http.IResponse> = null!
  const t2: IAdapterHandler<http.PathAwareContext<{}, string>, http.IResponse> = t1

  function testAssignability<path extends string>(
    x: IAdapterHandler<http.PathAwareContext<{}, path>, http.IResponse>
  ) {}

  testAssignability<string>(t1)
  testAssignability<string>(t2)
  testAssignability<"/:a+">(t1)
  testAssignability<"/:a+">(t2)
})
