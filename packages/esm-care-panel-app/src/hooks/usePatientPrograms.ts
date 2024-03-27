import useSWR from 'swr';
import { openmrsFetch } from '@openmrs/esm-framework';

export interface patientProgramResponse {
  uuid: string;
  display: string;
}

export const usePatientPrograms = (patientUuid: string) => {
  const enrollmentHistoryUrl = `/ws/rest/v1/programenrollment/?patient=${patientUuid}`;
  const { data, isValidating, error, isLoading } = useSWR<{ data: { results: Array<patientProgramResponse> } }>(
    enrollmentHistoryUrl,
    openmrsFetch,
  );
  return {
    error: error,
    isLoading: isLoading,
    enrollments: data?.data?.results ?? [],
    isValidating,
  };
};
