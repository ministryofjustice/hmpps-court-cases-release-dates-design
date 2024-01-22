import { formatMiniProfileDateOfBirth, formatMiniProfileName } from './utils'

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
    expect(formatMiniProfileName({ firstName, lastName })).toEqual(expected)
  })
})

describe('format mini profile date of birth', () => {
  it.each([
    // [null, null],
    // ['Empty string', ''],
    ['1978-10-23', '23/10/1978'],
  ])('%s formatMiniProfileDateOfBirth(%s, %s)', (dateOfBirth: string, expected: string) => {
    expect(formatMiniProfileDateOfBirth(dateOfBirth)).toEqual(expected)
  })
})
