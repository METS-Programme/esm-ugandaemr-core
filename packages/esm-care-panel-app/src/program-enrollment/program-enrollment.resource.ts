import useSWR from 'swr';
import axios from 'axios';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { useEffect, useMemo } from 'react';

type patientSummaryDataRequest = {
  patientuuid: string;
};

export function extractDate(timestamp: string): string {
  const dateObject = new Date(timestamp);
  const year = dateObject.getFullYear();
  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObject.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function extractValue(observation) {
  if (observation.valueDateTime) {
    return observation.valueDateTime;
  } else if (observation.valueCodeableConcept && observation.valueCodeableConcept.text) {
    return observation.valueCodeableConcept.text;
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

export function useGetARTStartDate(
  params: patientSummaryDataRequest,
  onArtStartDateDataReceived: (artStartDateData: string) => void,
  artStartDateUuid: string,
) {
  const apiUrl = `${restBaseUrl}/obs?concept=${artStartDateUuid}&patient=${params.patientuuid}&v=full`;
  const { data, error, isLoading, mutate } = useSWR<{ data: { results: any } }, Error>(apiUrl, openmrsFetch);
  const artStartDateData = useMemo(() => {
    return data ? extractDate(data.data.results[0].value) : [];
  }, [data]);

  useEffect(() => {
    if (artStartDateData !== null) {
      onArtStartDateDataReceived(artStartDateData as string);
    }
  }, [artStartDateData, artStartDateUuid, onArtStartDateDataReceived]);

  return {
    artStartDateData,
    artStartDateUuid,
    isError: error,
    isLoading: isLoading,
    mutate,
  };
}

export function useGetCurrentRegimen(
  params: patientSummaryDataRequest,
  onCurrentARVRegimenReceived: (artStartDateData: string) => void,
  currentRegimenUuid: string,
) {
  const apiUrl = `${restBaseUrl}/obs?concept=${currentRegimenUuid}&patient=${params.patientuuid}&v=full`;
  const { data, error, isLoading, mutate } = useSWR<{ data: { results: any } }, Error>(apiUrl, openmrsFetch);
  const currentARVRegimen = data ? data?.data.results[0]?.value?.display : null;

  useEffect(() => {
    if (currentARVRegimen !== null) {
      onCurrentARVRegimenReceived(currentARVRegimen as string);
    }
  }, [currentARVRegimen, currentRegimenUuid, onCurrentARVRegimenReceived]);
  return {
    currentARVRegimen,
    currentRegimenUuid,
    isError: error,
    isLoading: isLoading,
    mutate,
  };
}

export function useGetBaselineRegimen(
  params: patientSummaryDataRequest,
  onBaselineRegimenReceived: (weight: string) => void,
  baselineRegimenUuid: string,
) {
  const apiUrl = `${restBaseUrl}/obs?concept=${baselineRegimenUuid}&patient=${params.patientuuid}&v=full`;
  const { data, error, isLoading, mutate } = useSWR<{ data: { results: any[] } }, Error>(apiUrl, openmrsFetch);
  const baselineRegimen = data ? data?.data.results[0]?.value?.display : null;

  useEffect(() => {
    if (baselineRegimen !== null) {
      onBaselineRegimenReceived(baselineRegimen as string);
    }
  }, [baselineRegimen, baselineRegimenUuid, onBaselineRegimenReceived]);

  return {
    baselineRegimen,
    baselineRegimenUuid,
    isError: error,
    isLoading: isLoading,
    mutate,
  };
}

export function useGetCurrentHIVClinicalStage(
  params: patientSummaryDataRequest,
  onHIVClinicalStageReceived: (stage: string) => void,
  whoClinicalStageUuid: string,
) {
  const apiUrl = `${restBaseUrl}/obs?concept=${whoClinicalStageUuid}&patient=${params.patientuuid}&v=full`;
  const { data, error, isLoading, mutate } = useSWR<{ data: { results: any[] } }, Error>(apiUrl, openmrsFetch);

  const hivClinicalStage = data ? parseStageFromDisplay(data?.data.results[0]?.display) : null;

  useEffect(() => {
    if (hivClinicalStage !== null) {
      onHIVClinicalStageReceived(hivClinicalStage as string);
    }
  }, [hivClinicalStage, whoClinicalStageUuid, onHIVClinicalStageReceived]);

  return {
    hivClinicalStage,
    whoClinicalStageUuid,
    isError: error,
    isLoading: isLoading,
    mutate,
  };
}

export function useGetDateConfirmedHIVPositiveDate(
  params: patientSummaryDataRequest,
  onArtStartDateDataReceived: (artStartDateData: string) => void,
  artStartDateUuid: string,
) {
  const apiUrl = `${restBaseUrl}/obs?concept=${artStartDateUuid}&patient=${params.patientuuid}&v=full`;
  const { data, error, isLoading, mutate } = useSWR<{ data: { results: any } }, Error>(apiUrl, openmrsFetch);
  const artStartDateData = useMemo(() => {
    return data ? extractDate(data.data.results[0].value) : [];
  }, [data]);

  useEffect(() => {
    if (artStartDateData !== null) {
      onArtStartDateDataReceived(artStartDateData as string);
    }
  }, [artStartDateData, artStartDateUuid, onArtStartDateDataReceived]);

  return {
    artStartDateData,
    artStartDateUuid,
    isError: error,
    isLoading: isLoading,
    mutate,
  };
}

export function parseStageFromDisplay(display: string | undefined): string | null {
  if (!display) return null;
  const match = display.match(/\bSTAGE\s(\d+)/i);

  return match ? match[1] : null;
}
