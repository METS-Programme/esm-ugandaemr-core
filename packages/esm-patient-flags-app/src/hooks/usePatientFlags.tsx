import { openmrsFetch } from '@openmrs/esm-framework';
import useSWR from 'swr';

export interface Result {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Link {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export const usePatientFlags = (patientUuid: string) => {
  const patientFlagsUrl = `/ws/rest/v1/patientflags/patientflag?patient=${patientUuid}`;
  const { data, error, isLoading } = useSWR<{ data: { results: Array<Result> } }, Error>(patientFlagsUrl, openmrsFetch);
  const patientFlags = typeof data?.data === 'string' ? [] : (data?.data?.results ?? []);
  return { patientFlags, isLoading, error };
};
