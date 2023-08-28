import { getAsyncLifecycle, defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { createDashboardLink } from './components/create-dashboard-link.component';

const moduleName = '@ugandaemr/esm-radiology-app';

const options = {
  featureName: 'ugandaemr-radiology',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export const root = getAsyncLifecycle(() => import('./root.component'), options);

export const radiologyDashboardLink = getSyncLifecycle(
  createDashboardLink({
    name: 'radiology',
    slot: 'radiology-dashboard-slot',
    title: 'Radiology',
  }),
  options,
);

export const radiologyComponent = getAsyncLifecycle(() => import('./radiology.component'), options);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}
