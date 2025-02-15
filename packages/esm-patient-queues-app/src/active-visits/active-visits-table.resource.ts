import { openmrsFetch, restBaseUrl, Visit } from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import last from 'lodash-es/last';
import { Identifer } from '../types';
import { QueueStatus } from '../utils/utils';

export type QueuePriority = 'Emergency' | 'Not Urgent' | 'Priority' | 'Urgent';
export type MappedQueuePriority = Omit<QueuePriority, 'Urgent'>;
export type QueueService = 'Clinical consultation' | 'Triage';
export type QueueStatus = 'Finished' | 'Picked' | 'Pending';
dayjs.extend(isToday);

export interface VisitQueueEntry {
  queueEntry: VisitQueueEntry;
  uuid: string;
  visit: Visit;
}

export interface VisitNumberResponse {
  queueNumber: string;
}

export interface VisitQueueEntry {
  display: string;
  endedAt: null;
  locationWaitingFor: string | null;
  patient: {
    uuid: string;
    person: {
      age: string;
      gender: string;
      birthdate: string;
    };
    phoneNumber: string;
    identifiers: Array<Identifer>;
  };
  priority: {
    display: QueuePriority;
    uuid: string;
  };
  priorityComment: string | null;
  providerWaitingFor: null;
  queue: {
    description: string;
    display: string;
    name: string;
    service: {
      display: QueueService;
    };
    uuid: string;
    location: {
      uuid: string;
      name: string;
    };
  };
  startedAt: string;
  status: {
    display: QueueStatus;
    uuid: string;
  };
  uuid: string;
  visit: Visit;
  sortWeight: number;
}

export interface MappedVisitQueueEntry {
  id: string;
  encounters: Array<MappedEncounter>;
  name: string;
  patientAge: string;
  patientSex: string;
  patientDob: string;
  patientUuid: string;
  priority: MappedQueuePriority;
  priorityComment: string;
  priorityUuid: string;
  service: string;
  status: QueueStatus;
  statusUuid: string;
  visitStartDateTime: string;
  visitType: string;
  visitUuid: string;
  visitLocation: string;
  visitTypeUuid: string;
  waitTime: string;
  queueUuid: string;
  queueEntryUuid: string;
  queueLocation: string;
  sortWeight: number;
  visitQueueNumber: string;
  identifiers: Array<Identifer>;
}

// provider
export interface ProviderResponse {
  results: Result[];
}

export interface Result {
  uuid: string;
  display: string;
  person: Person;
  identifier: string;
  attributes: any[];
  retired: boolean;
  auditInfo: AuditInfo;
  links: Link[];
  resourceVersion: string;
}

export interface Person {
  uuid: string;
  display: string;
  gender: string;
  age: any;
  birthdate: any;
  birthdateEstimated: boolean;
  dead: boolean;
  deathDate: any;
  causeOfDeath: any;
  preferredName: PreferredName;
  preferredAddress: any;
  attributes: any[];
  voided: boolean;
  birthtime: any;
  deathdateEstimated: boolean;
  links: Link[];
  resourceVersion: string;
}

export interface PreferredName {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Link {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface AuditInfo {
  creator: Creator;
  dateCreated: string;
  changedBy: any;
  dateChanged: any;
}

export interface Creator {
  uuid: string;
  display: string;
  links: Link[];
}
interface UseVisitQueueEntries {
  visitQueueEntries: Array<MappedVisitQueueEntry> | null;
  visitQueueEntriesCount: number;
  isLoading: boolean;
  isError: Error;
  isValidating?: boolean;
  mutate: () => void;
}

interface ObsData {
  concept: {
    display: string;
    uuid: string;
  };
  value?: string | any;
  groupMembers?: Array<{
    concept: { uuid: string; display: string };
    value?: string | any;
  }>;
  obsDatetime: string;
}

interface Encounter {
  diagnoses: Array<any>;
  encounterDatetime: string;
  encounterProviders?: Array<{ provider: { person: { display: string } } }>;
  encounterType: { display: string; uuid: string };
  obs: Array<ObsData>;
  uuid: string;
  voided: boolean;
}

interface MappedEncounter extends Omit<Encounter, 'encounterType' | 'provider'> {
  encounterType: string;
  provider: string;
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
