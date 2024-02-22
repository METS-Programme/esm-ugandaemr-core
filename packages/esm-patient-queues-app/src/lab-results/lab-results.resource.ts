// get queue record with

import { openmrsFetch } from '@openmrs/esm-framework';

export interface EncounterSearchParams {
  patientUuid: string;
  fromdate: string;
  todate: string;
  encountertype: string;
  obsConcept?: string;
}

export async function getPatientEncounterWithOrders(params: EncounterSearchParams) {
  const apiUrl = `ws/rest/v1/encounter?patient=${params.patientUuid}&encountertype=${params.encountertype}&fromdate=${params.fromdate}&todate=${params.todate}&concept=${params.obsConcept}&v=full`;
  const abortController = new AbortController();

  return await openmrsFetch(apiUrl, {
    signal: abortController.signal,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
