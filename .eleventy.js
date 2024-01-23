const nunjucks = require('nunjucks')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const { formatMiniProfileDateOfBirth, formatMiniProfileName } = require('./dist/hmpps/utils/utils')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'node_modules/govuk-frontend/dist/govuk/assets': 'assets' })
  eleventyConfig.addPassthroughCopy({
    'node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js': 'assets/javascript/govuk/govuk-frontend.min.js',
  })
  eleventyConfig.addPassthroughCopy({
    'node_modules/@ministryofjustice/frontend/moj/all.js': 'assets/javascript/moj/all.js',
  })
  eleventyConfig.addPassthroughCopy({ 'dist/hmpps/assets': 'assets' })

  eleventyConfig.addFilter('formatMiniProfileName', formatMiniProfileName)
  eleventyConfig.addFilter('formatMiniProfileDateOfBirth', formatMiniProfileDateOfBirth)

  const njkEnv = nunjucks.configure([
    'docs/_includes/',
    'node_modules/govuk-frontend/dist/',
    'node_modules/@ministryofjustice/frontend/',
    'dist/',
  ])

  eleventyConfig.setLibrary('njk', njkEnv)

  eleventyConfig.addPlugin(syntaxHighlight)

  eleventyConfig.addWatchTarget('./dist/assets/')
  eleventyConfig.addWatchTarget('./dist/components/')

  eleventyConfig.setUseGitIgnore(false)

  return {
    dir: {
      input: "docs"
    }
  }
}
