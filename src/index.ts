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
      //add MCH slot onto Family Health dashboard
      {
        id: "mch-dashboard",
        slot: "family-health-dashboard-slot",
        load: getSyncLifecycle(createDashboardGroup(mchDashboardMeta), options),
        meta: mchDashboardMeta,
      },
      //add Child Health slot onto Family Health dashboard
      {
        id: "child-health-dashboard",
        slot: "family-health-dashboard-slot",
        load: getSyncLifecycle(
          createDashboardLink(childHealthDashboardMeta),
          options
        ),
        meta: childHealthDashboardMeta,
      },
      //add Child Health action to open a component
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
          () =>
            import("./pages/family-health-clinic/mch/pnc-register.component"),
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
          () =>
            import("./pages/family-health-clinic/mch/anc-register.component"),
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
      //add mat./pages/family-health-clinic/mch/EID/eid-services.component
      {
        id: "maternity-dashboard",
        slot: "mch-dashboard-slot",
        load: getSyncLifecycle(createDashboardLink(maternityMetaData), options),
        meta: maternityMetaData,
      },
      //add maternity action to open a component
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
