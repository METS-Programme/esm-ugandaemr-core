import useSWR from 'swr';
import { RegionsResponse } from '../../../../../types';

export interface FacilityResponse {
  message: string;
  status: boolean;
  data: Data;
}

export interface Data {
  resourceType: string;
  id: string;
  meta: Meta;
  type: string;
  link: Link[];
  entry: Entry[];
}

export interface Meta {
  lastUpdated: string;
}

export interface Link {
  relation: string;
  url: string;
}

export interface Entry {
  fullUrl: string;
  resource: Resource;
  search: Search;
}

export interface Resource {
  resourceType: string;
  id: string;
  meta: Meta2;
  extension: Extension[];
  status: string;
  name: string;
  alias: string[];
  type: Type[];
  telecom: Telecom[];
  address: Address;
  position: Position;
  managingOrganization: ManagingOrganization;
  partOf: PartOf;
  hoursOfOperation: HoursOfOperation[];
}

export interface Meta2 {
  versionId: string;
  lastUpdated: string;
  source: string;
}

export interface Extension {
  url: string;
  valueCode?: string;
  valueString?: string;
  valueReference?: ValueReference;
  valueInteger?: number;
}

export interface ValueReference {
  reference: string;
}

export interface Type {
  coding: Coding[];
}

export interface Coding {
  code: string;
  display: string;
}

export interface Telecom {
  system: string;
  value: string;
  use: string;
  rank: number;
}

export interface Address {
  use: string;
  type: string;
  text: string;
  line: string[];
  postalCode: string;
  country: string;
}

export interface Position {
  longitude: number;
  latitude: number;
  altitude: number;
}

export interface ManagingOrganization {
  reference: string;
  type: string;
  display: string;
}

export interface PartOf {
  reference: string;
  type: string;
  display: string;
}

export interface HoursOfOperation {
  allDay: boolean;
  openingTime: string;
  closingTime: string;
}

export interface Search {
  mode: string;
}

export function useFacilities() {
  const apiUrl = `https://nhfr-staging-api.planetsystems.co/nhfrApi/v0.0.1/externalSystem/search`;

  const fetcher = (apiUrl) => fetch(apiUrl).then((res) => res.json());

  const { data, error, isLoading } = useSWR<FacilityResponse, Error>(apiUrl, fetcher);

  return {
    facilities: data ? data.data?.entry : [],
    isError: error,
    isLoading,
  };
}

export function useFacilityRegions() {
  const apiUrl = `https://nhfr-staging-api.planetsystems.co/nhfrApi/v0.0.1/externalSystem/by/Region`;

  const fetcher = (apiUrl) => fetch(apiUrl).then((res) => res.json());

  const { data, error, isLoading } = useSWR<RegionsResponse, Error>(apiUrl, fetcher);

  return {
    regions: data ? data.data?.entry : [],
    isError: error,
    isLoading,
  };
}
