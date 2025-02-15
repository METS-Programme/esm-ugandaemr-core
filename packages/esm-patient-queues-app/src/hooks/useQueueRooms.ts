import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import useSWR from 'swr';

export interface QueueRoomsResponse {
  uuid: string;
  display: string;
  name: string;
  description: string;
  address1: string;
  address2: string;
  cityvillage: string;
  stateprovince: string;
  country: string;
  postalcode: string;
  latitude: string;
  longitude: string;
  countydistrict: string;
  address3: string;
  address4: string;
  address5: string;
  address6: string;
  tags: Tags[];
  parentLocation: ParentLocation;
  childLocations: String[];
  retired: boolean;
  auditinfo: Auditinfo;
  attributes: String[];
  address7: string;
  address8: string;
  address9: string;
  address10: string;
  address11: string;
  address12: string;
  address13: string;
  address14: string;
  address15: string;
  links: Links[];
  resourceVersion: string;
}

export interface Auditinfo {
  creator: Creator;
  dateCreated: string;
  changedby: Changedby;
  dateChanged: string;
}

export interface Changedby {
  uuid: string;
  display: string;
  links: Links[];
}

export interface Creator {
  uuid: string;
  display: string;
  links: Links[];
}

export interface ParentLocation {
  uuid: string;
  display: string;
  name: string;
  description: string;
  address1: string;
  address2: string;
  cityVillage: string;
  stateProvince: string;
  country: string;
  postalcode: string;
  latitude: string;
  longitude: string;
  countydistrict: string;
  address3: string;
  address4: string;
  address5: string;
  address6: string;
  tags: Tags[];
  parentLocation: ParentLocation;
  childLocations: ChildLocations[];
  retired: boolean;
  attributes: String[];
  address7: string;
  address8: string;
  address9: string;
  address10: string;
  address11: string;
  address12: string;
  address13: string;
  address14: string;
  address15: string;
  links: Links[];
  resourceversion: string;
}

export interface ChildLocations {
  uuid: string;
  display: string;
  links: Links[];
}

export interface ParentLocation {
  uuid: string;
  display: string;
  links: Links[];
}

export interface Tags {
  uuid: string;
  display: string;
  links: Links[];
}

export interface Tags {
  uuid: string;
  display: string;
  name: string;
  description: string;
  retired: boolean;
  links: Links[];
  resourceversion: string;
}

export interface Links {
  rel: string;
  uri: string;
  resourcealias: string;
}

export function useQueueRoomLocations(currentQueueLocation: string) {
  const apiUrl = `${restBaseUrl}/location/${currentQueueLocation}?v=full`;
  const { data, error, isLoading, mutate } = useSWR<{ data: QueueRoomsResponse }>(apiUrl, openmrsFetch);

  const queueRoomLocations = useMemo(
    () => data?.data?.parentLocation?.childLocations?.map((response) => response) ?? [],
    [data?.data?.parentLocation?.childLocations],
  );
  return {
    queueRoomLocations: queueRoomLocations.filter((location) => location?.uuid != null) ? queueRoomLocations : [],
    isLoading,
    error,
    mutate,
  };
}
