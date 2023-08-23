import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { dashboardMeta } from './dashboard.meta';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const options = {
  featureName: '@ugandaemr/esm-tb-app',
  moduleName,
};

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const tbDashboardLink =
  // t('Programs', 'Programs')
  getSyncLifecycle(
    createDashboardLink({
      ...dashboardMeta,
      moduleName,
    }),
    options,
  );

export const tbOverviewDashboard = getAsyncLifecycle(() => import('./pages/tb/tb.component'), options);
