import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';

interface PatientRegimenReturnType {
  patientRegimen: RegimenHistory;
  isLoading: boolean;
  error: Error;
}

interface RegimenHistory {
  startDate: string;
  endDate: string;
  regimenShortDisplay: string;
  regimenLine: string;
  regimenLongDisplay: string;
  changeReasons: Array<string>;
  regimenUuid: string;
  current: boolean;
}

export const useRegimenHistory = (patientUuid: string, category: string) => {
  const regimenHistoryHistoryUrl = `${restBaseUrl}/ugandaemr/regimenHistory?patientUuid=${patientUuid}&category=${category}`;
  const { data, error, isLoading } = useSWR<{ data: { results: Array<RegimenHistory> } }>(
    regimenHistoryHistoryUrl,
    openmrsFetch,
  );

  const regimen = data?.data?.results ? data?.data?.results : [];
  return { regimen, isLoading, error };
};
