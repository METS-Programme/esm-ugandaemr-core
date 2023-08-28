import { getAsyncLifecycle, defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { createHomeDashboardLink } from './components/create-dashboard-link.component';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';

const moduleName = '@ugandaemr/esm-radiology-app';

const options = {
  featureName: 'ugandaemr-radiology',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export const root = getAsyncLifecycle(() => import('./root.component'), options);

export const radiologyDashboardLink = getSyncLifecycle(
  createHomeDashboardLink({
    name: 'radiology',
    slot: 'radiology-dashboard-slot',
    title: 'Radiology',
  }),
  options,
);

export const radiologyComponent = getAsyncLifecycle(() => import('./radiology.component'), options);

// Patient chart
export const radiologyOrderDashboardLink = getSyncLifecycle(
  createDashboardLink({
    path: 'radiology-orders',
    title: 'Radiology',
    moduleName,
  }),
  options,
);
export const radiologyOrderComponent = getAsyncLifecycle(
  () => import('./patient-chart/radiology-order.component'),
  options,
);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}
