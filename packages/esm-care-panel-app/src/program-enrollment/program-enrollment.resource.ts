import useSWR from 'swr';
import axios from 'axios';
import { openmrsFetch } from '@openmrs/esm-framework';
import { useEffect } from 'react';

type ARTStartDateRequest = {
  patientuuid: string;
};

export function extractDate(timestamp: string): string {
  const dateObject = new Date(timestamp);
  const year = dateObject.getFullYear();
  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObject.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function useGetARTStartDate(
  params: ARTStartDateRequest,
  onArtStartDateDataReceived: (artStartDateData: string) => void,
  conceptuuid: string,
) {
  const apiUrl = `/ws/rest/v1/obs?concept=${conceptuuid}&patient=${params.patientuuid}&v=full`;
  const { data, error, isLoading, mutate } = useSWR<{ data: { results: any } }, Error>(apiUrl, openmrsFetch);
  const artStartDateData = data ? extractDate(data.data.results[0].value) : [];

  useEffect(() => {
    if (artStartDateData !== null) {
      onArtStartDateDataReceived(artStartDateData as string);
    }
  }, [artStartDateData, conceptuuid, onArtStartDateDataReceived]);

  return {
    artStartDateData,
    conceptuuid,
    isError: error,
    isLoading: isLoading,
    mutate,
  };
}

export function useGetCurrentRegimen(
  params: ARTStartDateRequest,
  onCurrentARVRegimenReceived: (artStartDateData: string) => void,
  conceptuuid: string,
) {
  const apiUrl = `/ws/rest/v1/obs?concept=${conceptuuid}&patient=${params.patientuuid}&v=full`;
  const { data, error, isLoading, mutate } = useSWR<{ data: { results: any } }, Error>(apiUrl, openmrsFetch);
  const currentARVRegimen = data ? data?.data.results[0]?.value?.display : null;

  useEffect(() => {
    if (currentARVRegimen !== null) {
      onCurrentARVRegimenReceived(currentARVRegimen as string);
    }
  }, [currentARVRegimen, conceptuuid, onCurrentARVRegimenReceived]);
  return {
    currentARVRegimen,
    conceptuuid,
    isError: error,
    isLoading: isLoading,
    mutate,
  };
}

export function useGetCurrentBaselineWeight(
  params: ARTStartDateRequest,
  onBaselineWeightReceived: (weight: string) => void,
  conceptuuid: string,
) {
  const apiUrl = `/ws/rest/v1/obs?concept=${conceptuuid}&patient=${params.patientuuid}&v=full`;
  const { data, error, isLoading, mutate } = useSWR<{ data: { results: any[] } }, Error>(apiUrl, openmrsFetch);

  const baselineWeight = data ? parseWeightFromDisplay(data?.data.results[0]?.display) : null;

  useEffect(() => {
    if (baselineWeight !== null) {
      onBaselineWeightReceived(baselineWeight as string);
    }
  }, [baselineWeight, conceptuuid, onBaselineWeightReceived]);

  return {
    baselineWeight,
    conceptuuid,
    isError: error,
    isLoading: isLoading,
    mutate,
  };
}

export function useGetCurrentHIVClinicalStage(
  params: ARTStartDateRequest,
  onHIVClinicalStageReceived: (stage: string) => void,
  conceptuuid: string,
) {
  const apiUrl = `/ws/rest/v1/obs?concept=${conceptuuid}&patient=${params.patientuuid}&v=full`;
  const { data, error, isLoading, mutate } = useSWR<{ data: { results: any[] } }, Error>(apiUrl, openmrsFetch);

  // Parsing the display value to extract just the numeric part of the stage.
  const hivClinicalStage = data ? parseStageFromDisplay(data?.data.results[0]?.display) : null;

  useEffect(() => {
    if (hivClinicalStage !== null) {
      onHIVClinicalStageReceived(hivClinicalStage as string);
    }
  }, [hivClinicalStage, conceptuuid, onHIVClinicalStageReceived]);

  return {
    hivClinicalStage,
    conceptuuid,
    isError: error,
    isLoading: isLoading,
    mutate,
  };
}

function parseStageFromDisplay(display: string | undefined): string | null {
  if (!display) return null;
  // Assuming the display format includes "HIV WHO CLINICAL STAGE X" where X is the stage number
  const match = display.match(/\bSTAGE\s(\d+)/i);
  return match ? match[1] : null;
}

function parseWeightFromDisplay(display: string | undefined): string | null {
  if (!display) return null;
  const match = display.match(/(\d+(\.\d+)?)/);
  return match ? match[0] : null;
}
