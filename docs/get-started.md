---
layout: layout.njk
pageTitle: Get started
activeMainNav: get-started
---

# Get started

To make your service consistent with GOV.UK, you should start by checking what exists in the [GOV.UK Design System](https://design-system.service.gov.uk/).

If something is not in the GOV.UK Design System, you should check what exists in the:

- [MoJ Design System](https://design-patterns.service.justice.gov.uk/)
- [other departments Design Systems](https://github.com/ctdesign/gov-design-systems-list)
- [GOV.UK community backlog](https://github.com/orgs/alphagov/projects/43/views/1)

Reuse as much as possible and iterate based on user needs.

## Using the component library

The [frontend components](/components) detailed in the library are available as a [Node.js package](https://www.npmjs.com/package/@ministryofjustice/hmpps-court-cases-release-dates-design).
Installing this package is the recommended way to use these components in your service. You can then copy the Nunjucks code for a component and include it in your views.

### GOV UK Prototype Kit

The Node.js package is fully compatible with the [GOV UK Prototype Kit](https://prototype-kit.service.gov.uk/docs/) and does not require any additional steps to use.

### Node.js express

There are a few additional steps when installing the Node.js package into HMPPS UI applications based on the [template](https://github.com/ministryofjustice/hmpps-template-typescript):

1. Add `'/node_modules/@ministryofjustice/hmpps-court-cases-release-dates-design/hmpps/assets'` and `'/node_modules/@ministryofjustice/hmpps-court-cases-release-dates-design'` to the static resources configuration in `setUpStaticResources.ts`
2. Add `'node_modules/@ministryofjustice/hmpps-court-cases-release-dates-design/'` and `'node_modules/@ministryofjustice/hmpps-court-cases-release-dates-design/hmpps/components/'` to `nunjucks.configure` in `nunjucksSetup.ts`
3. Add any Nunjucks filters required for the component to `nunjucksSetup.ts` e.g. `njkEnv.addFilter('personProfileName', personProfileName)`

## Contributing to the component library

The [code repository](https://github.com/ministryofjustice/@ministryofjustice/hmpps-court-cases-release-dates-design) for the frontend kit guides you through the steps to improve existing components and add new ones.
