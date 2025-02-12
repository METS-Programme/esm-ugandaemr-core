import { defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import { createDashboardLink } from './createDashboardLink';
import { ClinicalRoomMeta, ReceptionMeta, TriageMeta } from './dashboard.meta';
import editQueueEntryStatusModalComponent from './active-visits/change-status-dialog.component';
import patientChartMoveToNextServicePointModalComponent from './active-visits/change-status-move-to-next-dialog.component';
import queueTableMoveToNextServicePointModalComponent from './active-visits/queue-table-move-to-next-dialog.component';
import moveToNextServicePointButtonComponent from './active-visits/move-to-next-service-point-action.components';
import addPatientToQueueComponent from './active-visits/visit-form/visit-form.component';
import notesModalComponent from './active-visits/notes-dialog.component';
import pickPatientEntryQueueComponent from './active-visits/pick-patient-dialog.component';
import queueScreenComponent from './queue-board/queue-board.component';
import rootComponent from './root.component';
import homeDashboardComponent from './home.component';
import outpatientSideNavExtComponent from './side-menu/side-menu.component';
import triageRoomComponent from './queue-triage-home.component';
import receptionRoomComponent from './queue-reception-home.component';
import clinicalRoomComponent from './queue-clinical-room-home.component';
import startVisitFormComponent from './active-visits/visit-form/visit-form.component';
import startVisitFormButtonComponent from './active-visits/start-visit-form-button.component';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const options = {
  featureName: 'patient queues',
  moduleName,
};

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

// pages
export const root = getSyncLifecycle(rootComponent, options);

export const triageRoom = getSyncLifecycle(triageRoomComponent, options);

export const receptionRoom = getSyncLifecycle(receptionRoomComponent, options);

export const clinicalRoom = getSyncLifecycle(clinicalRoomComponent, options);

export const homeDashboard = getSyncLifecycle(homeDashboardComponent, options);

// extensions
export const outpatientSideNavExt = getSyncLifecycle(outpatientSideNavExtComponent, options);

// reception side nav item
export const queueReceptionDashboardLink = getSyncLifecycle(createDashboardLink(ReceptionMeta), options);

// triage side nav item
export const queueTriageDashboardLink = getSyncLifecycle(createDashboardLink(TriageMeta), options);

// clinical room side nav item
export const queueClinicalRoomDashboardLink = getSyncLifecycle(createDashboardLink(ClinicalRoomMeta), options);

export const editQueueEntryStatusModal = getSyncLifecycle(editQueueEntryStatusModalComponent, options);

export const patientChartMoveToNextServicePointModal = getSyncLifecycle(
  patientChartMoveToNextServicePointModalComponent,
  options,
);

export const queueTableMoveToNextServicePointModal = getSyncLifecycle(
  queueTableMoveToNextServicePointModalComponent,
  options,
);

export const moveToNextServicePointButton = getSyncLifecycle(moveToNextServicePointButtonComponent, options);

export const addPatientToQueue = getSyncLifecycle(addPatientToQueueComponent, options);

export const notesModal = getSyncLifecycle(notesModalComponent, options);

export const pickPatientEntryQueue = getSyncLifecycle(pickPatientEntryQueueComponent, options);

export const queueScreen = getSyncLifecycle(queueScreenComponent, options);

export const startVisitForm = getSyncLifecycle(startVisitFormComponent, options);

export const startVisitFormButton = getSyncLifecycle(startVisitFormButtonComponent, options);



