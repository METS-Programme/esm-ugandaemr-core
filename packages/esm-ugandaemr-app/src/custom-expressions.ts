import { getLatestObs } from './custom-apis/custom-apis';

export async function loadCurrentRegimen(patientId: string) {
  const response = await getLatestObs(patientId, 'dd2b0b4d-30ab-102d-86b0-7a5022ba4115');

  return response?.valueCodeableConcept?.coding[0]?.display ?? 'No Current Regimen';
}
