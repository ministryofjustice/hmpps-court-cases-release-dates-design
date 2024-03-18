export default {}

export type DesignSystemEnvironment = 'local' | 'dev' | 'pre' | 'prod'

export interface ServiceHeaderConfig {
  environment?: DesignSystemEnvironment
  prisonNumber?: string
  text?: string
  href?: string
}

export interface MiniProfileConfig {
  person: MiniProfilePerson
  profileUrl: string
  imageUrl: string
}

export interface MiniProfilePerson {
  prisonerNumber: string
  firstName: string
  lastName: string
  /**
   * Format: date
   * @example 1975-04-02
   */
  dateOfBirth: string
  status: string
  cellLocation?: string
  prisonName?: string
}

export interface Action {
  title: string
  href: string
  dataQa?: string
}

export interface SubNavigationConfig {
  environment: DesignSystemEnvironment
  navigation: SubNavigation
  prisonNumber: string
}

export interface SubNavigation {
  activeSubNav: 'overview' | 'court-cases' | 'adjustments' | 'release-dates' | 'documents'
  overview?: {
    href?: string
    enabled?: boolean
  }
  courtCases?: {
    href?: string
    enabled?: boolean
  }
  adjustments?: {
    href?: string
    enabled?: boolean
  }
  releaseDates?: {
    href?: string
    enabled?: boolean
  }
  documents?: {
    href?: string
    enabled?: boolean
  }
}

export interface LatestCalculationConfig {
  /**
   * Format: date
   * @example 1975-04-02
   */
  date: string
  location?: string
  reason: string
  source: 'NOMIS' | 'CRDS'
  dates: LatestCalculationDate[]
}

export interface LatestCalculationDate {
  id: string
  description: string
  /**
   * Format: date
   * @example 1975-04-02
   */
  date: string
  hints?: LatestCalculationDateHint[]
}

export interface LatestCalculationDateHint {
  text: string
  href?: string
}

export interface FooterConfig {
  environment?: DesignSystemEnvironment
  support?: {
    href?: string
    text?: string
  }
  feedback?: {
    href?: string
    text?: string
  }
  accessibilityStatement?: {
    href?: string
    text?: string
  }
  termsConditions?: {
    href?: string
    text?: string
  }
  privacyPolicy?: {
    href?: string
    text?: string
  }
  cookiesPolicy?: {
    href?: string
    text?: string
  }
  classes?: string
  attributes?: Record<string, never>
}
