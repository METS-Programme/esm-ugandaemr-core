import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import { createDashboardLink } from './createDashboardLink';
import { dashboardMeta } from './dashboard.meta';
import { registerPostSubmissionAction } from '@openmrs/openmrs-form-engine-lib';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const options = {
  featureName: 'patient queues',
  moduleName,
};

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);

  // register post form submission
  // ipd
  registerPostSubmissionAction({
    id: 'IpdAdmissionSubmissionAction',
    load: () => import('./post-submission-actions/ipd-admission-submission-action'),
  });
  // lab
  registerPostSubmissionAction({
    id: 'LabSubmissionAction',
    load: () => import('./post-submission-actions/lab-admission-submission-action'),
  });
  // medications
  registerPostSubmissionAction({
    id: 'MedicationsSubmissionAction',
    load: () => import('./post-submission-actions/medications-admission-submission-action'),
  });
  // radiology
  registerPostSubmissionAction({
    id: 'RadiologySubmissionAction',
    load: () => import('./post-submission-actions/radiology-admission-submission-action'),
  });

  // console.log('info');
}

// pages
export const root = getAsyncLifecycle(() => import('./root.component'), options);

// extensions
export const outpatientSideNavExt = getAsyncLifecycle(() => import('./side-menu/side-menu.component'), options);

export const patientQueuesDashboardLink = getSyncLifecycle(createDashboardLink(dashboardMeta), options);

export const homeDashboard = getAsyncLifecycle(() => import('./home.component'), options);

export const patientQueues = getAsyncLifecycle(
  () => import('./queue-patient-linelists/queue-services-table.component'),
  options,
);

export const editQueueEntryStatusModal = getAsyncLifecycle(
  () => import('./active-visits/change-status-dialog.component'),
  {
    featureName: 'edit queue status',
    moduleName,
  },
);

export const patientInfoBannerSlot = getAsyncLifecycle(() => import('./patient-info/patient-info.component'), {
  featureName: 'patient info slot',
  moduleName,
});

export const addPatientToQueue = getAsyncLifecycle(() => import('./patient-search/visit-form/visit-form.component'), {
  featureName: ' add patient to queue',
  moduleName,
});

export const removeQueueEntry = getAsyncLifecycle(
  () => import('./remove-queue-entry-dialog/remove-queue-entry.component'),
  {
    featureName: 'remove queue entry and end visit',
    moduleName,
  },
);

export const clearAllQueueEntries = getAsyncLifecycle(
  () => import('./clear-queue-entries-dialog/clear-queue-entries-dialog.component'),
  {
    featureName: 'clear all queue entries and end visits',
    moduleName,
  },
);

export const addVisitToQueueModal = getAsyncLifecycle(
  () => import('./add-patient-toqueue/add-patient-toqueue-dialog.component'),
  {
    featureName: 'add visit to queue',
    moduleName,
  },
);

export const transitionQueueEntryStatusModal = getAsyncLifecycle(
  () => import('./transition-queue-entry/transition-queue-entry-dialog.component'),
  {
    featureName: 'transition queue status',
    moduleName,
  },
);

export const previousVisitSummaryWidget = getAsyncLifecycle(() => import('./past-visit/past-visit.component'), options);

export const addProviderToRoomModal = getAsyncLifecycle(
  () => import('./add-provider-queue-room/add-provider-queue-room.component'),
  {
    featureName: 'add provider queue room',
    moduleName,
  },
);

export const notesModal = getAsyncLifecycle(() => import('./active-visits/notes-dialog.component'), options);

export const addQueueEntryWidget = getAsyncLifecycle(
  () => import('./patient-search/visit-form-queue-fields/visit-form-queue-fields.component'),
  options,
);

export const pickPatientEntryQueue = getAsyncLifecycle(() => import('./active-visits/pick-patient-dialog.component'), {
  featureName: 'pick patient dialog',
  moduleName,
});

export const queueScreen = getAsyncLifecycle(() => import('./queue-board/queue-board.component'), options);

export const testScreen = getAsyncLifecycle(() => import('./test.component'), options);
