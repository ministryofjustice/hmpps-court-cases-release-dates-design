# HMPPS Court cases and release dates frontend

## Add to prototype

Install the package:

`npm install hmpps-court-cases-release-dates-design`

Add the macro to your template.html file:

```nunjucks{% from "hmpps/components/mini-profile/macro.njk" import miniProfile %}```

Use the macro:

```nunjucks
{% set person = {
    firstName: 'Neil',
    lastName: 'Rudge',
    prisonerNumber: 'A1234BC',
    dateOfBirth: '1932-02-02',
    status: 'On remand',
    prisonName: 'HMP Kirkham',
    cellLocation: 'A-1-1'
} %}

{{ miniProfile(person, '/plugin-assets/hmpps-court-cases-release-dates-design/hmpps/assets/images/prisoner-profile-image.png', '#') }}
```
