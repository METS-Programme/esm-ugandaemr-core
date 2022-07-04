/**
 * This is the entrypoint file of the application. It communicates the
 * important features of this microfrontend to the app shell. It
 * connects the app shell to the React application(s) that make up this
 * microfrontend.
 */

import {
  getAsyncLifecycle,
  defineConfigSchema,
  provide,
  getSyncLifecycle,
} from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import ugandaEmrOverrides from "./ugandaemr-configuration-overrrides.json";
import ugandaEmrConfig from "./ugandaemr-config";
import formsRegistry from "./forms/forms-registry";
import { addToBaseFormsRegistry } from "@ohri/openmrs-ohri-form-engine-lib";
import {
  createDashboardGroup,
  createDashboardLink,
} from "@openmrs/esm-patient-common-lib";
import {
  ancDashboardMeta,
  eidDashboardMeta,
  mchDashboardMeta,
  pncDashboardMeta,
} from "./ugandaemr-dashboard";

/**
 * This tells the app shell how to obtain translation files: that they
 * are JSON files in the directory `../translations` (which you should
 * see in the directory structure).
 */
const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

/**
 * This tells the app shell what versions of what OpenMRS backend modules
 * are expected. Warnings will appear if suitable modules are not
 * installed. The keys are the part of the module name after
 * `openmrs-module-`; e.g., `openmrs-module-fhir2` becomes `fhir2`.
 */
const backendDependencies = {
  fhir2: "^1.2.0",
  "webservices.rest": "^2.2.0",
};

/**
 * This function performs any setup that should happen at microfrontend
 * load-time (such as defining the config schema) and then returns an
 * object which describes how the React application(s) should be
 * rendered.
 *
 * In this example, our return object contains a single page definition.
 * It tells the app shell that the default export of `greeter.tsx`
 * should be rendered when the route matches `hello`. The full route
 * will be `openmrsSpaBase() + 'hello'`, which is usually
 * `/openmrs/spa/hello`.
 */
function setupOpenMRS() {
  const moduleName = "@ugandaemr/esm-ugandaemr-app";

  const options = {
    featureName: "UgandaEMR",
    moduleName,
  };

  defineConfigSchema(moduleName, configSchema);
  provide(ugandaEmrOverrides);
  provide(ugandaEmrConfig);
  addToBaseFormsRegistry(formsRegistry);
  return {
    pages: [],
    extensions: [
      {
        id: "cervical-cancer-summary-ext",
        slot: "cacx-visits-slot",
        load: getAsyncLifecycle(
          () =>
            import("./pages/cervical-cancer/cacx-visits/cacx-visits.component"),
          {
            featureName: "cervical-cancer-summary-extension",
            moduleName,
          }
        ),
      },
      {
        id: "mch-dashboard",
        slot: "patient-chart-dashboard-slot",
        load: getSyncLifecycle(createDashboardGroup(mchDashboardMeta), options),
        meta: mchDashboardMeta,
      },
      //add PNC slot onto MCH dashboard
      {
        id: "pnc-dashboard",
        slot: "mch-dashboard-slot",
        load: getSyncLifecycle(createDashboardLink(pncDashboardMeta), options),
        meta: pncDashboardMeta,
      },
      //add PNC action to open a component
      {
        id: "pnc-summary-ext",
        slot: "pnc-dashboard-slot",
        load: getAsyncLifecycle(
          () => import("./pages/mch/pnc-register.component"),
          {
            featureName: "pnc-extension",
            moduleName,
          }
        ),
      },
      //add ANC slot onto MCH dashboard
      {
        id: "anc-dashboard",
        slot: "mch-dashboard-slot",
        load: getSyncLifecycle(createDashboardLink(ancDashboardMeta), options),
        meta: ancDashboardMeta,
      },
      //add ANC action to open a component
      {
        id: "anc-summary-ext",
        slot: "anc-dashboard-slot",
        load: getAsyncLifecycle(
          () => import("./pages/mch/anc-register.component"),
          {
            featureName: "anc-extension",
            moduleName,
          }
        ),
      },
      //add EID slot onto MCH dashboard
      {
        id: "eid-dashboard",
        slot: "mch-dashboard-slot",
        load: getSyncLifecycle(createDashboardLink(eidDashboardMeta), options),
        meta: eidDashboardMeta,
      },
      //add EID action to open a component
      {
        id: "eid-summary-ext",
        slot: "eid-dashboard-slot",
        load: getAsyncLifecycle(
          () => import("./pages/mch/eid-summary-form.component"),
          {
            featureName: "eid-extension",
            moduleName,
          }
        ),
      },
    ],
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
