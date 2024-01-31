import { OpenmrsEncounter, PostSubmissionAction, SessionMode } from '@openmrs/openmrs-form-engine-lib';
import { createProgramEnrollment } from './utils/care-programs.resource';
import { CreateProgramEnrollmentPayload } from './utils/utils';

export const CareProgramSubmissionAction: PostSubmissionAction = {
  applyAction: async function ({ patient, encounters, sessionMode }) {
    const encounter = encounters[0];
    const encounterLocation = encounter.location['uuid'];
    const patientUuid = encounter.patient['identifier'][0]['uuid'];

    // only do this the first time the form is entered
    if (sessionMode !== 'enter') {
      return;
    }

    const payload = CreateProgramEnrollmentPayload(patientUuid, encounterLocation, '', '', null);

    // enroll into a program
    createProgramEnrollment(payload)
      .then(() => {
        // console.info('successfully posted');
      })
      .catch(() => {
        // console.info('an error occured');
      });
  },
};

export default CareProgramSubmissionAction;
