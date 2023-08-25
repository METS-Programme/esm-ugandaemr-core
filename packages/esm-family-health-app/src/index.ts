import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle, provide } from '@openmrs/esm-framework';
import { createDashboardGroup, createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { addToBaseFormsRegistry } from '@openmrs/openmrs-form-engine-lib';
import { configSchema } from './config-schema';
import {
  childHealthDashboardMeta,
  familyHealthDashboardMeta,
  familyPlanningDashboardMeta,
  hivExposedInfantMeta,
  mchDashboardMeta,
  nutritionDashboardMeta,
} from './dashboard.meta';
import formsRegistry from './forms/forms-registry';
import ugandaEmrConfig from './ugandaemr-config';
import ugandaEmrOverrides from './ugandaemr-configuration-overrrides.json';
import { moduleName } from './constants';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const options = {
  featureName: '@ugandaemr/esm-family-health-app',
  moduleName,
};

// startapp
export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
  provide(ugandaEmrOverrides);
  provide(ugandaEmrConfig);
  addToBaseFormsRegistry(formsRegistry);
}

// pages

// extensions
export const familyHealthClinicDashboard = getSyncLifecycle(createDashboardGroup(familyHealthDashboardMeta), options);

export const mchDashboard = getSyncLifecycle(createDashboardLink({ ...mchDashboardMeta, moduleName }), options);

export const mchDashboardSummaryExt = getAsyncLifecycle(
  () => import('./pages/family-health-clinic/mch/mch-summary.component'),
  {
    featureName: 'mch-dashboard-summary',
    moduleName,
  },
);

export const childHealthDashboard = getSyncLifecycle(
  createDashboardLink({ ...childHealthDashboardMeta, moduleName }),
  options,
);

export const childHealthSummaryExt = getAsyncLifecycle(
  () => import('./pages/family-health-clinic/child-health.component'),
  {
    featureName: 'child-health-extension',
    moduleName,
  },
);

export const hivExposedInfantDashboard = getSyncLifecycle(
  createDashboardLink({ ...hivExposedInfantMeta, moduleName }),
  options,
);

export const hivExposedInfantExt = getAsyncLifecycle(
  () => import('./pages/family-health-clinic/hiv-exposed-infant/hiv-exposed-infant.component'),
  {
    featureName: 'hiv-exposed-infant',
    moduleName,
  },
);

export const familyPlanningDashboard = getSyncLifecycle(
  createDashboardLink({ ...familyPlanningDashboardMeta, moduleName }),
  options,
);

export const familyPlanningDashboardExt = getAsyncLifecycle(
  () => import('./pages/family-health-clinic/family-planning/family-planning.component'),
  {
    featureName: 'family-planning',
    moduleName,
  },
);

export const nutritionDashboard = getSyncLifecycle(
  createDashboardLink({ ...nutritionDashboardMeta, moduleName }),
  options,
);

export const nutritionDashboardExt = getAsyncLifecycle(
  () => import('./pages/family-health-clinic/Nutrition/nutrition.component'),
  {
    featureName: 'nutrition',
    moduleName,
  },
);
