const govukPrototypeKit = require('govuk-prototype-kit')

const { addFilter } = govukPrototypeKit.views
const { personDateOfBirth, personProfileName, personStatus } = require('../utils/utils')

addFilter('personProfileName', person => personProfileName(person))
addFilter('personDateOfBirth', dateString => personDateOfBirth(dateString))
addFilter('personStatus', person => personStatus(person))
