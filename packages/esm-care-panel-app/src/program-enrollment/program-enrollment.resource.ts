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
