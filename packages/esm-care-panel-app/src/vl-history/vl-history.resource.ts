import { fhirBaseUrl, openmrsFetch } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import useSWR from 'swr';
import { configSchema } from '../config-schema';

export function useViralLoadOservations(patientUuid) {
  const apiUrl = `${fhirBaseUrl}/Observation?patient=${patientUuid}&code=${configSchema.viralLoadSetUuid._default}&_summary=data&_sort=-date`;

  const { data, error, isValidating, mutate } = useSWR<{ data: any }, Error>(apiUrl, openmrsFetch);

  const observations = data?.data?.entry?.map((entry) => entry.resource);

  return {
    data: observations,
    isLoading: isValidating,
    isError: !!error,
    mutate,
  };
}

export function parseValueString(valueString) {
  const parts = valueString.split(',').map((part) => part.trim());
  let date, qualitative, viralLoad;

  parts.forEach((part) => {
    if (part.match(/^\d{4}-\d{2}-\d{2}$/)) {
      date = part;
    } else if (part === 'Target Not Detected' || part === 'DETECTED' || part === 'POOR SAMPLE QUALITY') {
      qualitative = part;
    } else if (!isNaN(parseFloat(part))) {
      viralLoad = part;
    }
  });

  return {
    date: date || '',
    qualitative: qualitative || '',
    viralLoad: viralLoad || '',
  };
}
