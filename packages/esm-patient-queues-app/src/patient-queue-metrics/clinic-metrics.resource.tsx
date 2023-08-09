import { Visit, formatDate, openmrsFetch, parseDate, useSession } from '@openmrs/esm-framework';

import dayjs from 'dayjs';
import useSWR from 'swr';
import { WaitTime } from '../types';
import { PatientQueue } from '../types/patient-queues';

export function useActiveVisits() {
  const currentUserSession = useSession();
  const startDate = dayjs().format('YYYY-MM-DD');
  const sessionLocation = currentUserSession?.sessionLocation?.uuid;

  const customRepresentation =
    'custom:(uuid,patient:(uuid,identifiers:(identifier,uuid),person:(age,display,gender,uuid)),' +
    'visitType:(uuid,name,display),location:(uuid,name,display),startDatetime,' +
    'stopDatetime)&fromStartDate=' +
    startDate +
    '&location=' +
    sessionLocation;
  const url = `/ws/rest/v1/visit?includeInactive=false&v=${customRepresentation}`;
  const { data, error, isLoading, isValidating } = useSWR<{ data: { results: Array<Visit> } }, Error>(
    sessionLocation ? url : null,
    openmrsFetch,
  );

  const activeVisitsCount = data?.data?.results.length
    ? data.data.results.filter((visit) => dayjs(visit.startDatetime).isToday())?.length
    : 0;

  return {
    activeVisitsCount: activeVisitsCount,
    isLoading,
    isError: error,
    isValidating,
  };
}

export function useAverageWaitTime(serviceUuid: string, statusUuid: string) {
  const apiUrl = `/ws/rest/v1/queue-metrics?queue=${serviceUuid}&status=${statusUuid}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: WaitTime }, Error>(
    serviceUuid && statusUuid ? apiUrl : null,
    openmrsFetch,
  );

  return {
    waitTime: data ? data?.data : null,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
}

export function usePatientsServed(
  currentQueueRoomLocationUuid: string,
  currentQueueLocationUuid: string,
  status: string,
) {
  const apiUrl = `/ws/rest/v1/patientqueue?v=full&location=${currentQueueLocationUuid}&room=${currentQueueRoomLocationUuid}&status=${status}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: Array<PatientQueue> } }, Error>(
    apiUrl,
    openmrsFetch,
  );

  const mapppedQueues = data?.data?.results.map((queue: PatientQueue) => {
    return {
      ...queue,
      id: queue.uuid,
      name: queue.patient?.person.display,
      patientUuid: queue.patient?.uuid,
      priorityComment: queue.priorityComment,
      priority: queue.priorityComment === 'Urgent' ? 'Priority' : queue.priorityComment,
      waitTime: queue.dateCreated ? `${dayjs().diff(dayjs(queue.dateCreated), 'minutes')}` : '--',
      status: queue.status,
      patientAge: queue.patient?.person?.age,
      patientSex: queue.patient?.person?.gender === 'M' ? 'MALE' : 'FEMALE',
      patientDob: queue.patient?.person?.birthdate
        ? formatDate(parseDate(queue.patient.person.birthdate), { time: false })
        : '--',
      identifiers: queue.patient?.identifiers,
      locationFrom: queue.locationFrom?.uuid,
      locationTo: queue.locationTo?.uuid,
      queueRoom: queue.locationTo?.display,
      visitNumber: queue.visitNumber,
    };
  });

  return {
    servedQueuePatients: mapppedQueues || [],
    servedCount: mapppedQueues?.length,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
}

export function usePatientsBeingServed(
  currentQueueRoomLocationUuid: string,
  currentQueueLocationUuid: string,
  status: string,
) {
  const apiUrl = `/ws/rest/v1/patientqueue?v=full&location=${currentQueueLocationUuid}&room=${currentQueueRoomLocationUuid}&status=${status}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: Array<PatientQueue> } }, Error>(
    apiUrl,
    openmrsFetch,
  );

  const mapppedQueues = data?.data?.results.map((queue: PatientQueue) => {
    return {
      ...queue,
      id: queue.uuid,
      name: queue.patient?.person.display,
      patientUuid: queue.patient?.uuid,
      priorityComment: queue.priorityComment,
      priority: queue.priorityComment === 'Urgent' ? 'Priority' : queue.priorityComment,
      waitTime: queue.dateCreated ? `${dayjs().diff(dayjs(queue.dateCreated), 'minutes')}` : '--',
      status: queue.status,
      patientAge: queue.patient?.person?.age,
      patientSex: queue.patient?.person?.gender === 'M' ? 'MALE' : 'FEMALE',
      patientDob: queue.patient?.person?.birthdate
        ? formatDate(parseDate(queue.patient.person.birthdate), { time: false })
        : '--',
      identifiers: queue.patient?.identifiers,
      locationFrom: queue.locationFrom?.uuid,
      locationTo: queue.locationTo?.uuid,
      queueRoom: queue.locationTo?.display,
      visitNumber: queue.visitNumber,
    };
  });

  return {
    patientQueueCount: mapppedQueues?.length,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
}
