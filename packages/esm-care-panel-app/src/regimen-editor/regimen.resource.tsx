import { openmrsFetch } from '@openmrs/esm-framework';
import { Encounter, UpdateObs } from '../types';
import useSWR from 'swr';
import { useMemo } from 'react';
import { configSchema } from '../config-schema';
import dayjs from 'dayjs';

export function saveEncounter(encounter: Encounter) {
  const abortController = new AbortController();

  return openmrsFetch(`/ws/rest/v1/encounter`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: encounter,
    signal: abortController.signal,
  });
}

export function updateEncounter(encounter: UpdateObs, encounterUuid) {
  const abortController = new AbortController();

  return openmrsFetch(`/ws/rest/v1/encounter/${encounterUuid}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: encounter,
    signal: abortController.signal,
  });
}

export function deleteEncounter(encounterUuid) {
  const abortController = new AbortController();

  return openmrsFetch(`/ws/rest/v1/encounter/${encounterUuid}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
    signal: abortController.signal,
  });
}

export function usePatientRegimenObservations(patientUuid, conceptUuids) {
  const conceptsQueryParam = conceptUuids.join('%2C');
  const apiUrl = `/ws/fhir2/R4/Observation?patient=${patientUuid}&code=${conceptsQueryParam}&_summary=data&_sort=-date`;

  const { data, error, isValidating, mutate } = useSWR<{ data: any }, Error>(apiUrl, openmrsFetch);

  const observations = useMemo(() => {
    if (!data?.data?.entry) return [];
    const priorRegimenObj = data.data.entry.find((item) =>
      item?.resource?.code?.coding?.some((coding) => coding.code === configSchema.priorArvRegimenUuid._default),
    );

    const priorEffectiveDateTime = priorRegimenObj?.resource?.effectiveDateTime;

    return data.data.entry.filter((item) => item?.resource?.effectiveDateTime === priorEffectiveDateTime);
  }, [data?.data]);

  console.info(observations);
  return {
    observations,
    isLoading: isValidating,
    isError: !!error,
    mutate,
  };
}
