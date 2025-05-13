import { defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import { createDashboardLink } from './createDashboardLink';
import { ClinicalRoomMeta, ReceptionMeta, TriageMeta } from './dashboard.meta';
import moveToNextServicePointButtonComponent from './active-visits/move-to-next-service-point-patient-action.component';
import notesModalComponent from './active-visits/notes/notes-action-menu.components';
import pickPatientEntryQueueComponent from './active-visits/pick-patient-dialog.component';
import queueScreenComponent from './components/queue-board/queue-board.component';
import rootComponent from './root.component';
import homeDashboardComponent from './home.component';
import outpatientSideNavExtComponent from './side-menu/side-menu.component';
import triageRoomComponent from './queue-triage-home.component';
import receptionRoomComponent from './queue-reception-home.component';
import clinicalRoomComponent from './queue-clinical-room-home.component';
import startVisitFormComponent from './components/visit-form/visit-form.component';
import startVisitFormButtonComponent from './active-visits/start-visit-form-button.component';
import checkedInTileComponent from './queue-tiles/checked-in-tile.component';
import queueCompletedTileComponent from './queue-tiles/queue-completed-tile.component';
import queueInQueueTileComponent from './queue-tiles/queue-in-queue-tile.component';
import queueWaitingTileComponent from './queue-tiles/queue-waiting-tile.component';
import moveToNextServicePointWorkspace from './active-visits/move-to-next-service-point.workspace';

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

export const moveToNextServicePointFormWorkspace = getSyncLifecycle(moveToNextServicePointWorkspace, options);

export const moveToNextServicePointButton = getSyncLifecycle(moveToNextServicePointButtonComponent, options);

export const notesModal = getSyncLifecycle(notesModalComponent, options);

export const pickPatientEntryQueue = getSyncLifecycle(pickPatientEntryQueueComponent, options);

export const queueScreen = getSyncLifecycle(queueScreenComponent, options);

export const startVisitForm = getSyncLifecycle(startVisitFormComponent, options);

export const startVisitFormButton = getSyncLifecycle(startVisitFormButtonComponent, options);

// summary tiles

export const checkInTile = getSyncLifecycle(checkedInTileComponent, options);

export const queueCompletedTile = getSyncLifecycle(queueCompletedTileComponent, options);

export const queueInQueueTile = getSyncLifecycle(queueInQueueTileComponent, options);

export const queueWaitingTile = getSyncLifecycle(queueWaitingTileComponent, options);
