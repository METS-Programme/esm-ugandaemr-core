import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { Encounter, UpdateObs } from '../types';

export function saveEncounter(encounter: Encounter) {
  const abortController = new AbortController();

  return openmrsFetch(`${restBaseUrl}/encounter`, {
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

  return openmrsFetch(`${restBaseUrl}/encounter/${encounterUuid}`, {
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

  return openmrsFetch(`${restBaseUrl}/encounter/${encounterUuid}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
    signal: abortController.signal,
  });
}
