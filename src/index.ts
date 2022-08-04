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
  mchDashboardMeta,
  pncDashboardMeta,
  opdDashboardMeta,
  familyHealthDashboardMeta,
  childHealthDashboardMeta,
<<<<<<< HEAD
  hivExposedInfantMeta,
  familyPlanningDashboardMeta,
} from "./dashboard.meta";
import { moduleName } from "./constants";
=======
  outpatientDashboardMeta,
  referralNoteDashboardMeta,
} from "./ugandaemr-dashboard";
>>>>>>> Add outpatient registration form

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
      //add opd slot onto patient chart dashboard
      {
        id: "opd-dashboard",
        slot: "patient-chart-dashboard-slot",
        load: getSyncLifecycle(createDashboardGroup(opdDashboardMeta), options),
        meta: opdDashboardMeta,
      },
      //add outpatient slot onto opd dashboard
      {
        id: "outpatient-dashboard",
        slot: "opd-dashboard-slot",
        load: getSyncLifecycle(
          createDashboardLink(outpatientDashboardMeta),
          options
        ),
        meta: outpatientDashboardMeta,
      },
      //add outpatient action to open a component
      {
        id: "outpatient-ext",
        slot: "outpatient-dashboard-slot1",
        load: getAsyncLifecycle(
          () => import("./pages/opd/outpatient-register.component"),
          {
            featureName: "outpatient-extension",
            moduleName,
          }
        ),
      },
      //add referral note slot onto opd dashboard
      {
        id: "referral-note-dashboard",
        slot: "opd-dashboard-slot",
        load: getSyncLifecycle(
          createDashboardLink(referralNoteDashboardMeta),
          options
        ),
        meta: referralNoteDashboardMeta,
      },
      //add referral note action to open a component
      {
        id: "referral-note-ext",
        slot: "referral-note-dashboard-slot",
        load: getAsyncLifecycle(
          () => import("./pages/opd/referral-note.component"),
          {
            featureName: "referral-note-extension",
            moduleName,
          }
        ),
      },
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
      {
        id: "family-health-clinic-dashboard",
        slot: "patient-chart-dashboard-slot",
        load: getSyncLifecycle(
          createDashboardGroup(familyHealthDashboardMeta),
          options
        ),
        meta: familyHealthDashboardMeta,
      },
      // SUB MENU
      {
        id: "mch-dashboard",
        slot: "family-health-dashboard-slot",
        load: getSyncLifecycle(createDashboardLink(mchDashboardMeta), options),
        meta: mchDashboardMeta,
      },
      {
        id: "mch-dashboard-summary-ext",
        slot: "mch-dashboard-slot",
        load: getAsyncLifecycle(
          () =>
            import("./pages/family-health-clinic/mch/mch-summary.component"),
          {
            featureName: "mch-dashboard-summary",
            moduleName,
          }
        ),
        meta: {
          columnSpan: 4,
        },
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
        meta: {
          columnSpan: 4,
        },
      },
      {
        id: "hiv-exposed-infant-dashboard",
        slot: "family-health-dashboard-slot",
        load: getSyncLifecycle(
          createDashboardLink(hivExposedInfantMeta),
          options
        ),
        meta: hivExposedInfantMeta,
      },
      {
        id: "hiv-exposed-infant-ext",
        slot: "hiv-exposed-infant-slot",
        load: getAsyncLifecycle(
          () =>
            import(
              "./pages/family-health-clinic/hiv-exposed-infant/hiv-exposed-infant.component"
            ),
          {
            featureName: "hiv-exposed-infant",
            moduleName,
          }
        ),
        meta: {
          columnSpan: 4,
        },
      },
      {
        id: "family-planning-dashboard",
        slot: "family-health-dashboard-slot",
        load: getSyncLifecycle(
          createDashboardLink(familyPlanningDashboardMeta),
          options
        ),
        meta: familyPlanningDashboardMeta,
      },
      {
        id: "family-planning-dashboard-ext",
        slot: "family-planning-dashboard-slot",
        load: getAsyncLifecycle(
          () =>
            import(
              "./pages/family-health-clinic/family-planning/family-planning.component"
            ),
          {
            featureName: "family-planning",
            moduleName,
          }
        ),
        meta: {
          columnSpan: 4,
        },
      },
    ],
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
