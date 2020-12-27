/**
 * @public
 */
export interface ICacheComponent {
  put(key: string, value: string | ArrayBuffer): Promise<void>
  get(key: string): Promise<ArrayBuffer | null>
}
