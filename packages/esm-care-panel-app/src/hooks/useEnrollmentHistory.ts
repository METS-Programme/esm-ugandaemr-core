import useSWR from 'swr';
import { openmrsFetch } from '@openmrs/esm-framework';

export const useEnrollmentHistory = (patientUuid: string) => {
  const enrollmentHistoryUrl = `/ws/rest/v1/programenrollment/?patient=${patientUuid}`;
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
