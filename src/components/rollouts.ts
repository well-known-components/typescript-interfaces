/**
 * @beta
 */
export type RolloutContext = {
  userId?: string
  sessionId?: string
  remoteAddress?: string
  environment?: string
  appName?: string
  properties?: Record<string, string | number | undefined>
}

/**
 * @beta
 */
export enum PayloadType {
  STRING = "string",
}

/**
 * @beta
 */
export interface Override {
  contextName: string
  values: String[]
}

/**
 * @beta
 */
export interface Payload {
  type: PayloadType
  value: string
}

/**
 * @beta
 */
export interface VariantDefinition {
  name: string
  weight: number
  payload: Payload
  overrides: Override[]
}

/**
 * @beta
 */
export interface Variant {
  name: string
  enabled: boolean
  payload?: Payload
}

/**
 * @beta
 */
export type FallbackFunction = (name: string, context: RolloutContext) => boolean

/**
 * @beta
 */
export type IRolloutComponent = {
  isEnabled(name: string, context: RolloutContext, fallbackFunction?: FallbackFunction): boolean
  getVariant(name: string, context: RolloutContext, fallbackVariant?: Variant): Variant
}
