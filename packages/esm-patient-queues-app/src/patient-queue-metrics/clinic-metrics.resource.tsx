import { Visit, formatDate, openmrsFetch, parseDate, useSession } from '@openmrs/esm-framework';

import dayjs from 'dayjs';
import useSWR from 'swr';
import { MappedQueueEntry, WaitTime } from '../types';
import { PatientQueue, UuidDisplay } from '../types/patient-queues';
import { MappedPatientQueueEntry } from '../active-visits/patient-queues.resource';

export type PickedResponse = {
  results: IResultsItem[];
};
export type IResultsItem = {
  uuid: string;
  creator: ICreator;
  dateCreated: string;
  changedBy: IChangedBy;
  dateChanged: string;
  voided: boolean;
  dateVoided: null;
  voidedBy: null;
  patient: IPatient;
  provider: IProvider;
  locationFrom: ILocationFrom;
  locationTo: ILocationTo;
  encounter: null;
  status: string;
  priority: number;
  priorityComment: string;
  visitNumber: string;
  comment: string;
  queueRoom: IQueueRoom;
  datePicked: null;
  dateCompleted: null;
  links: ILinksItem[];
  resourceVersion: string;
};
export type ICreator = {
  uuid: string;
  display: string;
  username: string;
  systemId: string;
  userProperties: IUserProperties;
  person: IPerson;
  privileges: IPrivilegesItem[];
  roles: IRolesItem[];
  retired: boolean;
  links: ILinksItem[];
  resourceVersion: string;
};
export type IUserProperties = {
  loginAttempts: string;
};
export type IPerson = {
  uuid: string;
  display: string;
  links: ILinksItem[];
  gender?: string;
  age?: number;
  birthdate?: string;
  birthdateEstimated?: boolean;
  dead?: boolean;
  deathDate?: null;
  causeOfDeath?: null;
  preferredName?: IPreferredName;
  preferredAddress?: IPreferredAddress;
  attributes?: IAttributesItem[];
  voided?: boolean;
  birthtime?: null;
  deathdateEstimated?: boolean;
  resourceVersion?: string;
};
export type ILinksItem = {
  rel: string;
  uri: string;
  resourceAlias: string;
};
export type IPrivilegesItem = {
  uuid: string;
  display: string;
  links: ILinksItem[];
};
export type IRolesItem = {
  uuid: string;
  display: string;
  links: ILinksItem[];
};
export type IChangedBy = {
  uuid: string;
  display: string;
  username: string;
  systemId: string;
  userProperties: IUserProperties;
  person: IPerson;
  privileges: IPrivilegesItem[];
  roles: IRolesItem[];
  retired: boolean;
  links: ILinksItem[];
  resourceVersion: string;
};
export type IPatient = {
  uuid: string;
  display: string;
  identifiers: IIdentifiersItem[];
  person: IPerson;
  voided: boolean;
  links: ILinksItem[];
  resourceVersion: string;
};
export type IIdentifiersItem = {
  uuid: string;
  display: string;
  links: ILinksItem[];
};
export type IPreferredName = {
  uuid: string;
  display: string;
  links: ILinksItem[];
};
export type IPreferredAddress = {
  uuid: string;
  display: null;
  links: ILinksItem[];
};
export type IAttributesItem = {
  uuid: string;
  display: string;
  links: ILinksItem[];
};
export type IProvider = {
  uuid: string;
  display: string;
  person: IPerson;
  identifier: string;
  attributes: IAttributesItem[];
  retired: boolean;
  links: ILinksItem[];
  resourceVersion: string;
};
export type ILocationFrom = {
  uuid: string;
  display: string;
  name: string;
  description: string;
  address1: null;
  address2: null;
  cityVillage: null;
  stateProvince: null;
  country: null;
  postalCode: null;
  latitude: null;
  longitude: null;
  countyDistrict: null;
  address3: null;
  address4: null;
  address5: null;
  address6: null;
  tags: ITagsItem[];
  parentLocation: IParentLocation;
  childLocations: any[];
  retired: boolean;
  attributes: any[];
  address7: null;
  address8: null;
  address9: null;
  address10: null;
  address11: null;
  address12: null;
  address13: null;
  address14: null;
  address15: null;
  links: ILinksItem[];
  resourceVersion: string;
};
export type ITagsItem = {
  uuid: string;
  display: string;
  links: ILinksItem[];
};
export type IParentLocation = {
  uuid: string;
  display: string;
  links: ILinksItem[];
};
export type ILocationTo = {
  uuid: string;
  display: string;
  name: string;
  description: string;
  address1: null;
  address2: null;
  cityVillage: null;
  stateProvince: null;
  country: null;
  postalCode: null;
  latitude: null;
  longitude: null;
  countyDistrict: null;
  address3: null;
  address4: null;
  address5: null;
  address6: null;
  tags: ITagsItem[];
  parentLocation: IParentLocation;
  childLocations: any[];
  retired: boolean;
  attributes: any[];
  address7: null;
  address8: null;
  address9: null;
  address10: null;
  address11: null;
  address12: null;
  address13: null;
  address14: null;
  address15: null;
  links: ILinksItem[];
  resourceVersion: string;
};
export type IQueueRoom = {
  uuid: string;
  display: string;
  name: string;
  description: string;
  address1: null;
  address2: null;
  cityVillage: null;
  stateProvince: null;
  country: null;
  postalCode: null;
  latitude: null;
  longitude: null;
  countyDistrict: null;
  address3: null;
  address4: null;
  address5: null;
  address6: null;
  tags: ITagsItem[];
  parentLocation: IParentLocation;
  childLocations: any[];
  retired: boolean;
  attributes: any[];
  address7: null;
  address8: null;
  address9: null;
  address10: null;
  address11: null;
  address12: null;
  address13: null;
  address14: null;
  address15: null;
  links: ILinksItem[];
  resourceVersion: string;
};

export function useActiveVisits() {
  const currentUserSession = useSession();
  const startDate = dayjs().format('YYYY-MM-DD');
  const sessionLocation = currentUserSession?.sessionLocation?.uuid;

  const customRepresentation =
    'custom:(uuid,patient:(uuid,identifiers:(identifier,uuid),person:(age,display,gender,uuid)),' +
    'visitType:(uuid,name,display),location:(uuid,name,display),startDatetime,' +
    'stopDatetime)&fromStartDate=' +
    startDate +
    '&location=' +
    sessionLocation;
  const url = `/ws/rest/v1/visit?includeInactive=false&v=${customRepresentation}`;
  const { data, error, isLoading, isValidating } = useSWR<{ data: { results: Array<Visit> } }, Error>(
    sessionLocation ? url : null,
    openmrsFetch,
  );

  const activeVisitsCount = data?.data?.results.length
    ? data.data.results.filter((visit) => dayjs(visit.startDatetime).isToday())?.length
    : 0;

  return {
    activeVisitsCount: activeVisitsCount,
    isLoading,
    isError: error,
    isValidating,
  };
}

export function useAverageWaitTime(serviceUuid: string, statusUuid: string) {
  const apiUrl = `/ws/rest/v1/queue-metrics?queue=${serviceUuid}&status=${statusUuid}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: WaitTime }, Error>(
    serviceUuid && statusUuid ? apiUrl : null,
    openmrsFetch,
  );

  return {
    waitTime: data ? data?.data : null,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
}

export function usePatientsServed(currentQueueLocationUuid: string, status: string) {
  //patientqueue?v=full&status=picked&room=f46890559-c543-41ad-97d6-768bcf22ec8f
  const apiUrl = `/ws/rest/v1/patientqueue?v=full&room=${currentQueueLocationUuid}&status=${status}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: Array<PatientQueue> } }, Error>(
    apiUrl,
    openmrsFetch,
  );

  const mapppedQueues = data?.data?.results?.map((queue: PatientQueue) => {
    return {
      ...queue,
      id: queue.uuid,
      name: queue.patient?.person.display,
      patientUuid: queue.patient?.uuid,
      priorityComment: queue.priorityComment,
      priority: queue.priorityComment === 'Urgent' ? 'Priority' : queue.priorityComment,
      waitTime: queue.dateCreated ? `${dayjs().diff(dayjs(queue.dateCreated), 'minutes')}` : '--',
      status: queue.status,
      patientAge: queue.patient?.person?.age,
      patientSex: queue.patient?.person?.gender === 'M' ? 'MALE' : 'FEMALE',
      patientDob: queue.patient?.person?.birthdate
        ? formatDate(parseDate(queue.patient.person.birthdate), { time: false })
        : '--',
      identifiers: queue.patient?.identifiers,
      locationFrom: queue.locationFrom?.uuid,
      locationTo: queue.locationTo?.uuid,
      queueRoom: queue.locationTo?.display,
      visitNumber: queue.visitNumber,
    };
  });

  return {
    servedQueuePatients:
      mapppedQueues && mapppedQueues.length > 0 ? (mapppedQueues?.[0] as unknown as MappedQueueEntry) : undefined,
    servedCount: mapppedQueues?.length,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
}

// get Queue Item
export function usePatientBeingServed(currentQueueLocationUuid: string, status: string) {
  const apiUrl = `/ws/rest/v1/patientqueue?v=full&location=${currentQueueLocationUuid}&status=${status}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: Array<PatientQueue> } }, Error>(
    apiUrl,
    openmrsFetch,
  );

  return {
    data: data.data,
    isLoading,
    isError: error,
  };
}

export function usePatientsBeingServed(currentQueueLocationUuid: string, status: string) {
  const apiUrl = `/ws/rest/v1/patientqueue?v=full&location=${currentQueueLocationUuid}&status=${status}`;
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
      priorityComment: queue.priorityComment,
      priority: queue.priorityComment === 'Urgent' ? 'Priority' : queue.priorityComment,
      waitTime: queue.dateCreated ? `${dayjs().diff(dayjs(queue.dateCreated), 'minutes')}` : '--',
      status: queue.status,
      patientAge: queue.patient?.person?.age,
      patientSex: queue.patient?.person?.gender === 'M' ? 'MALE' : 'FEMALE',
      patientDob: queue.patient?.person?.birthdate
        ? formatDate(parseDate(queue.patient.person.birthdate), { time: false })
        : '--',
      identifiers: queue.patient?.identifiers,
      locationFrom: queue.locationFrom?.uuid,
      locationTo: queue.locationTo?.uuid,
      queueRoom: queue.locationTo?.display,
      visitNumber: queue.visitNumber,
    };
  });

  return {
    patientQueueCount: mapppedQueues?.length,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
}

// overall checked in patients
export function useQueuePatients(status: string) {
  const apiUrl = `/ws/rest/v1/patientqueue?v=full&status=${status}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: Array<PatientQueue> } }, Error>(
    apiUrl,
    openmrsFetch,
  );

  return {
    count: data?.data.results?.length,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
}

// overall expected appointments

// overall being served patients
export function useQueueServingPatients(status: string) {
  const apiUrl = `/ws/rest/v1/patientqueue?v=full&status=${status}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: Array<PatientQueue> } }, Error>(
    apiUrl,
    openmrsFetch,
  );

  return {
    patientQueueCount: data?.data.results?.length,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
}
