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
  maternityMetaData,
  opdDashboardMeta,
  familyhealthDashboardMeta,
  childHealthDashboardMeta,
} from "./dashboard.meta";

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

export const moduleName = "@ugandaemr/esm-ugandaemr-app";

function setupOpenMRS() {
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
        id: "family-health-clinic-dashboard",
        slot: "patient-chart-dashboard-slot",
        load: getSyncLifecycle(
          createDashboardGroup(familyhealthDashboardMeta),
          options
        ),
        meta: familyhealthDashboardMeta,
      },
      {
        id: "mch-dashboard",
        slot: "family-health-dashboard-slot",
        load: getSyncLifecycle(createDashboardGroup(mchDashboardMeta), options),
        meta: mchDashboardMeta,
      },
      {
        id: "child-health-dashboard",
        slot: "family-health-dashboard-slot",
        load: getSyncLifecycle(
          createDashboardLink(childHealthDashboardMeta),
          options
        ),
        meta: childHealthDashboardMeta,
      },
      {
        id: "child-health-summary-ext",
        slot: "child-health-dashboard-slot",
        load: getAsyncLifecycle(
          () => import("./pages/family-health-clinic/child-health.component"),
          {
            featureName: "child-health-extension",
            moduleName,
          }
        ),
      },
      {
        id: "pnc-dashboard",
        slot: "mch-dashboard-slot",
        load: getSyncLifecycle(createDashboardLink(pncDashboardMeta), options),
        meta: pncDashboardMeta,
      },
      {
        id: "pnc-summary-ext",
        slot: "pnc-dashboard-slot",
        load: getAsyncLifecycle(
          () =>
            import("./pages/family-health-clinic/mch/pnc-register.component"),
          {
            featureName: "pnc-extension",
            moduleName,
          }
        ),
      },
      {
        id: "anc-dashboard",
        slot: "mch-dashboard-slot",
        load: getSyncLifecycle(createDashboardLink(ancDashboardMeta), options),
        meta: ancDashboardMeta,
      },
      {
        id: "anc-summary-ext",
        slot: "anc-dashboard-slot",
        load: getAsyncLifecycle(
          () =>
            import("./pages/family-health-clinic/mch/anc-register.component"),
          {
            featureName: "anc-extension",
            moduleName,
          }
        ),
      },
      {
        id: "eid-dashboard",
        slot: "mch-dashboard-slot",
        load: getSyncLifecycle(createDashboardLink(eidDashboardMeta), options),
        meta: eidDashboardMeta,
      },
      {
        id: "eid-summary-ext",
        slot: "eid-dashboard-slot",
        load: getAsyncLifecycle(
          () =>
            import(
              "./pages/family-health-clinic/mch/eid/eid-services.component"
            ),
          {
            featureName: "eid-extension",
            moduleName,
          }
        ),
      },
      {
        id: "maternity-dashboard",
        slot: "mch-dashboard-slot",
        load: getSyncLifecycle(createDashboardLink(maternityMetaData), options),
        meta: maternityMetaData,
      },
      {
        id: "maternity-register-extension",
        slot: "maternity-dashboard-slot",
        load: getAsyncLifecycle(
          () =>
            import(
              "./pages/family-health-clinic/mch/maternity-register.component"
            ),
          {
            featureName: "maternity-extension",
            moduleName,
          }
        ),
      },
    ],
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
