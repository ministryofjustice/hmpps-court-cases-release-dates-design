import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { MiniProfileConfig } from '../../../../src/hmpps/@types'
import { personProfileName, personDateOfBirth, personStatus } from '../../../../src/hmpps/utils/utils'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'src/',
  __dirname,
])
njkEnv.addFilter('personProfileName', personProfileName)
njkEnv.addFilter('personDateOfBirth', personDateOfBirth)
njkEnv.addFilter('personStatus', personStatus)

describe('Tests for mini profile component', () => {
  it('can load mini profile with correctly formatted fields', () => {
    const miniProfileConfig: MiniProfileConfig = {
      person: {
        prisonerNumber: 'ABC123',
        firstName: 'denzel',
        lastName: 'matthams',
        dateOfBirth: '1982-06-15',
        status: 'ACTIVE IN',
        prisonName: 'HMP Leeds',
        cellLocation: 'A-1-002',
      },
      profileUrl: '/person-profile/ABC123',
      imageUrl: '/person-image/ABC123',
    }
    const content = nunjucks.render('index.njk', { miniProfileConfig })
    const expectedMiniProfile: ExpectedMiniProfile = {
      prisonerNumber: 'ABC123',
      formattedName: 'Matthams, Denzel',
      formattedDob: '15/06/1982',
      status: 'ACTIVE IN',
      prisonName: 'HMP Leeds',
      cellLocation: 'A-1-002',
      profileUrl: '/person-profile/ABC123',
      imageUrl: '/person-image/ABC123',
      imageAltText: 'Image of Matthams, Denzel',
    }
    expect(extractMiniProfile(content)).toStrictEqual(expectedMiniProfile)
  })

  it('can load mini profile with optional location info', () => {
    const miniProfileConfig: MiniProfileConfig = {
      person: {
        prisonerNumber: 'ABC123',
        firstName: 'denzel',
        lastName: 'matthams',
        dateOfBirth: '1982-06-15',
        status: 'ACTIVE IN',
      },
      profileUrl: '/person-profile/ABC123',
      imageUrl: '/person-image/ABC123',
    }
    const content = nunjucks.render('index.njk', { miniProfileConfig })
    const expectedMiniProfile: ExpectedMiniProfile = {
      prisonerNumber: 'ABC123',
      formattedName: 'Matthams, Denzel',
      formattedDob: '15/06/1982',
      status: 'ACTIVE IN',
      prisonName: '',
      cellLocation: '',
      profileUrl: '/person-profile/ABC123',
      imageUrl: '/person-image/ABC123',
      imageAltText: 'Image of Matthams, Denzel',
    }
    expect(extractMiniProfile(content)).toStrictEqual(expectedMiniProfile)
  })

  it('shows profile banner when person is out', () => {
    const miniProfileConfig: MiniProfileConfig = {
      person: {
        prisonerNumber: 'ABC123',
        firstName: 'denzel',
        lastName: 'matthams',
        dateOfBirth: '1982-06-15',
        status: 'INACTIVE OUT',
        prisonId: 'OUT',
      },
      profileUrl: '/person-profile/ABC123',
      imageUrl: '/person-image/ABC123',
    }
    const content = nunjucks.render('index.njk', { miniProfileConfig })
    const expectedProfileBanner = {
      heading: 'This person has been released',
      paragraph: 'Some information may be hidden',
    } as ExpectedProfileBanner
    expect(extractProfileBanner(content)).toEqual(expectedProfileBanner)
  })

  interface ExpectedMiniProfile {
    prisonerNumber: string
    formattedName: string
    formattedDob: string
    status: string
    cellLocation: string
    prisonName: string
    imageUrl: string
    imageAltText: string
    profileUrl: string
  }

  function extractMiniProfile(html: string): ExpectedMiniProfile {
    const $ = cheerio.load(html)
    const img = $('[data-qa=mini-profile-person-img]')
    const profileLink = $('[data-qa=mini-profile-person-profile-link]')
    return {
      prisonerNumber: $('[data-qa=mini-profile-prisoner-number]').text(),
      formattedName: profileLink.text(),
      formattedDob: $('[data-qa=mini-profile-dob]').text(),
      status: $('[data-qa=mini-profile-status]').text(),
      cellLocation: $('[data-qa=mini-profile-cell-location]').text(),
      prisonName: $('[data-qa=mini-profile-prison-name]').text(),
      imageUrl: img.attr('src') as string,
      imageAltText: img.attr('alt') as string,
      profileUrl: profileLink.attr('href') as string,
    }
  }

  interface ExpectedProfileBanner {
    heading: string
    paragraph: string
  }

  function extractProfileBanner(html: string): ExpectedProfileBanner {
    const $ = cheerio.load(html)
    const profileBanner = $('[data-qa=personOutsideBanner]')
    return {
      heading: profileBanner.find('.govuk-heading-m').text().trim(),
      paragraph: profileBanner.find('p').last().text().trim(),
    }
  }
})
