export type designSystemEnv = 'local' | 'dev' | 'pre' | 'prod'
export class ServiceHeaderConfig {
  constructor(
    public environment: designSystemEnv,
    public prisonNumber?: string,
    public text?: string,
    public href?: string,
  ) {}
}
