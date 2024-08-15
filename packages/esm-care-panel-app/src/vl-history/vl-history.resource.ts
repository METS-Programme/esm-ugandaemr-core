import { openmrsFetch } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import useSWR from 'swr';
import { configSchema } from '../config-schema';

export function usePatientObservations(patientUuid, conceptUuids) {
  const conceptsQueryParam = conceptUuids.join('%2C');
  const apiUrl = `/ws/fhir2/R4/Observation?patient=${patientUuid}&code=${conceptsQueryParam}&_summary=data&_sort=-date&_count=6`;

  const { data, error, isValidating, mutate } = useSWR<{ data: any }, Error>(apiUrl, openmrsFetch);

  const observations = useMemo(() => {
    const extractDate = (dateTime: string) => dateTime?.split('T')[0];

    const vlQualitative =
      data?.data?.entry
        ?.filter((item) =>
          item?.resource?.code?.coding?.some(
            (conceptCode) => conceptCode?.code === configSchema.hivViralLoadQualitativeUuid._default,
          ),
        )
        ?.map((item) => ({
          id: item?.resource?.id,
          date: extractDate(item?.resource?.effectiveDateTime),
          display: item?.resource?.valueCodeableConcept?.text,
        })) || [];

    const viralLoad =
      data?.data?.entry
        ?.filter((item) =>
          item?.resource?.code?.coding?.some(
            (conceptCode) => conceptCode?.code === configSchema.hivViralLoadUuid._default,
          ),
        )
        ?.map((item) => ({
          id: item?.resource?.id,
          date: extractDate(item?.resource?.effectiveDateTime),
          value: item?.resource?.valueQuantity?.value,
        })) || [];

    const viralLoadDate =
      data?.data?.entry
        ?.filter((item) =>
          item?.resource?.code?.coding?.some(
            (conceptCode) => conceptCode?.code === configSchema.hivViralLoadDateUuid._default,
          ),
        )
        ?.map((item) => ({
          id: item?.resource?.id,
          date: extractDate(item?.resource?.effectiveDateTime),
        })) || [];

    const combined: Record<string, any> = {};

    [...vlQualitative, ...viralLoad, ...viralLoadDate].forEach((item) => {
      if (!combined[item.date]) {
        combined[item.date] = {
          date: item.date,
          vlQualitative: [],
          viralLoad: [],
          viralLoadDate: [],
        };
      }

      if (item.display) {
        combined[item.date].vlQualitative.push(item.display);
      }
      if (item.value) {
        combined[item.date].viralLoad.push(item.value);
      }
      if (item.date && !combined[item.date].viralLoadDate.includes(item.date)) {
        combined[item.date].viralLoadDate.push(item.date);
      }
    });

    const sortedCombined = Object.values(combined).sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    return sortedCombined;
  }, [data]);

  return {
    data: observations,
    isLoading: isValidating,
    isError: !!error,
    mutate,
  };
}
