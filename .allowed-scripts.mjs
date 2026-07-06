import { configureAllowedScripts } from '@ministryofjustice/hmpps-npm-script-allowlist'

export default configureAllowedScripts({
   allowlist: {
      "node_modules/@parcel/watcher@2.5.1": "ALLOW",
      "node_modules/fsevents@2.3.3": "ALLOW",
      "node_modules/govuk-prototype-kit/node_modules/@parcel/watcher@2.5.1": "FORBID",
      "node_modules/govuk-prototype-kit/node_modules/fsevents@2.3.2": "FORBID",
      "node_modules/unrs-resolver@1.11.1": "ALLOW"
   },
})
