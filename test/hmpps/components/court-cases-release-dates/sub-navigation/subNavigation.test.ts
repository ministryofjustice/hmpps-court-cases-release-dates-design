import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { DesignSystemEnvironment, SubNavigationConfig } from '../../../../../src/hmpps/@types'

nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'src/',
  __dirname,
])
describe('Tests for sub navigation component', () => {
  it.each([
    [
      'local' as DesignSystemEnvironment,
      'http://localhost:3000/prisoner/ABC123/overview',
      'http://localhost:3000/person/ABC123',
      'http://localhost:3000/ABC123',
      'http://localhost:3000/?prisonId=ABC123',
      'http://localhost:3000/person/ABC123',
      'http://localhost:3000/prisoner/ABC123/documents',
    ],
    [
      'dev' as DesignSystemEnvironment,
      'https://court-cases-release-dates-dev.hmpps.service.justice.gov.uk/prisoner/ABC123/overview',
      'https://remand-and-sentencing-dev.hmpps.service.justice.gov.uk/person/ABC123',
      'https://adjust-release-dates-dev.hmpps.service.justice.gov.uk/ABC123',
      'https://calculate-release-dates-dev.hmpps.service.justice.gov.uk/?prisonId=ABC123',
      'https://record-a-recall-dev.hmpps.service.justice.gov.uk/person/ABC123',
      'https://court-cases-release-dates-dev.hmpps.service.justice.gov.uk/prisoner/ABC123/documents',
    ],
    [
      'pre' as DesignSystemEnvironment,
      'https://court-cases-release-dates-preprod.hmpps.service.justice.gov.uk/prisoner/ABC123/overview',
      'https://remand-and-sentencing-preprod.hmpps.service.justice.gov.uk/person/ABC123',
      'https://adjust-release-dates-preprod.hmpps.service.justice.gov.uk/ABC123',
      'https://calculate-release-dates-preprod.hmpps.service.justice.gov.uk/?prisonId=ABC123',
      'https://record-a-recall-preprod.hmpps.service.justice.gov.uk/person/ABC123',
      'https://court-cases-release-dates-preprod.hmpps.service.justice.gov.uk/prisoner/ABC123/documents',
    ],
    [
      'prod' as DesignSystemEnvironment,
      'https://court-cases-release-dates.hmpps.service.justice.gov.uk/prisoner/ABC123/overview',
      'https://remand-and-sentencing.hmpps.service.justice.gov.uk/person/ABC123',
      'https://adjust-release-dates.hmpps.service.justice.gov.uk/ABC123',
      'https://calculate-release-dates.hmpps.service.justice.gov.uk/?prisonId=ABC123',
      'https://record-a-recall.hmpps.service.justice.gov.uk/person/ABC123',
      'https://court-cases-release-dates.hmpps.service.justice.gov.uk/prisoner/ABC123/documents',
    ],
  ])(
    'Should be able to load sub-navigation for all tabs in %s',
    (
      env: DesignSystemEnvironment,
      expectedOverview: string,
      expectedCourtCases: string,
      expectedAdjustments: string,
      expectedCrd: string,
      expectedRecalls: string,
      expectedDocuments: string,
    ) => {
      const config: SubNavigationConfig = {
        environment: env,
        prisonNumber: 'ABC123',
        navigation: {
          activeSubNav: 'overview',
        },
      }
      const content = nunjucks.render('index.njk', config)
      const links = extractLinks(content)

      expect(links.Overview).toStrictEqual(expectedOverview)
      expect(links['Court cases']).toStrictEqual(expectedCourtCases)
      expect(links.Adjustments).toStrictEqual(expectedAdjustments)
      expect(links['Release dates and calculations']).toStrictEqual(expectedCrd)
      expect(links.Recalls).toStrictEqual(expectedRecalls)
      expect(links.Documents).toStrictEqual(expectedDocuments)
    },
  )
  it('should be able to give custom href for all tabs', () => {
    const config: SubNavigationConfig = {
      environment: 'dev',
      prisonNumber: 'ABC123',
      navigation: {
        activeSubNav: 'overview',
        overview: { href: '/my-overview' },
        courtCases: { href: '/my-courtCases' },
        adjustments: { href: '/my-adjustments' },
        releaseDates: { href: '/my-releaseDates' },
        recalls: { href: '/my-recalls' },
        documents: { href: '/my-documents' },
      },
    }
    const content = nunjucks.render('index.njk', config)
    const links = extractLinks(content)
    expect(links.Overview).toStrictEqual('/my-overview')
    expect(links['Court cases']).toStrictEqual('/my-courtCases')
    expect(links.Adjustments).toStrictEqual('/my-adjustments')
    expect(links['Release dates and calculations']).toStrictEqual('/my-releaseDates')
    expect(links.Recalls).toStrictEqual('/my-recalls')
    expect(links.Documents).toStrictEqual('/my-documents')
  })

  it('enabled = true should show the tab', () => {
    const config: SubNavigationConfig = {
      environment: 'dev',
      prisonNumber: 'ABC123',
      navigation: {
        activeSubNav: 'overview',
        overview: { href: '/my-overview', enabled: true },
        courtCases: { href: '/my-courtCases', enabled: true },
        adjustments: { href: '/my-adjustments', enabled: true },
        releaseDates: { href: '/my-releaseDates', enabled: true },
        recalls: { href: '/my-recalls', enabled: true },
        documents: { href: '/my-documents', enabled: true },
      },
    }
    const content = nunjucks.render('index.njk', config)
    const $ = cheerio.load(content)
    const links = extractLinks(content)
    expect(links.Overview).toStrictEqual('/my-overview')
    expect(links['Court cases']).toStrictEqual('/my-courtCases')
    expect(links.Adjustments).toStrictEqual('/my-adjustments')
    expect(links['Release dates and calculations']).toStrictEqual('/my-releaseDates')
    expect(links.Recalls).toStrictEqual('/my-recalls')
    expect(links.Documents).toStrictEqual('/my-documents')
    expect($('li').length).toStrictEqual(6)
  })

  it('enabled = false should not render the overview tab', () => {
    const config: SubNavigationConfig = {
      environment: 'dev',
      prisonNumber: 'ABC123',
      navigation: {
        activeSubNav: 'overview',
        overview: { href: '/my-overview', enabled: false },
        courtCases: { href: '/my-courtCases', enabled: true },
        adjustments: { href: '/my-adjustments', enabled: true },
        releaseDates: { href: '/my-releaseDates', enabled: true },
        recalls: { href: '/my-recalls', enabled: true },
        documents: { href: '/my-documents', enabled: true },
      },
    }
    const content = nunjucks.render('index.njk', config)
    const $ = cheerio.load(content)
    const links = extractLinks(content)
    expect(links.Overview).toBeUndefined()
    expect(links['Court cases']).toStrictEqual('/my-courtCases')
    expect(links.Adjustments).toStrictEqual('/my-adjustments')
    expect(links['Release dates and calculations']).toStrictEqual('/my-releaseDates')
    expect(links.Recalls).toStrictEqual('/my-recalls')
    expect(links.Documents).toStrictEqual('/my-documents')
    expect($('li').length).toStrictEqual(5)
  })

  it('enabled = false should not render the Court cases tab', () => {
    const config: SubNavigationConfig = {
      environment: 'dev',
      prisonNumber: 'ABC123',
      navigation: {
        activeSubNav: 'overview',
        overview: { href: '/my-overview', enabled: true },
        courtCases: { href: '/my-courtCases', enabled: false },
        adjustments: { href: '/my-adjustments', enabled: true },
        releaseDates: { href: '/my-releaseDates', enabled: true },
        recalls: { href: '/my-recalls', enabled: true },
        documents: { href: '/my-documents', enabled: true },
      },
    }
    const content = nunjucks.render('index.njk', config)
    const $ = cheerio.load(content)
    const links = extractLinks(content)
    expect(links.Overview).toStrictEqual('/my-overview')
    expect(links['Court cases']).toBeUndefined()
    expect(links.Adjustments).toStrictEqual('/my-adjustments')
    expect(links['Release dates and calculations']).toStrictEqual('/my-releaseDates')
    expect(links.Recalls).toStrictEqual('/my-recalls')
    expect(links.Documents).toStrictEqual('/my-documents')
    expect($('li').length).toStrictEqual(5)
  })

  it('enabled = false should not render the adjustments tab', () => {
    const config: SubNavigationConfig = {
      environment: 'dev',
      prisonNumber: 'ABC123',
      navigation: {
        activeSubNav: 'overview',
        overview: { href: '/my-overview', enabled: true },
        courtCases: { href: '/my-courtCases', enabled: true },
        adjustments: { href: '/my-adjustments', enabled: false },
        releaseDates: { href: '/my-releaseDates', enabled: true },
        recalls: { href: '/my-recalls', enabled: true },
        documents: { href: '/my-documents', enabled: true },
      },
    }
    const content = nunjucks.render('index.njk', config)
    const $ = cheerio.load(content)
    const links = extractLinks(content)
    expect(links.Overview).toStrictEqual('/my-overview')
    expect(links['Court cases']).toStrictEqual('/my-courtCases')
    expect(links.Adjustments).toBeUndefined()
    expect(links['Release dates and calculations']).toStrictEqual('/my-releaseDates')
    expect(links.Recalls).toStrictEqual('/my-recalls')
    expect(links.Documents).toStrictEqual('/my-documents')
    expect($('li').length).toStrictEqual(5)
  })

  it('enabled = false should not render the release dates tab', () => {
    const config: SubNavigationConfig = {
      environment: 'dev',
      prisonNumber: 'ABC123',
      navigation: {
        activeSubNav: 'overview',
        overview: { href: '/my-overview', enabled: true },
        courtCases: { href: '/my-courtCases', enabled: true },
        adjustments: { href: '/my-adjustments', enabled: true },
        releaseDates: { href: '/my-releaseDates', enabled: false },
        recalls: { href: '/my-recalls', enabled: true },
        documents: { href: '/my-documents', enabled: true },
      },
    }
    const content = nunjucks.render('index.njk', config)
    const $ = cheerio.load(content)
    const links = extractLinks(content)
    expect(links.Overview).toStrictEqual('/my-overview')
    expect(links['Court cases']).toStrictEqual('/my-courtCases')
    expect(links.Adjustments).toStrictEqual('/my-adjustments')
    expect(links['Release dates and calculations']).toBeUndefined()
    expect(links.Recalls).toStrictEqual('/my-recalls')
    expect(links.Documents).toStrictEqual('/my-documents')
    expect($('li').length).toStrictEqual(5)
  })

  it('enabled = false should not render the documents tab', () => {
    const config: SubNavigationConfig = {
      environment: 'dev',
      prisonNumber: 'ABC123',
      navigation: {
        activeSubNav: 'overview',
        overview: { href: '/my-overview', enabled: true },
        courtCases: { href: '/my-courtCases', enabled: true },
        adjustments: { href: '/my-adjustments', enabled: true },
        releaseDates: { href: '/my-releaseDates', enabled: true },
        recalls: { href: '/my-recalls', enabled: true },
        documents: { href: '/my-documents', enabled: false },
      },
    }
    const content = nunjucks.render('index.njk', config)
    const $ = cheerio.load(content)
    const links = extractLinks(content)
    expect(links.Overview).toStrictEqual('/my-overview')
    expect(links['Court cases']).toStrictEqual('/my-courtCases')
    expect(links.Adjustments).toStrictEqual('/my-adjustments')
    expect(links['Release dates and calculations']).toStrictEqual('/my-releaseDates')
    expect(links.Recalls).toStrictEqual('/my-recalls')
    expect(links.Documents).toBeUndefined()
    expect($('li').length).toStrictEqual(5)
  })

  it('enabled = false should not render the recalls tab', () => {
    const config: SubNavigationConfig = {
      environment: 'dev',
      prisonNumber: 'ABC123',
      navigation: {
        activeSubNav: 'overview',
        overview: { href: '/my-overview', enabled: true },
        courtCases: { href: '/my-courtCases', enabled: true },
        adjustments: { href: '/my-adjustments', enabled: true },
        releaseDates: { href: '/my-releaseDates', enabled: true },
        recalls: { href: '/my-recalls', enabled: false },
        documents: { href: '/my-documents', enabled: true },
      },
    }
    const content = nunjucks.render('index.njk', config)
    const $ = cheerio.load(content)
    const links = extractLinks(content)
    expect(links.Overview).toStrictEqual('/my-overview')
    expect(links['Court cases']).toStrictEqual('/my-courtCases')
    expect(links.Adjustments).toStrictEqual('/my-adjustments')
    expect(links['Release dates and calculations']).toStrictEqual('/my-releaseDates')
    expect(links.Recalls).toBeUndefined()
    expect(links.Documents).toStrictEqual('/my-documents')
    expect($('li').length).toStrictEqual(5)
  })

  it('should highlight the active tab', () => {
    const config: SubNavigationConfig = {
      environment: 'dev',
      prisonNumber: 'ABC123',
      navigation: {
        activeSubNav: 'release-dates',
      },
    }
    const content = nunjucks.render('index.njk', config)
    const $ = cheerio.load(content)
    const links = $('a')
      .map((i, element) => {
        return { key: $(element).text(), value: $(element).attr('aria-current') }
      })
      .get()
    const pages = Object.fromEntries(links.map(x => [x.key, x.value]))
    expect(pages.Overview).toBeUndefined()
    expect(pages['Court cases']).toBeUndefined()
    expect(pages.Adjustments).toBeUndefined()
    expect(pages['Release dates and calculations']).toStrictEqual('page')
    expect(pages.Documents).toBeUndefined()
  })

  function extractLinks(content: string) {
    const $ = cheerio.load(content)
    const links = $('a')
      .map((i, element) => {
        return { key: $(element).text(), value: $(element).attr('href') }
      })
      .get()
    return Object.fromEntries(links.map(x => [x.key, x.value]))
  }
})
