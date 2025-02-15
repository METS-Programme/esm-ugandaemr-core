import dayjs from 'dayjs';
import useSWR from 'swr';
import { formatDate, openmrsFetch, parseDate, restBaseUrl } from '@openmrs/esm-framework';
import { PatientQueue, UuidDisplay } from '../types/patient-queues';
import { NewVisitPayload, ProviderResponse } from '../types';

export interface MappedPatientQueueEntry {
  id: string;
  name: string;
  patientAge: number;
  patientSex: string;
  patientDob: string;
  patientUuid: string;
  priority: string;
  priorityComment: string;
  comment: string;
  status: string;
  waitTime: string;
  locationFrom?: string;
  locationToName?: string;
  visitNumber: string;
  identifiers: Array<UuidDisplay>;
  dateCreated: string;
  creatorUuid: string;
  creatorUsername: string;
  creatorDisplay: string;
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
