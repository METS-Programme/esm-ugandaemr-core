import { openmrsFetch } from '@openmrs/esm-framework';
import useSWR from 'swr';

export const useEnrollmentHistory = (patientUuid: string) => {
  const enrollmentHistoryUrl = `/ws/rest/v1/ugandaemr/patientHistoricalEnrollment?patientUuid=${patientUuid}`;
  const { data, isValidating, error, isLoading } = useSWR<{ data: Array<Record<string, any>> }>(
    enrollmentHistoryUrl,
    openmrsFetch,
  );

  return {
    error: error,
    isLoading: isLoading,
    enrollments: data?.data ?? [],
    isValidating,
  };
};
