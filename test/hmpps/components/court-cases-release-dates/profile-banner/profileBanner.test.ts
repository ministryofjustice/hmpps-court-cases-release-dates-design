import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'

nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'src/',
  __dirname,
])

describe('Tests for profile-banner component', () => {
  it('Should display correct params', () => {
    const params = {
      dataQa: 'personOutsideBanner',
      heading: 'This person has been released',
      paragraphText: 'Some information may be hidden',
    }

    const content = nunjucks.render('index.njk', { params })
    const $ = cheerio.load(content)

    const headingText = $('.govuk-heading-m').text().trim()
    const paragraphText = $('p').last().text().trim()

    expect(headingText).toStrictEqual('This person has been released')
    expect(paragraphText).toStrictEqual('Some information may be hidden')
  })
})
