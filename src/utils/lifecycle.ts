import { IBaseComponent } from "../components/base-component"

function stopAllComponents(components: Record<string, IBaseComponent>) {
  const pending: PromiseLike<any>[] = []
  for (let c in components) {
    const component = components[c]
    if (component.stop) {
      pending.push(component.stop())
    }
  }
  return Promise.all(pending)
}

// gracefully finalizes all the components on SIGTERM
function bindStopService(components: Record<string, IBaseComponent>) {
  process.on("SIGTERM", () => {
    process.stdout.write("<<< SIGTERM received >>>\n")
    stopAllComponents(components)
      .then(() => process.exit())
      .catch((e) => {
        console.error(e)
        process.exit(1)
      })
  })
}

// gracefully finalizes all the components on SIGTERM
async function startComponentsLifecycle(components: Record<string, IBaseComponent>): Promise<void> {
  const pending: PromiseLike<any>[] = []

  let mutStarted = false
  let mutLive = false

  const immutableStartOptions: IBaseComponent.ComponentStartOptions = {
    started() {
      return mutStarted
    },
    live() {
      return mutLive
    },
    getComponents() {
      return components
    },
  }

  for (let c in components) {
    const component = components[c]
    if (component.start) {
      const awaitable = component.start(immutableStartOptions)
      if (awaitable && typeof awaitable == "object" && "then" in awaitable) {
        pending.push(awaitable)
        if (awaitable.catch) {
          // avoid unhanled catch error messages in node.
          // real catch happens below in `Promise.all(pending)`
          awaitable.catch(() => void 0)
        }
      }
    }
  }

  // application started
  mutLive = true

  bindStopService(components)

  if (pending.length == 0) return

  try {
    await Promise.all(pending)
    mutStarted = true
  } catch (e) {
    console.error(e)
    process.stderr.write("<<< Error initializing components. Stopping components and closing application. >>>\n")
    await stopAllComponents(components)
    process.exit(1)
  }
}

/**
 * handles an async function, if it fails the program exits with exit code 1
 */
function asyncTopLevelExceptionHanler<T>(fn: () => Promise<T>): Promise<T> {
  return fn().catch((error) => {
    // print error and stacktrace
    console.error(error)
    // exit program with error
    process.exit(1)
  })
}

/**
 * This namespace handles the basic lifecycle of the components.
 * @public
 */
export namespace lifecycle {
  export type ComponentBasedProgram<Components> = {
    /**
     * async stop() finishes all the components of the service and awaits for completion
     * it should be called to gracefully stop the program.
     *
     * It is automatically called on SIGTERM
     */
    stop(): Promise<void>

    /**
     * The components are present here only for debugging reasons. Do not use
     * it as part of your program.
     */
    readonly components: Components
  }

  /**
   * Program entry point, this should be the one and only top level
   * expression of your program.
   */
  export async function programEntryPoint<Components extends Record<string, any>>(config: {
    main: (components: Components) => Promise<any>
    initComponents: () => Promise<Components>
  }): Promise<ComponentBasedProgram<Components>> {
    return asyncTopLevelExceptionHanler(async () => {
      // pick a componentInitializer
      const componentInitializer = config.initComponents

      // init ports & components
      process.stdout.write("<<< Initializing components >>>\n")
      const components: Components = await componentInitializer()

      // wire adapters
      process.stdout.write("<<< Wiring app >>>\n")
      await config.main(components)

      // start components & ports
      process.stdout.write("<<< Starting components >>>\n")
      await startComponentsLifecycle(components)

      return {
        get components() {
          process.stderr.write("Warning: Usage of program.components is only intended for debuging reasons.\n")
          return components
        },
        async stop(): Promise<void> {
          await stopAllComponents(components)
        },
      }
    })
  }
}
