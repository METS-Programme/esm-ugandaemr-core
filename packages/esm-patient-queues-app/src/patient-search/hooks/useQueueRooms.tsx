import { openmrsFetch } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import useSWR from 'swr';

export interface QueueRoomsResponse {
  uuid: string;
  display: string;
  name: string;
  description: string;
  address1: any;
  address2: any;
  cityVillage: any;
  stateProvince: any;
  country: string;
  postalCode: any;
  latitude: any;
  longitude: any;
  countyDistrict: any;
  address3: any;
  address4: any;
  address5: any;
  address6: any;
  tags: Tag[];
  parentLocation: ParentLocation;
  childLocations: ChildLocation[];
  retired: boolean;
  attributes: any[];
  address7: any;
  address8: any;
  address9: any;
  address10: any;
  address11: any;
  address12: any;
  address13: any;
  address14: any;
  address15: any;
  links: Link[];
  resourceVersion: string;
}

export interface Tag {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Link {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface ParentLocation {
  uuid: string;
  display: string;
  links: Link[];
}

export interface ChildLocation {
  uuid: string;
  display: string;
  links: Link[];
}

export function useQueueRoomLocations(currentQueueLocation: string) {
  const apiUrl = `/ws/rest/v1/location/${currentQueueLocation}?full-v`;
  const { data, error, isLoading } = useSWR<{ data: QueueRoomsResponse }>(apiUrl, openmrsFetch);

  const queueRoomLocations = useMemo(
    () => data?.data?.childLocations?.map((response) => response) ?? [],
    [data?.data?.childLocations],
  );
  return { queueRoomLocations: queueRoomLocations ? queueRoomLocations : [], isLoading, error };
}
