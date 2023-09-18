import { PostSubmissionAction } from '@openmrs/openmrs-form-engine-lib';
import { addQueueEntry } from '../active-visits/active-visits-table.resource';
import {
  NewVisitPayload,
  getVisitTypes,
  saveVisit,
  toDateObjectStrict,
  toOmrsIsoString,
  useVisitTypes,
} from '@openmrs/esm-framework';
import { first } from 'rxjs/operators';
import dayjs from 'dayjs';
import { convertTime12to24 } from '@openmrs/esm-patient-common-lib';

export const IpdAdmissionSubmissionAction: PostSubmissionAction = {
  applyAction: async function ({ patient, encounters, sessionMode }) {
    const encounter = encounters[0];
    const encounterLocation = encounter.location['uuid'];

    console.info('we are jabarating...', JSON.stringify(encounter));
    // only do this the first time the form is entered
    if (sessionMode !== 'enter') {
      return;
    }

    // add to queue
    addQueueEntry(
      encounter.uuid,
      encounterLocation,
      patient?.id,
      0,
      encounter.uuid,
      'Urgent',
      encounterLocation,
      'Urgent',
      'We are testing',
    )
      .then(() => {
        console.info('succesfully posted');
      })
      .catch(() => {
        console.info('succesfully posted');
      });
  },
};

export default IpdAdmissionSubmissionAction;
