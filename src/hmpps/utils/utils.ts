import { format, isValid, parse, parseISO } from 'date-fns'
import type { ConsecutiveToDetails, SentenceLength } from '../@types'

const uniformWhitespace = (word: string): string => (word ? word.trim().replace(/\s+/g, ' ') : '')

export const sentenceCase = (word: string): string => {
  const uniformWhitespaceWord = uniformWhitespace(word)
  return uniformWhitespaceWord.trim().length >= 1
    ? uniformWhitespaceWord[0].toUpperCase() + uniformWhitespaceWord.toLowerCase().slice(1)
    : ''
}

export const nameCase = (name: string): string => {
  const uniformWhitespaceName = uniformWhitespace(name)
  return uniformWhitespaceName
    .split(' ')
    .map(s => (s.includes('-') ? s.split('-').map(sentenceCase).join('-') : sentenceCase(s)))
    .join(' ')
}

export const firstNameSpaceLastName = (person: { firstName: string; lastName: string }): string => {
  return `${nameCase(person.firstName)} ${nameCase(person.lastName)}`.trim()
}

export const lastNameCommaFirstName = (person: { firstName: string; lastName: string }): string => {
  return `${nameCase(person.lastName)}, ${nameCase(person.firstName)}`.replace(/(^, )|(, $)/, '')
}

export const dayMonthYearForwardSlashSeparator = (dateString: string): string => {
  if (!dateString) return ''
  const date = parse(dateString, 'yyyy-MM-dd', new Date())
  return date && isValid(date) ? format(date, 'dd/MM/yyyy') : dateString
}

export const personProfileName = (person: { firstName: string; lastName: string }): string =>
  lastNameCommaFirstName(person)

export const personDateOfBirth = (dateOfBirth: string): string => dayMonthYearForwardSlashSeparator(dateOfBirth)

export const personStatus = (status: string): string => sentenceCase(status)

export const hmppsFormatDate = (dateString: string, pattern: string): string => {
  if (!dateString) return ''
  const date = parseISO(dateString)
  return date && isValid(date) ? format(date, pattern) : dateString
}

export const formatLengths = (lengths: SentenceLength) => {
  if (lengths) {
    const allTimeUnits = ['years', 'months', 'weeks', 'days']
    const missingTimeUnits = allTimeUnits.filter(timeUnit => !lengths.periodOrder.includes(timeUnit))
    const recordedLength = lengths.periodOrder.reduce(
      (prev, current: keyof SentenceLength) => `${prev} ${lengths[current] ?? '0'} ${current}`,
      '',
    )
    const missingLengths = missingTimeUnits.reduce((prev, current) => `${prev} 0 ${current}`, '')
    return `${recordedLength}${missingLengths ? ` ${missingLengths}` : ''}`
  }
  return null
}

export type EmailLinkOptions = {
  emailAddress?: string
  linkText: string
  emailSubjectText?: string
  prefixText?: string
  suffixText?: string
}
export function createSupportLink({
  linkText,
  prefixText = '',
  suffixText = '',
  emailAddress = 'omu.specialistsupportteam@justice.gov.uk',
  emailSubjectText,
}: EmailLinkOptions): string {
  const subjectPart = emailSubjectText ? `?subject=${encodeURIComponent(emailSubjectText)}` : ''
  const contactLink = `<a href="mailto:${emailAddress}${subjectPart}">${linkText}</a>`
  return `${prefixText}${contactLink}${suffixText}`
}

export const consecutiveToDetailsToDescription = (consecutiveToDetails: ConsecutiveToDetails) => {
  let description = ''
  if (consecutiveToDetails.countNumber) {
    description = `${description} to count ${consecutiveToDetails.countNumber}`
  } else {
    description = `${description} to ${consecutiveToDetails.offenceCode} - ${consecutiveToDetails.offenceDescription}`
  }
  if (consecutiveToDetails.courtCaseReference) {
    description = `${description} on case ${consecutiveToDetails.courtCaseReference}`
  }
  if (consecutiveToDetails.courtName) {
    description = `${description} at ${consecutiveToDetails.courtName}`
  }
  if (consecutiveToDetails.warrantDate) {
    description = `${description} on ${consecutiveToDetails.warrantDate}`
  }
  return description
}
