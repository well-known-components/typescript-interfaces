function stopAllComponents(components: Record<string, { stop: () => any } | any>) {
  const pending: PromiseLike<any>[] = []
  for (let c in components) {
    const component = components[c]
    if ("stop" in component) {
      pending.push(component.stop())
    }
  }
  return Promise.all(pending)
}

// gracefully finalizes all the components on SIGTERM
function bindStopService(components: Record<string, { stop: () => any } | any>) {
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
async function startComponentsLifecycle(components: Record<string, { start: () => any } | any>): Promise<void> {
  const pending: PromiseLike<any>[] = []

  for (let c in components) {
    const component = components[c]
    if ("start" in component) {
      const awaitable = component.start()
      if (awaitable && typeof awaitable == "object" && "then" in awaitable) {
        pending.push(awaitable)
        awaitable.catch(() => void 0)
      }
    }
  }

  bindStopService(components)

  if (pending.length == 0) return

  if ("allSettled" in Promise) {
    await (Promise as any).allSettled(pending)
  }

  try {
    await Promise.all(pending)
  } catch (e) {
    console.error(e)
    process.stderr.write("<<< Error initializing components. Stopping components and closing application. >>>\n")
    await stopAllComponents(components)
    process.exit(1)
  }
}

// handles an async function, if it fails the program exits with exit code 1
function awaitable<T>(fn: () => Promise<T>): Promise<T> {
  return fn().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}

/**
 * @public
 */
export namespace lifecycle {
  export async function programEntryPoint<Components>(config: {
    main: (components: Components) => Promise<any>
    initComponents: () => Promise<Components>
    // initTestComponents?: () => Promise<Components>
  }): Promise<{ stop(): Promise<void> }> {
    return awaitable(async () => {
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
        async stop(): Promise<void> {
          await startComponentsLifecycle(components)
        },
      }
    })
  }
}
