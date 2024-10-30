import useSWR from 'swr';
import { formatDate, openmrsFetch, parseDate, restBaseUrl } from '@openmrs/esm-framework';
import { PatientQueue } from '../../types/patient-queues';
import dayjs from 'dayjs';

export function usePatientQueuesList(currentQueueLocationUuid: string, status: string, isToggled: boolean) {
  const url = !isToggled
    ? `${restBaseUrl}/patientqueue?v=full&status=${status}&parentLocation=${currentQueueLocationUuid}`
    : `${restBaseUrl}/patientqueue?v=full&status=${status}`;

  return usePatientQueueRequest(url);
}

export function usePatientQueueRequest(apiUrl: string) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: Array<PatientQueue> } }, Error>(
    apiUrl,
    openmrsFetch,
    { refreshInterval: 3000 },
  );

  const mapppedQueues = data?.data?.results.map((queue: PatientQueue) => {
    return {
      ...queue,
      id: queue.uuid,
      name: queue.patient?.person.display,
      patientUuid: queue.patient?.uuid,
      provider: queue.provider?.person.display,
      priorityComment: queue.priorityComment,
      priority: queue.priorityComment === 'Urgent' ? 'Priority' : queue.priorityComment,
      priorityLevel: queue.priority,
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
      locationToName: queue.locationTo?.name,
      queueRoom: queue.locationTo?.display,
      locationTags: queue.queueRoom?.tags,
      visitNumber: queue.visitNumber,
      dateCreated: queue.dateCreated,
      creatorUuid: queue.creator?.uuid,
      creatorUsername: queue.creator?.username,
      creatorDisplay: queue.creator?.display,
    };
  });

  return {
    patientQueueEntries: mapppedQueues || [],
    patientQueueCount: mapppedQueues?.length,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
}

export function getLocationByUuid(uuid: string) {
  const abortController = new AbortController();
  const url = `${restBaseUrl}/location/${uuid}`;
  return openmrsFetch(url, {
    method: 'GET',
    signal: abortController.signal,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
