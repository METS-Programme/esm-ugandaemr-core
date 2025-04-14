import useSWR from 'swr';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';

export type PatientCarePrograms = {
  uuid: string;
  display: string;
  enrollmentFormUuid: string;
  enrollmentStatus: string;
  discontinuationFormUuid: string;
  enrollmentDetails?: { uuid: string; dateCompleted: string; location: string; dateEnrolled: string };
};

export interface ProgramEnrollmentProps {
  patientUuid: string;
  programName: string;
  enrollments: Array<any>;
  formEntrySub: any;
  launchPatientWorkspace: Function;
  PatientChartProps: string;
}

export const useCarePrograms = (patientUuid: string) => {
  const url = `${restBaseUrl}/ugandaemr/patientCohorts?patientUuid=${patientUuid}`;
  const { data, error, isLoading, isValidating } = useSWR<{ data: Array<PatientCarePrograms> }>(url, openmrsFetch);

  return {
    carePrograms: data?.data?.filter((careProgram) => careProgram.enrollmentStatus !== 'active') ?? [],
    error,
    isLoading,
    isValidating,
  };
};
