import {fhirBaseUrl, openmrsFetch, restBaseUrl} from "@openmrs/esm-framework";
import {date} from "zod";
import dayjs from "dayjs";

export function CalcMonthsOnART(artStartDate: Date, followupDate: Date) {
  let resultMonthsOnART: number;
  let artInDays = Math.round((followupDate.getTime() - artStartDate.getTime?.()) / 86400000);
  if (artStartDate && followupDate && artInDays < 30) {
    resultMonthsOnART = 0;
  } else if (artStartDate && followupDate && artInDays >= 30) {
    resultMonthsOnART = Math.floor(artInDays / 30);
  }

  return artStartDate && followupDate ? resultMonthsOnART : null;
}

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
export async function latestObs(patientId: string, conceptUuid: string) {
  const response = await getLatestObs(patientId, conceptUuid);

  if (response) {
    const conceptDataType = await getConceptDataType(conceptUuid);

    if (conceptDataType === 'Date') {
      return dayjs(response?.valueDateTime).format('DD/MM/YYYY');
    } else if (conceptDataType === 'Coded') {
      return response?.valueCodeableConcept?.coding[0]?.display;
    }else if (conceptDataType === 'Numeric') {
      return response?.referenceRange[0]?.high?.value;
    }


  }
}
