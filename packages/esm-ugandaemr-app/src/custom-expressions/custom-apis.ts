import { fhirBaseUrl, restBaseUrl, openmrsFetch } from '@openmrs/esm-framework';
import { configSchema } from '@ugandaemr/esm-care-panel-app/src/config-schema';
import dayjs from "dayjs";
import {dateFormat} from "../constants";

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

  const dsdmUuids = [
    configSchema.ccladUuid._default,
    configSchema.cddpUuid._default,
    configSchema.fbgUuid._default,
    configSchema.fbimUuid._default,
    configSchema.ftdrUuid._default,
    configSchema.crpddpUuid._default,
  ];

  const filteredDSDModels =
    data?.results.flatMap((enrollment) =>
      enrollment.states.filter((state) => dsdmUuids.includes(state.state.concept.uuid)),
    ) ?? [];

  return filteredDSDModels;
}

export async function getCohortCategorization(uuid: string) {
  let apiUrl = `${restBaseUrl}/cohortm/cohort?v=custom:(name,uuid)&cohortType=${uuid}`;

  return await openmrsFetch(apiUrl);
}

export async function getEncounters(patientUuid: string, encounterTypeUuid?: string) {
  let params = `patient=${patientUuid}${encounterTypeUuid ? `&encounterType=${encounterTypeUuid}` : ''}`;

  const apiUrl = `${restBaseUrl}/encounter?${params}&v=custom:(uuid,encounterDatetime,encounterType:(uuid,name))`;
  const { data } = await openmrsFetch(apiUrl);

  return (
    data?.results?.map((encounter) => ({
      uuid: encounter.uuid,
      encounterDatetime: encounter.encounterDatetime,
      encounterType: encounter.encounterType.name,
    })) || []
  );
}

export function getPatientEncounterDates(patientUuid: string, encounterTypeUuid: string) {
  let params = `encounterType=${encounterTypeUuid}&patient=${patientUuid}&v=custom:(uuid,encounterDatetime)`;
  return openmrsFetch(`${restBaseUrl}/encounter?${params}`).then(({ data }) => {
    if (data.results.length === 0) {
      return [];
    }
    return data.results.map((encounter: any) => dayjs(encounter.encounterDatetime).format(dateFormat));
  });
}
