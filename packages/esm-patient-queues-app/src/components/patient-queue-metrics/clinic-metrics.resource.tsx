import dayjs from 'dayjs';
import useSWR from 'swr';
import { formatDate, openmrsFetch, parseDate, getGlobalStore, restBaseUrl } from '@openmrs/esm-framework';
import { PatientQueue } from '../../types/patient-queues';
import { Value } from './metrics-card.component';
import { getMetrics } from './clinic-metrics.component';

export function usePatientsServed(currentQueueLocationUuid: string, status: string) {
  const apiUrl = `${restBaseUrl}/patientqueue?v=full&room=${currentQueueLocationUuid}&status=${status}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: Array<PatientQueue> } }, Error>(
    apiUrl,
    openmrsFetch,
  );

  const mapppedQueues = data?.data?.results?.map((queue: PatientQueue) => {
    return {
      ...queue,
      id: queue.uuid,
      name: queue.patient?.person.display,
      patientUuid: queue.patient?.uuid,
      priorityComment: queue.priorityComment,
      provider: queue.provider?.identifier,
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
    servedQueuePatients: mapppedQueues,
    servedCount: mapppedQueues?.length,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
}

// get Queue Item
export function usePatientBeingServed(currentQueueLocationUuid: string, status: string) {
  const apiUrl = `${restBaseUrl}/patientqueue?v=full&location=${currentQueueLocationUuid}&status=${status}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: Array<PatientQueue> } }, Error>(
    apiUrl,
    openmrsFetch,
  );

  return {
    data: data.data,
    isLoading,
    isError: error,
  };
}

export function usePatientsBeingServed(currentQueueLocationUuid: string, status: string, loggedInProviderUuid: string) {
  const apiUrl = `${restBaseUrl}/patientqueue?v=full&location=${currentQueueLocationUuid}&status=${status}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: Array<PatientQueue> } }, Error>(
    apiUrl,
    openmrsFetch,
  );

  const filteredQueues = data?.data?.results.filter(
    (queue: PatientQueue) => queue.provider?.person.display === loggedInProviderUuid,
  );

  const mapppedQueues = filteredQueues?.map((queue: PatientQueue) => {
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

// overall checked in patients
export function useQueuePatients(status: string) {
  const apiUrl = `${restBaseUrl}/patientqueue?v=full&status=${status}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: Array<PatientQueue> } }, Error>(
    apiUrl,
    openmrsFetch,
  );

  return {
    count: data?.data.results?.length,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
}

// overall being served patients
export function useQueueServingPatients(status: string) {
  const apiUrl = `${restBaseUrl}/patientqueue?v=full&status=${status}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: Array<PatientQueue> } }, Error>(
    apiUrl,
    openmrsFetch,
  );

  return {
    patientQueueCount: data?.data.results?.length,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
}

export interface PatientStats {
  locationTag: LocationTag;
  pending: number;
  serving: number;
  completed: number;
  links: Link[];
}

export interface LocationTag {
  uuid: string;
  display: string;
  name: string;
  description: string;
  retired: boolean;
  links: Link[];
  resourceVersion: string;
}

export interface Link {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export function useServicePointCount(parentLocation: string, beforeDate: String, afterDate: String) {
  const apiUrl = `${restBaseUrl}/queuestatistics?parentLocation=${parentLocation}&toDate=${afterDate}&fromDate=${beforeDate}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: Array<PatientStats> } }, Error>(
    apiUrl,
    openmrsFetch,
  );

  const servicePoints = ['Triage', 'Clinical Room', 'Laboratory', 'Radiology', 'Main Pharmacy'];
  let patientStatsArray: Array<Value> = [];

  servicePoints.map((servicePoint) => {
    patientStatsArray.push(getMetrics(servicePoint, data?.data?.results));
  });

  return {
    stats: patientStatsArray,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
}
