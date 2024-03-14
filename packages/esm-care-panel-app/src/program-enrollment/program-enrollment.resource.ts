import useSWR from 'swr';
import { openmrsFetch } from '@openmrs/esm-framework';
import { useMemo } from 'react';

export function extractValue(observation) {
  if (observation.valueDateTime) {
    return observation.valueDateTime;
  } else if (observation.valueCodeableConcept && observation.valueCodeableConcept.text) {
    return observation.valueCodeableConcept.text;
  } else if (observation.valueQuantity) {
    return observation.valueQuantity.value;
  }
  return null;
}

export function usePatientObservations(patientUuid, conceptUuids) {
  const conceptsQueryParam = conceptUuids.join('%2C');
  const apiUrl = `/ws/fhir2/R4/Observation?patient=${patientUuid}&code=${conceptsQueryParam}&_summary=data&_sort=-date&_count=100`;

  const { data, error, isValidating, mutate } = useSWR(apiUrl, async (url) => {
    const response = await openmrsFetch(url);
    return response.data;
  });

  const observations = useMemo(() => {
    const resultsByConcept = {};

    data?.entry?.forEach((entry) => {
      const observation = entry.resource;
      const observedConceptCode = observation.code.coding.find((coding) => conceptUuids.includes(coding.code))?.code;
      const value = extractValue(observation);

      if (observedConceptCode && value !== null) {
        // Ensure the array exists for the conceptCode
        if (!resultsByConcept[observedConceptCode]) {
          resultsByConcept[observedConceptCode] = [];
        }
        // Push the value into the correct array based on conceptCode
        resultsByConcept[observedConceptCode].push(value);
      }
    });

    return resultsByConcept;
  }, [data, conceptUuids]);
  // console.info(JSON.stringify(data, null, 2));

  return {
    observations,
    data,
    isLoading: isValidating,
    isError: !!error,
    mutate,
  };
}

export function parseStageFromDisplay(display: string | undefined): string | null {
  if (!display) return null;
  const match = display.match(/\bSTAGE\s(\d+)/i);

  return match ? match[1] : null;
}
