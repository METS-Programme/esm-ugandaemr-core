import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle, provide } from '@openmrs/esm-framework';
import { createDashboardGroup, createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { addToBaseFormsRegistry } from '@openmrs/openmrs-form-engine-lib';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import { opdDashboardMeta, testingDashboardtMeta, treatmentDashboardtMeta } from './dashboard.meta';
import formsRegistry from './forms/forms-registry';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const options = {
  featureName: '@ugandaemr/esm-outpatient-app',
  moduleName,
};

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
  // TODO: these forms need to be deleted and moved to the backend
  addToBaseFormsRegistry(formsRegistry);
}

export const opdDashboardGroup = getSyncLifecycle(createDashboardGroup(opdDashboardMeta), options);

//  testing dashboard
export const opdTestingDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...testingDashboardtMeta,
    moduleName,
  }),
  options,
);

//  treatment dashboard
export const opdTreatmentDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...treatmentDashboardtMeta,
    moduleName,
  }),
  options,
);

export const opdTestingDashboardLinkExt = getAsyncLifecycle(() => import('./pages/opd/outpatient.component'), {
  featureName: 'opd-dashboard-ext',
  moduleName,
});
