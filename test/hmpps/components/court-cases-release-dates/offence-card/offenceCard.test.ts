import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { OffenceCardConfig } from '../../../../../src/hmpps/@types'
import { formatLengths } from '../../../../../src/hmpps/utils/utils'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'src/',
  __dirname,
])
njkEnv.addFilter('formatLengths', formatLengths)

describe('Tests for offence card component', () => {
  it('can load offence code with correctly formatted fields', () => {
    const offenceCodeConfig: OffenceCardConfig = {
      offenceCode: 'OFFENCECODE',
      offenceName: 'An Offence Name',
      offenceStartDate: '27 06 2024',
      offenceEndDate: '27 08 2024',
      outcome: 'Imprisonment',
      countNumber: '1',
      convictionDate: '12 09 2024',
      terrorRelated: true,
      isSentenced: true,
      custodialSentenceLength: {
        years: '1',
        months: '2',
        weeks: '3',
        days: '4',
        periodOrder: ['years', 'months', 'weeks', 'days'],
      },
      licencePeriodLength: {
        years: '5',
        months: '6',
        periodOrder: ['years', 'months'],
      },
      sentenceServeType: 'CONSECUTIVE',
      consecutiveTo: '3',
      sentenceType: 'SDS (Standard Determinate Sentence)',
      fineAmount: '17000',
      detailsClasses: 'govuk-!-padding-4',
      actions: {
        items: [
          {
            text: 'Edit',
            href: '/edit',
          },
          {
            text: 'Delete',
            href: '/delete',
          },
        ],
      },
    }
    const content = nunjucks.render('index.njk', { offenceCodeConfig })
    const expectedOffenceCard: ExpectedOffenceCard = {
      offenceCardHeader: 'OFFENCECODE An Offence Name Terror-related',
      offenceSummary: {
        'Committed on': '27 06 2024 to 27 08 2024',
        'Conviction date': '12 09 2024',
        'Consecutive or concurrent': 'Consecutive to count 3',
        'Licence period': '5 years 6 months 0 weeks 0 days',
        Outcome: 'Imprisonment',
        'Sentence length': '1 years 2 months 3 weeks 4 days',
        'Sentence type': 'SDS (Standard Determinate Sentence)',
        'Fine amount': '£17000'
      },
      actions: ['Edit', 'Delete'],
    }
    expect(extractOffenceCard(content)).toStrictEqual(expectedOffenceCard)
  })

  interface ExpectedOffenceCard {
    offenceCardHeader: string
    offenceSummary: {
      [x: string]: string
    }
    actions: string[]
  }

  function extractOffenceCard(html: string): ExpectedOffenceCard {
    const $ = cheerio.load(html)
    const $offenceCard = $('.offence-card')
    const $offenceCardDetails = $offenceCard.find('.offence-card-offence-details')
    const offenceCardHeader = removeNewLinesTrim($offenceCardDetails.find('.govuk-heading-s').text())
    const offenceSummary = $offenceCardDetails
      .find('[data-qa=offenceSummaryList]')
      .find('.govuk-summary-list__row')
      .toArray()
      .map(row => {
        const key = removeNewLinesTrim($(row).find('.govuk-summary-list__key').text())
        const value = removeNewLinesTrim($(row).find('.govuk-summary-list__value').text())
        return { [key]: value }
      })
      .reduce((acc, curr) => {
        return { ...acc, ...curr }
      }, {})
    const actions = $offenceCard
      .find('.offence-card-actions')
      .find('.offence-card-actions-list')
      .find('li')
      .toArray()
      .map(actionItem => {
        return removeNewLinesTrim($(actionItem).text())
      })

    return {
      offenceCardHeader,
      offenceSummary,
      actions,
    }
  }

  function removeNewLinesTrim(value: string): string {
    return value
      .replace(/\r?\n|\r|\n/g, '')
      .trim()
      .replace(/\s{2,}/g, ' ')
  }
})
