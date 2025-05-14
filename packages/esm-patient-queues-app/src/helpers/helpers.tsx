import { getGlobalStore } from '@openmrs/esm-framework';
import { PatientQueue } from '../types/patient-queues';

// selected queue patient uuid
const initialPatientQueueUuidState = { patientQueueUuid: localStorage.getItem('patientQueueUuid') };

export function getSelectedPatientQueueUuid() {
  return getGlobalStore<{ patientQueueUuid: string }>('patientQueueUuid', initialPatientQueueUuidState);
}

export const updateSelectedPatientQueueUuid = (currentPatientQueueUuid: string) => {
  const store = getSelectedPatientQueueUuid();
  store.setState({ patientQueueUuid: currentPatientQueueUuid });
};

// Patient Queue stores
export function getPatientQueueWaitingList() {
  return getGlobalStore<{ queue: PatientQueue[] }>('patientQueueWaitingList', { queue: [] });
}
export const updatePatientQueueWaitingList = (queue: PatientQueue[]) => {
  const store = getPatientQueueWaitingList();
  store.setState({ queue });
};
