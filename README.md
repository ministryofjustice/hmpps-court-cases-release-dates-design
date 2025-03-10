# HMPPS Court cases and release dates component library

A shared frontend component library and design system for court cases and release dates product set services.

## Getting started

This repository contains the source for both the [frontend component library node.js package]((https://www.npmjs.com/package/@ministryofjustice/hmpps-court-cases-release-dates-design)) and the [design system documentation site](https://court-cases-release-dates-design.hmpps.service.justice.gov.uk/).
The design system documentation site contains [full instructions](https://court-cases-release-dates-design.hmpps.service.justice.gov.uk/get-started/) for using the [components](https://court-cases-release-dates-design.hmpps.service.justice.gov.uk/components/) in your service or prototype.

## Top level and product set components

There are two levels of components in the design system:

- Top level components that are recommended for use across all HMPPS services e.g. the [mini profile](https://court-cases-release-dates-design.hmpps.service.justice.gov.uk/components/mini-profile/)
- Product set specific components that are targetted at a subset of connected services e.g. the [court cases and release dates components](https://court-cases-release-dates-design.hmpps.service.justice.gov.uk/components/court-cases-release-dates/)

Components can begin life as a product set component and then be promoted to a top level component if they are used by multiple product sets.
Components at the top level can also be candidates for the [Ministry of Justice Design System](https://design-patterns.service.justice.gov.uk/) if they are not HMPPS specific.
Promoting components in this way is actively encouraged. 

## Developing components

The component library and design system documentation site are designed to be developed in conjunction with each other.
A component can be added or refined while being reviewed on the design system documentation site and the component documentation can be written at the same time.

### Prerequisites

Start by cloning the repository and installing the dependencies:

```bash
npm install
```

You can then start the development environment:

```bash
npm run dev
```

This will start a local server available at http://localhost:3010/ and watch for changes to source files.

### Adding or updating a component

The source for components can be found in the src/hmpps/components directory or product set specific subdirectory. Each component should be in its own directory using the `kebab-cased` component name.
At a minimum, a component should have a macro.njk file, which registers the nunjucks macro and a template.njk file which contains the markup for the component.

### Component documentation

The design system documentation site source can be found in `docs` and is built using [Eleventy](https://www.11ty.dev/), a static site generator.
It uses a mixture of markdown and nunjucks files to generate the site. Layout files are in the `docs/_includes` directory and components are in the `docs/components` directory.
Adding documentation for a new component requires a new nunjucks file and additions to two other files:

1. Add `component-name-in-kebab-case.njk` to the `docs/components` directory or product set specific subdirectory
2. Add a link to the component documentation to the side navigation in the component layout file `docs/_includes/component.njk` or product set specific layout file
3. Complete the documentation for the new component including the HTML markup and Nunjucks code as a minimum
4. Ensure that any required Nunjucks filters are included in the Nunjucks code section

Once added, you can view your component documentation at http://localhost:3010/components/component-name-in-kebab-case/

### Styling components

The component library makes all the styles provided by the [GOV.UK Design System](https://design-system.service.gov.uk/) and the [Ministry of Justice Design System](https://design-patterns.service.justice.gov.uk/) available to components.
If a component requires additional styling, a scss file using the `_kebab-cased` component name (note the underscore prefix) should be added in the component directory.
This file should then be added to the `src/hmpps/components/_all.scss` file. At which point it will be automatically bundled and available in the design system documentation site.

### Nunjucks filters

HMPPS components commonly use nunjucks filters for formatting text, names dates and times. These should be added to the `src/hmpps/utils/utils.ts` file.
They then need to be registered in the `.eleventy.js` file, so they are available in the design system documentation site.

Start by adding the filter name to the list above `} = require("./dist/hmpps/utils/utils");` near the top of the file. Then register the filter by adding `njkEnv.addFilter('nameOfFilter', nameOfFilter)` towards the bottom of the file.

Ensure that any required Nunjucks filters are included in the Nunjucks code section of the component documentation.

### Making component available to the prototype toolkit

The prototype toolkit is configured to use the components from this library using the `src/package/govuk-prototype-kit.config.json` file.
Add the component into the `nunjucksMacros` section. Each macro needs an `importFrom` and `macroName` property value.
Full documentation of this section and the config file itself can be found on the [GOV.UK Prototype Kit site](https://prototype-kit.service.gov.uk/docs/configure-plugin#nunjucksmacros)

Any nunjucks filters used by the component should be added to the `src/hmpps/filters/prototype-kit-filters.js` similar to how they are added to the design system documentation site.

## Publishing components

The component library is published to the node.js package repository as [@ministryofjustice/hmpps-court-cases-release-dates-design](https://www.npmjs.com/package/@ministryofjustice/hmpps-court-cases-release-dates-design).
The publish workflow is triggered when a new [release](https://github.com/ministryofjustice/@ministryofjustice/hmpps-court-cases-release-dates-design/releases) is created in the repo. A new release should use semantic versioning i.e. major.minor.patch.

| Version | Description                                                                                                                      |
|---------|----------------------------------------------------------------------------------------------------------------------------------|
| major   | Breaking changes to an existing component or from a dependency e.g. [govuk-frontend](https://github.com/alphagov/govuk-frontend) |
| minor   | New components or new features added to existing components                                                                      |
| patch   | Bug fixes or minor changes to existing components                                                                                |

The publish workflow will automatically update the version number in the package.json file and publish the package to npm.

## Publishing documentation site

The design system documentation site is automatically published whenever a pull request is merged into the `main` branch. No manual steps are required
