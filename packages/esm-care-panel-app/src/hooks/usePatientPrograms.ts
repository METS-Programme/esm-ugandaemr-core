import useSWR from 'swr';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { configSchema } from '../config-schema';

export interface Concept {
  uuid: string;
  display: string;
}

export interface Program {
  uuid: string;
  name: string;
  description: string;
  concept: Concept;
}

export interface PatientProgramResponse {
  uuid: string;
  display: string;
  program: Program;
  dateEnrolled: string;
  dateCompleted: string;
}

export const usePatientPrograms = (patientUuid: string) => {
  const apiUrl = `${restBaseUrl}/programenrollment/?patient=${patientUuid}&v=full`;
  const { data, isValidating, error, isLoading } = useSWR<{ data: { results: Array<PatientProgramResponse> } }>(
    apiUrl,
    openmrsFetch,
  );
  const hivTbUuids = [configSchema.hivProgramUuid._default, configSchema.tbProgramUuid._default];

  const dsdmUuids = [
    configSchema.ccladUuid._default,
    configSchema.cddpUuid._default,
    configSchema.fbgUuid._default,
    configSchema.fbimUuid._default,
    configSchema.ftdrUuid._default,
  ];

  const filteredPrograms =
    data?.data?.results.filter((enrollment) => hivTbUuids.includes(enrollment.program.uuid)) ?? [];

  const filteredDSDModels = data?.data?.results.filter((model) => dsdmUuids.includes(model.program.concept.uuid) ?? []);

  return {
    error: error,
    isLoading: isLoading,
    enrollments: filteredPrograms,
    dsdmModels: filteredDSDModels,
    isValidating,
  };
};
