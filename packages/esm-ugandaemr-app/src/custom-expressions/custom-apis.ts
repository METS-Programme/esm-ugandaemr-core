import { restBaseUrl, openmrsFetch } from '@openmrs/esm-framework';

export async function getCohortCategorization(uuid: string) {
  let apiUrl = `${restBaseUrl}/cohortm/cohort?v=custom:(name,uuid)&cohortType=${uuid}`;

  return await openmrsFetch(apiUrl);
}
