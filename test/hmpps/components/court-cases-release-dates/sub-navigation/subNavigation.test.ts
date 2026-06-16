import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { CheerioAPI } from 'cheerio'
import { SubNavigationConfig, SubNavigationServices } from '../../../../../src/hmpps/@types'

nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'src/',
  __dirname,
])
describe('Tests for sub navigation component', () => {
  it('should be for all tabs', () => {
    const config: SubNavigationConfig = {
      navigation: allTabs(),
      activeSubNav: 'overview',
    }
    const content = nunjucks.render('index.njk', config)
    const $ = cheerio.load(content)
    const links = extractLinks($)
    expect(links.Overview.attr('href')).toStrictEqual('http://localhost:8000/prisoner/AB1234AB/overview')
    expect(links.Overview.attr('aria-current')).toStrictEqual('page')
    expect(links['Court cases'].attr('href')).toStrictEqual('http://localhost:8001/person/AB1234AB')
    expect(links.Adjustments.attr('href')).toStrictEqual('http://localhost:8002/AB1234AB')
    expect(links.Recalls.attr('href')).toStrictEqual('http://localhost:8003/person/AB1234AB')
    expect(links['Release dates and calculations'].attr('href')).toStrictEqual(
      'http://localhost:8004?prisonId=AB1234AB',
    )
    expect(
      links['Release dates and calculations'].find('.moj-notification-badge').children().first().text(),
    ).toStrictEqual('1')
    expect(links['Release dates and calculations'].find('.moj-notification-badge').attr('class')).toContain(
      'required_before_calculation',
    )
    expect(links.Documents.find('.moj-notification-badge').children().first().text()).toStrictEqual('1')
    expect(links.Documents.find('.moj-notification-badge').attr('class')).toContain('notification')
    expect($('.moj-outage-banner').text().trim()).toStrictEqual(config.navigation.overview.maintenanceAlert.message)
  })
  it('should be for minimal tabs', () => {
    const config: SubNavigationConfig = {
      navigation: minimalAccess(),
      activeSubNav: 'adjustments',
    }
    const content = nunjucks.render('index.njk', config)
    const $ = cheerio.load(content)
    const links = extractLinks($)
    expect(links.Overview.attr('href')).toStrictEqual('http://localhost:8000/prisoner/AB1234AB/overview')
    expect(links['Court cases']).toBeUndefined()
    expect(links.Adjustments.attr('href')).toStrictEqual('http://localhost:8002/AB1234AB')
    expect(links.Adjustments.attr('aria-current')).toStrictEqual('page')
    expect(links.Recalls).toBeUndefined()
    expect(links['Release dates and calculations'].attr('href')).toStrictEqual(
      'http://localhost:8004?prisonId=AB1234AB',
    )
    expect($('.moj-outage-banner').length).toStrictEqual(0)
  })

  function extractLinks($: CheerioAPI) {
    const links = $('a')
      .map((i, element) => {
        return { key: $(element).contents().first().text().trim(), value: $(element) }
      })
      .get()
    return Object.fromEntries(links.map(x => [x.key, x.value]))
  }

  function minimalAccess(): SubNavigationServices {
    return {
      overview: {
        href: 'http://localhost:8000/prisoner/AB1234AB/overview',
        text: 'Overview',
        thingsToDo: {
          count: 0,
          things: [],
        },
        maintenanceAlert: {
          enabled: true,
          message: 'There is due to be an outage in the future',
        },
      },
      adjustments: {
        href: 'http://localhost:8002/AB1234AB',
        text: 'Adjustments',
        thingsToDo: {
          count: 0,
          things: [],
        },
        maintenanceAlert: {
          enabled: false,
          message: 'placeholder',
        },
      },
      releaseDates: {
        href: 'http://localhost:8004?prisonId=AB1234AB',
        text: 'Release dates and calculations',
        thingsToDo: {
          count: 0,
          things: [],
        },
        maintenanceAlert: {
          enabled: false,
          message: 'placeholder',
        },
      },
    }
  }

  function allTabs(): SubNavigationServices {
    return {
      overview: {
        href: 'http://localhost:8000/prisoner/AB1234AB/overview',
        text: 'Overview',
        thingsToDo: {
          count: 0,
          things: [],
        },
        maintenanceAlert: {
          enabled: true,
          message: 'There is due to be an outage in the future',
        },
      },
      courtCases: {
        href: 'http://localhost:8001/person/AB1234AB',
        text: 'Court cases',
        thingsToDo: {
          count: 0,
          things: [],
        },
        maintenanceAlert: {
          enabled: false,
          message: 'placeholder',
        },
      },
      adjustments: {
        href: 'http://localhost:8002/AB1234AB',
        text: 'Adjustments',
        thingsToDo: {
          count: 0,
          things: [],
        },
        maintenanceAlert: {
          enabled: false,
          message: 'placeholder',
        },
      },
      recalls: {
        href: 'http://localhost:8003/person/AB1234AB',
        text: 'Recalls',
        thingsToDo: {
          count: 0,
          things: [],
        },
        maintenanceAlert: {
          enabled: false,
          message: 'placeholder',
        },
      },
      releaseDates: {
        href: 'http://localhost:8004?prisonId=AB1234AB',
        text: 'Release dates and calculations',
        thingsToDo: {
          count: 1,
          severity: 'REQUIRED_BEFORE_CALCULATION',
          things: [
            {
              title: 'Title',
              message: 'Message',
              type: 'CALCULATION_REQUIRED',
              buttonText: 'Calculations',
              buttonHref: 'http://localhost:3000/calculations',
            },
          ],
        },
        maintenanceAlert: {
          enabled: false,
          message: 'placeholder',
        },
      },
      documents: {
        href: 'http://localhost:8000/prisoner/AB1234AB/documents',
        text: 'Documents',
        thingsToDo: {
          count: 1,
          severity: 'NOTIFICATION',
          things: [
            {
              title: '',
              message: '',
              type: 'HMCTS_API_DOCUMENT_RECEIVED',
              buttonText: '',
              buttonHref: '',
            },
          ],
        },
        maintenanceAlert: {
          enabled: false,
          message: 'placeholder',
        },
      },
    }
  }
})
