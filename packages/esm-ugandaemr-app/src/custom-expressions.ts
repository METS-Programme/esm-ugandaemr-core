import { getConceptDataType, getLatestObs } from './custom-apis/custom-apis';
import dayjs from 'dayjs';

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
