const nunjucks = require('nunjucks')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const {
  consecutiveToDetailsToDescription,
  personDateOfBirth,
  personProfileName,
  personStatus,
  hmppsFormatDate,
  formatLengths,
} = require('./dist/hmpps/utils/utils')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'node_modules/govuk-frontend/dist/govuk/assets': 'assets' })
  eleventyConfig.addPassthroughCopy({
    'node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js': 'assets/javascript/govuk/govuk-frontend.min.js',
  })
  eleventyConfig.addPassthroughCopy({
    'node_modules/@ministryofjustice/frontend/moj/all.js': 'assets/javascript/moj/all.js',
  })
  eleventyConfig.addPassthroughCopy({ 'dist/hmpps/assets': 'assets' })
  eleventyConfig.addPassthroughCopy({ 'docs-assets': 'assets' })

  eleventyConfig.addFilter('personProfileName', personProfileName)
  eleventyConfig.addFilter('personDateOfBirth', personDateOfBirth)
  eleventyConfig.addFilter('personStatus', personStatus)
  eleventyConfig.addFilter('hmppsFormatDate', hmppsFormatDate)
  eleventyConfig.addFilter('formatLengths', formatLengths)
  eleventyConfig.addFilter('consecutiveToDetailsToDescription', consecutiveToDetailsToDescription)

  const njkEnv = nunjucks.configure([
    'docs/_includes/',
    'node_modules/govuk-frontend/dist/',
    'node_modules/@ministryofjustice/frontend/',
    'dist/',
  ])

  eleventyConfig.setLibrary('njk', njkEnv)

  eleventyConfig.addPlugin(syntaxHighlight)

  eleventyConfig.setUseGitIgnore(false)

  eleventyConfig.setQuietMode(true)

  return {
    dir: {
      input: 'docs',
    },
  }
}
