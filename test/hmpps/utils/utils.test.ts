import { ConsecutiveToDetails, MergedFromCaseDetails } from '../../../src/hmpps/@types'
import {
  consecutiveToDetailsToDescription,
  dayMonthYearForwardSlashSeparator,
  firstNameSpaceLastName,
  formatCountNumber,
  formatMergedFromCase,
  hmppsFormatDate,
  lastNameCommaFirstName,
  nameCase,
  sentenceCase,
} from '../../../src/hmpps/utils/utils'

describe('sentence case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['whitespace', '   ', ''],
    ['leading whitespace', '   word', 'Word'],
    ['trailing whitespace', 'word   ', 'Word'],
    ['interstitial whitespace', 'word   word  word', 'Word word word'],
    ['lower case', 'word', 'Word'],
    ['upper case', 'WORD', 'Word'],
    ['mixed case', 'WoRd', 'Word'],
    ['multiple words', 'word WORD WoRd', 'Word word word'],
    ['hyphenated', 'word-WORD-WoRd', 'Word-word-word'],
  ])("%s sentenceCase('%s')", (_: string, word: string, expected: string) => {
    expect(sentenceCase(word)).toEqual(expected)
  })
})

describe('name case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['whitespace', '   ', ''],
    ['leading whitespace', '   name', 'Name'],
    ['trailing whitespace', 'name   ', 'Name'],
    ['interstitial whitespace', 'name   name  name', 'Name Name Name'],
    ['lower case', 'Name', 'Name'],
    ['upper case', 'NAME', 'Name'],
    ['mixed case', 'NaMe', 'Name'],
    ['multiple words', 'Name NAME NaMe', 'Name Name Name'],
    ['hyphenated', 'Name-NAME-NaMe', 'Name-Name-Name'],
  ])("%s nameCase('%s')", (_: string, name: string, expected: string) => {
    expect(nameCase(name)).toEqual(expected)
  })
})

describe('format first name last name', () => {
  it.each([
    [null, null, null, ''],
    ['empty string', '', '', ''],
    ['empty string first name', '', 'last', 'Last'],
    ['empty string last name', 'first', '', 'First'],
    ['whitespace', '   ', '  ', ''],
    ['leading whitespace', '   first', '  last', 'First Last'],
    ['trailing whitespace', 'first   ', 'last  ', 'First Last'],
    ['interstitial whitespace', 'first   first', 'last  last', 'First First Last Last'],
    ['Lower case', 'first', 'last', 'First Last'],
    ['Upper case', 'FIRST', 'LAST', 'First Last'],
    ['Mixed case', 'FiRSt', 'LaSt', 'First Last'],
    ['Multiple words', 'first FIRST FiRSt', 'last LAST LaSt', 'First First First Last Last Last'],
    ['Hyphenated', 'first-FIRST-FiRSt', 'last-LAST-LaSt', 'First-First-First Last-Last-Last'],
  ])("%s firstNameSpaceLastName('%s', '%s')", (_: string, firstName: string, lastName: string, expected: string) => {
    expect(firstNameSpaceLastName({ firstName, lastName })).toEqual(expected)
  })
})

describe('format last name, first name', () => {
  it.each([
    [null, null, null, ''],
    ['empty string', '', '', ''],
    ['empty string first name', '', 'last', 'Last'],
    ['empty string last name', 'first', '', 'First'],
    ['whitespace', '   ', '  ', ''],
    ['leading whitespace', '   first', '  last', 'Last, First'],
    ['trailing whitespace', 'first   ', 'last  ', 'Last, First'],
    ['interstitial whitespace', 'first   first', 'last  last', 'Last Last, First First'],
    ['Lower case', 'first', 'last', 'Last, First'],
    ['Upper case', 'FIRST', 'LAST', 'Last, First'],
    ['Mixed case', 'FiRSt', 'LaSt', 'Last, First'],
    ['Multiple words', 'first FIRST FiRSt', 'last LAST LaSt', 'Last Last Last, First First First'],
    ['Hyphenated', 'first-FIRST-FiRSt', 'last-LAST-LaSt', 'Last-Last-Last, First-First-First'],
  ])("%s lastNameCommaFirstName('%s', '%s')", (_: string, firstName: string, lastName: string, expected: string) => {
    expect(lastNameCommaFirstName({ firstName, lastName })).toEqual(expected)
  })
})

describe('format day/month/year', () => {
  it.each([
    [null, ''],
    ['', ''],
    ['Empty string', 'Empty string'],
    ['23/10/1978', '23/10/1978'],
    ['1978-10-23', '23/10/1978'],
  ])("%s dayMonthYearForwardSlashSeparator('%s', '%s')", (dateString: string, expected: string) => {
    expect(dayMonthYearForwardSlashSeparator(dateString)).toEqual(expected)
  })
})
describe('format using date string', () => {
  it.each([
    [null, 'dd LLLL yyyy', ''],
    ['', 'dd LLLL yyyy', ''],
    ['Not a date', 'dd LLLL yyyy', 'Not a date'],
    ['1978-10-23', 'dd LLLL yyyy', '23 October 1978'],
    ['1982-06-15', 'cccc, dd LLLL yyyy', 'Tuesday, 15 June 1982'],
    ['1982-06-15T15:30:45', 'cccc, dd LLLL yyyy', 'Tuesday, 15 June 1982'],
    ['1982-06-15', 'dd/MM/yyyy', '15/06/1982'],
  ])("hmppsFormatDate('%s', '%s') returns %s", (dateString: string, format: string, expected: string) => {
    expect(hmppsFormatDate(dateString, format)).toEqual(expected)
  })
})

describe('consecutive to details to description', () => {
  it('only show count number', () => {
    const config = {
      countNumber: '5',
      offenceCode: 'OFF1',
      offenceDescription: 'Offence description',
    } as ConsecutiveToDetails
    const result = consecutiveToDetailsToDescription(config)
    expect(result).toEqual(' to count 5')
  })

  it('show offence when no count number', () => {
    const config = {
      offenceCode: 'OFF1',
      offenceDescription: 'Offence description',
    } as ConsecutiveToDetails
    const result = consecutiveToDetailsToDescription(config)
    expect(result).toEqual(' to OFF1 - Offence description')
  })

  it('show court case reference', () => {
    const config = {
      countNumber: '5',
      offenceCode: 'OFF1',
      offenceDescription: 'Offence description',
      courtCaseReference: 'G36895',
    } as ConsecutiveToDetails
    const result = consecutiveToDetailsToDescription(config)
    expect(result).toEqual(' to count 5 on case G36895')
  })

  it('show all fields', () => {
    const config = {
      countNumber: '5',
      offenceCode: 'OFF1',
      offenceDescription: 'Offence description',
      courtCaseReference: 'G36895',
      courtName: 'A Court',
      warrantDate: '12/03/2001',
    } as ConsecutiveToDetails
    const result = consecutiveToDetailsToDescription(config)
    expect(result).toEqual(' to count 5 on case G36895 at A Court on 12/03/2001')
  })
})

describe('format merged from case details', () => {
  it('shows case reference when filled out', () => {
    const config = {
      caseReference: 'C123',
      courtCode: 'COURT1',
      mergedFromDate: '2025-06-05',
      warrantDate: '2025-03-05',
    } as MergedFromCaseDetails
    const courtDetails = {
      COURT1: 'Court 1 description',
    }
    const result = formatMergedFromCase(config, courtDetails)
    expect(result).toEqual('C123 at Court 1 description')
  })

  it('shows court name and date when no case reference', () => {
    const config = {
      courtCode: 'COURT1',
      mergedFromDate: '2025-06-05',
      warrantDate: '2025-03-05',
    } as MergedFromCaseDetails
    const courtDetails = {
      COURT1: 'Court 1 description',
    }
    const result = formatMergedFromCase(config, courtDetails)
    expect(result).toEqual('Court 1 description on 05/03/2025')
  })
})

describe('format count number', () => {
  it('show nomis line number when count is null', () => {
    const result = formatCountNumber(null, '1')
    expect(result).toEqual('NOMIS line number 1')
  })

  it('return null when count number is -1', () => {
    const result = formatCountNumber('-1', '5')
    expect(result).toBeNull()
  })

  it('show count number when entered', () => {
    const result = formatCountNumber('66', '2')
    expect(result).toEqual('Count 66')
  })
})
