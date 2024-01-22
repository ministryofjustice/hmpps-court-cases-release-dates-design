import { format, parse } from 'date-fns'

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

const capitalizeFirstLetter = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const capitalizeFirstLetters = (word: string): string =>
  isBlank(word.trim()) ? '' : word.trim().split('-').map(capitalizeFirstLetter).join('-')

export const formatMiniProfileName = (person: { firstName: string; lastName: string }): string => {
  return `${capitalizeFirstLetters(person.lastName)}, ${capitalizeFirstLetters(person.firstName)}`
}

export const formatMiniProfileDateOfBirth = (dateOfBirth: string): string => {
  const date = parse(dateOfBirth, 'yyyy-MM-dd', new Date())
  return format(date, 'dd/MM/yyyy')
}
