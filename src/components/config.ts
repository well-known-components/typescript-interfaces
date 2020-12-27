/**
 * @public
 */
export interface IConfigComponent<T = Record<string, any>> {
  getString(name: keyof T | string): Promise<string | undefined>
  getNumber(name: keyof T | string): Promise<number | undefined>
  requireString(name: keyof T | string): Promise<string>
  requireNumber(name: keyof T | string): Promise<number>
}
