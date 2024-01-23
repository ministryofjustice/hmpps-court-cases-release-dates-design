const govukPrototypeKit = require('govuk-prototype-kit')

const { addFilter } = govukPrototypeKit.views
const {
  dayMonthYearForwardSlashSeparator,
  firstNameLastName,
  lastNameFirstName,
  sentenceCase,
  sentenceCaseHyphenatedWord,
} = require('../utils/utils')

addFilter('dayMonthYearForwardSlashSeparator', dateString => dayMonthYearForwardSlashSeparator(dateString))
addFilter('firstNameLastName', person => firstNameLastName(person))
addFilter('lastNameFirstName', person => lastNameFirstName(person))
addFilter('sentenceCase', word => sentenceCase(word))
addFilter('sentenceCaseHyphenatedWord', word => sentenceCaseHyphenatedWord(word))
