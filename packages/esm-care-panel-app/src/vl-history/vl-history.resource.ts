import { fhirBaseUrl, openmrsFetch } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import useSWR from 'swr';
import { configSchema } from '../config-schema';

export function usePatientObservations(patientUuid, conceptUuids) {
  const conceptsQueryParam = conceptUuids.join('%2C');
  const apiUrl = `${fhirBaseUrl}/Observation?patient=${patientUuid}&code=${conceptsQueryParam}&_summary=data&_sort=-date&_count=12`;

  const { data, error, isValidating, mutate } = useSWR<{ data: any }, Error>(apiUrl, openmrsFetch);

  const observationsByDate = useMemo(() => {
    if (!data) return {};

    const observations = data?.data?.entry?.map((entry) => entry.resource);

    // Grouped observations by effectiveDateTime
    const groupedObservations = observations?.reduce((acc, observation) => {
      const { effectiveDateTime } = observation;
      if (!acc[effectiveDateTime]) {
        acc[effectiveDateTime] = {
          observations: [],
          valuesArray: [],
          dateArray: [],
          displayArray: [],
        };
      }
      acc[effectiveDateTime]?.observations.push(observation);

      const coding = observation?.code?.coding[0];
      if (coding?.code === `${configSchema.hivViralLoadUuid._default}` && observation?.valueQuantity) {
        acc[effectiveDateTime].valuesArray.push(observation.valueQuantity.value);
      } else if (coding?.code === `${configSchema.hivViralLoadDateUuid._default}` && observation?.effectiveDateTime) {
        acc[effectiveDateTime].dateArray.push(observation.effectiveDateTime);
      } else if (
        coding?.code === `${configSchema.hivViralLoadQualitativeUuid._default}` &&
        observation?.valueCodeableConcept
      ) {
        acc[effectiveDateTime].displayArray.push(observation.valueCodeableConcept?.coding[0]?.display);
      }

      return acc;
    }, {});

    return groupedObservations;
  }, [data]);

  return {
    observations: observationsByDate,
    isLoading: isValidating,
    isError: !!error,
    mutate,
  };
}
