import useSWR from 'swr';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { configSchema } from '../config-schema';

export interface PatientProgramResponse {
  uuid: string;
  program: Program;
  dateEnrolled: string;
  dateCompleted: string;
  states: State[];
}

export interface Program {
  uuid: string;
  name: string;
}

export interface State {
  state: StateDetail;
  startDate: string;
  endDate: string;
}

export interface StateDetail {
  concept: Concept;
}

export interface Concept {
  uuid: string;
  display: string;
}

export const usePatientPrograms = (patientUuid: string) => {
  const apiUrl = `${restBaseUrl}/programenrollment/?patient=${patientUuid}&v=custom:(uuid,program:(uuid,name,allWorkflows:(uuid,states:(uuid,concept.name.name,),concept.name.name)),location:(uuid,name),attributes:(uuid,attributeType:(uuid,display),value:(uuid,name.name)),dateEnrolled,dateCompleted,states:(state:(concept),startDate,endDate,voided),outcome)`;
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
    configSchema.crpddpUuid._default,
  ];

  const filteredPrograms =
    data?.data?.results.filter((enrollment) => hivTbUuids.includes(enrollment.program.uuid)) ?? [];

  const filteredDSDModels =
    data?.data?.results.flatMap((enrollment) =>
      enrollment.states.filter((state) => dsdmUuids.includes(state.state.concept.uuid)),
    ) ?? [];

  return {
    error: error,
    isLoading: isLoading,
    enrollments: filteredPrograms,
    dsdmModels: filteredDSDModels,
    isValidating,
  };
};

export const getAcronym = (text) => {
  if (!text) return '';
  return text
    .split(' ')
    .map((word) => word[0])
    .join('');
};
