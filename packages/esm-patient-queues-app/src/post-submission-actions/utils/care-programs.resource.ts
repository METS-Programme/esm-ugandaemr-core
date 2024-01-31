import { openmrsFetch } from '@openmrs/esm-framework';
import { ProgramEnrollmentPayload } from './utils';

export async function createProgramEnrollment(payload: ProgramEnrollmentPayload) {
  const abortController = new AbortController();
  return openmrsFetch(`/ws/rest/v1/programenrollment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
    body: payload,
  });
}
