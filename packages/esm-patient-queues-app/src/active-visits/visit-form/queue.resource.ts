import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';
import { Appointment, ProviderResponse } from '../../types';

export async function saveAppointment(appointment: Appointment) {
  const abortController = new AbortController();

  await openmrsFetch(`${restBaseUrl}/appointment`, {
    method: 'POST',
    signal: abortController.signal,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      patientUuid: appointment?.patient.uuid,
      serviceUuid: appointment?.service?.uuid,
      startDateTime: appointment?.startDateTime,
      endDateTime: appointment?.endDateTime,
      appointmentKind: appointment?.appointmentKind,
      locationUuid: appointment?.location?.uuid,
      comments: appointment?.comments,
      status: 'CheckedIn',
      appointmentNumber: appointment?.appointmentNumber,
      uuid: appointment?.uuid,
      providerUuid: appointment?.provider?.uuid,
    },
  });
}

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

export async function getCurrentVisit(patient: string, date: string) {
  const apiUrl = `${restBaseUrl}/visit?patient=${patient}&includeInactive=false&fromStartDate=${date}&v=default&limit=1`;
  const abortController = new AbortController();
  return await openmrsFetch(apiUrl, {
    signal: abortController.signal,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
