import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import { createDashboardGroup, createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { TBDashboardMeta, contactTracingDashboardtMeta, tbTreatmentDashboardMeta } from './dashboard.meta';

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
export const contactTracingDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...contactTracingDashboardtMeta,
    moduleName,
  }),
  options,
);
export const contactTracingDashboardExt = getAsyncLifecycle(() => import('./pages/screening/screening.component'), {
  featureName: 'contact-tracing',
  moduleName,
});

//treatment and followup
export const tbTreatmentDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...tbTreatmentDashboardMeta,
    moduleName,
  }),
  options,
);
export const tbTreatmentDashboardExt = getAsyncLifecycle(
  () => import('./pages/treatment/treatment-follow-up.component'),
  {
    featureName: 'tb-treatment',
    moduleName,
  },
);
