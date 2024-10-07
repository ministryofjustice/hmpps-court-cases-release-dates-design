import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { DesignSystemEnvironment, FooterConfig } from '../../../../../src/hmpps/@types'

nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'src/',
  __dirname,
])
describe('Tests for footer component', () => {
  it('Should display default text and href for support', () => {
    const config: FooterConfig = { environment: 'dev' }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#support-text').text()).toStrictEqual('To get help, email omu.specialistsupportteam@justice.gov.uk.')
    expect($('#footer-support-link').text()).toStrictEqual('omu.specialistsupportteam@justice.gov.uk')
    expect($('#footer-support-link').attr('href')).toStrictEqual('mailto:omu.specialistsupportteam@justice.gov.uk')
  })

  it('Can override default text for support', () => {
    const config: FooterConfig = { environment: 'dev', support: { text: 'Custom text' } }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#footer-support-link').text()).toStrictEqual('Custom text')
  })

  it('can override default href for support', () => {
    const config: FooterConfig = { environment: 'dev', support: { href: '/custom-support' } }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#footer-support-link').attr('href')).toStrictEqual('/custom-support')
  })

  it('should display default text and href for feedback', () => {
    const config: FooterConfig = { environment: 'dev' }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#footer-feedback-link').text().trim()).toStrictEqual('Feedback (opens in a new tab)')
    expect($('#footer-feedback-link').attr('href')).toStrictEqual('https://eu.surveymonkey.com/r/Z2MBZZ3')
  })

  it('Can override default text for feedback', () => {
    const config: FooterConfig = { environment: 'dev', feedback: { text: 'Custom text' } }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#footer-feedback-link').text().trim()).toStrictEqual('Custom text')
  })

  it('can override default href for feedback', () => {
    const config: FooterConfig = { environment: 'dev', feedback: { href: '/custom-feedback' } }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#footer-feedback-link').attr('href')).toStrictEqual('/custom-feedback')
  })

  it('should display default text and href for accessibility statement', () => {
    const config: FooterConfig = { environment: 'dev' }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#footer-accessibility-statement-link').text().trim()).toStrictEqual('Accessibility')
    expect($('#footer-accessibility-statement-link').attr('href')).toStrictEqual(
      'https://calculate-release-dates-dev.hmpps.service.justice.gov.uk/accessibility',
    )
  })

  it('Can override default text for accessibility statement ', () => {
    const config: FooterConfig = { environment: 'dev', accessibilityStatement: { text: 'Custom text' } }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#footer-accessibility-statement-link').text().trim()).toStrictEqual('Custom text')
  })

  it('can override default href for accessibility statement', () => {
    const config: FooterConfig = { environment: 'dev', accessibilityStatement: { href: '/custom-accessibility' } }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#footer-accessibility-statement-link').attr('href')).toStrictEqual('/custom-accessibility')
  })

  it('should display default text and href for terms and conditions', () => {
    const config: FooterConfig = { environment: 'dev' }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#footer-terms-conditions-link').text().trim()).toStrictEqual('Terms and conditions')
    expect($('#footer-terms-conditions-link').attr('href')).toStrictEqual(
      'https://dps-dev.prison.service.justice.gov.uk/terms-and-conditions',
    )
  })

  it('Can override default text for terms and conditions', () => {
    const config: FooterConfig = { environment: 'dev', termsConditions: { text: 'Custom text' } }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#footer-terms-conditions-link').text().trim()).toStrictEqual('Custom text')
  })

  it('can override default href for terms and conditions', () => {
    const config: FooterConfig = { environment: 'dev', termsConditions: { href: '/custom-terms' } }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#footer-terms-conditions-link').attr('href')).toStrictEqual('/custom-terms')
  })

  it('should display default text and href for privacy policy', () => {
    const config: FooterConfig = { environment: 'dev' }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#footer-privacy-policy-link').text().trim()).toStrictEqual('Privacy policy')
    expect($('#footer-privacy-policy-link').attr('href')).toStrictEqual(
      'https://dps-dev.prison.service.justice.gov.uk/privacy-policy',
    )
  })

  it('Can override default text for privacy policy', () => {
    const config: FooterConfig = { environment: 'dev', privacyPolicy: { text: 'Custom text' } }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#footer-privacy-policy-link').text().trim()).toStrictEqual('Custom text')
  })

  it('can override default href for privacy policy', () => {
    const config: FooterConfig = { environment: 'dev', privacyPolicy: { href: '/custom-privacy' } }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#footer-privacy-policy-link').attr('href')).toStrictEqual('/custom-privacy')
  })

  it('should display default text and href for cookies policy', () => {
    const config: FooterConfig = { environment: 'dev' }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#footer-cookies-link').text().trim()).toStrictEqual('Cookies policy')
    expect($('#footer-cookies-link').attr('href')).toStrictEqual(
      'https://dps-dev.prison.service.justice.gov.uk/cookies-policy',
    )
  })

  it('Can override default text for cookies policy', () => {
    const config: FooterConfig = { environment: 'dev', cookiesPolicy: { text: 'Custom text' } }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#footer-cookies-link').text().trim()).toStrictEqual('Custom text')
  })

  it('can override default href for cookies policy', () => {
    const config: FooterConfig = { environment: 'dev', cookiesPolicy: { href: '/custom-cookie' } }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#footer-cookies-link').attr('href')).toStrictEqual('/custom-cookie')
  })

  it('Default to dev environment', () => {
    const content = nunjucks.render('index.njk', { config: {} })
    const $ = cheerio.load(content)
    expect($('#footer-check-my-diary-link').attr('href')).toStrictEqual(
      'https://check-my-diary-dev.prison.service.justice.gov.uk?fromDPS=true',
    )
  })

  it.each([
    [
      'local' as DesignSystemEnvironment,
      'http://localhost:3000/checkMyDiary',
      'http://localhost:3000/submitIntelligenceReport',
    ],
    [
      'dev' as DesignSystemEnvironment,
      'https://check-my-diary-dev.prison.service.justice.gov.uk?fromDPS=true',
      'https://submit-information-report-dev.hmpps.service.justice.gov.uk',
    ],
    [
      'pre' as DesignSystemEnvironment,
      'https://check-my-diary-preprod.prison.service.justice.gov.uk?fromDPS=true',
      'https://submit-information-report-preprod.hmpps.service.justice.gov.uk',
    ],
    [
      'prod' as DesignSystemEnvironment,
      'https://checkmydiary.service.justice.gov.uk?fromDPS=true',
      'https://submit-information-report.hmpps.service.justice.gov.uk',
    ],
  ])(
    'Link for %s should be %s for check diary and %s for intelligence report',
    (env: DesignSystemEnvironment, expectedCheckDiary: string, expectedIntelligenceReport: string) => {
      const config: FooterConfig = { environment: env }
      const content = nunjucks.render('index.njk', { config })
      const $ = cheerio.load(content)
      expect($('#footer-check-my-diary-link').attr('href')).toStrictEqual(expectedCheckDiary)
      expect($('#footer-submit-intelligence-report-link').attr('href')).toStrictEqual(expectedIntelligenceReport)
    },
  )
})
