const govukPrototypeKit = require('govuk-prototype-kit')

const { addFilter } = govukPrototypeKit.views
const { formatMiniProfileName, formatMiniProfileDateOfBirth } = require('../utils/utils')

addFilter('formatMiniProfileName', function (person) {
  return formatMiniProfileName(person)
})

addFilter('formatMiniProfileDateOfBirth', function (dateOfBirth) {
  return formatMiniProfileDateOfBirth(dateOfBirth)
})
