import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { SubNavigationServices, ThingsToDoConfig } from '../../../../../src/hmpps/@types'

nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'src/',
  __dirname,
])
describe('Tests for things to do component', () => {
  it('should be for all services', () => {
    const config: ThingsToDoConfig = {
      serviceDefinitions: {
        services: services(),
      },
      service: 'all',
    }
    const content = nunjucks.render('index.njk', config)
    const $ = cheerio.load(content)
    expect($('h2:contains(overview-title)').toArray().length).not.toBe(0)
    expect($('a:contains(overview-button)').attr('href')).toBe('/overview-link')

    expect($('h2:contains(courtCases-title)').toArray().length).not.toBe(0)
    expect($('a:contains(courtCases-button)').attr('href')).toBe('/courtCases-link')

    expect($('h2:contains(adjustments-title)').toArray().length).not.toBe(0)
    expect($('a:contains(adjustments-button)').attr('href')).toBe('/adjustments-link')

    expect($('h2:contains(recalls-title)').toArray().length).not.toBe(0)
    expect($('a:contains(recalls-button)').attr('href')).toBe('/recalls-link')

    expect($('h2:contains(releaseDates-title)').toArray().length).not.toBe(0)
    expect($('a:contains(releaseDates-button)').attr('href')).toBe('/releaseDates-link')
  })
  it('should be for a given service', () => {
    const config: ThingsToDoConfig = {
      serviceDefinitions: {
        services: services(),
      },
      service: 'adjustments',
    }
    const content = nunjucks.render('index.njk', config)
    const $ = cheerio.load(content)
    expect($('h2:contains(overview-title)').toArray().length).toBe(0)

    expect($('h2:contains(courtCases-title)').toArray().length).toBe(0)

    expect($('h2:contains(adjustments-title)')).not.toBeUndefined()
    expect($('a:contains(adjustments-button)').attr('href')).toBe('/adjustments-link')

    expect($('h2:contains(recalls-title)').toArray().length).toBe(0)

    expect($('h2:contains(releaseDates-title)').toArray().length).toBe(0)
  })

  function services(): SubNavigationServices {
    return {
      overview: {
        href: 'http://localhost:8000/prisoner/AB1234AB/overview',
        text: 'Overview',
        thingsToDo: {
          count: 1,
          things: [
            {
              title: 'overview-title',
              message: 'overview-message',
              buttonHref: '/overview-link',
              buttonText: 'overview-button',
              type: 'overview-type',
            },
          ],
        },
      },
      courtCases: {
        href: 'http://localhost:8001/person/AB1234AB',
        text: 'Court cases',
        thingsToDo: {
          count: 1,
          things: [
            {
              title: 'courtCases-title',
              message: 'courtCases-message',
              buttonHref: '/courtCases-link',
              buttonText: 'courtCases-button',
              type: 'courtCases-type',
            },
          ],
        },
      },
      adjustments: {
        href: 'http://localhost:8002/AB1234AB',
        text: 'Adjustments',
        thingsToDo: {
          count: 1,
          things: [
            {
              title: 'adjustments-title',
              message: 'adjustments-message',
              buttonHref: '/adjustments-link',
              buttonText: 'adjustments-button',
              type: 'adjustments-type',
            },
          ],
        },
      },
      recalls: {
        href: 'http://localhost:8003/person/AB1234AB',
        text: 'Recalls',
        thingsToDo: {
          count: 1,
          things: [
            {
              title: 'recalls-title',
              message: 'recalls-message',
              buttonHref: '/recalls-link',
              buttonText: 'recalls-button',
              type: 'recalls-type',
            },
          ],
        },
      },
      releaseDates: {
        href: 'http://localhost:8004?prisonId=AB1234AB',
        text: 'Release dates and calculations',
        thingsToDo: {
          count: 0,
          things: [
            {
              title: 'releaseDates-title',
              message: 'releaseDates-message',
              buttonHref: '/releaseDates-link',
              buttonText: 'releaseDates-button',
              type: 'releaseDates-type',
            },
          ],
        },
      },
    }
  }
})
