import useSWR from 'swr';
import groupBy from 'lodash/groupBy';
import { openmrsFetch } from '@openmrs/esm-framework';
import { Result } from './useCarePrograms';

export const useEnrollmentHistory = (patientUuid: string) => {
  const enrollmentHistoryUrl = `/ws/rest/v1/programenrollment?patient=${patientUuid}&v=full`;
  const { data, isValidating, error, isLoading } = useSWR<{ data: { results: Array<Result> } }, Error>(
    enrollmentHistoryUrl,
    openmrsFetch,
  );

  return {
    error: error,
    isLoading: isLoading,
    enrollments: data?.data.results ?? [],
    isValidating,
  };
};
