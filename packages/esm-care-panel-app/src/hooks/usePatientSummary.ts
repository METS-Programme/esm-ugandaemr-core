import { openmrsFetch } from '@openmrs/esm-framework';
import useSWR from 'swr';
import { PatientSummary } from '../types/index';


export interface Result {
  uuid: string
  name: string 
  links: Link[]
}
 

export interface Link {
  rel: string
  uri: string
  resourceAlias: string
}

 

export const usePatientSummary = (patientUuid: string) => {
  const programSummaryUrl = `/ws/rest/v1/program`;
  const { data, mutate, error, isLoading } = useSWR<{ data: Array<Result> }>(programSummaryUrl, openmrsFetch);

  return {
    data: data?.data ? data?.data : null,
    isError: error,
    isLoading: isLoading,
  };
};
