import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { ServiceHeaderConfig } from '../../../../../src/hmpps/@types'

nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'src/',
  __dirname,
])
describe('Tests for service header component', () => {
  it('Should display default text and service root links when no prisoner', () => {
    const config: ServiceHeaderConfig = { environment: 'dev' }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#service-header-heading').text()).toStrictEqual('Court cases and release dates')
    expect($('#service-header-heading-link').attr('href')).toStrictEqual(
      'https://custody-manager-dev.hmpps.service.justice.gov.uk',
    )
  })

  it('Should display default text and service prisoner specific links when there is a prisoner', () => {
    const config: ServiceHeaderConfig = { environment: 'dev', prisonNumber: 'ABC123' }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#service-header-heading').text()).toStrictEqual('Court cases and release dates')
    expect($('#service-header-heading-link').attr('href')).toStrictEqual(
      'https://custody-manager-dev.hmpps.service.justice.gov.uk/prisoner/ABC123/overview',
    )
  })

  it('Can override the heading text', () => {
    const config: ServiceHeaderConfig = {
      environment: 'dev',
      text: 'My service',
    }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#service-header-heading').text()).toStrictEqual('My service')
  })

  it('Can override the link', () => {
    const config: ServiceHeaderConfig = {
      href: '/my-service',
    }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#service-header-heading-link').attr('href')).toStrictEqual('/my-service')
  })

  it('Default to dev environment', () => {
    const content = nunjucks.render('index.njk', { config: {} })
    const $ = cheerio.load(content)
    expect($('#service-header-heading-link').attr('href')).toStrictEqual(
      'https://custody-manager-dev.hmpps.service.justice.gov.uk',
    )
  })

  it.each([
    ['local', 'http://localhost:3000'],
    ['dev', 'https://custody-manager-dev.hmpps.service.justice.gov.uk'],
    ['pre', 'https://custody-manager-preprod.hmpps.service.justice.gov.uk'],
    ['prod', 'https://custody-manager.hmpps.service.justice.gov.uk'],
  ])('Link for %s should be %s', (env: 'local' | 'dev' | 'pre' | 'prod', expected: string) => {
    const config: ServiceHeaderConfig = { environment: env }
    const content = nunjucks.render('index.njk', { config })
    const $ = cheerio.load(content)
    expect($('#service-header-heading-link').attr('href')).toStrictEqual(expected)
  })

  it.each([
    ['local', 'http://localhost:3000/prisoner/ABC123/overview'],
    ['dev', 'https://custody-manager-dev.hmpps.service.justice.gov.uk/prisoner/ABC123/overview'],
    ['pre', 'https://custody-manager-preprod.hmpps.service.justice.gov.uk/prisoner/ABC123/overview'],
    ['prod', 'https://custody-manager.hmpps.service.justice.gov.uk/prisoner/ABC123/overview'],
  ])(
    'Link for %s should be %s when there is a prison number',
    (env: 'local' | 'dev' | 'pre' | 'prod', expected: string) => {
      const config: ServiceHeaderConfig = { environment: env, prisonNumber: 'ABC123' }
      const content = nunjucks.render('index.njk', { config })
      const $ = cheerio.load(content)
      expect($('#service-header-heading-link').attr('href')).toStrictEqual(expected)
    },
  )
})
