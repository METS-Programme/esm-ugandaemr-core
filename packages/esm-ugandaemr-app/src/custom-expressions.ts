import { getConceptDataType, getLatestObs, getPatientPrograms } from './custom-apis/custom-apis';
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
  const response = await getPatientPrograms(patiendId);

  const dsdmUuids = [
    configSchema.ccladUuid._default,
    configSchema.cddpUuid._default,
    configSchema.fbgUuid._default,
    configSchema.fbimUuid._default,
    configSchema.ftdrUuid._default,
  ];

  const filteredDSDModels =
    response?.results.flatMap((enrollment) =>
      enrollment.states.filter((state) => dsdmUuids.includes(state.state.concept.uuid)),
    ) ?? [];
}
