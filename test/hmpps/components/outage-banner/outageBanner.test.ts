import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { OutageBannerConfig } from '../../../../src/hmpps/@types'

nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'src/',
  __dirname,
])

describe('Tests for outage banner component', () => {
  it('can load text', () => {
    const outageBannerConfig: OutageBannerConfig = {
      text: 'Some outage is due!',
    }
    const content = nunjucks.render('index.njk', { outageBannerConfig })
    const $ = cheerio.load(content)
    const innerContent = $('.moj-outage-banner__inner').text().trim()
    expect(innerContent).toStrictEqual(outageBannerConfig.text)
  })
})
