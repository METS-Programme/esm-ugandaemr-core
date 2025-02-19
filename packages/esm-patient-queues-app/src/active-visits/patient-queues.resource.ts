import dayjs from 'dayjs';
import useSWR from 'swr';
import { formatDate, openmrsFetch, parseDate, restBaseUrl, usePagination, useSession } from '@openmrs/esm-framework';
import { PatientQueue, UuidDisplay } from '../types/patient-queues';
import { NewVisitPayload, ProviderResponse } from '../types';
import { ResourceFilterCriteria, ResourceRepresentation, toQueryParams } from '../resource-filter-criteria';
import { PageableResult } from '../pageable-result';
import { useEffect, useState } from 'react';
import { QueueStatus } from '../utils/utils';
import last from 'lodash-es/last';

export interface PatientQueueFilter extends ResourceFilterCriteria {
  status?: string;
  parentLocation?: string;
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

export function usePatientQueuesList(
  currentQueueLocationUuid: string,
  status: string,
  isToggled: boolean,
  isClinical: boolean,
) {
  const url =
    isToggled && isClinical
      ? `${restBaseUrl}/patientqueue?v=full&status=${status}`
      : isToggled
      ? `${restBaseUrl}/patientqueue?v=full&status=${status}&parentLocation=${currentQueueLocationUuid}`
      : `${restBaseUrl}/patientqueue?v=full&status=${status}&room=${currentQueueLocationUuid}`;

  return usePatientQueueRequest(url);
}

export function usePatientQueueRequest(apiUrl: string) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: Array<PatientQueue> } }, Error>(
    apiUrl,
    openmrsFetch,
  );

  const mapppedQueues = data?.data?.results.map((queue: PatientQueue) => {
    return {
      ...queue,
      id: queue.uuid,
      name: queue.patient?.person.display,
      patientUuid: queue.patient?.uuid,
      provider: queue.provider?.person.display,
      priorityComment: queue.priorityComment,
      priority: queue.priorityComment === 'Urgent' ? 'Priority' : queue.priorityComment,
      priorityLevel: queue.priority,
      waitTime:
        queue.status === 'COMPLETED'
          ? queue.dateCreated && queue.dateChanged
            ? `${dayjs(queue.dateChanged).diff(dayjs(queue.dateCreated), 'minutes')} Minutes`
            : '--'
          : queue.dateCreated
          ? `${dayjs().diff(dayjs(queue.dateCreated), 'minutes')} Minutes`
          : '--',
      status: queue.status,
      patientAge: queue.patient?.person?.age,
      patientSex: queue.patient?.person?.gender === 'M' ? 'MALE' : 'FEMALE',
      patientDob: queue.patient?.person?.birthdate
        ? formatDate(parseDate(queue.patient.person.birthdate), { time: false })
        : '--',
      identifiers: queue.patient?.identifiers,
      locationFrom: queue.locationFrom?.uuid,
      locationTo: queue.locationTo?.uuid,
      locationToName: queue.locationTo?.name,
      queueRoom: queue.locationTo?.display,
      locationTags: queue.queueRoom?.tags,
      visitNumber: queue.visitNumber,
      dateCreated: queue.dateCreated,
      creatorUuid: queue.creator?.uuid,
      creatorUsername: queue.creator?.username,
      creatorDisplay: queue.creator?.display,
    };
  });

  return {
    patientQueueEntries: mapppedQueues || [],
    patientQueueCount: mapppedQueues?.length,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
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
  const apiUrl = `${restBaseUrl}/patientqueue/${toQueryParams(filter)}`;
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

export function usePatientQueuePages(v?: ResourceRepresentation) {
  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setPageSize] = useState(10);
  const [searchString, setSearchString] = useState(null);
  const session = useSession();
  const { location } = useParentLocation(session?.sessionLocation?.uuid);

  const [parentLocation, setParentLocation] = useState(location?.uuid);
  const [status, setStatus] = useState(QueueStatus.Pending);

  const [patientQueueFilter, setPatientQueueFilter] = useState<PatientQueueFilter>({
    startIndex: currentPage - 1,
    v: v || ResourceRepresentation.Default,
    limit: currentPageSize,
    q: null,
    totalCount: true,
  });

  const { items, isLoading, error } = usePatientQueues(patientQueueFilter);
  const pagination = usePagination(items.results, currentPageSize);

  useEffect(() => {
    setPatientQueueFilter({
      startIndex: currentPage - 1,
      v: ResourceRepresentation.Default,
      limit: currentPageSize,
      q: searchString,
      totalCount: true,
      status: status,
      parentLocation: parentLocation,
    });
  }, [searchString, currentPage, currentPageSize, status, parentLocation]);

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
    status,
    setStatus,
    parentLocation,
    setParentLocation,
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

export async function addQueueEntry(
  queueUuid: string,
  patientUuid: string,
  provider: string,
  priority: number,
  status: string,
  locationUuid: string,
  priorityComment: string,
  comment: string,
) {
  const abortController = new AbortController();

  return await openmrsFetch(`${restBaseUrl}/patientqueue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
    body: {
      patient: patientUuid,
      provider: provider,
      locationFrom: locationUuid,
      locationTo: queueUuid !== undefined ? queueUuid : 'Not Set',
      status: status ? status : QueueStatus.Pending,
      priority: priority ? priority : 0,
      priorityComment: priorityComment ?? 'Not Set',
      comment: comment ?? 'This is pending',
      queueRoom: queueUuid !== undefined ? queueUuid : 'Not Set',
    },
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

export function getLocation(uuid: string) {
  const abortController = new AbortController();
  return openmrsFetch(`${restBaseUrl}/location/${uuid}&v=full`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
  });
}
