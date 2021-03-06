/**
 * More info: https://andrewlock.net/deploying-asp-net-core-applications-to-kubernetes-part-6-adding-health-checks-with-liveness-readiness-and-startup-probes/
 * @public
 */
export interface IStatusCheckCapableComponent {
  /**
   * The first probe to run is the Startup probe.
   * When your app starts up, it might need to do a lot of work.
   * It might need to fetch data from remote services, load dlls
   * from plugins, who knows what else. During that process, your
   * app should either not respond to requests, or if it does, it
   * should return a status code of 400 or higher. Once the startup
   * process has finished, you can switch to returning a success
   * result (200) for the startup probe.
   *
   * IMPORTANT: This method should return as soon as possible, not wait for completion.
   * @public
   */
  startupProbe?(): Promise<boolean>

  /**
   * Readiness probes indicate whether your application is ready to
   * handle requests. It could be that your application is alive, but
   * that it just can't handle HTTP traffic. In that case, Kubernetes
   * won't kill the container, but it will stop sending it requests.
   * In practical terms, that means the pod is removed from an
   * associated service's "pool" of pods that are handling requests,
   * by marking the pod as "Unready".
   *
   * IMPORTANT: This method should return as soon as possible, not wait for completion.
   * @public
   */
  readynessProbe?(): Promise<boolean>
}
