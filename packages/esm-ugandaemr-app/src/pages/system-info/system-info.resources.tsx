import useSWR from 'swr';
import { openmrsFetch } from '@openmrs/esm-framework';
import { systemInfo } from './system-info.types';
import { useState, useEffect } from 'react';

const facilityRegistryURL = 'https://nhfr-staging-api.planetsystems.co';

export function useGetSystemInformation() {
  const apiUrl = `/ws/rest/v1/systeminformation?v=full`;
  const { data, error, isLoading } = useSWR<{ data: systemInfo }, Error>(apiUrl, openmrsFetch);

  return {
    systemInfo: data?.data,
    isLoading,
    isError: error,
  };
}

export function useGetResourceInformation(type) {
  const [state, setState] = useState({});
  const [error, setError] = useState('');
  const url = `${facilityRegistryURL}/NHFRSearch?`;
  let param = '';

  switch (type) {
    case 'ownership':
      param = 'resource=ValueSet&name=facilityOwnership';
      break;
    case 'careLevel':
      param = 'resource=ValueSet&name=facilityLevel';
      break;
  }

  useEffect(() => {
    const dataFetch = async () => {
      try {
        const data = await (
          await fetch(`${url}${param}&_pretty=true`, {
            method: 'GET',
          })
        ).json();
        setState(data);
      } catch (e) {
        setError('Error loading resource');
      }
    };

    dataFetch();
  }, [param, url]);

  return { data: state, error: error };
}

export async function getFacility(params) {
  let url = `${facilityRegistryURL}/NHFRSearch?resource=Location&type=healthFacility`;
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
