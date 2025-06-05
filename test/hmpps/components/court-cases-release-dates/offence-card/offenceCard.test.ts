import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { OffenceCardConfig } from '../../../../../src/hmpps/@types'
import {
  consecutiveToDetailsToDescription,
  formatLengths,
  formatMergedFromCase,
} from '../../../../../src/hmpps/utils/utils'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'src/',
  __dirname,
])
njkEnv.addFilter('formatLengths', formatLengths)
njkEnv.addFilter('consecutiveToDetailsToDescription', consecutiveToDetailsToDescription)
njkEnv.addFilter('formatMergedFromCase', formatMergedFromCase)

describe('Tests for offence card component', () => {
  it('can load offence code with correctly formatted fields', () => {
    const offenceCodeConfig: OffenceCardConfig = {
      offenceCode: 'OFFENCECODE',
      offenceName: 'An Offence Name',
      offenceStartDate: '27 06 2024',
      offenceEndDate: '27 08 2024',
      outcome: 'Imprisonment',
      outcomeUpdated: true,
      countNumber: '1',
      convictionDate: '12 09 2024',
      terrorRelated: true,
      isSentenced: true,
      periodLengths: [
        {
          description: 'Sentence length',
          years: '1',
          months: '2',
          weeks: '3',
          days: '4',
          periodOrder: ['years', 'months', 'weeks', 'days'],
        },
        {
          description: 'Licence period',
          years: '5',
          months: '6',
          periodOrder: ['years', 'months', 'weeks', 'days'],
        },
      ],
      sentenceServeType: 'CONSECUTIVE',
      consecutiveTo: {
        countNumber: '3',
        offenceCode: 'OFF1',
        offenceDescription: 'Offence Description',
      },
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
      listItems: {
        classes: 'govuk-!-margin-top-4',
        items: [
          {
            html: '<a href="/update-outcome">Update outcome</a>',
          },
        ],
      },
      mergedFromCase: {
        caseReference: 'C123',
        courtCode: 'COURT1',
        mergedFromDate: '2025-06-05',
        warrantDate: '2025-03-05',
      },
      courtDetails: {
        COURT1: 'Court 1 description',
      },
    }
    const content = nunjucks.render('index.njk', { offenceCodeConfig })
    const expectedOffenceCard: ExpectedOffenceCard = {
      offenceCardHeader: 'OFFENCECODE An Offence Name Terror-related',
      offenceSummary: {
        'Committed on': '27 06 2024 to 27 08 2024',
        'Conviction date': '12 09 2024',
        Outcome: 'Imprisonment Updated',
        'Sentence length': '1 years 2 months 3 weeks 4 days',
        'Licence period': '5 years 6 months 0 weeks 0 days',
        'Sentence type': 'SDS (Standard Determinate Sentence)',
        'Fine amount': '£17000',
        'Consecutive or concurrent': 'Consecutive to count 3',
        'Merged from': 'C123 at Court 1 description',
      },
      actions: ['Edit', 'Delete'],
      listItems: ['Update outcome'],
    }
    expect(extractOffenceCard(content)).toStrictEqual(expectedOffenceCard)
  })

  it('can load offence code with correctly formatted fields where all optional ones do not show', () => {
    const offenceCodeConfig: OffenceCardConfig = {
      offenceCode: 'OFFENCECODE',
      offenceName: 'An Offence Name',
      offenceStartDate: '27 06 2024',
      offenceEndDate: '27 08 2024',
      outcome: 'Imprisonment',
      hideOutcome: true,
      hideLicencePeriod: true,
      countNumber: '1',
      convictionDate: '12 09 2024',
      terrorRelated: false,
      isSentenced: true,
      periodLengths: [
        {
          description: 'Sentence length',
          years: '1',
          months: '2',
          weeks: '3',
          days: '4',
          periodOrder: ['years', 'months', 'weeks', 'days'],
        },
      ],
      sentenceServeType: 'CONSECUTIVE',
      consecutiveTo: {
        countNumber: '3',
        offenceCode: 'OFF1',
        offenceDescription: 'Offence Description',
      },
      sentenceType: 'SDS (Standard Determinate Sentence)',
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
      listItems: {
        classes: 'govuk-!-margin-top-4',
        items: [
          {
            html: '<a href="/update-outcome">Update outcome</a>',
          },
        ],
      },
    }
    const content = nunjucks.render('index.njk', { offenceCodeConfig })
    const expectedOffenceCard: ExpectedOffenceCard = {
      offenceCardHeader: 'OFFENCECODE An Offence Name',
      offenceSummary: {
        'Committed on': '27 06 2024 to 27 08 2024',
        'Conviction date': '12 09 2024',
        'Sentence length': '1 years 2 months 3 weeks 4 days',
        'Sentence type': 'SDS (Standard Determinate Sentence)',
        'Consecutive or concurrent': 'Consecutive to count 3',
      },
      actions: ['Edit', 'Delete'],
      listItems: ['Update outcome'],
    }
    expect(extractOffenceCard(content)).toStrictEqual(expectedOffenceCard)
  })

  interface ExpectedOffenceCard {
    offenceCardHeader: string
    offenceSummary: {
      [x: string]: string
    }
    actions: string[]
    listItems: string[]
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
    const listItems = $offenceCard
      .find('[data-qa=offenceCardList]')
      .find('li')
      .toArray()
      .map(listItem => {
        return removeNewLinesTrim($(listItem).text())
      })

    return {
      offenceCardHeader,
      offenceSummary,
      actions,
      listItems,
    }
  }

  function removeNewLinesTrim(value: string): string {
    return value
      .replace(/\r?\n|\r|\n/g, '')
      .trim()
      .replace(/\s{2,}/g, ' ')
  }
})
