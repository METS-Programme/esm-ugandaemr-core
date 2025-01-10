import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';
import { ProviderResponse } from '../../types';


// fetch providers of a service point
export function useProviders() {
  const apiUrl = `${restBaseUrl}/provider?q=&v=full`;
  const { data, error, isLoading, isValidating } = useSWR<{ data: { results: Array<ProviderResponse> } }, Error>(
    apiUrl,
    openmrsFetch,
  );

  return {
    providers: data ? data.data?.results : [],
    isLoading,
    isError: error,
    isValidating,
  };
}

export async function getCurrentPatientQueueByPatientUuid(patientUuid: string, currentLocation: string) {
  const apiUrl = `${restBaseUrl}/incompletequeue?queueRoom=${currentLocation}&patient=${patientUuid}&v=full`;

  const abortController = new AbortController();

  return await openmrsFetch(apiUrl, {
    signal: abortController.signal,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
