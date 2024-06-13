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

export async function getFacility(params, facilityUrl: string) {
  let url = `${facilityUrl}?resource=Location&type=healthFacility`;
  const queryParams = new URLSearchParams();

  Object.keys(params).forEach((key) => {
    if (params[key] === '' || params[key] === null) {
      delete params[key];
    }
  });

  if (params['ownership']) {
    queryParams.append('facilityOwnership', `${params['ownership']}`);
  }
  if (params['careLevel']) {
    queryParams.append('facilityLevelOfCare', `${params['careLevel']}`);
  }
  if (params['facilityName']) {
    queryParams.append('facilityDisplayName', `${params['facilityName']}`);
  }
  queryParams.append('facilityOperationalStatus', 'Operational/Functional');

  url = `${url}&${queryParams.toString()}`;

  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.error(error);
  }
}

export const handleFacilityResponse = (facilitySearchResponse) => {
  const arr = [];
  if (facilitySearchResponse.total > 0 || (facilitySearchResponse['entry'] && facilitySearchResponse['entry'].length)) {
    facilitySearchResponse['entry'].forEach((facility) => {
      arr.push({
        id: facility['resource']['id'],
        name: facility['resource']['name'],
        code: facility['resource']['extension'].filter((ext) => ext['url'] === 'uniqueIdentifier')[0]['valueString'],
      });
    });
  } else if (facilitySearchResponse.total === 0) {
    arr.push({
      id: null,
      name: null,
      code: null,
    });
  }
  return arr;
};

export function useRetrieveFacilityCode() {
  const apiURL = '/ws/rest/v1/systemsetting?q=ugandaemrsync.national.health.facility.registry.identifier&v=full';

  const { data, error, isLoading } = useSWR<{ data: [] }, Error>(apiURL, openmrsFetch);

  return {
    facilityIds: data?.data['results'],
    isLoading,
    isError: error,
  };
}

export async function updatePropertyValue(propertyUuid: string, value: string) {
  const abortController = new AbortController();

  return openmrsFetch(`/ws/rest/v1/systemsetting/${propertyUuid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
    body: {
      value: value,
    },
  });
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
