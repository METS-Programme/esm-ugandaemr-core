import { fhirBaseUrl, openmrsFetch } from '@openmrs/esm-framework';

export async function getLatestObs(patientUuid: string, conceptUuid: string, encounterTypeUuid?: string) {
  let params = `patient=${patientUuid}&code=${conceptUuid}${
    encounterTypeUuid ? `&encounter.type=${encounterTypeUuid}` : ''
  }`;
  // the latest obs
  params += '&_sort=-_lastUpdated&_count=1';
  const { data } = await openmrsFetch(`${fhirBaseUrl}/Observation?${params}`);
  return data.entry?.length ? data.entry[0].resource : null;
}
