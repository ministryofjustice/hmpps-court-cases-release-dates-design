import { format, isValid, parse } from 'date-fns'

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

export const sentenceCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

export const sentenceCaseHyphenatedWord = (word: string): string =>
  isBlank(word.trim()) ? '' : word.trim().split('-').map(sentenceCase).join('-')

export const firstNameLastName = (person: { firstName: string; lastName: string }): string => {
  return `${sentenceCaseHyphenatedWord(person.firstName)} ${sentenceCaseHyphenatedWord(person.lastName)}`
}

export const lastNameFirstName = (person: { firstName: string; lastName: string }): string => {
  return `${sentenceCaseHyphenatedWord(person.lastName)}, ${sentenceCaseHyphenatedWord(person.firstName)}`
}

export const dayMonthYearForwardSlashSeparator = (dateString: string): string => {
  const date = parse(dateString, 'yyyy-MM-dd', new Date())
  return isValid(date) ? format(date, 'dd/MM/yyyy') : dateString
}
