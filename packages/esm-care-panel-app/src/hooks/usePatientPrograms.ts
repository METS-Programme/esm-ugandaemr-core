import useSWR from 'swr';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { configSchema } from '../config-schema';

export interface patientProgramResponse {
  uuid: string;
  display: string;
  program: {
    uuid: string;
    name: string;
    description: string;
  };
}

export const usePatientPrograms = (patientUuid: string) => {
  const apiUrl = `${restBaseUrl}/programenrollment/?patient=${patientUuid}&v=full`;
  const { data, isValidating, error, isLoading } = useSWR<{ data: { results: Array<patientProgramResponse> } }>(
    apiUrl,
    openmrsFetch,
  );
  const hivTbUuids = [configSchema.hivProgramUuid._default, configSchema.tbProgramUuid._default];

  const filteredPrograms =
    data?.data?.results.filter((enrollment) => hivTbUuids.includes(enrollment.program.uuid)) ?? [];
  return {
    error: error,
    isLoading: isLoading,
    enrollments: filteredPrograms,
    isValidating,
  };
};
