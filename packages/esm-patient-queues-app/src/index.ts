import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import { createDashboardLink } from './createDashboardLink';
import { dashboardMeta } from './dashboard.meta';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const options = {
  featureName: 'patient queues',
  moduleName,
};

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

// pages
export const root = getAsyncLifecycle(() => import('./root.component'), options);

// extensions
export const outpatientSideNavExt = getAsyncLifecycle(() => import('./side-menu/side-menu.component'), options);

export const patientQueuesDashboardLink = getSyncLifecycle(createDashboardLink(dashboardMeta), options);

export const homeDashboard = getAsyncLifecycle(() => import('./home.component'), options);

export const editQueueEntryStatusModal = getAsyncLifecycle(
  () => import('./active-visits/change-status-dialog.component'),
  {
    featureName: 'edit queue status',
    moduleName,
  },
);

export const patientChartMoveToNextServicePointModal = getAsyncLifecycle(
  () => import('./active-visits/change-status-move-to-next-dialog.component'),
  options,
);

export const moveToNextServicePointButton = getAsyncLifecycle(
  () => import('./active-visits/move-to-next-service-point-action.components'),
  options,
);

export const addPatientToQueue = getAsyncLifecycle(() => import('./visit-form/visit-form.component'), {
  featureName: ' add patient to queue',
  moduleName,
});

export const notesModal = getAsyncLifecycle(() => import('./active-visits/notes-dialog.component'), options);

export const pickPatientEntryQueue = getAsyncLifecycle(() => import('./active-visits/pick-patient-dialog.component'), {
  featureName: 'pick patient dialog',
  moduleName,
});

export const queueScreen = getAsyncLifecycle(() => import('./queue-board/queue-board.component'), options);

export const testScreen = getAsyncLifecycle(() => import('./test.component'), options);
