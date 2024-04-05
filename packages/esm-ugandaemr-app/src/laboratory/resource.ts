import { useConfig, restBaseUrl, openmrsFetch } from '@openmrs/esm-framework';
import { Order } from '@openmrs/esm-patient-common-lib';
import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import { Concept, Encounter } from './types';

export function useGetOrdersWorklist(fulfillerStatus: string) {
  const { laboratoryOrderTypeUuid } = useConfig({ externalModuleName: '@openmrs/esm-laboratory-app' });

  const orderTypeQuery = laboratoryOrderTypeUuid !== '' ? `orderTypes=${laboratoryOrderTypeUuid}` : '';

  const apiUrl = `${restBaseUrl}/order?${orderTypeQuery}&fulfillerStatus=${fulfillerStatus}&v=full`;

  const mutateOrders = useCallback(
    () =>
      mutate(
        (key) =>
          typeof key === 'string' && key.startsWith(`${restBaseUrl}/order?orderTypes=${laboratoryOrderTypeUuid}`),
      ),
    [laboratoryOrderTypeUuid],
  );

  const { data, error, isLoading } = useSWR<{ data: { results: Array<Order> } }, Error>(apiUrl, openmrsFetch, {
    refreshInterval: 3000,
  });

  return {
    data: data?.data ? data.data.results : [],
    isLoading,
    isError: error,
    mutate: mutateOrders,
  };
}

export function useGetEncounterById(encounterUuid: string) {
  const apiUrl = `${restBaseUrl}/encounter/${encounterUuid}?v=full`;
  const { data, error, isLoading } = useSWR<{ data: Encounter }, Error>(apiUrl, openmrsFetch);

  return {
    encounter: data?.data,
    isLoading,
    isError: error,
  };
}

export function useGetConceptById(conceptUuid: string) {
  const apiUrl = `${restBaseUrl}/concept/${conceptUuid}?v=full`;
  const { data, error, isLoading } = useSWR<{ data: Concept }, Error>(apiUrl, openmrsFetch);
  return {
    concept: data?.data,
    isLoading,
    isError: error,
  };
}

export async function rejectOrder(uuid: string, body: any) {
  const abortController = new AbortController();

  return openmrsFetch(`${restBaseUrl}/order/${uuid}/fulfillerdetails/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
    body: body,
  });
}
