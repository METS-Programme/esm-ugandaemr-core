import { getGlobalStore } from '@openmrs/esm-framework';
import { useEffect, useState } from 'react';
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

export const useSelectedPatientQueueUuid = () => {
  const [currentPatientQueueUuid, setCurrentPatientQueueUuid] = useState(initialPatientQueueUuidState.patientQueueUuid);

  useEffect(() => {
    getSelectedPatientQueueUuid().subscribe(({ patientQueueUuid }) => setCurrentPatientQueueUuid(patientQueueUuid));
  }, []);
  return currentPatientQueueUuid;
};



// facility
const initialFacilityNameState = { facilityName: localStorage.getItem('facilityName') };
const initialFacilityIdentifierState = { facilityIdentifier: localStorage.getItem('facilityIdentifier') };

export function getSelectedFacilityName() {
  return getGlobalStore<{ facilityName: string }>('facilityName', initialFacilityNameState);
}

export function getSelectedFacilityIdentifier() {
  return getGlobalStore<{ facilityIdentifier: string }>('facilityIdentifier', initialFacilityIdentifierState);
}

export const updateSelectedFacilityName = (currentFacilityName: string) => {
  const store = getSelectedFacilityName();
  store.setState({ facilityName: currentFacilityName });
};

export const updateSelectedFacilityIdentifier = (currentFacilityIdentifier: string) => {
  const store = getSelectedFacilityIdentifier();
  store.setState({ facilityIdentifier: currentFacilityIdentifier });
};

export const useSelectedFacilityName = () => {
  const [currentFacilityName, setCurrentFacilityName] = useState(initialFacilityNameState.facilityName);

  useEffect(() => {
    getSelectedFacilityName().subscribe(({ facilityName }) => setCurrentFacilityName(facilityName));
  }, []);
  return currentFacilityName;
};

export const useSelectedFacilityIdentifier = () => {
  const [currentFacilityIdentifier, setCurrentFacilityIdentifier] = useState(
    initialFacilityIdentifierState.facilityIdentifier,
  );

  useEffect(() => {
    getSelectedFacilityIdentifier().subscribe(({ facilityIdentifier }) =>
      setCurrentFacilityIdentifier(facilityIdentifier),
    );
  }, []);
  return currentFacilityIdentifier;
};

// patient 
const initialSelectedPatientUuid = { patientUuid: localStorage.getItem('patientUuid') };

export function getSelectedPatientUuid() {
  return getGlobalStore<{ patientUuid: string }>('patientUuid', initialSelectedPatientUuid);
}

export const updateSelectedPatientUuid = (currentPatientUuid: string) => {
  const store = getSelectedPatientUuid();
  store.setState({ patientUuid: currentPatientUuid });
};

export const useSelectedPatientUuid = () => {
  const [currentPatientUuid, setCurrentPatientUuid] = useState(initialSelectedPatientUuid.patientUuid);

  useEffect(() => {
    getSelectedPatientUuid().subscribe(({ patientUuid }) => setCurrentPatientUuid(patientUuid));
  }, []);
  return currentPatientUuid;
};


// Patient Queue stores
export function getPatientQueueWaitingList() {
  return getGlobalStore<{ queue: PatientQueue[] }>('patientQueueWaitingList', { queue: [] });
}
export const updatePatientQueueWaitingList = (queue: PatientQueue[]) => {
  const store = getPatientQueueWaitingList();
  store.setState({ queue });
};
