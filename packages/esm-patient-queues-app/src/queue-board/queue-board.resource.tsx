import { usePatientQueueRequest } from '../active-visits/patient-queues.resource';
import { QueueRoomsResponse, useQueueRoomLocations } from '../hooks/useQueueRooms';
import useSWR from 'swr';
import { openmrsFetch, useSession } from '@openmrs/esm-framework';
import { PatientQueue } from '../types/patient-queues';
import { useEffect, useState } from 'react';

export function usePatientQueuesListByStatus(status: string) {
  const apiUrl = `/ws/rest/v1/patientqueue?v=full&status=${status}`;
  return usePatientQueueRequest(apiUrl);
}

export function usePatientQueuesByParentLocation(status: string) {
  const session = useSession();
  const locationUuid = session?.sessionLocation?.uuid;

  const locationApiUrl = locationUuid ? `/ws/rest/v1/location/${locationUuid}?v=full` : null;
  const {
    data: queueRoomsData,
    error: queueRoomError,
    isLoading: queueRoomLoading,
  } = useSWR<{
    data: QueueRoomsResponse;
  }>(locationApiUrl, openmrsFetch);

  const parentLocationUuid = queueRoomsData?.data?.parentLocation?.uuid;

  const queueApiUrl = parentLocationUuid
    ? `/ws/rest/v1/patientqueue?status=${status}&parentLocation=${queueRoomsData?.data?.parentLocation?.uuid}`
    : null;

  const {
    data,
    error: patientQueueErrors,
    isLoading: patientQueueLoading,
  } = useSWR<{
    data: { results: Array<PatientQueue> };
  }>(queueApiUrl, openmrsFetch, { refreshInterval: 20000 });

  return {
    isLoading: patientQueueLoading || queueRoomLoading,
    isError: patientQueueErrors || queueRoomError,
    patientQueues: data?.data?.results,
  };
}

export function usePatientQueueBoard() {
  const {
    patientQueues: pending,
    isLoading: loadingPending,
    isError: errorPending,
  } = usePatientQueuesByParentLocation('pending');

  const {
    patientQueues: picked,
    isLoading: loadingPicked,
    isError: errorPicked,
  } = usePatientQueuesByParentLocation('picked');

  return {
    isLoading: loadingPending || loadingPicked,
    isError: errorPending || errorPicked,
    pending,
    picked,
  };
}
