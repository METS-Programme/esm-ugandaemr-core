import { PostSubmissionAction } from '@openmrs/openmrs-form-engine-lib';
import { addQueueEntry } from '../active-visits/active-visits-table.resource';

export const IpdAdmissionSubmissionAction: PostSubmissionAction = {
  applyAction: async function ({ patient, encounters, sessionMode }) {
    const encounter = encounters[0];
    const encounterLocation = encounter.location['uuid'];

    // only do this the first time the form is entered
    if (sessionMode !== 'enter') {
      return;
    }

    // add to queue
    addQueueEntry(
      encounter.uuid,
      encounterLocation,
      patient?.id,
      '',
      2,
      encounter.uuid,
      'pending',
      encounterLocation,
      'Urgent',
      'We are testing',
    )
      .then(() => {
        console.info('succesfully posted');
      })
      .catch(() => {
        console.info('an error occured');
      });
  },
};

export default IpdAdmissionSubmissionAction;
