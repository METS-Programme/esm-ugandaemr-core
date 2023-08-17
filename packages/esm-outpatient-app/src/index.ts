import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle, provide } from '@openmrs/esm-framework';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { addToBaseFormsRegistry } from '@openmrs/openmrs-form-engine-lib';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import { opdDashboardMeta } from './dashboard.meta';
import formsRegistry from './forms/forms-registry';
import ugandaEmrOverrides from './ugandaemr-configuration-overrrides.json';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const options = {
  featureName: '@ugandaemr/esm-outpatient-app',
  moduleName,
};

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
  provide(ugandaEmrOverrides);
  addToBaseFormsRegistry(formsRegistry);
}

// opd dashboard
export const opdDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...opdDashboardMeta,
    moduleName,
  }),
  options,
);

export const opdDashboardExt = getAsyncLifecycle(() => import('./pages/opd/outpatient.component'), {
  featureName: 'opd-dashboard-summary',
  moduleName,
});
