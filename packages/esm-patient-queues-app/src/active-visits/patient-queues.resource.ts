import dayjs from 'dayjs';
import useSWR from 'swr';
import { openmrsFetch, restBaseUrl, usePagination } from '@openmrs/esm-framework';
import { PatientQueue } from '../types/patient-queues';
import { NewVisitPayload, ProviderResponse } from '../types';
import { ResourceFilterCriteria, ResourceRepresentation, toQueryParams } from '../resource-filter-criteria';
import { PageableResult } from '../pageable-result';
import { useEffect, useState } from 'react';
import last from 'lodash-es/last';

export interface PatientQueueFilter extends ResourceFilterCriteria {
  status?: string;
  parentLocation?: string;
  room?: string;
}

export interface NewQueuePayload {
  patient: string;
  provider: string;
  locationFrom: string;
  locationTo: string;
  status: string;
  priority: number;
  priorityComment: string;
  comment: string;
  queueRoom: string;
}

export interface NewCheckInPayload {
  patient: string;
  provider: string;
  currentLocation: string;
  locationTo: string;
  patientStatus: string;
  priority: number;
  priorityComment: string;
  visitComment: string;
  queueRoom: string;
  visitType: string;
}

export interface LocationResponse {
  uuid: string;
  display: string;
  name: string;
  description: any;
  address1: any;
  address2: any;
  cityVillage: any;
  stateProvince: any;
  country: any;
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

// get parentlocation
export function useParentLocation(currentQueueLocationUuid: string) {
  const apiUrl = `${restBaseUrl}/location/${currentQueueLocationUuid}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: LocationResponse }, Error>(
    apiUrl,
    openmrsFetch,
  );

  return {
    location: data?.data,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
}

export function useChildLocations(parentUuid: string) {
  const apiUrl = `${restBaseUrl}/location/${parentUuid}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: LocationResponse }, Error>(
    apiUrl,
    openmrsFetch,
  );

  return {
    location: data?.data,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
}

// Fetch providers of a service point
export function useProviders(selectedNextQueueLocation: string) {
  const apiUrl = `${restBaseUrl}/provider?q=&v=full`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    { data: { results: Array<ProviderResponse> } },
    Error
  >(apiUrl, openmrsFetch);

  // Filter providers based on the selected location
  const providers =
    data?.data?.results?.filter((provider) =>
      provider.attributes.some(
        (attr) =>
          attr.attributeType.display === 'Default Location' &&
          typeof attr.value === 'object' &&
          attr.value.uuid === selectedNextQueueLocation,
      ),
    ) || [];

  return {
    providers,
    error,
    isLoading,
    isError: Boolean(error),
    isValidating,
    mutate,
  };
}

export async function getCurrentPatientQueueByPatientUuid(patientUuid: string, currentLocation: string) {
  const apiUrl = `${restBaseUrl}/incompletequeue?queueRoom=${currentLocation}&patient=${patientUuid}&v=full`;

  const abortController = new AbortController();

  return await openmrsFetch(apiUrl, {
    signal: abortController.signal,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// create visit
export async function createVisit(payload: NewVisitPayload) {
  const abortController = new AbortController();

  return await openmrsFetch(`${restBaseUrl}/visit`, {
    method: 'POST',
    signal: abortController.signal,
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  });
}

// update Visit
export async function updateVisit(uuid: string, payload: NewVisitPayload) {
  const abortController = new AbortController();

  return await openmrsFetch(`${restBaseUrl}/visit/${uuid}`, {
    method: 'POST',
    signal: abortController.signal,
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  });
}

// get current visit
export async function getCurrentVisit(patient: string, date: string) {
  const apiUrl = `${restBaseUrl}/visit?patient=${patient}&includeInactive=false&fromStartDate=${date}&v=default&limit=1`;
  const abortController = new AbortController();
  return await openmrsFetch(apiUrl, {
    signal: abortController.signal,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function checkCurrentVisit(patientUuid) {
  const date = dayjs().format('YYYY-MM-DD');
  const resp = await getCurrentVisit(patientUuid, date);
  return resp.data?.results !== null && resp.data?.results.length > 0;
}

export function usePatientQueues(filter: PatientQueueFilter) {
  const apiUrl = `${restBaseUrl}/patientqueue${toQueryParams(filter)}`;
  const { data, error, isLoading } = useSWR<
    {
      data: PageableResult<PatientQueue>;
    },
    Error
  >(apiUrl, openmrsFetch);

  return {
    items: data?.data || <PageableResult<PatientQueue>>{},
    isLoading,
    error,
  };
}

export function usePatientQueuePages(
  currentLocation: string,
  currentStatus: string,
  isToggled?: boolean,
  isClinical?: boolean,
) {
  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setPageSize] = useState(10);
  const [searchString, setSearchString] = useState<string | null>(null);

  const [patientQueueFilter, setPatientQueueFilter] = useState<PatientQueueFilter>({
    startIndex: currentPage - 1,
    v: ResourceRepresentation.Full,
    limit: currentPageSize,
    q: null,
    totalCount: true,
    parentLocation: isToggled && !isClinical ? currentLocation : '',
    status: isToggled ? currentStatus : '',
    room: !isToggled ? currentLocation : '',
  });

  const { items, isLoading, error } = usePatientQueues(patientQueueFilter);
  const pagination = usePagination(items.results, currentPageSize);

  useEffect(() => {
    setPatientQueueFilter({
      startIndex: (currentPage - 1) * currentPageSize,
      v: ResourceRepresentation.Full,
      limit: currentPageSize,
      q: searchString,
      totalCount: true,
      parentLocation: isToggled && !isClinical ? currentLocation : '',
      status: isToggled ? currentStatus : '',
      room: !isToggled ? currentLocation : '',
    });
  }, [searchString, currentPage, currentPageSize, currentLocation, currentStatus, isToggled, isClinical]);

  return {
    items: pagination.results,
    pagination,
    totalCount: items.totalCount,
    currentPageSize,
    currentPage,
    setCurrentPage,
    setPageSize,
    pageSizes,
    isLoading,
    error,
    setSearchString,
  };
}

export const getOriginFromPathName = (pathname = '') => {
  const from = pathname.split('/');
  return last(from);
};

export async function updateQueueEntry(
  status: string,
  providerUuid: string,
  queueUuid: string,
  priority: number,
  priorityComment: string,
  comment: string,
) {
  const abortController = new AbortController();

  return await openmrsFetch(`${restBaseUrl}/patientqueue/${queueUuid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
    body: {
      provider: {
        uuid: providerUuid,
      },
      status: status,
      priority: priority ? priority : 0,
      priorityComment: priorityComment === 'Urgent' ? 'Priority' : priorityComment,
      comment: comment,
    },
  });
}

export async function addQueueEntry(payload: NewQueuePayload) {
  const abortController = new AbortController();

  return await openmrsFetch(`${restBaseUrl}/patientqueue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
    body: payload,
  });
}

export async function checkInQueue(payload: NewCheckInPayload) {
  const abortController = new AbortController();

  return await openmrsFetch(`${restBaseUrl}/checkinpatient`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
    body: payload,
  });
}

export function generateVisitQueueNumber(location: string, patient: string) {
  const abortController = new AbortController();
  return openmrsFetch(`${restBaseUrl}/queuenumber?patient=${patient}&location=${location}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
  });
}

export function getCareProvider(provider: string) {
  const abortController = new AbortController();

  return openmrsFetch(`${restBaseUrl}/provider?user=${provider}&v=full`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
  });
}

export function getLocationByUuid(uuid: string) {
  const abortController = new AbortController();
  const url = `${restBaseUrl}/location/${uuid}`;
  return openmrsFetch(url, {
    method: 'GET',
    signal: abortController.signal,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
