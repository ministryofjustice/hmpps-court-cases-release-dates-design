import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { Action, LatestCalculationConfig } from '../../../../../src/hmpps/@types'
import { hmppsFormatDate } from '../../../../../src/hmpps/utils/utils'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'src/',
  __dirname,
])
njkEnv.addFilter('hmppsFormatDate', hmppsFormatDate)

const action: Action = { title: 'My action', href: '/my-action', dataQa: 'my-action-link' }

describe('Tests for latest calculation date component', () => {
  it('Card title should just be the date and reason if there is no location (NOMIS or early CRD)', () => {
    const latestCalculation: LatestCalculationConfig = {
      date: '2024-06-01',
      reason: 'Transfer check',
      source: 'NOMIS',
      dates: [],
    }
    const content = nunjucks.render('index.njk', { latestCalculation })
    const $ = cheerio.load(content)
    const titleLines = $('.govuk-summary-card__title')
      .text()
      .split('\n')
      .map(str => str.trim())
      .filter(str => str.length > 0)
    expect(titleLines[0]).toStrictEqual('01 June 2024')
    expect(titleLines[1]).toStrictEqual('Calculation reason: Transfer check')
  })
  it('Card title should include the location if there is one', () => {
    const latestCalculation: LatestCalculationConfig = {
      date: '2024-06-01',
      location: 'HMP Kirkham',
      reason: 'Transfer check',
      source: 'DPS',
      dates: [],
    }
    const content = nunjucks.render('index.njk', { latestCalculation })
    const $ = cheerio.load(content)
    const titleLines = $('.govuk-summary-card__title')
      .text()
      .split('\n')
      .map(str => str.trim())
      .filter(str => str.length > 0)
    expect(titleLines[0]).toStrictEqual('01 June 2024 at HMP Kirkham')
    expect(titleLines[1]).toStrictEqual('Calculation reason: Transfer check')
  })
  it('NOMIS calculation should NOMIS badge with no action', () => {
    const latestCalculation: LatestCalculationConfig = {
      date: '2024-06-01',
      reason: 'Transfer check',
      source: 'NOMIS',
      dates: [],
    }
    const content = nunjucks.render('index.njk', { latestCalculation, action })
    const $ = cheerio.load(content)
    expect($('[data-qa=my-action-link]').length).toStrictEqual(0)
    expect($('.moj-badge').text()).toStrictEqual('NOMIS')
  })
  it('DPS calculation should not show badge even with no action', () => {
    const latestCalculation: LatestCalculationConfig = {
      date: '2024-06-01',
      reason: 'Transfer check',
      source: 'DPS',
      dates: [],
    }
    const content = nunjucks.render('index.njk', { latestCalculation })
    const $ = cheerio.load(content)
    expect($('[data-qa=my-action-link]').length).toStrictEqual(0)
    expect($('.moj-badge').length).toStrictEqual(0)
  })
  it('DPS calculation should show action if specified', () => {
    const latestCalculation: LatestCalculationConfig = {
      date: '2024-06-01',
      reason: 'Transfer check',
      source: 'DPS',
      dates: [],
    }
    const content = nunjucks.render('index.njk', { latestCalculation, action })
    const $ = cheerio.load(content)
    const actionLink = $('[data-qa=my-action-link]')
    expect(actionLink.length).toStrictEqual(1)
    expect($(actionLink[0]).text()).toStrictEqual('My action')
    expect($(actionLink[0]).attr('href')).toStrictEqual('/my-action')
    expect($('.moj-badge').length).toStrictEqual(0)
  })
  it('Should show all dates with their description', () => {
    const latestCalculation: LatestCalculationConfig = {
      date: '2024-06-01',
      reason: 'Transfer check',
      source: 'DPS',
      dates: [
        {
          id: 'SLED',
          description: 'Sentence and licence expiry date',
          date: '2036-02-19',
        },
        {
          id: 'CRD',
          description: 'Conditional release date',
          date: '2034-02-19',
        },
      ],
    }
    const content = nunjucks.render('index.njk', { latestCalculation, action })
    expect(extractDate(content, 'SLED')).toStrictEqual({
      id: 'SLED',
      description: 'Sentence and licence expiry date',
      date: 'Tuesday, 19 February 2036',
      hints: [],
    })
    expect(extractDate(content, 'CRD')).toStrictEqual({
      id: 'CRD',
      description: 'Conditional release date',
      date: 'Sunday, 19 February 2034',
      hints: [],
    })
  })
  it('Should show hints for a date', () => {
    const latestCalculation: LatestCalculationConfig = {
      date: '2024-06-01',
      reason: 'Transfer check',
      source: 'DPS',
      dates: [
        {
          id: 'SLED',
          description: 'Sentence and licence expiry date',
          date: '2036-02-19',
          hints: [{ text: 'Some foo hint' }, { text: 'Some bar hint' }],
        },
        {
          id: 'CRD',
          description: 'Conditional release date',
          date: '2034-02-19',
        },
      ],
    }
    const content = nunjucks.render('index.njk', { latestCalculation, action })
    expect(extractDate(content, 'SLED')).toStrictEqual({
      id: 'SLED',
      description: 'Sentence and licence expiry date',
      date: 'Tuesday, 19 February 2036',
      hints: [{ text: 'Some foo hint' }, { text: 'Some bar hint' }],
    })
    expect(extractDate(content, 'CRD')).toStrictEqual({
      id: 'CRD',
      description: 'Conditional release date',
      date: 'Sunday, 19 February 2034',
      hints: [],
    })
  })
  it('Should show hints with a policy link', () => {
    const latestCalculation: LatestCalculationConfig = {
      date: '2024-06-01',
      reason: 'Transfer check',
      source: 'DPS',
      dates: [
        {
          id: 'SLED',
          description: 'Sentence and licence expiry date',
          date: '2036-02-19',
          hints: [{ text: 'Some foo hint', href: '/my-foo-policy' }],
        },
      ],
    }
    const content = nunjucks.render('index.njk', { latestCalculation, action })
    expect(extractDate(content, 'SLED')).toStrictEqual({
      id: 'SLED',
      description: 'Sentence and licence expiry date',
      date: 'Tuesday, 19 February 2036',
      hints: [{ text: 'Some foo hint (opens in new tab)', href: '/my-foo-policy' }],
    })
  })

  function extractDate(
    html: string,
    id: string,
  ): {
    id: string
    description: string
    date: string
    hints?: { text: string; href?: string }[]
  } {
    const $ = cheerio.load(html)
    const row = $(`[data-qa=latest-calculation-card-release-date-${id}]`)
    const leftColumn = $(row[0]).find('.release-dates-key')
    const rightColumn = $(row[0]).find('.govuk-summary-list__value')
    const hintParagraphs = rightColumn.find('.release-date-hint')
    const hintLinks = rightColumn.find('.release-date-hint-link')
    const hints: { text: string; href?: string }[] = []
    hintParagraphs
      .filter((i, elem) => $(elem).find('a').length === 0)
      .each((i, elem) => {
        hints.push({ text: $(elem).text() })
      })
    hintLinks.each((i, elem) => {
      hints.push({ text: $(elem).text(), href: $(elem).attr('href') })
    })

    return {
      id: leftColumn.find('.release-dates-id').text(),
      description: leftColumn.find('.release-date-description').first().text(),
      date: rightColumn.find('.release-date-formatted').text(),
      hints,
    }
  }
})
