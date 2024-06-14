import useSWR from 'swr';
import axios from 'axios';
import { openmrsFetch } from '@openmrs/esm-framework';
import { systemInfo } from './system-info.types';

type facilityRequest = {
  resource: string;
  name: string;
};

export function useGetResourceInformation(params: facilityRequest) {
  const apiUrl = `https://api-nhfr.health.go.ug/NHFRSearch?resource=${params.resource}&name=${params.name}`;

  const fetcher = async () => {
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Error in fetcher: ${error.message}`);
    }
  };

  const { data, error } = useSWR(apiUrl, fetcher);
  const facilities = data?.entry?.filter((entry) =>
    entry?.resource?.extension?.find((extension) => extension.url === 'levelOfCare'),
  );

  return {
    data: facilities,
    isLoading: !error && !data,
    isError: error,
  };
}

export async function updatePropertyValue(propertyName: string, value: string) {
  const abortController = new AbortController();

  try {
    const response = await openmrsFetch(`/ws/rest/v1/systemsetting/${propertyName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: abortController.signal,
      body: JSON.stringify({
        value: value,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update property value: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    throw new Error(`Error in updatePropertyValue: ${error.message}`);
  }
}

export function useGetSystemInformation() {
  const apiUrl = `/ws/rest/v1/systeminformation?v=full`;
  const { data, error, isLoading } = useSWR<{ data: systemInfo }, Error>(apiUrl, openmrsFetch);

  return {
    systemInfo: data?.data,
    isLoading,
    isError: error,
  };
}

export function useRetrieveFacilityCode() {
  const apiURL = '/ws/rest/v1/systemsetting?q=ugandaemrsync.national.health.facility.registry.identifier&v=full';

  const { data, error, isLoading } = useSWR<{ data: [] }, Error>(apiURL, openmrsFetch);

  return {
    facilityIds: data?.data['results'],
    isLoading,
    isError: error,
  };
}
