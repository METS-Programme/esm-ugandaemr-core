import {
  getAsyncLifecycle,
  defineConfigSchema,
  provide,
  getSyncLifecycle,
} from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import ugandaEmrOverrides from "./ugandaemr-configuration-overrrides.json";
import formsRegistry from "./forms/forms-registry";
import { addToBaseFormsRegistry } from "@ohri/openmrs-ohri-form-engine-lib";
import { createDashboardLink } from "@openmrs/esm-patient-common-lib";
import { opdDashboardMeta } from "./dashboard.meta";
import { moduleName } from "./constants";

const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

const backendDependencies = {
  fhir2: "^1.2.0",
  "webservices.rest": "^2.2.0",
};

function setupOpenMRS() {
  const options = {
    featureName: "@ugandaemr/esm-outpatient-app",
    moduleName,
  };

  defineConfigSchema(moduleName, configSchema);
  provide(ugandaEmrOverrides);
  addToBaseFormsRegistry(formsRegistry);
  return {
    pages: [],
    extensions: [
      {
        id: "opd-dashboard",
        slot: "patient-chart-dashboard-slot",
        load: getSyncLifecycle(createDashboardLink(opdDashboardMeta), options),
        meta: opdDashboardMeta,
      },
      {
        id: "opd-dashboard-ext",
        slot: "opd-dashboard-slot",
        load: getAsyncLifecycle(() => import("./pages/opd/opd.component"), {
          featureName: "opd-dashboard-summary",
          moduleName,
        }),
        meta: {
          columnSpan: 4,
        },
      },
    ],
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
