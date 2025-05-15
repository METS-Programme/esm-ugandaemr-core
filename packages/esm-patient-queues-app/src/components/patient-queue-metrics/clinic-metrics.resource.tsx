import useSWR from 'swr';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { PatientQueue } from '../../types/patient-queues';
import { getMetrics } from './clinic-metrics.component';
import { Value } from '../../summary-tiles/summary-tile.component';
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
