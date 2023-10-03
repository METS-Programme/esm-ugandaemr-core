import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle, provide } from '@openmrs/esm-framework';
import { createDashboardGroup, createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import {
  ipdDashboardMeta,
  ipdPalliativeDashboardtMeta,
  testingDashboardtMeta,
  treatmentDashboardtMeta,
} from './dashboard.meta';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const options = {
  featureName: '@ugandaemr/esm-inpatient-app',
  moduleName,
};

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

/*export const ipdDashboardGroup = getSyncLifecycle(createDashboardGroup(ipdDashboardMeta), options);

//  testing dashboard
export const ipdTestingDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...testingDashboardtMeta,
    moduleName,
  }),
  options,
);*/

export const ipdTestDashboardLinkExt = getAsyncLifecycle(
  () => import('./pages/ipd/clinical/clinical-assessment.component'),
  {
    featureName: 'ipd-dashboard-ext',
    moduleName,
  },
);

//  treatment dashboard
export const ipdTreatmentDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...treatmentDashboardtMeta,
    moduleName,
  }),
  options,
);

export const ipdTestingDashboardLinkExt = getAsyncLifecycle(
  () => import('./pages/ipd/admissions/admission.component'),
  {
    featureName: 'ipd-dashboard-ext',
    moduleName,
  },
);

//  Palliative dashboard
export const ipdPalliativeDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...ipdPalliativeDashboardtMeta,
    moduleName,
  }),
  options,
);

export const ipdPalliativeDashboardLinkExt = getAsyncLifecycle(
  () => import('./pages/ipd/palliative/palliative-care.component'),
  {
    featureName: 'ipd--palliative-dashboard-ext',
    moduleName,
  },
);
