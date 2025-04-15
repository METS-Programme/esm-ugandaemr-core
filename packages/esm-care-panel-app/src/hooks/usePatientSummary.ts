import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';
import { PatientSummary } from '../types/index';

export const usePatientSummary = (patientUuid: string) => {
  const programSummaryUrl = `${restBaseUrl}/patientSummary?patientUuid=${patientUuid}`;
  const { data, error, isLoading } = useSWR<{ data: PatientSummary }>(programSummaryUrl, openmrsFetch);

  return {
    data: data?.data ? data?.data : null,
    isError: error,
    isLoading: isLoading,
  };
};
