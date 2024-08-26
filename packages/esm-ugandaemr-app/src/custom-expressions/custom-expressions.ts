import { getConceptDataType, getLatestObs, getPatientPrograms } from './custom-apis';
import dayjs from 'dayjs';
import { configSchema } from '@ugandaemr/esm-care-panel-app/src/config-schema';

export async function latestObs(patientId: string, conceptUuid: string) {
  const response = await getLatestObs(patientId, conceptUuid);

  if (response) {
    const conceptDataType = await getConceptDataType(conceptUuid);

    if (conceptDataType === 'Date') {
      return dayjs(response?.valueDateTime).format('DD/MM/YYYY');
    } else if (conceptDataType === 'Coded') {
      return response?.valueCodeableConcept?.coding[0]?.display;
    }
  }
}

export async function patientDSDM(patiendId: string) {
  const DSDModels = await getPatientPrograms(patiendId);

  console.info(DSDModels);
  return DSDModels[0]?.state?.concept?.display;
}
