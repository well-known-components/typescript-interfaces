/**
 * Defines a simple interface for a generic key-value store.
 * @public
 */
export interface ICacheComponent {
  /**
   * Puts a new value in the caché.
   * "put", as in http, is expected to be an idempotent operation.
   */
  put(key: string, value: string | ArrayBuffer): Promise<void>
  /**
   * Tries to get a value from the store. It returns null if no value is present
   */
  get(key: string): Promise<ArrayBuffer | null>
}
