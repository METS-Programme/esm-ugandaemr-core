import { Visit, defaultVisitCustomRepresentation, openmrsFetch, updateVisit } from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { first } from 'rxjs/operators';
import useSWR from 'swr';
import { endPatientStatus } from '../active-visits/active-visits-table.resource';
import { omrsDateFormat, timeZone } from '../constants';
import { AppointmentsFetchResponse, EndVisitPayload } from '../types';

const statusChangeTime = dayjs(new Date()).format(omrsDateFormat);

interface VisitReturnType {
  error: Error;
  mutate: () => void;
  isValidating: boolean;
  currentVisit: Visit | null;
  isLoading: boolean;
}

export async function voidQueueEntry(
  endedAt: Date,
  endCurrentVisitPayload: EndVisitPayload,
  visitUuid: string,
) {
  const abortController = new AbortController();

}

export function useCheckedInAppointments(patientUuid: string, startDate: string) {
  const abortController = new AbortController();

  const appointmentsSearchUrl = `/ws/rest/v1/appointments/search`;
  const fetcher = () =>
    openmrsFetch(appointmentsSearchUrl, {
      method: 'POST',
      signal: abortController.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        patientUuid: patientUuid,
        startDate: startDate,
      },
    });

  const { data, error, isLoading, isValidating } = useSWR<AppointmentsFetchResponse, Error>(
    appointmentsSearchUrl,
    fetcher,
  );

  const appointments = data?.data?.length
    ? data.data.filter((appointment) => appointment.status === 'CheckedIn')
    : null;

  return {
    data: data ? appointments : null,
    isError: error,
    isLoading,
    isValidating,
  };
}

export async function changeAppointmentStatus(toStatus: string, appointmentUuid: string) {
  const url = `/ws/rest/v1/appointments/${appointmentUuid}/status-change`;
  return openmrsFetch(url, {
    body: { toStatus, onDate: statusChangeTime, timeZone: timeZone },
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
}


export function useVisit(patientUuid: string): VisitReturnType {
  const { data, error, mutate, isValidating } = useSWR<{
    data: { results: Array<Visit> };
  }>(
    patientUuid
      ? `/ws/rest/v1/visit?patient=${patientUuid}&v=${defaultVisitCustomRepresentation}&includeInactive=false&v=full`
      : null,
    openmrsFetch
  );

  const currentVisit = useMemo(
    () =>
      data?.data.results.find((visit) => visit.stopDatetime === null) ?? null,
    [data?.data.results]
  );

  return {
    error,
    mutate,
    isValidating,
    currentVisit,
    isLoading: !data && !error,
  };
}