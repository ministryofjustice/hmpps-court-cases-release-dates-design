import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'

nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'src/',
  __dirname,
])

describe('Tests for date picker component', () => {
  it('Check datePicker value is correct', () => {
    const renderedHTML = renderDatePicker({ value: '01/01/2001', id: 'date-picker-input-text-id' })
    const datePickerValue = extractDatePickerValue(renderedHTML)
    expect(datePickerValue).toEqual('01/01/2001')
  })
})

function renderDatePicker(params) {
  return nunjucks.render('index.njk', { params })
}

function extractDatePickerValue(html) {
  const $ = cheerio.load(html)
  return $('#date-picker-input-text-id').val()
}
