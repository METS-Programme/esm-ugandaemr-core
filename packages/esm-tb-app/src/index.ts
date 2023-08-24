import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import { createDashboardGroup, createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { TBDashboardMeta, tbScreeningDashboardtMeta, tbTreatmentDashboardtMeta } from './dashboard.meta';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const options = {
  featureName: '@ugandaemr/esm-tb-app',
  moduleName,
};

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const tbDashboardGroup = getSyncLifecycle(createDashboardGroup(TBDashboardMeta), options);

//  screening dashboard
export const tbScreeningDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...tbScreeningDashboardtMeta,
    moduleName,
  }),
  options,
);
export const tbScreeningDashboardExt = getAsyncLifecycle(() => import('./pages/screening/screening.component'), {
  featureName: 'tb-screening',
  moduleName,
});

//treatment and followup
export const tbTreatmentDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...tbTreatmentDashboardtMeta,
    moduleName,
  }),
  options,
);
export const tbTreatmentDashboardExt = getAsyncLifecycle(() => import('./pages/treatment/treatment.component'), {
  featureName: 'tb-treatment',
  moduleName,
});
