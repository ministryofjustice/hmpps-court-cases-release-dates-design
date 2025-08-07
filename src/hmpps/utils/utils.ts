import { format, isValid, parse, parseISO } from 'date-fns'
import type { ConsecutiveToDetails, MergedFromCaseDetails, SentenceLength } from '../@types'

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

export const formatMergedFromCase = (
  mergedFromCaseDetails: MergedFromCaseDetails,
  courtDetails: { [key: string]: string },
): string | undefined => {
  if (mergedFromCaseDetails) {
    let description = `${courtDetails[mergedFromCaseDetails.courtCode]} on ${dayMonthYearForwardSlashSeparator(mergedFromCaseDetails.warrantDate)}`
    if (mergedFromCaseDetails.caseReference) {
      description = `${mergedFromCaseDetails.caseReference} at ${courtDetails[mergedFromCaseDetails.courtCode]}`
    }
    return description
  }
  return null
}

export const formatCountNumber = (countNumber?: string | null, lineNumber?: string | null): string | undefined => {
  if (countNumber) {
    if (countNumber === '-1') {
      return null
    }
    return `Count ${countNumber}`
  }
  if (lineNumber) {
    return `NOMIS line number ${lineNumber}`
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

export const consecutiveToDetailsToDescription = (details: ConsecutiveToDetails): string => {
  const {
    countNumber,
    offenceCode,
    offenceDescription,
    courtCaseReference,
    courtName,
    warrantDate,
    offenceStartDate,
    offenceEndDate,
  } = details

  const isValidCount = countNumber && countNumber !== '-1'
  const isSameCase = !courtName && !courtCaseReference && !warrantDate // if any of these are passed the implication is that it's consec to another case

  // These cases come from a decision table provided by the analysts
  // Case 1: Valid count, same case
  if (isValidCount && isSameCase) {
    return ` to count ${countNumber}`
  }

  // Case 2: No valid count, same case
  if (!isValidCount && isSameCase) {
    const offencePart = ` to ${offenceCode} - ${offenceDescription}`
    const datePart = offenceStartDate
        ? ` committed on ${offenceStartDate}${offenceEndDate ? ` to ${offenceEndDate}` : ''}`
        : ''
    return offencePart + datePart
  }

  // Case 3: Valid count, not same case + case ref
  if (isValidCount && courtCaseReference) {
    return ` to count ${countNumber} on case ${courtCaseReference} at ${courtName} on ${warrantDate}`
  }

  // Case 4: Valid count, not same case, no case ref
  if (isValidCount && !isSameCase && !courtCaseReference) {
    return ` to count ${countNumber} at ${courtName} on ${warrantDate}`
  }

  // Case 5: No valid count, not same case, with case ref
  if (!isValidCount && !isSameCase && courtCaseReference) {
    const offencePart = ` to ${offenceCode} - ${offenceDescription}`
    const datePart = offenceStartDate
        ? ` committed on ${offenceStartDate}${offenceEndDate ? ` to ${offenceEndDate}` : ''}`
        : ''
    const locationPart = ` on case ${courtCaseReference} at ${courtName} on ${warrantDate}`
    return offencePart + datePart + locationPart
  }

  // Case 6: No valid count, not same case, no case ref
  if (!isValidCount  && !isSameCase && !courtCaseReference) {
    const offencePart = ` to ${offenceCode} - ${offenceDescription}`
    const datePart = offenceStartDate
        ? ` committed on ${offenceStartDate}${offenceEndDate ? ` to ${offenceEndDate}` : ''}`
        : ''
    const locationPart = ` at ${courtName} on ${warrantDate}`
    return offencePart + datePart + locationPart
  }

  // Fallback — shouldn't happen
  return ' to unknown sentence'
}

