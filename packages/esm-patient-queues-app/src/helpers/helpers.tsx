import { getGlobalStore } from '@openmrs/esm-framework';
import { useEffect, useState } from 'react';
import { AppointmentSummary } from '../types';
import { PatientQueue } from '../types/patient-queues';

export const getServiceCountByAppointmentType = (
  appointmentSummary: Array<AppointmentSummary>,
  appointmentType: string,
) => {
  return appointmentSummary
    .map((el) => Object.entries(el.appointmentCountMap).flatMap((el) => el[1][appointmentType]))
    .flat(1)
    .reduce((count, val) => count + val, 0);
};

const initialServiceNameState = { serviceName: localStorage.getItem('queueServiceName') };
const initialServiceUuidState = { serviceUuid: localStorage.getItem('queueServiceUuid') };
const intialStatusNameState = { status: '' };
const initialQueueLocationNameState = { queueLocationName: localStorage.getItem('queueLocationName') };
const initialQueueLocationUuidState = { queueLocationUuid: localStorage.getItem('queueLocationUuid') };
const initialSelectedQueueRoomTimestamp = { providerQueueRoomTimestamp: new Date() };
const initialPermanentProviderQueueRoomState = {
  isPermanentProviderQueueRoom: localStorage.getItem('isPermanentProviderQueueRoom'),
};

// queue room
const initialQueueRoomLocationNameState = { queueRoomLocationName: localStorage.getItem('queueRoomLocationName') };
const initialQueueRoomLocationUuidState = { queueRoomLocationUuid: localStorage.getItem('queueRoomLocationUuid') };

export function getSelectedQueueRoomLocationName() {
  return getGlobalStore<{ queueRoomLocationName: string }>('queueRoomLocationName', initialQueueRoomLocationNameState);
}

export function getSelectedQueueRoomLocationUuid() {
  return getGlobalStore<{ queueRoomLocationUuid: string }>('queueRoomLocationUuid', initialQueueRoomLocationUuidState);
}

export const updateSelectedQueueRoomLocationName = (currentQueueRoomLocationName: string) => {
  const store = getSelectedQueueRoomLocationName();
  store.setState({ queueRoomLocationName: currentQueueRoomLocationName });
};

export const updateSelectedQueueRoomLocationUuid = (currentQueueRoomLocationUuid: string) => {
  const store = getSelectedQueueRoomLocationUuid();
  store.setState({ queueRoomLocationUuid: currentQueueRoomLocationUuid });
};

export const useSelectedQueueRoomLocationName = () => {
  const [currentQueueRoomLocationName, setCurrentQueueRoomLocationName] = useState(
    initialQueueRoomLocationNameState.queueRoomLocationName,
  );

  useEffect(() => {
    getSelectedQueueRoomLocationName().subscribe(({ queueRoomLocationName }) =>
      setCurrentQueueRoomLocationName(queueRoomLocationName),
    );
  }, []);
  return currentQueueRoomLocationName;
};

export const useSelectedQueueRoomLocationUuid = () => {
  const [currentQueueRoomLocationUuid, setCurrentQueueRoomLocationUuid] = useState(
    initialQueueRoomLocationUuidState.queueRoomLocationUuid,
  );

  useEffect(() => {
    getSelectedQueueRoomLocationUuid().subscribe(({ queueRoomLocationUuid }) =>
      setCurrentQueueRoomLocationUuid(queueRoomLocationUuid),
    );
  }, []);
  return currentQueueRoomLocationUuid;
};

//

export function getSelectedServiceName() {
  return getGlobalStore<{ serviceName: string }>('queueSelectedServiceName', initialServiceNameState);
}

export function getSelectedServiceUuid() {
  return getGlobalStore<{ serviceUuid: string }>('queueSelectedServiceUuid', initialServiceUuidState);
}

export function getSelectedAppointmentStatus() {
  return getGlobalStore<{ status: string }>('appointmentSelectedStatus', intialStatusNameState);
}

export function getSelectedQueueLocationName() {
  return getGlobalStore<{ queueLocationName: string }>('queueLocationNameSelected', initialQueueLocationNameState);
}

export function getSelectedQueueLocationUuid() {
  return getGlobalStore<{ queueLocationUuid: string }>('queueLocationUuidSelected', initialQueueLocationUuidState);
}

export function getPatientQueueWaitingList() {
  return getGlobalStore<{ queue: PatientQueue[] }>('patientQueueWaitingList', { queue: [] });
}

export function getSelectedQueueRoomTimestamp() {
  return getGlobalStore<{ providerQueueRoomTimestamp: Date }>(
    'queueProviderRoomTimestamp',
    initialSelectedQueueRoomTimestamp,
  );
}

export function getIsPermanentProviderQueueRoom() {
  return getGlobalStore<{ isPermanentProviderQueueRoom: string }>(
    'isPermanentProviderQueueRoom',
    initialPermanentProviderQueueRoomState,
  );
}

export const updateSelectedServiceName = (currentServiceName: string) => {
  const store = getSelectedServiceName();
  store.setState({ serviceName: currentServiceName });
};

export const updateSelectedServiceUuid = (currentServiceUuid: string) => {
  const store = getSelectedServiceUuid();
  store.setState({ serviceUuid: currentServiceUuid });
};

export const updateSelectedAppointmentStatus = (currentAppointmentStatus: string) => {
  const store = getSelectedAppointmentStatus();
  store.setState({ status: currentAppointmentStatus });
};

export const updateSelectedQueueLocationName = (currentLocationName: string) => {
  const store = getSelectedQueueLocationName();
  store.setState({ queueLocationName: currentLocationName });
};

export const updateSelectedQueueLocationUuid = (currentLocationUuid: string) => {
  const store = getSelectedQueueLocationUuid();
  store.setState({ queueLocationUuid: currentLocationUuid });
};

export const updatedSelectedQueueRoomTimestamp = (currentProviderRoomTimestamp: Date) => {
  const store = getSelectedQueueRoomTimestamp();
  store.setState({ providerQueueRoomTimestamp: currentProviderRoomTimestamp });
};

export const updateIsPermanentProviderQueueRoom = (currentIsPermanentProviderQueueRoom) => {
  const store = getIsPermanentProviderQueueRoom();
  store.setState({ isPermanentProviderQueueRoom: currentIsPermanentProviderQueueRoom });
};

export const useSelectedServiceName = () => {
  const [currentServiceName, setCurrentServiceName] = useState(initialServiceNameState.serviceName);

  useEffect(() => {
    getSelectedServiceName().subscribe(({ serviceName }) => setCurrentServiceName(serviceName));
  }, []);
  return currentServiceName;
};

export const useSelectedServiceUuid = () => {
  const [currentServiceUuid, setCurrentServiceUuid] = useState(initialServiceUuidState.serviceUuid);

  useEffect(() => {
    getSelectedServiceUuid().subscribe(({ serviceUuid }) => setCurrentServiceUuid(serviceUuid));
  }, []);
  return currentServiceUuid;
};

export const useSelectedAppointmentStatus = () => {
  const [currentAppointmentStatus, setCurrentAppointmentStatus] = useState(intialStatusNameState.status);

  useEffect(() => {
    getSelectedAppointmentStatus().subscribe(({ status }) => setCurrentAppointmentStatus(status));
  }, []);
  return currentAppointmentStatus;
};

export const useSelectedQueueLocationName = () => {
  const [currentQueueLocationName, setCurrentQueueLocationName] = useState(
    initialQueueLocationNameState.queueLocationName,
  );

  useEffect(() => {
    getSelectedQueueLocationName().subscribe(({ queueLocationName }) => setCurrentQueueLocationName(queueLocationName));
  }, []);
  return currentQueueLocationName;
};

export const useSelectedQueueLocationUuid = () => {
  const [currentQueueLocationUuid, setCurrentQueueLocationUuid] = useState(
    initialQueueLocationUuidState.queueLocationUuid,
  );

  useEffect(() => {
    getSelectedQueueLocationUuid().subscribe(({ queueLocationUuid }) => setCurrentQueueLocationUuid(queueLocationUuid));
  }, []);
  return currentQueueLocationUuid;
};

export const useSelectedProviderRoomTimestamp = () => {
  const [currentProviderRoomTimestamp, setCurrentProviderRoomTimestamp] = useState(
    initialSelectedQueueRoomTimestamp.providerQueueRoomTimestamp,
  );

  useEffect(() => {
    getSelectedQueueRoomTimestamp().subscribe(({ providerQueueRoomTimestamp }) =>
      setCurrentProviderRoomTimestamp(providerQueueRoomTimestamp),
    );
  }, []);
  return currentProviderRoomTimestamp;
};

export const useIsPermanentProviderQueueRoom = () => {
  const [currentIsPermanentProviderQueueRoom, setCurrentIsPermanentProviderQueueRoom] = useState(
    initialPermanentProviderQueueRoomState.isPermanentProviderQueueRoom,
  );

  useEffect(() => {
    getIsPermanentProviderQueueRoom().subscribe(({ isPermanentProviderQueueRoom }) =>
      setCurrentIsPermanentProviderQueueRoom(isPermanentProviderQueueRoom),
    );
  }, []);
  return currentIsPermanentProviderQueueRoom;
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

// Patient Queue stores
export const updatePatientQueueWaitingList = (queue: PatientQueue[]) => {
  const store = getPatientQueueWaitingList();
  store.setState({ queue });
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
