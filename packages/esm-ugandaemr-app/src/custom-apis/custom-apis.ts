import { fhirBaseUrl, restBaseUrl, openmrsFetch } from '@openmrs/esm-framework';

export async function getLatestObs(patientUuid: string, conceptUuid: string, encounterTypeUuid?: string) {
  let params = `patient=${patientUuid}&code=${conceptUuid}${
    encounterTypeUuid ? `&encounter.type=${encounterTypeUuid}` : ''
  }`;

  params += '&_sort=-_lastUpdated&_count=1';
  const { data } = await openmrsFetch(`${fhirBaseUrl}/Observation?${params}`);

  return data.entry?.length ? data.entry[0].resource : null;
}

export async function getConceptDataType(conceptUuid: string) {
  let apiUrl = `${restBaseUrl}/concept/${conceptUuid}?v=custom:(datatype:(name,uuid,display))`;

  const { data } = await openmrsFetch(apiUrl);

  return data?.datatype?.name;
}
