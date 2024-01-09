import useSWR from "swr";
import { openmrsFetch } from "@openmrs/esm-framework";


export function extractDate(timestamp: string): string {
  const dateObject = new Date(timestamp);
  const year = dateObject.getFullYear();
  const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObject.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function useGetCurrentRegimen(patientuuid: string, conceptuuid: string) {
  const apiUrl = `/ws/rest/v1/obs?concept=${conceptuuid}&patient=${patientuuid}&v=full&limit=1`;
  const { data, error, isLoading, mutate } = useSWR<  { data: { results: any } },  Error  >(apiUrl, openmrsFetch);
  const currentARVRegimen = data ? data?.data.results[0].value : null;  
  return {
    currentARVRegimen,
    conceptuuid,
    isError: error,
    isLoading: isLoading,
    mutate,
  };
}

export function useGetARTStartDate(patientuuid: string, conceptuuid: string) {
  const apiUrl = `/ws/rest/v1/obs?concept=${conceptuuid}&patient=${patientuuid}&v=full`;
  const { data, error, isLoading, mutate } = useSWR<{ data: { results: any } }, Error>(apiUrl, openmrsFetch);
  console.info("---info",data)
  const artStartDateData = data ? data?.data : [];
  return {
    artStartDateData,
    isError: error,
    isLoading: isLoading,
  };
}

export function useGetAherence(patientuuid: string, conceptuuid: string) {
  const apiUrl = `/ws/rest/v1/obs?concept=${conceptuuid}&patient=${patientuuid}&v=full`;
  const { data, error, isLoading, mutate } = useSWR<{ data: { results: any } }, Error>(apiUrl, openmrsFetch);
  const adherence = data ? data?.data.results[0].value?.display : null;
  return {
    adherence,
    conceptuuid,
    isError: error,
    isLoading: isLoading,
    mutate,
  };
}

export function useGetLastWHOstage(patientUuid: string, conceptUuid: string) {
  const apiUrl = `/ws/rest/v1/obs?concept=${conceptUuid}&patient=${patientUuid}&v=full`;
  const { data, error, isLoading, mutate } = useSWR<{ data: { results: any } }, Error>(apiUrl, openmrsFetch);
  const adherence = data ? data?.data.results[0].value?.display : null;
  return {
    adherence,
    conceptUuid,
    isError: error,
    isLoading: isLoading,
    mutate,
  };
}