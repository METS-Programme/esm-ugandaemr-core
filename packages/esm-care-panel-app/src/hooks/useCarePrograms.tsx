import useSWR from 'swr';
import { openmrsFetch } from '@openmrs/esm-framework';


export interface Result {
  uuid: string
  name: string
  allWorkflows: AllWorkflow[]
  links: Link[]
}

export interface AllWorkflow {
  uuid: string
  concept: Concept
  retired: boolean
  states: State[]
  links: Link[]
}

export interface Concept {
  uuid: string
  display: string
  links: Link[]
}

export interface Link {
  rel: string
  uri: string
  resourceAlias: string
}

export interface State {
  uuid: string
  retired: boolean
  concept: Concept2
  links: Link[]
}

export interface Concept2 {
  uuid: string
  display: string
  links: Link[]
}


export const useCarePrograms = (patientUuid: string) => {
  const url = `/ws/rest/v1/program`;
  const { data, error, isLoading, isValidating } =   useSWR<{ data: { results: Array<Result> } }, Error>(
    url,
    openmrsFetch,
  );

  console.log("careProgrames: " + data?.data?.results);

  return {
    carePrograms: data?.data.results ?? [],
    error,
    isLoading,
    isValidating,
  };
};