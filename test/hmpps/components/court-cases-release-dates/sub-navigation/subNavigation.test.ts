import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
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
    const links = extractLinks(content)
    expect(links.Overview.attr('href')).toStrictEqual('http://localhost:8000/prisoner/AB1234AB/overview')
    expect(links.Overview.attr('aria-current')).toStrictEqual('page')
    expect(links['Court cases'].attr('href')).toStrictEqual('http://localhost:8001/person/AB1234AB')
    expect(links.Adjustments.attr('href')).toStrictEqual('http://localhost:8002/AB1234AB')
    expect(links.Adjustments.find('.moj-notification-badge').text()).toStrictEqual('1')
    expect(links.Recalls.attr('href')).toStrictEqual('http://localhost:8003/person/AB1234AB')
    expect(links['Release dates and calculations'].attr('href')).toStrictEqual(
      'http://localhost:8004?prisonId=AB1234AB',
    )
  })
  it('should be for minimal tabs', () => {
    const config: SubNavigationConfig = {
      navigation: minimalAccess(),
      activeSubNav: 'adjustments',
    }
    const content = nunjucks.render('index.njk', config)
    const links = extractLinks(content)
    expect(links.Overview.attr('href')).toStrictEqual('http://localhost:8000/prisoner/AB1234AB/overview')
    expect(links['Court cases']).toBeUndefined()
    expect(links.Adjustments.attr('href')).toStrictEqual('http://localhost:8002/AB1234AB')
    expect(links.Adjustments.attr('aria-current')).toStrictEqual('page')
    expect(links.Recalls).toBeUndefined()
    expect(links['Release dates and calculations'].attr('href')).toStrictEqual(
      'http://localhost:8004?prisonId=AB1234AB',
    )
  })

  function extractLinks(content: string) {
    const $ = cheerio.load(content)
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
        },
      },
      adjustments: {
        href: 'http://localhost:8002/AB1234AB',
        text: 'Adjustments',
        thingsToDo: {
          count: 0,
        },
      },
      releaseDates: {
        href: 'http://localhost:8004?prisonId=AB1234AB',
        text: 'Release dates and calculations',
        thingsToDo: {
          count: 0,
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
        },
      },
      courtCases: {
        href: 'http://localhost:8001/person/AB1234AB',
        text: 'Court cases',
        thingsToDo: {
          count: 0,
        },
      },
      adjustments: {
        href: 'http://localhost:8002/AB1234AB',
        text: 'Adjustments',
        thingsToDo: {
          count: 1,
        },
      },
      recalls: {
        href: 'http://localhost:8003/person/AB1234AB',
        text: 'Recalls',
        thingsToDo: {
          count: 0,
        },
      },
      releaseDates: {
        href: 'http://localhost:8004?prisonId=AB1234AB',
        text: 'Release dates and calculations',
        thingsToDo: {
          count: 0,
        },
      },
    }
  }
})
