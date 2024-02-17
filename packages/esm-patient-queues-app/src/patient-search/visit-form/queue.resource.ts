import { openmrsFetch } from '@openmrs/esm-framework';
import { Appointment, ProviderResponse } from '../../types';
import useSWR from 'swr';

export async function addQueueEntry(
  visitUuid: string,
  patientUuid: string,
  priority: string,
  status: string,
  queueServiceUuid: string,
  appointment: Appointment,
  locationUuid: string,
) {
  const abortController = new AbortController();

  return openmrsFetch(`/ws/rest/v1/patientqueue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
    body: {
      patient: patientUuid,
      provider: '',
      locationFrom: locationUuid,
      locationTo: queueServiceUuid !== undefined ? queueServiceUuid : 'Not Set',
      status: status ? status : 'pending',
      encounter: null,
      visitNumber: '',
      priority: 1,
      priorityComment: 'Urgent',
      comment: 'Na',
      queueRoom: queueServiceUuid !== undefined ? queueServiceUuid : 'Not Set',
    },
  });
}

export async function saveAppointment(appointment: Appointment) {
  const abortController = new AbortController();

  await openmrsFetch(`/ws/rest/v1/appointment`, {
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
  const apiUrl = `/ws/rest/v1/provider?q=&v=full`;
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
