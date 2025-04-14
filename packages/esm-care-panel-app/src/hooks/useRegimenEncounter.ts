import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';
import { RegimenEncounter } from '../types';

export const useRegimenEncounter = (category: string, patientUuid: string) => {
  const regimenEncounterUrl = `${restBaseUrl}/ugandaemr/lastRegimenEncounter?patientUuid=${patientUuid}&category=${category}`;
  const { data, error, isLoading } = useSWR<{ data: { results } }>(regimenEncounterUrl, openmrsFetch);

  const regimenEncounter = data?.data?.results ? data?.data?.results : '';
  return { regimenEncounter, isLoading, error };
};
