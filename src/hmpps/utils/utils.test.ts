import { dayMonthYearForwardSlashSeparator, lastNameFirstName } from './utils'

describe('format mini profile name', () => {
  it.each([
    // [null, null, null, ''],
    ['empty string', '', '', ', '],
    ['Lower case', 'robert', '', ', Robert'],
    ['Upper case', 'ROBERT', '', ', Robert'],
    ['Mixed case', 'RoBErT', '', ', Robert'],
    ['Multiple words', 'RobeRT', 'SMiTH', 'Smith, Robert'],
    ['Leading spaces', '  RobeRT', '', ', Robert'],
    ['Trailing spaces', 'RobeRT  ', '', ', Robert'],
    ['Hyphenated', 'Robert-John', 'SmiTH-jONes-WILSON', 'Smith-Jones-Wilson, Robert-John'],
  ])('%s formatMiniProfileName(%s, %s)', (_: string, firstName: string, lastName: string, expected: string) => {
    expect(lastNameFirstName({ firstName, lastName })).toEqual(expected)
  })
})

describe('format day month year forward slash separator', () => {
  it.each([
    [null, ''],
    ['', ''],
    ['Empty string', 'Empty string'],
    ['23/10/1978', '23/10/1978'],
    ['1978-10-23', '23/10/1978'],
  ])('%s dayMonthYearForwardSlashSeparator(%s, %s)', (dateString: string, expected: string) => {
    expect(dayMonthYearForwardSlashSeparator(dateString)).toEqual(expected)
  })
})
