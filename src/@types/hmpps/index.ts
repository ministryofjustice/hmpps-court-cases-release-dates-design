export default {}

export type DesignSystemEnvironment = 'local' | 'dev' | 'pre' | 'prod'

export interface ServiceHeaderConfig {
  environment: DesignSystemEnvironment
  prisonNumber?: string
  text?: string
  href?: string
}
