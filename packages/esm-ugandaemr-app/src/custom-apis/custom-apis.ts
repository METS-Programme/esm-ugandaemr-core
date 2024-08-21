import { fhirBaseUrl, restBaseUrl, openmrsFetch } from '@openmrs/esm-framework';
import useSWR from 'swr';
import { configSchema } from '@ugandaemr/esm-care-panel-app/src/config-schema';
import { PatientProgramResponse } from '@ugandaemr/esm-care-panel-app/src/hooks/usePatientPrograms';

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

export async function getPatientPrograms(patientUuid: string) {
  const apiUrl = `${restBaseUrl}/programenrollment/?patient=${patientUuid}&v=custom:(uuid,program:(uuid,name,allWorkflows:(uuid,states:(uuid,concept.name.name,),concept.name.name)),location:(uuid,name),attributes:(uuid,attributeType:(uuid,display),value:(uuid,name.name)),dateEnrolled,dateCompleted,states:(state:(concept),startDate,endDate,voided),outcome)`;

  const { data } = await openmrsFetch(apiUrl);

  return data;
}
