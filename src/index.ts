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
} from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import ugandaEmrOverrides from "./ugandaemr-configuration-overrrides.json";
import formsRegistry from "./forms/forms-registry";
import { addToBaseFormsRegistry } from "openmrs-ohri-form-engine-lib";
import { createDashboardLink } from "@openmrs/esm-patient-common-lib";

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
  const moduleName = "esm-ugandaemr-app";

  const options = {
    featureName: "UgandaEMR",
    moduleName,
  };

  defineConfigSchema(moduleName, configSchema);
  provide(ugandaEmrOverrides);
  addToBaseFormsRegistry(formsRegistry);

  return {
    pages: [],
    extensions: [
      {
        id: "cervical-cancer-summary-ext",
        slot: "program-management-summary-slot",
        load: getAsyncLifecycle(
          () => import("./pages/cervical-cancer/cacx-screening.component"),
          {
            featureName: "program-summary-extension",
            moduleName,
          }
        ),
      },
      // Sample code to add new sidenav links
      // {
      //   id: "new-dashboard",
      //   slot: "patient-chart-dashboard-slot",
      //   load: getSyncLifecycle(
      //     createDashboardLink(dashboardMeta),
      //     options
      //   ),
      //   meta: dashboardMeta,
      // },
      // {
      //   id: "new-page-summary-ext",
      //   slot: "new-dashboard-slot",
      //   load: getAsyncLifecycle(
      //     () =>
      //       import(
      //         "./pages/new-directory/new-page.component"
      //       ),
      //     {
      //       featureName: "new-page-extension",
      //       moduleName,
      //     }
      //   ),
      // },
    ],
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
