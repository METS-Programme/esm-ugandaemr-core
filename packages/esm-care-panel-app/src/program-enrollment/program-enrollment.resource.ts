import useSWR from 'swr';
import axios from 'axios';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { useEffect, useMemo } from 'react';

function extractValue(observation) {
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
  const apiUrl = `/ws/fhir2/R4/Observation?patient=${patientUuid}&code=${conceptsQueryParam}&_summary=data&_sort=-date`;

  const { data, error, isValidating, mutate } = useSWR(apiUrl, async (url) => {
    const response = await openmrsFetch(url);
    return response.data;
  });

  const observations = useMemo(() => {
    const resultsByConcept = {};

    data?.entry?.forEach((entry) => {
      const observation = entry.resource;
      const conceptCode = observation.code.coding.find((coding) => conceptUuids.includes(coding.code)).code;
      const value = extractValue(observation);

      if (value !== null) {
        if (!resultsByConcept[conceptCode]) {
          resultsByConcept[conceptCode] = [];
        }
        resultsByConcept[conceptCode].push(value);
      }
    });

    return resultsByConcept;
  }, [data, conceptUuids]);

  return {
    observations,
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
