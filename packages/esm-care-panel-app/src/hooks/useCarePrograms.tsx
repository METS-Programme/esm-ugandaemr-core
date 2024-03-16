import { openmrsFetch } from '@openmrs/esm-framework';
import useSWR from 'swr';

export type PatientCarePrograms = {
  uuid: string;
  display: string;
  enrollmentFormUuid: string;
  enrollmentStatus: string;
  discontinuationFormUuid: string;
  enrollmentDetails?: { uuid: string; dateCompleted: string; location: string; dateEnrolled: string };
};

export const useCarePrograms = (patientUuid: string) => {
  const url = `/ws/rest/v1/ugandaemr/patientCohorts?patientUuid=${patientUuid}`;
  const { data, error, isLoading, isValidating } = useSWR<{ data: Array<PatientCarePrograms> }>(url, openmrsFetch);

  return {
    carePrograms: data?.data?.filter((careProgram) => careProgram.enrollmentStatus !== 'active') ?? [],
    error,
    isLoading,
    isValidating,
  };
};
