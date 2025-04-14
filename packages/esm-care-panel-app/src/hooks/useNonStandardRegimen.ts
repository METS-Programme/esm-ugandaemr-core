import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';

interface nonStandardRegimen {
  name: string;
  uuid: string;
}

export const useNonStandardRegimen = () => {
  const nonStandardRegimenUrl = `${restBaseUrl}/ugandemr/arvDrugs`;
  const { data, error, isLoading } = useSWR<{ data: { results: Array<nonStandardRegimen> } }>(
    nonStandardRegimenUrl,
    openmrsFetch,
  );

  const nonStandardRegimen = data?.data?.results ? data?.data?.results : [];
  return { nonStandardRegimen, isLoading, error };
};
